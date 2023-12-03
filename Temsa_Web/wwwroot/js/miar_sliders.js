import { setDisabledOfButtonAsync, updateResultLabel } from "./miar_tools.js";


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
    const btn_chooseFile = $("#btn_chooseFile");
    let currentSliderNo = 0;
    let maxSliderQuantity;  // associated with "slider_noAndPaths" length
    let slider_selectedFilesInfos = {};
    let slider_noAndPaths = [];
    let buttonThatTriggeringToChooseFileInput = "";
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

        //#region control the selected file (errors)

        //#region when any file not selected (return)
        if (selectedFileInfos == undefined)
            return;
        //#endregion

        //#region when selected file type not image (error)
        else if (!selectedFileInfos.type.startsWith("image/")) {
            inpt_chooseFile.val("");
            updateResultLabel(
                resultLabeL_id,
                errorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#region when same image already added previously (error)

        //#region when exists in "slider_noAndPaths" (error)
        let result = slider_noAndPaths.findIndex(p => p == selectedFileInfos.name);

        if (result != -1) {
            updateResultLabel(
                resultLabeL_id,
                errorMessagesByLanguages[language]["imageConflicted"],
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#region when exists in "slider_selectedFilesInfos" (error)
        for (let sliderNo in slider_selectedFilesInfos) {
            let fileName = slider_selectedFilesInfos[sliderNo];

            // when conflicted
            if (fileName == selectedFileInfos.name) {
                updateResultLabel(
                    resultLabeL_id,
                    errorMessagesByLanguages[language]["imageConflicted"],
                    resultLabel_errorColor);

                return;
            }
        }
        //#endregion

        //#endregion

        //#endregion

        //#region when clicked to "btn_next"
        if (buttonThatTriggeringToChooseFileInput == btn_next.attr("id")) {
            currentSliderNo += 1;
            maxSliderQuantity += 1;
        }
        //#endregion

        //#region update "slider_selectedFilesInfos"
        slider_selectedFilesInfos[currentSliderNo] = selectedFileInfos
        //#endregion

        //#region display slider and show previous button
        await displaySliderByDataUrlAsync(selectedFileInfos);
        btn_previous.removeAttr("hidden");
        //#endregion
    })
    inpt_chooseFile.click(async (event, idOfButtonThatDoTrigger) => {
        //#region save button name that last trigerring to "inpt_chooseFile.click()"
        buttonThatTriggeringToChooseFileInput = idOfButtonThatDoTrigger;
        //#endregion
    })
    btn_previous.click(async () => {
        //#region before start
        resultLabel.empty();
        currentSliderNo -= 1;
        //#endregion

        //#region hide previous button and active next button
        if (currentSliderNo == 0)
            btn_previous.attr("hidden", "")

        await setDisabledOfButtonAsync(
            false,
            btn_next,
            nextButton_bgColor_enabled);
        //#endregion

        //#region add "next.png" to next button
        if (img_buttonNext.attr("src") == image_newImagePath) {
            img_buttonNext.removeAttr("src");  // remove "noImage.png";
            img_buttonNext.attr("src", "/images/next.png");
            img_buttonNext.removeAttr("style");  // reset sizes
        }
        //#endregion

        await displaySliderAsync();
    })
    btn_next.click(async () => {
        //#region before start
        resultLabel.empty();  // reset 
        inpt_chooseFile.val("");  // reset
        //#endregion

        //#region when clicked to next button with "newImage.png"
        if (img_buttonNext.attr("src") == image_newImagePath) {
            //#region do trigger to "inpt_chooseFile.click()"
            inpt_chooseFile.trigger(
                "click",
                [btn_next.attr("id")]);
            //#endregion
        }
        //#endregion

        //#region when clicked to normal next button
        else {
            // display new slider
            currentSliderNo += 1;
            await displaySliderAsync();

            // show previous button
            btn_previous.removeAttr("hidden");
        }
        //#endregion
    })
    btn_chooseFile.click(() => {
        //#region before start
        resultLabel.empty();  // reset
        inpt_chooseFile.val("");  // reset
        //#endregion

        //#region do trigger to "inpt_chooseFile.click()"
        inpt_chooseFile.trigger(
            "click",
            [btn_chooseFile.attr("id")]);
        //#endregion
    });
    $("#btn_remove").click(async () => {
        //#region before start
        resultLabel.empty();
        inpt_chooseFile.val("")  // reset
        //#endregion

        //#region update "sliderNoAndPaths" and "slider_selectedFilesInfos"
        slider_noAndPaths[currentSliderNo] = undefined;
        delete slider_selectedFilesInfos[currentSliderNo];
        //#endregion

        //#region when last slider removed
        if (currentSliderNo == maxSliderQuantity - 1) {
            slider_noAndPaths.pop();

            //#region update "currentSliderNo" and "maxSliderQuantity"
            if (currentSliderNo != 0) {
                currentSliderNo -= 1
                maxSliderQuantity -= 1;
            }
            //#endregion

            //#region hide previous button
            if (currentSliderNo == 0)
                btn_previous.attr("hidden", "")
            //#endregion
        }
        //#endregion

        await displaySliderAsync();
    });
    $("#btn_save").click(async () => {
        //#region before start
        resultLabel.empty();
        //#endregion

        //#region when images not added to some pages (error)
        for (let sliderNo = 0; sliderNo < maxSliderQuantity; sliderNo += 1) {
            // when slider not exists in "slider_noAndPaths" and "slider_selectedFilesInfos"
            if (slider_noAndPaths[sliderNo] == undefined
                && slider_selectedFilesInfos[sliderNo] == undefined) {
                    updateResultLabel(
                        resultLabeL_id,
                        errorMessagesByLanguages[language]["noImage"],
                        resultLabel_errorColor);

                    return;
            }
        }
        //#endregion

        await uploadSlidersAsync();
    })
    $("#div_sidebarMenuButton").click(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
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
        // 2nd ajax: upload sliders to folder
        // 3nd ajax: upload sliders to db
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

                //#region when any file selected (ajax)
                if (Object.keys(slider_selectedFilesInfos).length != 0) {
                    //#region upload selected sliders (ajax)
                    let selectedFileNames = [];

                    for (let sliderNo in slider_selectedFilesInfos) {
                        //#region add fileName to "selectedFileNames" array
                        let sliderInfos = slider_selectedFilesInfos[sliderNo];
                        selectedFileNames.push(sliderInfos.name);
                        //#endregion

                        //#region upload slider to folder and db (2nd ajax)
                        let reader = new FileReader();

                        reader.readAsDataURL(sliderInfos);
                        reader.onload = function (event) {
                            //#region upload sliders to folder and db (3th ajax)
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
                                    //#region upload selected sliders to db (3th ajax)
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
                                                "fileNames": selectedFileNames
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
                }
                //#endregion

                //#region when any file not selected
                else {
                    //#region update "sliderNoAndPaths" on local
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

            updateSliderNoButtonAsync();
            controlNextButtonAsync();
        };
        //#endregion
    }

    async function displaySliderAsync() {
        //#region before start
        // reset selected file input
        inpt_selectedFile.val("");

        // remove old slider
        img_sliders.removeAttr("src");

        // write "image loading..." message 
        updateResultLabel(
            spn_fileStatusLabel_id,
            successMessagesByLanguages[language]["imageLoading"],
            spn_fileStatusLabel_color
        );
        //#endregion

        await setSliderMaxHeightAndWidthAsync();

        //#region when slider not exists on "slider_selectedFilesInfos"
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

            //#region when slider exists on "slider_noAndPaths"
            else {
                img_sliders.attr("src", image_noImagePath);

                // add message to "inpt_selectedFile"
                inpt_selectedFile.val(
                    errorMessagesByLanguages[language]["imageNotSelected"]);
            }
            //#endregion

            //#region reset "fileStatusLabel"
            $(spn_fileStatusLabel_id).empty();
            //#endregion

            await updateSliderNoButtonAsync();
            await controlNextButtonAsync();
        }
        //#endregion

        //#region when slider exists on "slider_selectedFilesInfos"
        else
            await displaySliderByDataUrlAsync(selectedFileInfos);
        //#endregion
    }

    async function controlNextButtonAsync() {
        //#region add "newImage.png" to next button
        if (currentSliderNo == maxSliderQuantity - 1) {
            //#region add "newImage.png" to button next
            img_buttonNext.attr("src", image_newImagePath);  // add image
            img_buttonNext.attr("style", image_newImagePath_style);  // set sizes
            //#endregion

            //#region when slider to be displayed is "NoImage.png"
            if (img_sliders.attr("src") == image_noImagePath)
                // disable button next
                await setDisabledOfButtonAsync(
                    true,
                    btn_next,
                    nextButton_bgColor_disabled);
            //#endregion

            //#region when slider to be displayed isn't "NoImage.png"
            else
                // enable button next
                await setDisabledOfButtonAsync(
                    false,
                    btn_next,
                    nextButton_bgColor_enabled);
            //#endregion
        }
        //#endregion
    }

    async function initializeMaxSliderQuantityAsync() {
        //#region initialize "maxSliderQuantity"
        maxSliderQuantity = slider_noAndPaths.length <= 1 ?
            1 :
            slider_noAndPaths.length
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

                    initializeMaxSliderQuantityAsync();
                    displaySliderAsync();

                    //#region save "slider_noAndPaths" to local
                    localStorage.setItem(
                        localKeys_sliderNoAndPaths,
                        JSON.stringify(slider_noAndPaths));
                    //#endregion
                },
                error: () => {
                    initializeMaxSliderQuantityAsync();
                    displaySliderAsync(); // for add "noImage" image
                }
            })
        //#endregion

        //#region when "slider_noAndPaths" exists in local
        else {
            initializeMaxSliderQuantityAsync();
            await displaySliderAsync();
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

