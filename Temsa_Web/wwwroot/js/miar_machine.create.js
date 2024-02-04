import {
    btn_descriptions_id, changeDescriptionsButtonColorAsync, descriptions,
    resetDescriptionsBuffer, uploadDescriptionsEventsAsync
} from "./miar_descriptions.js";

import {
    machineForm_setMachineVideoSizeAsync, machineForm_removeVideoAttrAsync,
    change_pdfInputAsync, machineForm_removePosterAttrAsync,
    machineForm_addElementNamesAsync, machineForm_populateSelectsAsync,
    click_showImageButtonAsync, click_showVideoButtonAsync,
    machineForm_showOrHideBackButtonAsync, click_inputAsync, click_textAreaAsync,
    change_imageInputAsync, change_videoInputAsync
} from "./miar_machine.js";

import { updateResultLabel, getBase64StrOfFileAsync } from "./miar_tools.js"
import { checkValueOfNumberInputAsync } from "./miar_module_inputForm.js";


$(function () {
    //#region variables
    const img_loading = $("#img_loading");
    const vid_machine = $("#vid_machine");
    const src_machine = $("#src_machine");
    const spn_resultLabel_id = "p_resultLabel";
    const spn_resultLabel = $("#" + spn_resultLabel_id);
    const spn_fileStatus = $("#spn_fileStatus");
    const btn = {
        "showImage": $("#btn_showImage"),
        "showVideo": $("#btn_showVideo"),
        "save": $("#btn_save")
    };
    const div = {
        "form_id": "div_form",
        "panelTitle": $("#div_panelTitle"),
        "imageInput": $("#div_imageInput"),
        "videoInput": $("#div_videoInput"),
        "pdfInput": $("#div_pdfInput"),
        "mainCategory": $("#div_mainCategory"),
        "subCategory": $("#div_subCategory"),
        "model": $("#div_model"),
        "brand": $("#div_brand"),
        "year": $("#div_year"),
        "stock": $("#div_stock"),
        "sold": $("#div_sold"),
        "rented": $("#div_rented"),
        "handStatus": $("#div_handStatus")
    };
    const slct = {
        "mainCategory": $("#slct_mainCategory"),
        "subCategory": $("#slct_subCategory")
    };
    const inpt = {
        "model_id": "inpt_model",
        "brand_id": "inpt_brand",
        "year_id": "inpt_year",
        "stock_id": "inpt_stock",
        "sold_id": "inpt_sold",
        "rented_id": "inpt_rented",
        "image": $("#inpt_image"),
        "video": $("#inpt_video"),
        "pdf": $("#inpt_pdf"),
        "chooseImage": $("#inpt_chooseImage"),
        "chooseVideo": $("#inpt_chooseVideo"),
        "choosePdf": $("#inpt_choosePdf"),
    };
    const langPack_panelTitle = {
        "TR": "YENİ MAKİNE OLUŞTUR",
        "EN": "CREATE NEW MACHINE"
    };
    let isWindowResizeInCriticalSection = false;
    let imageAndVideoButtons_activeButton = "";
    //#endregion

    //#region events
    $("form").submit(async event => {
        //#region resets
        // reset result label
        event.preventDefault();
        spn_resultLabel.empty();

        // display loading gif
        img_loading.removeAttr("hidden");
        //#endregion

        //#region control the descriptions whether entered (error)

        //#region when any description not entered (error)
        if (!descriptions.isChanged) {
            // write error
            updateResultLabel(
                "#" + spn_resultLabel_id,
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
                    "#" + spn_resultLabel_id,
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

            await machineForm_removePosterAttrAsync(vid_machine, src_machine);
            await machineForm_removeVideoAttrAsync(vid_machine, src_machine);
            await changeDescriptionsButtonColorAsync(
                $("#" + btn_descriptions_id),
                descriptions_unsavedColor);
            resetDescriptionsBuffer();
            //#endregion

            //#region write successfull message
            updateResultLabel(
                "#" + spn_resultLabel_id,
                successMessagesByLanguages[language]["saveSuccessful"],
                resultLabel_successColor,
                "30px",
                img_loading);
            //#endregion
        }
        //#endregion 

        //#endregion 
    })
    $("#" + div.form_id + " input").click(async (event) => {
        await click_inputAsync(event, spn_resultLabel);
    })
    $("#" + div.form_id + " textarea").click(async () => {
        await click_textAreaAsync(spn_resultLabel);
    })
    $("#" + div.form_id + " input[type= number]").change(async (event) => {
        //#region check number input whether max or min value violation
        let input = $("#" + event.target.id);

        switch (event.target.id) {
            case inpt.year_id:
                await checkValueOfNumberInputAsync(
                    input,
                    numberInputLimits.year.min,
                    numberInputLimits.year.max);
                break;
            case inpt.stock_id:
                await checkValueOfNumberInputAsync(
                    input,
                    numberInputLimits.stock.min,
                    numberInputLimits.stock.max);
                break;
            case inpt.sold_id:
                await checkValueOfNumberInputAsync(
                    input,
                    numberInputLimits.sold.min,
                    numberInputLimits.sold.max);
                break;
            case inpt.rented_id:
                await checkValueOfNumberInputAsync(
                    input,
                    numberInputLimits.rented.min,
                    numberInputLimits.rented.max);
                break;
        }
        //#endregion
    })
    $(window).resize(async () => {
        //#region wait until the previous resize event finishes
        if (isWindowResizeInCriticalSection)
            return;
        //#endregion

        //#region set machine video size 
        isWindowResizeInCriticalSection = true;

        setTimeout(async () => {
            await machineForm_setMachineVideoSizeAsync(vid_machine);

            isWindowResizeInCriticalSection = false;
        }, 500);
        //#endregion
    })
    btn.showImage.click(async () => {
        //#region active/passive the image and video buttons
        //passive the video button
        btn.showVideo.addClass("btn_imageAndVideo_passive");
        btn.showVideo.removeClass("btn_imageAndVideo_active");
        
        // active the image button
        btn.showImage.addClass("btn_imageAndVideo_active");
        btn.showImage.removeClass("btn_imageAndVideo_passive");
        //#endregion

        //#region show image if video shows
        if (imageAndVideoButtons_activeButton != "image")
            await click_showImageButtonAsync(btn.showImage, btn.showVideo, vid_machine);

        imageAndVideoButtons_activeButton = "image";
        //#endregion        
    })
    btn.showVideo.click(async () => {
        //#region active/passive the image and video buttons
        // passive the image button
        btn.showImage.addClass("btn_imageAndVideo_passive");
        btn.showImage.removeClass("btn_imageAndVideo_active");

        // active the video button
        btn.showVideo.addClass("btn_imageAndVideo_active");
        btn.showVideo.removeClass("btn_imageAndVideo_passive");
        //#endregion

        //#region show video if image shows
        if (imageAndVideoButtons_activeButton != "video")
            await click_showVideoButtonAsync(btn.showImage, btn.showVideo, vid_machine);

        imageAndVideoButtons_activeButton = "video";
        //#endregion
    })
    inpt.chooseImage.click(() => {
        inpt.image.trigger("click");
    })
    inpt.chooseVideo.click(() => {
        inpt.video.trigger("click");
    })
    inpt.choosePdf.click(() => {
        inpt.pdf.trigger("click");
    })
    inpt.image.change(async (event) => {
        let isSuccess = await change_imageInputAsync(
            event,
            inpt.chooseImage,
            img_loading,
            inpt.image,
            vid_machine,
            spn_fileStatus);

        //#region when unsuccessful
        if (!isSuccess)
            return;
        //#endregion

        //#region display image button
        // when video is added
        if (btn.showVideo.attr("hidden") == undefined)
            btn.showImage.addClass("btn btn_imageAndVideo btn_imageAndVideo_passive")


        // when video is not added
        else {
            btn.showImage.addClass("btn btn_imageAndVideo btn_imageAndVideo_active");
            imageAndVideoButtons_activeButton = "image";
        }
           
        btn.showImage.removeAttr("hidden");
        //#endregion
    })
    inpt.video.change(async (event) => {
        let isSuccess = await change_videoInputAsync(
            event,
            inpt.chooseVideo,
            img_loading,
            inpt.video,
            src_machine,
            vid_machine,
            spn_fileStatus);

        //#region when unsuccessful
        if (!isSuccess)
            return;
        //#endregion

        //#region display video button
        // when image is added
        if (btn.showImage.attr("hidden") == undefined)
            btn.showVideo.addClass("btn btn_imageAndVideo btn_imageAndVideo_passive")

        // when image is not added
        else {
            btn.showVideo.addClass("btn btn_imageAndVideo btn_imageAndVideo_active");
            imageAndVideoButtons_activeButton = "video";
        }
            
        btn.showVideo.removeAttr("hidden");
        //#endregion
    })
    inpt.pdf.change(async (event) => {
        await change_pdfInputAsync(
            event,
            inpt.choosePdf,
            img_loading,
            inpt.pdf);
    })
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add panel title
        div.panelTitle.append(
            langPack_panelTitle[language]);
        //#endregion

        await machineForm_addElementNamesAsync(
            btn.showImage,
            btn.showVideo,
            div.imageInput,
            div.videoInput,
            div.pdfInput,
            div.mainCategory,
            div.subCategory,
            div.model,
            div.brand,
            div.year,
            div.stock,
            div.sold,
            div.rented,
            div.handStatus,
            btn_descriptions_id,
            btn.save
        );
        await machineForm_populateSelectsAsync(slct.mainCategory);
        await uploadDescriptionsEventsAsync();
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
                    "MainCategoryName": slct.mainCategory.val(),
                    "SubCategoryName": slct.subCategory.val(),
                    "Model": $("#" + inpt.model_id).val(),
                    "BrandName": $("#" + inpt.brand_id).val(),
                    "HandStatus": $("input[name= handStatus]:checked").val(),
                    "PdfName": selectedPdfInfos.name,
                    "Stock": $("#" + inpt.stock_id).val(),
                    "Year": $("#" + inpt.year_id).val(),
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
                        "#" + spn_resultLabel_id,
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
                        "#" + spn_resultLabel_id,
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
                        "#" + spn_resultLabel_id,
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
                        "#" + spn_resultLabel_id,
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

    populateHtmlAsync();
})