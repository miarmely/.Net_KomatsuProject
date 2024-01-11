import {
    populateSelectAsync, isFileTypeValidAsync, updateResultLabel,
    populateElementByAjaxOrLocalAsync, displayFileByObjectUrlAsync,
    removeObjectUrlFromElementAsync, getFileTypeFromFileName, isFileSizeValidAsync
} from "./miar_tools.js"

import { ul_descriptions_id, uploadDescriptionsEvents  } from "./miar_descriptions.js"

//#region variables
export const resultLabel_id = "#p_resultLabel";
export const btn_descriptions_id = "btn_descriptions";
export const txt_descriptions_id = "txt_descriptions";
export const slct_mainCategory_id = "slct_mainCategory";
export const slct_subCategory_id = "slct_subCategory";
export const inpt_image_id = "inpt_image";
export const inpt_video_id = "inpt_video";
export const inpt_pdf_id = "inpt_pdf";
export const inpt_model_id = "inpt_model";
export const inpt_brand_id = "inpt_brand";
export const inpt_year_id = "inpt_year";
export const inpt_stock_id = "inpt_stock";
export const inpt_sold_id = "inpt_sold";
export const inpt_rented_id = "inpt_rented";
export const inpt_chooseImage_id = "inpt_chooseImage";
export const inpt_chooseVideo_id = "inpt_chooseVideo";
export const inpt_choosePdf_id = "inpt_choosePdf";
export const vid_machine_id = "vid_machine";
export const src_machine_id = "src_machine";
export const a_descriptions_class = "a_descriptions";
export const btn_chooseImage_id = "btn_chooseImage";
export const btn_chooseVideo_id = "btn_chooseVideo";
export const btn_choosePdf_id = "btn_choosePdf";
export const btn_save_id = "btn_save";
export const div_form = $("#div_form");
export const spn_fileStatusLabel = $("#spn_fileStatusLabel");
export const path_imageFolderAfterWwwroot = "images\\machines";
export const path_videoFolderAfterWwwRoot = "videos\\machines";
export const path_pdfFolderAfterWwwroot = "pdfs";
export const img_loading = $("#img_loading");
export const vid_machine = $("#" + vid_machine_id);
export const src_machine = $("#" + src_machine_id);
export let selectedImageInfos;
export let selectedPdfInfos;
export let selectedVideoInfos;
export let imageSizeLimitInMb = 25;
export let videoSizeLimitInMb = 25;
export let pdfSizeLimitInMb = 25;
const formLabelNamesByLanguages = {
    "TR": {
        "mainCategory": "Ana Kategori",
        "subCategory": "Alt Kategori",
        "brand": "Marka",
        "model": "Model",
        "year": "Yıl",
        "handStatus": {
            "label": "El Durumu",
            "radio1": "Sıfır",
            "radio2": "İkinci El"
        },
        "stock": "Stok Adedi",
        "sold": "Satılan",
        "rented": "Kiralanan",
        "image": "Resim",
        "video": "Video",
        "pdf": "Pdf"
    },
    "EN": {
        "mainCategory": "Main Category",
        "subCategory": "Subcategory",
        "brand": "Brand",
        "model": "Model",
        "year": "Year",
        "handStatus": {
            "label": "Hand Status",
            "radio1": "Zero",
            "radio2": "Second Hand"
        },
        "stock": "Stock",
        "sold": "sold",
        "rented": "rented",
        "image": "Image",
        "video": "Video",
        "pdf": "Pdf"
    },
}
const saveButtonNameByLanguages = {
    "TR": "KAYDET",
    "EN": "SAVE"
}
const description_baseButtonNameByLanguages = {
    "TR": "Açıklama",
    "EN": "Description"
}
//#endregion

