import {
    btn_descriptions_id, changeDescriptionsButtonColorAsync, descriptions,
    resetDescriptionsBuffer
} from "./miar_descriptions.js";

import {
    inpt_brand_id, inpt_model_id, inpt_stock_id, inpt_year_id,
    path_imageFolderAfterWwwroot, path_pdfFolderAfterWwwroot,
    path_videoFolderAfterWwwroot, populateFormAsync, removePosterAttrAsync,
    removeVideoAttrAsync, selectedImageInfos, selectedPdfInfos, selectedVideoInfos,
    slct_mainCategory_id, slct_subCategory_id, vid_machine
} from "./miar_machine_inputForm.js";

import {
    updateResultLabel, getBase64StrOfFileAsync
} from "./miar_tools.js"


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const img_loading = $("#img_loading");
    //#endregion

    //#region events
    $("form").submit(async event => {
        //#region resets
        // reset result label
        event.preventDefault();
        $(resultLabel_id).empty();

        // display loading gif
        img_loading.removeAttr("hidden");
        //#endregion

        //#region control the descriptions whether entered (error)

        //#region when any description not entered (error)
        if (!descriptions.isChanged) {
            // write error
            updateResultLabel(
                resultLabel_id,
                errorMessagesByLanguages[language]["descriptionNotEntered"],
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        //#region descriptions in some language not entered (error)
        // get languages in session
        let languagesInSession = JSON.parse(
            localStorage.getItem(localKeys_allLanguages))[language];

        // control description by language
        for (let index in languagesInSession) {
            //#region control the descriptions whether some languages entered (error)
            let languageInSession = languagesInSession[index];

            if (descriptions.byLanguages[languageInSession] == null  // when relevant language not entered
                || descriptions.byLanguages[languageInSession] == ""  // when blank value entered
            ) {
                // write error
                updateResultLabel(
                    resultLabel_id,
                    `"${languageInSession}" ${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);

                return;
            }
            //#endregion
        }
        //#endregion

        //#endregion

        //#region create machine

        //#region create
        let isCreateSuccessful = await createMachineAsync() ?
            await uploadMachineImageToFolderAsync() ?
                await uploadMachineVideoToFolderAsync() ?
                    await uploadMachinePdfToFolderAsync() ?
                        true
                        : false
                    : false
                : false
            : false;
        //#endregion

        //#region when create is successful
        if (isCreateSuccessful) {
            //#region reset form
            $("form")[0].reset();

            await removePosterAttrAsync();
            await removeVideoAttrAsync();
            await changeDescriptionsButtonColorAsync(
                $("#" + btn_descriptions_id),
                descriptions_unsavedColor);
            resetDescriptionsBuffer();
            //#endregion

            //#region write successfull message
            updateResultLabel(
                resultLabel_id,
                successMessagesByLanguages[language]["saveSuccessful"],
                resultLabel_successColor,
                "30px",
                img_loading);
            //#endregion
        }
        //#endregion 

        //#endregion 
    })
    $(window).resize(async () => {
        await setMachineVideoSizeAsync();
    })
    //#endregion
    async function setMachineVideoSizeAsync() {
        //#region set width and height
        let panelBodyWidth = $(".panel-body").prop("clientWidth");

        vid_machine.css(
            "width",
            panelBodyWidth - (panelBodyWidth * (60 / 100)));
        //#endregion
    }

    async function createMachineAsync() {
        return new Promise(resolve => {
            $.ajax({
                method: "POST",
                url: baseApiUrl + `/machine/create?language=${language}`,
                headers: { "Authorization": jwtToken },
                data: JSON.stringify({
                    "ImageName": selectedImageInfos.name,
                    "VideoName": selectedVideoInfos.name,
                    "MainCategoryName": $("#" + slct_mainCategory_id).val(),
                    "SubCategoryName": $("#" + slct_subCategory_id).val(),
                    "Model": $("#" + inpt_model_id).val(),
                    "BrandName": $("#" + inpt_brand_id).val(),
                    "HandStatus": $("input[name = handStatus]:checked").val(),
                    "PdfName": selectedPdfInfos.name,
                    "Stock": $("#" + inpt_stock_id).val(),
                    "Year": $("#" + inpt_year_id).val(),
                    "Descriptions": {
                        "TR": descriptions.byLanguages.TR,
                        "EN": descriptions.byLanguages.EN
                    }
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: (response) => {
                    //#region write error
                    updateResultLabel(
                        resultLabel_id,
                        JSON.parse(response.responseText).errorMessage,
                        resultLabel_errorColor,
                        "30px",
                        img_loading);
                    //#endregion

                    resolve(false);
                }
            });
        });
    }

    async function uploadMachineImageToFolderAsync() {
        return new Promise(async resolve => {
            $.ajax({
                type: "POST",
                url: (baseApiUrl + "/machine/upload/image?" +
                    `language=${language}` +
                    `&fileName=${selectedImageInfos.name}` +
                    `&fileFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedImageInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    // write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulImageUpload"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
    }

    async function uploadMachineVideoToFolderAsync() {
        return new Promise(async resolve => {
            $.ajax({
                type: "POST",
                url: (baseApiUrl + "/machine/upload/video?" +
                    `language=${language}` +
                    `&fileName=${selectedVideoInfos.name}` +
                    `&fileFolderPathAfterWwwroot=${path_videoFolderAfterWwwroot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedVideoInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    // write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulVideoUpload"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
    }

    async function uploadMachinePdfToFolderAsync() {
        return new Promise(async resolve => {
            $.ajax({
                type: "POST",
                url: (baseApiUrl + "/machine/upload/pdf?" +
                    `language=${language}` +
                    `&fileName=${selectedPdfInfos.name}` +
                    `&fileFolderPathAfterWwwroot=${path_pdfFolderAfterWwwroot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedPdfInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    // write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulPdfUpload"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
    }
    //#endregion

    populateFormAsync(true);
})