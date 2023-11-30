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
    const slider_folderPathAfterWwwRoot = "images\\sliders";
    const spn_fileStatusLabel_id = "#spn_fileStatusLabel";
    const spn_fileStatusLabel_color = "#120a8f";
    let currentSliderNo = 0;
    let slider_selectedFilesInfos = {};
    let slider_noAndPaths = [];
    //#endregion

    //#region events
    $(window).resize(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
    $("#btn_save").click(async () => {
        //#region any slider not selected
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
        if (currentSliderNo == 0)
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
        if (currentSliderNo == maxSliderQuantity - 1)
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
        btn_sliderNo.append((currentSliderNo + 1) + "/" + maxSliderQuantity);
    }

    async function uploadSlidersAsync() {
        //#region set data
        let data = slider_noAndPaths;

        // add selected files paths to "slider_noAndPaths"
        for (let sliderNo in slider_selectedFilesInfos)
            data[sliderNo] = slider_selectedFilesInfos[sliderNo]
                .name;
        //#endregion

        // 1st ajax: delete sliders from folder and db
        // 2nd ajax: upload sliders to folder and db
        $.ajax({
            method: "DELETE",
            url: (baseApiUrl + "/file/slider/delete/multiple" +
                `?language=${language}` +
                `&folderPathAfterWwwroot=${slider_folderPathAfterWwwRoot}`),
            headers: {
                "authorization": jwtToken
            },
            data: JSON.stringify({
                "FileNamesToBeNotDelete": data
            }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region get total selected file quantity
                let slider_totalSelectedFilesQuantity = Object
                    .keys(slider_selectedFilesInfos)
                    .length;

                let slider_uploadedSliderQuantity = 0;
                //#endregion

                //#region upload sliders (ajax)
                for (let sliderNo in slider_selectedFilesInfos) {
                    //#region upload slider to folder and db (ajax)
                    let sliderInfos = slider_selectedFilesInfos[sliderNo];
                    let reader = new FileReader();

                    reader.readAsDataURL(sliderInfos);
                    reader.onload = function (event) {
                        //#region upload sliders to folder and db (ajax)
                        let dataUrl = event.target.result;

                        // upload slider to folder 
                        $.ajax({
                            method: "POST",
                            url: (baseApiUrl + "/file/slider/upload/folder" +
                                `?language=${language}` +
                                `&FolderPathAfterWwwroot=${slider_folderPathAfterWwwRoot}`),
                            headers: {
                                "authorization": jwtToken
                            },
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({
                                "FileName": sliderInfos.name,
                                "FileContentInBase64Str": dataUrl.replace("data:image/jpeg;base64,", "")   // add only base64 part of dataUrl
                            }),
                            success: () => {
                                //#region update to "slider_noAndPaths"
                                slider_noAndPaths[sliderNo] = sliderInfos.name;
                                //#endregion

                                //#region upload sliders to db (ajax)
                                slider_uploadedSliderQuantity += 1;

                                // when all selected sliders uploaded
                                if (slider_uploadedSliderQuantity == slider_totalSelectedFilesQuantity) {
                                    $.ajax({
                                        method: "POST",
                                        url: baseApiUrl + `/file/slider/upload/db?language=${language}`,
                                        headers: {
                                            "authorization": jwtToken
                                        },
                                        data: JSON.stringify({
                                            "fileNames": slider_noAndPaths
                                        }),
                                        contentType: "application/json",
                                        dataType: "json",
                                        success: () => {
                                            //#region update "sliderNoAndPaths" on local
                                            slider_noAndPaths = data;  // update
                                            slider_selectedFilesInfos = {};  // reset

                                            localStorage.setItem(
                                                localKeys_sliderNoAndPaths,
                                                JSON.stringify(slider_noAndPaths));
                                            //#endregion

                                            //#region write success message
                                            updateResultLabel(
                                                resultLabeL_id,
                                                slider_successMessageByLanguages[language],
                                                resultLabel_successColor);
                                            //#endregion
                                        },
                                        error: () => {
                                            updateResultLabel(
                                                resultLabeL_id,
                                                slider_errorMessagesByLanguages[language]["uploadToDb"],
                                                resultLabel_errorColor);
                                        }
                                    })
                                }
                                //#endregion
                            },
                            error: () => {
                                updateResultLabel(
                                    resultLabeL_id,
                                    slider_errorMessagesByLanguages[language]["uploadToFolder"],
                                    resultLabel_successColor);
                            }
                        })
                        //#endregion
                    }
                    //#endregion
                }
                //#endregion
            },
            error: () => {
                updateResultLabel(
                    resultLabeL_id,
                    "error occured on server side, please try again later",
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
        //#region when slider to be display hasn't been changed previously
        let selectedFileInfos = slider_selectedFilesInfos[currentSliderNo];

        if (selectedFileInfos == undefined) {
            //#region when slider exists on "slider_noAndPaths"
            let fileName = slider_noAndPaths[currentSliderNo];

            if (fileName != undefined)
                img_sliders.attr(
                    "src",
                    "/" + slider_folderPathAfterWwwRoot + "//" + fileName);
            //#endregion

            //#region when slider not exists on "slider_noAndPaths"
            else
                img_sliders.attr("src", noImagePath)
            //#endregion
        }
        //#endregion

        //#region when slider to be display has been changed previously
        else {
            //#region add "noImage" image and "image loading..." message 
            img_sliders.removeAttr("src");  // until slider loads
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

        //#region initialize "slider_noAndPaths" array
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
                    "authorization": jwtToken
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region populate to "slider_noAndPaths"
                    for (let index in response) {
                        let sliderInfos = response[index];
                        slider_noAndPaths.push(sliderInfos["fileName"]);
                    }
                    //#endregion

                    displaySliderByPathAsync();

                    //#region save "slider_noAndPaths" to local
                    localStorage.setItem(
                        localKeys_sliderNoAndPaths,
                        JSON.stringify(slider_noAndPaths));
                    //#endregion
                },
                error: () => {
                    displaySliderByPathAsync(); // for add "noImage" image
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

