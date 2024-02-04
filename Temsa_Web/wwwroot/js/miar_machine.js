import {
    displayFileByObjectUrlAsync, populateSelectAsync, isFileSizeValidAsync,
    isFileTypeValidAsync, populateElementByAjaxOrLocalAsync,
    removeObjectUrlFromElementAsync, updateResultLabel
} from "./miar_tools.js"

import { a_descriptions_class, ul_descriptions_id } from "./miar_descriptions.js";


//#region variables
const langPack_formElementNames = {
    "TR": {
        "imageInput": "Resim",
        "videoInput": "Video",
        "pdfInput": "Pdf",
        "mainCategory": "Kategori",
        "subCategory": "Alt Kategori",
        "model": "Model",
        "brand": "Marka",
        "year": "Yıl",
        "stock": "Stok Adedi",
        "sold": "Satılan",
        "rented": "Kiralanan",
        "handStatus": {
            "name": "El Durumu",
            "radioL": "Sıfır",
            "radioR": "İkinci El"
        },
        "descriptions": "Açıklama"
    },
    "EN": {
        "imageInput": "Image",
        "videoInput": "Video",
        "pdfInput": "Pdf",
        "mainCategory": "Category",
        "subCategory": "Subcategory",
        "model": "Model",
        "brand": "Brand",
        "year": "Year",
        "stock": "Stock",
        "sold": "Sold",
        "rented": "Rented",
        "handStatus": {
            "name": "Hand Status",
            "radioL": "Zero",
            "radioR": "Second Hand"
        },
        "descriptions": "Description"
    },
}
const langPack_imageAndVideoButtons = {
    "TR": {
        "image": "Resim",
        "video": "Video"
    },
    "EN": {
        "image": "Image",
        "video": "Video"
    }
}
const langPack_saveButton = {
    "TR": "KAYDET",
    "EN": "SAVE"
}
const css_imageAndVideoButtons_checked = {
    "color": "yellow",
    "background-color": "darkblue",
    "font-weight": "bolder"
};
const imageSizeLimitInMb = 20;
const videoSizeLimitInMb = 20;
const pdfSizeLimitInMb = 20;
//#endregion