//#region events
function uploadEvents() {
    //#region set variables
    let inpt_chooseImage = $("#" + inpt_chooseImage_id);
    let inpt_chooseVideo = $("#" + inpt_chooseVideo_id);
    let inpt_choosePdf = $("#" + inpt_choosePdf_id);
    let inpt_image = $("#" + inpt_image_id);
    let inpt_video = $("#" + inpt_video_id);
    let inpt_pdf = $("#" + inpt_pdf_id);
    //#endregion

    inpt_chooseImage.click(() => {
        inpt_image.trigger("click");
    })
    inpt_chooseVideo.click(() => {
        inpt_video.trigger("click");
    })
    inpt_choosePdf.click(() => {
        inpt_pdf.trigger("click");
    })
    inpt_image.change(async (event) => {
        //#region control selected file (error)

        //#region when any file not selected (return)
        selectedImageInfos = event.target.files[0];

        if (selectedImageInfos == undefined)
            return;
        //#endregion

        //#region when file type is not image (error)
        if (!await isFileTypeValidAsync(selectedImageInfos, "image")) {
            // write error
            updateResultLabel(
                `#spn_help_${inpt_chooseImage_id}`,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor,
                "10px");

            // reset file input
            inpt_image.val("");
            return;
        }
        //#endregion

        //#region when file size is invalid (error)
        if (!await isFileSizeValidAsync(selectedImageInfos.size, imageSizeLimitInMb)) {
            // write error
            updateResultLabel(
                "#spn_help_" + inpt_chooseImage_id,
                errorMessagesByLanguages[language]["imageSizeOverflow"],
                resultLabel_errorColor,
                "30px",
                img_loading);

            // reset file input
            inpt_image.val("");
            return;
        }
        //#endregion

        //#endregion

        //#region display image
        // change image name on <input>
        inpt_chooseImage.val(selectedImageInfos.name);

        await displayFileByObjectUrlAsync(
            selectedImageInfos,
            vid_machine,
            "poster",
            spn_fileStatusLabel,
            null,
            () => {
                // show video and set video sizes
                vid_machine.removeAttr("hidden");
                setMachineVideoSizeAsync();
                vid_machine.load();
            });
        //#endregion
    })
    inpt_video.change(async (event) => {
        //#region control selected file (error)

        //#region when any file not selected (return)
        selectedVideoInfos = event.target.files[0];

        if (selectedVideoInfos == undefined)
            return;
        //#endregion

        //#region when file type isn't video (error)
        if (!await isFileTypeValidAsync(selectedVideoInfos, "video/")) {
            // write error
            updateResultLabel(
                "#spn_help_" + inpt_chooseVideo_id,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor,
                "10px");

            // reset file input
            inpt_video.val("");
            return;
        }
        //#endregion
        
        //#region when file size is invalid (error)
        if (!await isFileSizeValidAsync(selectedVideoInfos.size, videoSizeLimitInMb)) {
            updateResultLabel(
                "#spn_help_" + inpt_chooseVideo_id,
                errorMessagesByLanguages[language]["videoSizeOverflow"],
                resultLabel_errorColor,
                "30px",
                img_loading);

            // reset file input
            inpt_video.val("");
            return;
        }
        //#endregion

        //#endregion

        //#region display video
        // add new video name to <input>
        inpt_chooseVideo.val(selectedVideoInfos.name)

        await displayFileByObjectUrlAsync(
            selectedVideoInfos,
            src_machine,
            "src",
            spn_fileStatusLabel,
            () => {
                // set type of video <source>
                src_machine.attr("type", selectedVideoInfos.type);
            },
            () => {
                // show video and set sizes
                vid_machine.removeAttr("hidden");
                setMachineVideoSizeAsync();
                vid_machine.load();
            });
        //#endregion
    })
    inpt_pdf.change(async (event) => {
        //#region control selected file (error)

        //#region when any file not selected (return)
        selectedPdfInfos = event.target.files[0];

        if (selectedPdfInfos == undefined)
            return;
        //#endregion

        //#region when file type is not "pdf" (error)
        if (!await isFileTypeValidAsync(selectedPdfInfos, "application/pdf")) {
            // write error
            updateResultLabel(
                "#spn_help_" + inpt_choosePdf_id,
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
        if (!await isFileSizeValidAsync(selectedPdfInfos.size, pdfSizeLimitInMb)) {
            // write error
            updateResultLabel(
                "#spn_help_" + inpt_choosePdf_id,
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
        inpt_choosePdf.val(selectedPdfInfos.name);
        //#endregion
    })
    $("input").click((event) => {
        //#region reset help label of clicked <input>
        let clickedInputId = event.target.id;
        let spn_help = $(`#spn_help_${clickedInputId}`);

        spn_help.removeAttr("style"); // rese style
        spn_help.empty();  // reset input
        //#endregion
    })
    vid_machine.on("ended", async () => {
        // restart video
        vid_machine.load();
    });
    uploadDescriptionsEvents();
}
//#endregion

//#region functions
export async function populateFormAsync(addTableTitle = true) {
    //#region resets
    div_form.empty();  // hide articles
    window.scrollTo(0, 0);  // locate the scroll to head
    //#endregion

    //#region add table title
    if (addTableTitle)
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
    //#endregion

    //#region add image input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label" style="text-align">${formLabelNamesByLanguages[language].image}</label>
            <div class="col-sm-6">
            <div>
                <input id="${inpt_chooseImage_id}"  type="text"  class="form-control  form_file_input"   readonly/>
                <span id="spn_help_${inpt_chooseImage_id}" class="help-block"></span>
                <div hidden>
                    <input id="${inpt_image_id}"  type="file"  class=""  accept="image/*">
                </div>
            </div>
        </div>`
    );
    //#endregion

    //#region add video input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label" style="text-align">${formLabelNamesByLanguages[language].video}</label>
            <div class="col-sm-6">
            <div>
                <input id="${inpt_chooseVideo_id}"  type="text"  class="form-control  form_file_input"  readonly/>
                <span id="spn_help_${inpt_chooseVideo_id}" class="help-block"></span>
                <div hidden>
                    <input  id="${inpt_video_id}"  type= "file"  accept= "video/*"/>
                </div>
            </div>
        </div>`
    );
    //#endregion

    //#region add mainCategory and subcategory select

    //#region add mainCategory label and <select>
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">${formLabelNamesByLanguages[language].mainCategory}</label>
            <div class="col-sm-6">
                <select id="${slct_mainCategory_id}" class="form-control m-bot15"></select>
                <span id="spn_help_${slct_mainCategory_id}" class="help-block"></span>
            </div>
        </div>`
    );
    //#endregion

    //#region add subCategory label and <select>
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">${formLabelNamesByLanguages[language].subCategory}</label>
            <div class="col-sm-6">
                <select id="${slct_subCategory_id}" class="form-control m-bot15">
                </select>
                <span id="spn_help_${slct_subCategory_id}" class="help-block"></span>
            </div>
        </div>`
    );
    //#endregion

    //#region populate mainCategory and subCategory <select>'s
    await populateElementByAjaxOrLocalAsync(
        localKeys_allMainCategories,
        `/machine/display/mainCategory?language=${language}`,
        async (data) => {
            //#region populate mainCategory <select>
            populateSelectAsync(
                $("#" + slct_mainCategory_id),
                data);
            //#endregion

            //#region !!!!!!!!!!!!!!! disable mainCategoryNames !!!!!!!!!!!!!!! (TEMPORARY)
            for (let index = 2; index <= data.length; index += 1) {
                let option = $("#" + slct_mainCategory_id)
                    .children(`option:nth-child(${index})`)

                option.attr("disabled", "")
                option.attr("style", "color:darkgrey")
            }
            //#endregion
        },
        () => {
            //#region populate subCategory <select> after mainCategory populated
            let selectedMainCategory = $("#" + slct_mainCategory_id).val();

            populateElementByAjaxOrLocalAsync(
                localKeys_allSubCategories,
                `/machine/display/subCategory?language=${language}&mainCategoryName=${selectedMainCategory}`,
                (data) => {
                    populateSelectAsync(
                        $("#" + slct_subCategory_id),
                        data);
                }
            );
            //#endregion
        }
    );
    //#endregion

    //#endregion

    //#region add model input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">
                ${formLabelNamesByLanguages[language].model}
            </label>
            <div class="col-sm-6">
                <input id="${inpt_model_id}" type="text" class="form-control" required>
                <span id="spn_help_${inpt_model_id}" class="help-block"></span>
            </div>
        </div>`
    );
    //#endregion

    //#region add brand input
    div_form.append(
        `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].brand}
                </label>
                <div class="col-sm-6">
                    <input id="${inpt_brand_id}" type="text" class="form-control" required>
                    <span id="spn_help_${inpt_brand_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add year input
    div_form.append(
        `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].year}
                </label>
                <div class="col-sm-6">
                    <input id="${inpt_year_id}" type="number" class="form-control" min=1900 max=2099 required>
                    <span id="spn_help_${inpt_year_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add stock input
    div_form.append(
        `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].stock}
                </label>
                <div class="col-sm-6">
                    <input id="${inpt_stock_id}" type="number" class="form-control" min=0 max=5000 required>
                    <span id="spn_help_${inpt_stock_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add sold input
    div_form.append(
        `<div class="form-group">
                <label class="col-sm-3 control-label">${formLabelNamesByLanguages[language].sold}</label>
                <div class="col-sm-6">
                    <input id="${inpt_sold_id}" type="number" class="form-control" min=0 max=5000 required>
                    <span id="spn_help_${inpt_sold_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add rented input
    div_form.append(
        `<div class="form-group">
                <label class="col-sm-3 control-label">${formLabelNamesByLanguages[language].rented}</label>
                <div class="col-sm-6">
                    <input id="${inpt_rented_id}" type="number" class="form-control" min=0 max=5000 required>
                    <span id="spn_help_${inpt_rented_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add handStatus radioButton
    let handStatus = formLabelNamesByLanguages[language].handStatus;

    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">
                ${handStatus.label}
            </label>
            <div class="col-sm-6">
                <div class="radio">
                    <label style="margin-right:10px">
                        <input type="radio" name="handStatus" value="${handStatus.radio1}"  checked="">
                            ${handStatus.radio1}
                    </label>
                    <label>
                        <input type="radio" name="handStatus" value="${handStatus.radio2}">
                            ${handStatus.radio2}
                    </label>
                </div>
            </div>
        </div>`
    );
    //#endregion

    //#region add pdf input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">${formLabelNamesByLanguages[language].pdf}</label>
            <div class="col-sm-6">
                <input id="${inpt_choosePdf_id}"  type="text"  class="form-control  form_file_input"  readonly>
                <span id="spn_help_${inpt_choosePdf_id}" class="help-block"></span>
                <div hidden>
                    <input id="${inpt_pdf_id}" type="file" class="form-control" accept="application/pdf"  name="pdf">
                </div>
            </div>
        </div>`
    );
    //#endregion

    //#region add descriptions <textarea>

    //#region add descriptions <div>
    div_form.append(
        `<div class="form-horizontal bucket-form">
            <div class="form-group">
                <label class="col-sm-3 control-label">
                    <div class="input-group m-bot15">
                        <div class="input-group-btn">
                            <button id="${btn_descriptions_id}" style="background-color:darkblue; color:red" tabindex="-1" class="btn btn-info" type="button">
                                <b>${description_baseButtonNameByLanguages[language]} (${language})</b>
                            </button>
                            <button tabindex="-1" style="background-color: darkblue;" data-toggle="dropdown" class="btn btn-info dropdown-toggle" type="button">
                                <span class="caret"></span>
                            </button>
                            <ul id="${ul_descriptions_id}"  role="menu" class="dropdown-menu pull-right" style="text-align:center">
                            </ul>
                        </div>
                    </div>
                </label>
                <div class="col-sm-6">
                    <textarea id="${txt_descriptions_id}"  style="resize:none"  type="text"  class="form-control"  rows="10"  required></textarea>
                </div>
            </div>
        </div`
    );
    //#endregion

    //#region add languages to description <button>
    await populateElementByAjaxOrLocalAsync(
        localKeys_allLanguages,
        "/machine/display/language",
        (data) => {
            //#region add languages as <li>
            for (let index in data) {
                let languageInData = data[index];

                $("#" + ul_descriptions_id).append(
                    `<li>
                        <a class="${a_descriptions_class}" href="#">${languageInData}</a>
                     </li>`
                );
            }
            //#endregion
        }
    )
    //#endregion

    //#endregion

    //#region add save button
    div_form.append(
        `<div class="form-group">
                <div class="col-sm-6; text-center">
                    <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">
                        ${saveButtonNameByLanguages[language]}
                    </button>
                </div>
            </div>`
    );
    //#endregion

    uploadEvents();
}

