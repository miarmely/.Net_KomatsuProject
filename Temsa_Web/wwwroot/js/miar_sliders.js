import { updateResultLabel } from "./miar_tools.js";

$(function () {
    //#region variables
    const maxSliderQuantity = 10;
    const img_sliders_id = "img_sliders";
    const img_sliders = $("#" + img_sliders_id);
    const btn_previous = $("#btn_previous");
    const btn_next = $("#btn_next");
    const btn_sliderNo = $("#btn_sliderNo");
    const noImagePath = "../images/noImage.png";
    const inpt_chooseFile = $("#inpt_chooseFile");
    const resultLabel = $("#spn_resultLabel");
    const sliderFolderPath = "images\\sliders";
    let currentSliderNo = 1;
    let sliderFiles;
    let sliderFileNames;
    //#endregion

    //#region events
    $(window).resize(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
    $("#btn_save").click(async () => {
        //#region any slider not added
        if (Object.keys(sliderFiles).length == 0)
            return;
        //#endregion

        await uploadSliderFilesAsync();
    })
    inpt_chooseFile.change(async (event) => {
        //#region get selected file
        resultLabel.empty();  // reset resultLabel
        let selectedFile = event.target.files[0];
        //#endregion

        //#region when selected file not image
        if (!selectedFile.type.startsWith("image/")) {
            inpt_chooseFile.val("");
            updateResultLabel(
                "#spn_resultLabel",
                "sadece resim tipindeki dosyaları seçebilirsiniz.",
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#region display image
        sliderFiles[currentSliderNo] = selectedFile // save selectedFile
        await displayImageAsync();
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
        await displayImageAsync();
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
        await displayImageAsync();
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

    async function displayImageAsync() {
        //#region get current slider file
        let file = sliderFiles[currentSliderNo];

        if (file == undefined) {
            img_sliders.attr("src", noImagePath);
            return;
        }
        //#endregion

        //#region add src to <img>
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = function (event) {
            let blob = event.target.result;
            img_sliders.attr("src", blob);
        }
        //#endregion
    }

    async function updateSliderNoButtonAsync() {
        btn_sliderNo.empty();
        btn_sliderNo.append(currentSliderNo + "/" + maxSliderQuantity);
    }

    async function uploadSliderFilesAsync() {
        // 1st ajax: delete sliders from db and folder 
        // 2nd ajax: upload sliders to db and local
        $.ajax({
            method: "DELETE",
            url: baseApiUrl + `/file/slider/delete?path=${sliderFolderPath}`,
            headers: {
                "authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region upload sliders (ajax)
                let sliderFileNames = {}

                for (let sliderNo in sliderFiles) {
                    //#region set variables
                    let sliderFile = sliderFiles[sliderNo];
                    sliderFileNames[sliderNo] = sliderFile.name;
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
                            headers: { "authorization": jwtToken },
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({
                                "pathAfterWwwRoot": sliderFolderPath,
                                "fileName": sliderFile.name,
                                "fileContentInBase64Str": dataUrl.replace("data:image/jpeg;base64,", "")   // add only base64 part of dataUrl
                            }),
                            success: () => {
                                updateResultLabel(
                                    "#spn_resultLabel",
                                    resultLabel_successMessageByLanguages[language],
                                    resultLabel_successColor);
                            },
                            error: (response) => {
                                updateResultLabel(
                                    "#spn_resultLabel",
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
                    resultLabel.attr("id"),
                    "any error occured in server side",
                    resultLabel_errorColor);
            }
        })
    }

    async function populateSlider() {
        await setSliderMaxHeightAndWidthAsync();

        //#region populate "slider no" button
        btn_sliderNo.append(`1/${maxSliderQuantity}`);
        //#endregion

        //#region when sliderFiles isn't exists in local
        sliderFiles = localStorage.getItem(localKeys_sliderFileNames);

        if (sliderFiles == null) {
            sliderFiles = {};
            img_sliders.attr("src", noImagePath);
        }
        //#endregion

        //#region when sliderFiles is exists in local
        else {
            //#region add first slider on sliderFiles
            sliderFiles = JSON.parse(sliderFiles);

            await displayImageAsync();
            //#endregion

            //#region show next button
            if (Object.keys(sliderFiles).length > 1)
                btn_previous.removeAttr("disabled");
            //#endregion
        }
        //#endregion
    }
    //#endregion

    populateSlider();
})