//#region events
export async function click_showImageButtonAsync(
    btn_showImage,
    btn_showVideo,
    vid_machine
) {
    // add css to show button
    btn_showImage.css(css_imageAndVideoButtons_checked);
    btn_showVideo.removeAttr("style");  // reset

    // remove video attributes
    vid_machine.removeAttr("controls autoplay");
    vid_machine.load();
}
export async function click_showVideoButtonAsync(
    btn_showImage,
    btn_showVideo,
    vid_machine
) {
    // add css to video button
    btn_showVideo.css(css_imageAndVideoButtons_checked);
    btn_showImage.removeAttr("style");  // reset

    // show video controls
    vid_machine.attr({
        "controls": "",
        "autoplay": ""
    });
    vid_machine.load();
}
export async function click_inputAsync(event, spn_resultLabel) {
    //#region reset help label of clicked <input>
    let clickedInputId = event.target.id;
    let spn_help = $(`#spn_help_${clickedInputId}`);

    spn_help.removeAttr("style"); // reset style
    spn_help.empty();  // reset input
    //#endregion

    spn_resultLabel.empty();
    spn_resultLabel.removeAttr("style");
}
export async function click_textAreaAsync(spn_resultLabel) {
    spn_resultLabel.empty();
    spn_resultLabel.removeAttr("style");
}
export async function change_imageInputAsync(
    event,
    inpt_chooseImage,
    img_loading,
    inpt_image,
    vid_machine,
    spn_fileStatus
) {
    //#region control selected file (error)

    //#region when any file not selected (return)
    let selectedFileInfos = event.target.files[0];

    if (selectedFileInfos == undefined)
        return;
    //#endregion

    //#region when file type is not image (error)
    if (!await isFileTypeValidAsync(selectedFileInfos, "image")) {
        // write error
        updateResultLabel(
            "#spn_help_" + inpt_chooseImage.attr("id"),
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset file input
        inpt_image.val("");
        return;
    }
    //#endregion

    //#region when file size is invalid (error)
    if (!await isFileSizeValidAsync(selectedFileInfos.size, imageSizeLimitInMb)) {
        // write error
        updateResultLabel(
            "#spn_help_" + inpt_chooseImage.attr("id"),
            errorMessagesByLanguages[language]["imageSizeOverflow"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset file input
        inpt_image.val("");
        return;
    }
    //#endregion

    //#endregion

    //#region display image
    // change image name on <input>
    selectedImageInfos = selectedFileInfos;
    inpt_chooseImage.val(selectedImageInfos.name);

    await displayFileByObjectUrlAsync(
        selectedImageInfos,
        vid_machine,
        "poster",
        spn_fileStatus,
        () => {
            // hide machine video
            vid_machine.attr("hidden", "");
        },
        () => {
            // show video and set video sizes
            vid_machine.removeAttr("hidden");
            machineForm_setMachineVideoSizeAsync(vid_machine);
            vid_machine.load();
        });
    //#endregion
}
export async function change_videoInputAsync(
    event,
    inpt_chooseVideo,
    img_loading,
    inpt_video,
    src_machine,
    vid_machine,
    spn_fileStatus
) {
    //#region control selected file (error)

    //#region when any file not selected (return)
    let selectedFileInfos = event.target.files[0];

    if (selectedFileInfos == undefined)
        return;
    //#endregion

    //#region when file type isn't video (error)
    if (!await isFileTypeValidAsync(selectedFileInfos, "video/")) {
        // write error
        updateResultLabel(
            "#spn_help_" + inpt_chooseVideo.attr("id"),
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset file input
        inpt_video.val("");
        return;
    }
    //#endregion

    //#region when file size is invalid (error)
    if (!await isFileSizeValidAsync(selectedFileInfos.size, videoSizeLimitInMb)) {
        updateResultLabel(
            "#spn_help_" + inpt_chooseVideo.attr("id"),
            errorMessagesByLanguages[language]["videoSizeOverflow"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset file input
        inpt_video.val("");
        return;
    }
    //#endregion

    //#endregion

    //#region display video
    // add new video name to <input>
    selectedVideoInfos = selectedFileInfos;
    inpt_chooseVideo.val(selectedVideoInfos.name)

    await displayFileByObjectUrlAsync(
        selectedVideoInfos,
        src_machine,
        "src",
        spn_fileStatus,
        () => {
            // hide machine video
            vid_machine.attr("hidden", "");

            // set type of video <source>
            src_machine.attr("type", selectedVideoInfos.type);
        },
        () => {
            // show video and set sizes
            vid_machine.removeAttr("hidden");
            machineForm_setMachineVideoSizeAsync(vid_machine);
            vid_machine.load();
        });
    //#endregion
}
export async function change_pdfInputAsync(
    event,
    inpt_choosePdf,
    img_loading,
    inpt_pdf
) {
    //#region control selected file (error)

    //#region when any file not selected (return)
    let selectedFileInfos = event.target.files[0];

    if (selectedFileInfos == undefined)
        return;
    //#endregion

    //#region when file type is not "pdf" (error)
    if (!await isFileTypeValidAsync(selectedFileInfos, "application/pdf")) {
        // write error
        updateResultLabel(
            "#" + inpt_choosePdf.attr("id"),
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset file input
        inpt_pdf.val("");
        return;
    }
    //#endregion

    //#region when file size is invalid (error)
    if (!await isFileSizeValidAsync(selectedFileInfos.size, pdfSizeLimitInMb)) {
        // write error
        updateResultLabel(
            "#" + inpt_choosePdf.attr("id"),
            errorMessagesByLanguages[language]["pdfSizeOverflow"],
            resultLabel_errorColor,
            "30px",
            img_loading);

        // reset file input
        inpt_pdf.val("");
        return;
    }
    //#endregion

    //#endregion

    //#region add new pdf name to <input>
    selectedPdfInfos = selectedFileInfos;
    inpt_choosePdf.val(selectedPdfInfos.name);
    //#endregion
}
//#endregion

//#region functions
export async function machineForm_removePosterAttrAsync(vid_machine, src_machine) {
    //#region when poster is object url
    if (vid_machine.attr("poster").startsWith("blob:"))
        await removeObjectUrlFromElementAsync(
            vid_machine,
            "poster",
            () => {
                // when video isn't exists too
                if (src_machine.attr("src") == undefined)
                    vid_machine.attr("hidden", "");  // hide <video>

                vid_machine.load();
            });
    //#endregion

    //#region when poster is normal url
    else
        vid_machine.removeAttr("poster");
    //#endregion
}
export async function machineForm_removeVideoAttrAsync(vid_machine, src_machine) {
    //#region when video is object url
    if (src_machine.attr("src").startsWith("blob:"))
        await removeObjectUrlFromElementAsync(
            src_machine,
            "src",
            () => {
                // when image isn't exists
                if (vid_machine.attr("poster") == undefined)
                    vid_machine.attr("hidden", "");  // hide <video>

                // remove attr
                vid_machine.removeAttr("control");
                src_machine.removeAttr("type");
                vid_machine.load();
            });
    //#endregion

    //#region when video is normal url
    else {
        vid_machine.removeAttr("controls");
        src_machine.removeAttr("src type");
    }
    //#endregion
}
export async function machineForm_showOrHideBackButtonAsync(
    mode,
    div_backButton,
    div_panelTitle,
    btn_back
) {
    switch (mode) {
        case "show":
            // show back button
            div_backButton.removeAttr("hidden");

            // shift the panel title to right
            div_panelTitle.css(
                "padding-left",
                btn_back.css("width"));
            break;
        case "hide":
            // hide back button
            div_backButton.attr("hidden", "");

            // shift the panel title to left
            div_panelTitle.css("padding-left", "");
            break;
    }
}
export async function machineForm_setMachineVideoSizeAsync(vid_machine) {
    //#region set width and max-height
    let panelBody_width = $(".panel-body").prop("clientWidth");

    // set as square
    vid_machine.css({
        "width": panelBody_width - (panelBody_width * (60 / 100)),
        "max-height": panelBody_width - (panelBody_width * (60 / 100))
    });
    //#endregion
}
export async function machineForm_addElementNamesAsync(
    btn_showImage,
    btn_showVideo,
    div_imageInput,
    div_videoInput,
    div_pdfInput,
    div_mainCategory,
    div_subCategory,
    div_model,
    div_brand,
    div_year,
    div_stock,
    div_sold,
    div_rented,
    div_handStatus,
    btn_descriptions_id,
    btn_save
) {
    //#region show image button
    let formElementNames = langPack_formElementNames[language];

    btn_showImage.append(
        langPack_imageAndVideoButtons[language]["image"]);
    //#endregion

    //#region show video button
    btn_showVideo.append(
        langPack_imageAndVideoButtons[language]["video"]);
    //#endregion

    //#region image input
    div_imageInput.children("label")
        .append(formElementNames["imageInput"]);
    //#endregion

    //#region video input
    div_videoInput.children("label")
        .append(formElementNames["videoInput"]);
    //#endregion

    //#region pdf input
    div_pdfInput.children("label")
        .append(formElementNames["pdfInput"]);
    //#endregion

    //#region mainCategory
    div_mainCategory.children("label")
        .append(formElementNames["mainCategory"]);
    //#endregion

    //#region subCategory
    div_subCategory.children("label")
        .append(formElementNames["subCategory"]);
    //#endregion

    //#region model
    div_model.children("label")
        .append(formElementNames["model"]);
    //#endregion

    //#region brand
    div_brand.children("label")
        .append(formElementNames["brand"]);
    //#endregion

    //#region year
    div_year.children("label")
        .append(formElementNames["year"]);
    //#endregion

    //#region stock
    div_stock.children("label")
        .append(formElementNames["stock"]);
    //#endregion

    //#region sold
    div_sold.children("label")
        .append(formElementNames["sold"]);
    //#endregion

    //#region rented
    div_rented.children("label")
        .append(formElementNames["rented"]);
    //#endregion

    //#region handStatus
    // label
    div_handStatus.children("label")
        .append(formElementNames["handStatus"]["name"]);

    // radioL
    let radioL = $("#" + div_handStatus.attr("id") + " .radio label:nth-child(1)");

    radioL.append(formElementNames["handStatus"]["radioL"]);
    radioL.children("input")
        .val(formElementNames["handStatus"]["radioL"]);

    // radioR
    let radioR = $("#" + div_handStatus.attr("id") + " .radio label:nth-child(2)");

    radioR.append(formElementNames["handStatus"]["radioR"]);
    radioR.children("input")
        .val(formElementNames["handStatus"]["radioR"])
    //#endregion

    //#region description button
    $("#" + btn_descriptions_id + " b").append(
        `${formElementNames.descriptions} (${language})`);
    //#endregion

    //#region save button
    btn_save.append(
        langPack_saveButton[language]);
    //#endregion
}
export async function machineForm_populateSelectsAsync(slct_mainCategory) {
    // populate main category and subcategory selects
    await populateElementByAjaxOrLocalAsync(
        localKeys_allMainCategories,
        `/machine/display/mainCategory?language=${language}`,
        (mainCategories) => {
            //#region add main categories
            populateSelectAsync(
                slct_mainCategory,
                mainCategories);
            //#endregion

            //#region !!!!!!!!!!!!!!! disable mainCategoryNames !!!!!!!!!!!!!!! (TEMPORARY)
            for (let index = 2; index <= mainCategories.length; index += 1) {
                let option = slct_mainCategory
                    .children(`option:nth-child(${index})`)

                option.attr("disabled", "")
                option.attr("style", "color:darkgrey")
            }
            //#endregion
        },
        () => {
            //#region populate subCategories after mainCategory populated
            let selectedMainCategory = slct_mainCategory.val();

            populateElementByAjaxOrLocalAsync(
                localKeys_allSubCategories,
                `/machine/display/subCategory?language=${language}&mainCategoryName=${selectedMainCategory}`,
                (subCategories) => {
                    populateSelectAsync(
                        $("#slct_subCategory"),
                        subCategories);
                }
            );
            //#endregion
        });

    // populate description select
    await populateElementByAjaxOrLocalAsync(
        localKeys_allLanguages,
        "/machine/display/language",
        (languages) => {
            //#region add languages as <li>
            for (let index in languages) {
                let languageInData = languages[index];

                $("#" + ul_descriptions_id).append(
                    `<li>
                        <a class="${a_descriptions_class}" href="#">${languageInData}</a>
                     </li>`
                );
            }
            //#endregion
        });
}
//#endregion