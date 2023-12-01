import { updateResultLabel } from "./miar_tools.js";


$(function () {
    //#region variables
    const img_sliders_id = "img_sliders";
    const img_sliders = $("#" + img_sliders_id);
    const btn_previous = $("#btn_previous");
    const btn_next = $("#btn_next");
    const btn_sliderNo = $("#btn_sliderNo");
    const inpt_chooseFile = $("#inpt_chooseFile");
    const resultLabeL_id = "#spn_resultLabel";
    const resultLabel = $(resultLabeL_id);
    const slider_folderPathAfterWwwRoot = "images\\sliders";
    const spn_fileStatusLabel_id = "#spn_fileStatusLabel";
    const spn_fileStatusLabel_color = "#120a8f";
    const img_buttonNext = $("#img_buttonNext");
    const image_noImagePath = "/images/noImage.png";
    const image_newImagePath = "/images/newImage.png";
    const image_newImagePath_style = "max-width:45px; max-height:45px";
    const inpt_selectedFile = $("#inpt_selectedFile");
    const nextButton_bgColor_enabled = "darkBlue";
    const nextButton_bgColor_disabled = "darkGrey";
    let currentSliderNo = 0;
    let maxSliderQuantity;  // associated with "slider_noAndPaths" length
    let slider_selectedFilesInfos = {};
    let slider_noAndPaths = [];
    //#endregion

    //#region events
    $(window).resize(async () => {
        await setSliderMaxHeightAndWidthAsync();
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
                errorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#region active next button with "NoImage.png"
        if (currentSliderNo == maxSliderQuantity - 1)
            await enableOrDisableNextButtonAsync(false);
        //#endregion

        //#region display slider by dataUrl
        slider_selectedFilesInfos[currentSliderNo] = selectedFileInfos // save selectedFile
        await displaySliderByDataUrlAsync(selectedFileInfos);
        //#endregion
    })
    btn_previous.click(async () => {
        //#region update slider no button
        resultLabel.empty();
        currentSliderNo -= 1;

        await updateSliderNoButtonAsync();
        //#endregion

        //#region hide previous button and active next button
        if (currentSliderNo == 0)
            btn_previous.attr("hidden", "")

        await enableOrDisableNextButtonAsync(false);
        //#endregion

        //#region add "next.png" to next button
        if (img_buttonNext.attr("src") == image_newImagePath) {
            img_buttonNext.removeAttr("src");  // remove "noImage.png";
            img_buttonNext.attr("src", "/images/next.png");
            img_buttonNext.removeAttr("style");  // reset sizes
        }
        //#endregion

        //#region display image
        inpt_chooseFile.val(""); // reset choose file input
        await displaySliderByPathAsync();
        //#endregion
    })
    btn_next.click(async () => {
        //#region when clicked to next button with "noImage.png"
        resultLabel.empty();

        if (img_buttonNext.attr("src") == image_newImagePath) {
            maxSliderQuantity += 1;

            // disable next button with "noImage.png"
            await enableOrDisableNextButtonAsync(true);
        }
        //#endregion

        //#region update "sliderNo" button
        currentSliderNo += 1;
        await updateSliderNoButtonAsync();
        //#endregion

        //#region display slider
        btn_previous.removeAttr("hidden");  // show previous button
        inpt_chooseFile.val(""); // reset choose file input

        await displaySliderByPathAsync();
        //#endregion

        //#region add "newImage.png" to next button
        if (currentSliderNo == maxSliderQuantity - 1) {
            // add "newImage.png" to button next
            img_buttonNext.attr("src", image_newImagePath);
            img_buttonNext.attr("style", image_newImagePath_style);  // set sizes

            // disable button next with "newImage.png"
            if (img_sliders.attr("src") == image_noImagePath)
                await enableOrDisableNextButtonAsync(true);
        }
        //#endregion
    })
    $("#btn_save").click(async () => {
        //#region any slider not selected (error)
        resultLabel.empty();

        if (Object.keys(slider_selectedFilesInfos).length == 0) {
            updateResultLabel(
                resultLabeL_id,
                errorMessagesByLanguages[language]["noAnyChanges"],
                resultLabel_errorColor);

            return;
        }
        //#endregion

        await uploadSlidersAsync();
    })
    $("#div_sidebarMenuButton").click(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
    $("#btn_chooseFile").click(() =>
        inpt_chooseFile.trigger("click")
    );
    //#endregion

    //#region functions
    async function setSliderMaxHeightAndWidthAsync() {
        //#region set max width and height of slider
        let sliderMaxWidth = $(".panel-body")[0].clientWidth - 40;  // 40: i choosed as trying
        const sliderMaxHeight = window.innerHeight / 2.5;
        //#endregion

        //#region when siderbar menu opened
        const classWhenSidebarMenuOpened = "nav-collapse";

        if ($("#sidebar").attr("class") == classWhenSidebarMenuOpened)
            sliderMaxWidth -= 240;  // 240: sidebarMenu width
        //#endregion

        //#region change max sizes of slider
        img_sliders.css("max-width", sliderMaxWidth);
        img_sliders.css("max-height", sliderMaxHeight);
        //#endregion
    }

    async function updateSliderNoButtonAsync() {
        btn_sliderNo.empty();
        btn_sliderNo.append(
            (currentSliderNo + 1) + "/" + maxSliderQuantity);
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
                                "FileContentInBase64Str": dataUrl.replace(`data:${sliderInfos.type};base64,`, "")   // add only base64 part of dataUrl
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
                                                successMessagesByLanguages[language]["successfullSave"],
                                                resultLabel_successColor);
                                            //#endregion
                                        },
                                        error: () => {
                                            updateResultLabel(
                                                resultLabeL_id,
                                                errorMessagesByLanguages[language]["uploadToDb"],
                                                resultLabel_errorColor);
                                        }
                                    })
                                }
                                //#endregion
                            },
                            error: () => {
                                updateResultLabel(
                                    resultLabeL_id,
                                    errorMessagesByLanguages[language]["uploadToFolder"],
                                    resultLabel_errorColor);
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
                    errorMessagesByLanguages[language]["deleteFromFolderAndDb"],
                    resultLabel_errorColor);
            }
        })
    }

    async function displaySliderByDataUrlAsync(selectedFileInfos) {
        //#region add dataUrl to src of slider <img>
        let fileReader = new FileReader();

        fileReader.readAsDataURL(selectedFileInfos);
        fileReader.onload = function (event) {
            // add src to slider <img>
            var dataUrl = event.target.result;
            img_sliders.attr("src", dataUrl);

            // write file name to "inpt_selectedFile"
            inpt_selectedFile.val(selectedFileInfos.name);

            // reset "image loading..." message
            $(spn_fileStatusLabel_id).empty(); 
        };
        //#endregion
    }

    async function displaySliderByPathAsync() {
        await setSliderMaxHeightAndWidthAsync();

        //#region when slider to be display hasn't been changed previously
        let selectedFileInfos = slider_selectedFilesInfos[currentSliderNo];

        if (selectedFileInfos == undefined) {
            //#region when slider exists on "slider_noAndPaths"
            let fileName = slider_noAndPaths[currentSliderNo];

            if (fileName != undefined) {
                // add src to slider <img>
                img_sliders.attr(
                    "src",
                    "/" + slider_folderPathAfterWwwRoot + "//" + fileName);

                // write file name to "inpt_selectedFile"
                inpt_selectedFile.val(fileName);
            }
                
            //#endregion

            //#region when slider not exists on "slider_noAndPaths"
            else {
                img_sliders.attr("src", image_noImagePath);

                // add message to "inpt_selectedFile"
                inpt_selectedFile.val(
                    errorMessagesByLanguages[language]["imageNotSelected"]);
            }
            //#endregion
        }
        //#endregion

        //#region when slider to be display has been changed previously
        else {
            //#region remove image and add "image loading..." message 
            img_sliders.removeAttr("src");  // until slider loads
            updateResultLabel(
                spn_fileStatusLabel_id,
                successMessagesByLanguages[language]["imageLoading"],
                spn_fileStatusLabel_color
            );
            //#endregion

            await displaySliderByDataUrlAsync(selectedFileInfos);
        }
        //#endregion
    }

    async function initializeSliderNoButtonAsync() {
        //#region when total slider quantity less than 2
        let totalSliderQuantity = slider_noAndPaths.length

        if (totalSliderQuantity <= 1) {
            //#region add "newImage.png" to next button
            maxSliderQuantity = 1;
            img_buttonNext.attr("src", image_newImagePath);
            img_buttonNext.attr("style", image_newImagePath_style);  // set sizes
            //#endregion

            //#region disable button next with "newImage.png"
            if (totalSliderQuantity == 0)
                await enableOrDisableNextButtonAsync(true);
            //#endregion
        }
        //#endregion

        //#region when total slider quantity more than 1
        else
            maxSliderQuantity = totalSliderQuantity;
        //#endregion

        //#region populate "sliderNo" button
        btn_sliderNo.append(`1/${maxSliderQuantity}`);
        //#endregion
    }

    async function enableOrDisableNextButtonAsync(doDisabled) {
        //#region do disabled next button
        if (doDisabled) {
            btn_next.attr("disabled", "");
            btn_next.css("background-color", nextButton_bgColor_disabled);
        }
        //#endregion

        //#region active next button
        else {
            btn_next.removeAttr("disabled");
            btn_next.css("background-color", nextButton_bgColor_enabled);
        }
        //#endregion
    }

    async function populateSliderAsync() {
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
                    initializeSliderNoButtonAsync();

                    //#region save "slider_noAndPaths" to local
                    localStorage.setItem(
                        localKeys_sliderNoAndPaths,
                        JSON.stringify(slider_noAndPaths));
                    //#endregion
                },
                error: () => {
                    displaySliderByPathAsync(); // for add "noImage" image
                    initializeSliderNoButtonAsync();
                }
            })
        //#endregion

        //#region when "slider_noAndPaths" exists in local
        else {
            await displaySliderByPathAsync();
            await initializeSliderNoButtonAsync();
        }
        //#endregion

        //#endregion
    }

    async function populateHtmlAsync() {
        // add table title
        $("#header_tableTitle").append(
            tableTitleByLanguages[language]);

        // add choose file button name
        $("#btn_chooseFile").append(
            chooseFileButton_nameByLanguages[language]);

        // add save button name
        $("#btn_save").append(
            saveButton_nameByLanguages[language]);

        // add remove button name
        $("#btn_remove").append(
            removeButtonNameByLanguages[language]);
    }
    //#endregion

    populateHtmlAsync();
    populateSliderAsync();
})

