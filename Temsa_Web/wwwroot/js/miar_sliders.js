import { updateResultLabel } from "./miar_tools.js";

$(function () {
    //#region variables
    const maxSliderQuantity = 10;
    const img_sliders_id = "img_sliders";
    const img_sliders = $("#" + img_sliders_id);
    const btn_previous = $("#btn_previous");
    const btn_next = $("#btn_next");
    const btn_sliderNo = $("#btn_sliderNo");
    const noImagePath = "/images/noImage.png";
    const inpt_chooseFile = $("#inpt_chooseFile");
    const resultLabeL_id = "#spn_resultLabel";
    const resultLabel = $(resultLabeL_id);
    const sliderFolderPath = "images\\sliders";
    const spn_fileStatusLabel_id = "#spn_fileStatusLabel";
    const spn_fileStatusLabel_color = "#120a8f";
    let currentSliderNo = 1;
    let slider_selectedFilesInfos = {};
    let slider_noAndPaths = {};
    //#endregion

    //#region events
    $(window).resize(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
    $("#btn_save").click(async () => {
        //#region any slider not added
        if (Object.keys(slider_selectedFilesInfos).length == 0)
            return;
        //#endregion

        await uploadSlidersAsync();
    })
    inpt_chooseFile.change(async (event) => {
        //#region get selected file
        resultLabel.empty();  // reset resultLabel
        let selectedFileInfos = event.target.files[0];
        //#endregion

        //#region when selected file not image
        if (!selectedFileInfos.type.startsWith("image/")) {
            inpt_chooseFile.val("");
            updateResultLabel(
                resultLabeL_id,
                "sadece resim tipindeki dosyaları seçebilirsiniz.",
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#region display slider by dataUrl
        slider_selectedFilesInfos[currentSliderNo] = selectedFileInfos // save selectedFile
        await displaySliderByDataUrlAsync(selectedFileInfos);
        //#endregion
    })
    btn_previous.click(async () => {
        //#region update slider no button
        currentSliderNo -= 1;
        await updateSliderNoButtonAsync();
        //#endregion

        //#region hide previous button and show next button
        if (currentSliderNo == 1)
            btn_previous.attr("hidden", "")

        btn_next.removeAttr("hidden");
        //#endregion

        //#region display image
        inpt_chooseFile.val(""); // reset choose file input
        await displaySliderByPathAsync();
        //#endregion
    })
    btn_next.click(async () => {
        //#region update slider no button
        currentSliderNo += 1;
        await updateSliderNoButtonAsync();
        //#endregion

        //#region hide next button and show previous button
        if (currentSliderNo == maxSliderQuantity)
            btn_next.attr("hidden", "")

        btn_previous.removeAttr("hidden");
        //#endregion

        //#region display image
        inpt_chooseFile.val(""); // reset choose file input
        await displaySliderByPathAsync();
        //#endregion
    })
    //#endregion

    //#region functions
    async function setSliderMaxHeightAndWidthAsync() {
        //#region set max width and height of slider
        const divWidth = $(".panel-body")[0].clientWidth - 40;  // 40: i choosed as trying
        const divHeight = $("#container")[0].clientHeight / 2;

        img_sliders.css("max-width", divWidth);
        img_sliders.css("max-height", divHeight);
        //#endregion
    }

    async function updateSliderNoButtonAsync() {
        btn_sliderNo.empty();
        btn_sliderNo.append(currentSliderNo + "/" + maxSliderQuantity);
    }

    async function uploadSlidersAsync() {
        // 1st ajax: delete sliders from db and folder 
        // 2nd ajax: upload sliders to db and local
        $.ajax({
            method: "DELETE",
            url: baseApiUrl + "/file/slider/delete/all" +
                `?language=${language}` +
                `&path=${sliderFolderPath}`,
            headers: {
                "authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region upload sliders (ajax)
                let sliderFileNames = {}

                for (let sliderNo in slider_selectedFilesInfos) {
                    //#region populate "sliderFileNames"
                    let sliderInfos = slider_selectedFilesInfos[sliderNo];
                    sliderFileNames[sliderNo] = sliderInfos.name;
                    //#endregion

                    //#region upload file (ajax)
                    let reader = new FileReader();

                    reader.readAsDataURL(sliderFile);
                    reader.onload = function (event) {
                        //#region upload slider images (ajax)
                        let dataUrl = event.target.result;

                        $.ajax({
                            method: "POST",
                            url: baseApiUrl + "/file/slider/upload",
                            headers: {
                                "authorization": jwtToken
                            },
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({
                                "pathAfterWwwRoot": sliderFolderPath,
                                "fileName": sliderFile.name,
                                "fileContentInBase64Str": dataUrl.replace("data:image/jpeg;base64,", "")   // add only base64 part of dataUrl
                            }),
                            success: () => {
                                updateResultLabel(
                                    resultLabeL_id,
                                    resultLabel_successMessageByLanguages[language],
                                    resultLabel_successColor);
                            },
                            error: (response) => {
                                updateResultLabel(
                                    resultLabeL_id,
                                    JSON.parse(response.responseText).errorMessage,
                                    resultLabel_errorColor);
                            }
                        })
                        //#endregion
                    }
                    //#endregion
                }
                //#endregion

                //#region add slider files to local
                localStorage.setItem(
                    localKeys_sliderFileNames,
                    JSON.stringify(sliderFiles));
                //#endregion
            },
            error: () => {
                updateResultLabel(
                    resultLabeL_id,
                    "any error occured in server side",
                    resultLabel_errorColor);
            }
        })
    }

    async function displaySliderByDataUrlAsync(selectedFileInfos) {
        //#region add dataUrl to src of slider <img>
        let fileReader = new FileReader();

        fileReader.readAsDataURL(selectedFileInfos);
        fileReader.onload = function (event) {
            var dataUrl = event.target.result;
            img_sliders.attr("src", dataUrl);

            $(spn_fileStatusLabel_id).empty(); // reset "image loading..." message
        };
        //#endregion
    }

    async function displaySliderByPathAsync() {
        //#region when slider that to be display hasn't been changed previously
        let selectedFileInfos = slider_selectedFilesInfos[currentSliderNo];

        if (selectedFileInfos == undefined) {
            //#region when slider exists on "slider_noAndPaths"
            let sliderPath = slider_noAndPaths[currentSliderNo];

            if (sliderPath != undefined)
                img_sliders.attr("src", sliderPath);
            //#endregion

            //#region when slider not exists on "slider_noAndPaths"
            else
                img_sliders.attr("src", noImagePath)
            //#endregion
        }
        //#endregion

        //#region when slider that to be display has been changed previously
        else {
            //#region add "noImage" image and "image loading..." message 
            img_sliders.attr("src", noImagePath);  // until slider loads
            updateResultLabel(
                spn_fileStatusLabel_id,
                "resim yükleniyor...",
                spn_fileStatusLabel_color
            );
            //#endregion

            await displaySliderByDataUrlAsync(selectedFileInfos);
        }
        //#endregion
    }

    async function populateSliderAsync() {
        await setSliderMaxHeightAndWidthAsync();

        //#region populate "slider no" button
        btn_sliderNo.append(`1/${maxSliderQuantity}`);
        //#endregion

        //#region initialize "slider_noAndPaths"
        // get infos from local
        let sliderNoAndPathsInLocal = localStorage
            .getItem(localKeys_sliderNoAndPaths);

        // initialize
        slider_noAndPaths = sliderNoAndPathsInLocal == null ?
            slider_noAndPaths  // when "slider_noAndPaths" not exists local
            : JSON.parse(sliderNoAndPathsInLocal);
        //#endregion

        //#region display first slider (ajax)

        //#region when "slider_noAndPaths" not exists in local (ajax)
        if (sliderNoAndPathsInLocal == null)
            $.ajax({
                method: "GET",
                url: baseApiUrl + `/file/slider/display/all?language=${language}`,
                headers: {
                    "Authorization": jwtToken
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region populate to "slider_noAndPaths"
                    for (let index in response) {
                        let sliderInfos = response[index];
                        slider_noAndPaths[sliderInfos["sliderNo"]] = sliderInfos["sliderPath"];
                    }
                    //#endregion

                    displaySliderByPathAsync();

                    //#region save "slider_noAndPaths" to local
                    localStorage.setItem(
                        localKeys_sliderNoAndPaths,
                        JSON.stringify(slider_noAndPaths));
                    //#endregion
                },
                error: (response) => {
                    displaySliderByPathAsync();
                }
            })
        //#endregion

        //#region when "slider_noAndPaths" exists in local
        else
            await displaySliderByPathAsync();
        //#endregion

        //#endregion
    }
    //#endregion

    populateSliderAsync();
})