export async function addDefaultValuesToFormAsync(machineInfos) {
    //#region upload video
    await setMachineVideoSizeAsync();

    //#region upload video attributes
    vid_machine.attr(
        "poster",
        "/" + path_imageFolderAfterWwwroot + "/" + machineInfos["imageName"],);

    src_machine.attr({
        "src": "/" + path_videoFolderAfterWwwRoot + "/" + machineInfos["videoName"],
        "type": "video/" + getFileTypeFromFileName(machineInfos["videoName"])
    });
    //#endregion

    //#region display video
    vid_machine.removeAttr("hidden");
    vid_machine.load();
    //#endregion

    //#endregion

    //#region populate inputs
    $("#" + inpt_chooseImage_id).val(machineInfos["imageName"]);
    $("#" + inpt_chooseVideo_id).val(machineInfos["videoName"]);
    $("#" + slct_mainCategory_id).val(machineInfos["mainCategoryName"]);
    $("#" + slct_subCategory_id).val(machineInfos["subCategoryName"]);
    $("#" + inpt_model_id).val(machineInfos["model"]);
    $("#" + inpt_brand_id).val(machineInfos["brandName"]);
    $("#" + inpt_year_id).val(machineInfos["year"]);
    $("#" + inpt_stock_id).val(machineInfos["stock"]);
    $("#" + inpt_sold_id).val(machineInfos["sold"]);
    $("#" + inpt_rented_id).val(machineInfos["rented"]);
    $(`input[name= handStatus][value=${machineInfos.handStatus}]`).attr("checked", "");
    $("#" + inpt_choosePdf_id).val(machineInfos["pdfName"]);
    $("#" + txt_descriptions_id).val(machineInfos.descriptions[language]);
    //#endregion
}

export async function removePosterOrVideoAsync(which) {
    //#region remove video or poster on video
    switch (which) {
        case "poster":
            await removeObjectUrlFromElementAsync(
                vid_machine,
                "poster",
                () => {
                    // when video isn't exists too
                    if (src_machine.attr("src") == undefined)
                        vid_machine.attr("hidden", "");  // hide <video>

                    vid_machine.load();
                });
            break;
        case "video":
            await removeObjectUrlFromElementAsync(
                src_machine,
                "src",
                () => {
                    // when image isn't exists
                    if (vid_machine.attr("poster") == undefined)
                        vid_machine.attr("hidden", "");  // hide <video>

                    vid_machine.load();
                });
            break;
    }
    //#endregion
}

export async function setMachineVideoSizeAsync() {
    //#region set width and max-height
    let panelBodyWidth = $(".panel-body").prop("clientWidth");

    vid_machine.css({
        "width": panelBodyWidth - (panelBodyWidth * (60 / 100)),
        "max-height": panelBodyWidth - (panelBodyWidth * (60 / 100))
    }); 
    //#endregion
}
//#endregion