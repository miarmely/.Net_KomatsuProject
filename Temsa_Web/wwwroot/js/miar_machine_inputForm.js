import {
    populateSelectAsync, isFileTypeInvalidAsync, updateResultLabel,
    populateElementByAjaxOrLocalAsync, displayFileByObjectUrlAsync,
    removeObjectUrlFromElementAsync, click_descriptionDropdownItemAsync,
    click_descriptionsButtonAsync, change_descriptionsTextareaAsync
} from "./miar_tools.js"

//#region variables
const resultLabel_id = "#p_resultLabel";
const btn_descriptions_id = "btn_descriptions";
const txt_descriptions_id = "txt_descriptions";
const slct_mainCategory_id = "slct_mainCategory";
const slct_subCategory_id = "slct_subCategory";
const ul_description_id = "ul_description";
const inpt_image_id = "inpt_image";
const inpt_video_id = "inpt_video";
const inpt_pdf_id = "inpt_pdf";
const inpt_model_id = "inpt_model";
const inpt_brand_id = "inpt_brand";
const inpt_year_id = "inpt_year";
const inpt_stock_id = "inpt_stock";
const vid_machine_id = "vid_machine";
const src_machine_id = "src_machine";
const a_descriptions_class = "a_descriptions";
const div_form = $("#div_form");
const spn_fileStatusLabel = $("#spn_fileStatusLabel");
const path_imageFolderAfterWwwroot = "images\\machines";
const path_pdfFolderAfterWwwroot = "pdfs";
const path_videoFolderAfterWwwRoot = "videos\\machines";
const img_loading = $("#img_loading");
const vid_machine = $("#" + vid_machine_id);
const src_machine = $("#" + src_machine_id);
let selectedImageInfos;
let selectedPdfInfos;
let selectedVideoInfos;

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
const successMessagesByLanguages = {
    "TR": {
        "saveSuccessful": "başarıyla kaydedildi",
    },
    "EN": {
        "saveSuccessful": "saved with successful"
    }
}
const errorMessagesByLanguages = {
    "TR": {
        "pdfReadingError": "pdf yüklenirken bir hata oluştu.",
        "descriptionNotEntered": "açıklama girilmedi"
    },
    "EN": {
        "pdfReadingError": "an error occured when pdf uploading",
        "descriptionNotEntered": "description not entered"
    }
}
//#endregion

//#region events
export async function click_inputAsync(clickedInputId) {
    //reset help label of clicked <input>
    $(`#spn_help_${clickedInputId}`).empty();
}
export async function change_imageInputAsync() {
    //#region control the selected file (error)

    //#region when any file not selected
    if (selectedImageInfos == undefined) {
        await removePosterOrVideoAsync("poster");
        return;
    }
    //#endregion

    //#region when file type is not image (error)
    if (await isFileTypeInvalidAsync(
        selectedImageInfos,
        "image",
        $("#" + inpt_image_id))
    ) {
        await removePosterOrVideoAsync("poster");

        // write error
        updateResultLabel(
            `#spn_help_${inpt_image_id}`,
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px");

        return;
    }
    //#endregion

    //#endregion

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
}
export async function change_videoInputAsync() {
    //#region control selected file (error)

    //#region when any file not selected (return)
    if (selectedVideoInfos == undefined) {
        await removePosterOrVideoAsync("video");
        return;
    }
    //#endregion

    //#region when file type isn't video (error)
    if (await isFileTypeInvalidAsync(
        selectedVideoInfos,
        "video/",
        $('#' + inpt_video_id))
    ) {
        await removePosterOrVideoAsync("video");

        // write error
        updateResultLabel(
            "#spn_help_" + inpt_video_id,
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px");

        return;
    }
    //#endregion

    //#endregion

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
        }
    )
}
export async function change_pdfInputAsync() {
    //#region when any file not selected (return)
    if (selectedPdfInfos == undefined)
        return;
    //#endregion

    //#region when file type is not "pdf" (error)
    if (await isFileTypeInvalidAsync(
        selectedPdfInfos,
        "application/pdf",
        $("#" + inpt_pdf_id))) {
        // write error
        updateResultLabel(
            `#spn_help_${inpt_pdf_id}`,
            partnerErrorMessagesByLanguages[language]["invalidFileType"],
            resultLabel_errorColor,
            "10px",
            img_loading);

        // reset pdf <input>
        $("#" + inpt_pdf_id).val("");
        return;
    }
    //#endregion
}
export async function ended_machineVideoAsync() {
    // restart video
    vid_machine.load();
}
//#endregion

//#region functions
export async function populateFormAsync(addTableTitle = true) {
    div_form.empty();

    //#region add table title
    if (addTableTitle)
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
    //#endregion

    //#region add image input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label" style="text-align">
                <button type="button" class="btn_form_label">${formLabelNamesByLanguages[language].image}</button>
            </label>
            <div class="col-sm-6">
            <div>
                <input type="text"  class="form-control"  disabled/>
                <div hidden>
                    <input id="${inpt_image_id}"  type="file"  class=""  accept="image/*"  required>
                </div>
                <span id="spn_help_${inpt_image_id}" class="help-block"></span>
            </div>
        </div>`
    );
    //#endregion

    //#region add video input
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label" style="text-align">
                <button type="button" class="btn_form_label">${formLabelNamesByLanguages[language].video}</button>
            </label>
            <div class="col-sm-6">
            <div>
                <input  id= "${inpt_video_id}"  type= "file"  class= "form-control"  accept= "video/*"  required />
                <span id="spn_help_${inpt_video_id}" class="help-block"></span>
            </div>
        </div>`
    );
    //#endregion

    //#region add mainCategory and subcategory select

    //#region add mainCategory label and <select>
    div_form.append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">
                ${formLabelNamesByLanguages[language].mainCategory}
            </label>
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
            <label class="col-sm-3 control-label">
                ${formLabelNamesByLanguages[language].subCategory}
            </label>
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
                    <input id="${inpt_brand_id}" type="number" class="form-control" min=1 max=5000 required>
                    <span id="spn_help_${inpt_brand_id}" class="help-block"></span>
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
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].pdf}
                </label>
                <div class="col-sm-6">
                    <input id="${inpt_pdf_id}" type="file" class="form-control" accept="application/pdf" required>
                    <span id="spn_help_${inpt_pdf_id}" class="help-block"></span>
                </div>
            </div>`
    );
    //#endregion

    //#region add descriptions texarea

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
                            <ul id="${ul_description_id}"  role="menu" class="dropdown-menu pull-right" style="text-align:center">
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

    //#region populate descriptions <ul>
    await populateElementByAjaxOrLocalAsync(
        localKeys_allLanguages,
        "/machine/display/language",
        (data) => {
            //#region add languages as <li>
            for (let index in data) {
                let languageInData = data[index];

                $("#" + ul_description_id).append(
                    `<li>
                            <a class="${a_descriptions_class}" href="#">${languageInData}</a>
                        </li>`
                );
            }
            //#endregion
        }
    )
    //#endregion

    ////#region add default value to descriptions <text>
    //let descriptionsInSession = JSON.parse(sessionStorage
    //    .getItem(sessionKeys_descriptionsOnCreatePage));

    //// when description in page language exists on session
    //if (descriptionsInSession != null)
    //    $("#" + txt_descriptions_id).val(
    //        descriptionsInSession[language]);
    ////#endregion

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

    //#region declare events
    $("#" + inpt_image_id).change(async (event) => {
        // save selected file infos
        selectedImageInfos = event.target.files[0];

        await change_imageInputAsync();
    })
    $('#' + inpt_video_id).change(async (event) => {
        // save selected file infos
        selectedVideoInfos = event.target.files[0];

        await change_videoInputAsync();
    })
    $("#" + inpt_pdf_id).change(async (event) => {
        // save file infos
        selectedPdfInfos = event.target.files[0];

        await change_pdfInputAsync();
    })
    $("#" + btn_descriptions_id).click(async () => {
        await click_descriptionsButtonAsync(
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    $("." + a_descriptions_class).click(async (event) => {
        // for prevent coming to head of web page when clicked to <a>
        event.preventDefault();

        await click_descriptionDropdownItemAsync(
            $(":focus"),
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    $("#" + txt_descriptions_id).on("input", async () => {
        await change_descriptionsTextareaAsync(
            $("#" + btn_descriptions_id));
    })
    $("input").click(async (event) => {
        //#region reset help label of clicked <input>
        let clickedElementId = event.target.id;

        await click_inputAsync(clickedElementId);
        //#endregion
    })
    vid_machine.on("ended", async () => {
        await ended_machineVideoAsync();
    });
    //#endregion
}

export async function addDefaultValuesToFormAsync(machineInfos) {
    $("#" + inpt_image_id).val(machineInfos["imageName"]);
    $("#" + inpt_video_id).val(machineInfos["videoName"]);
    $("#" + slct_mainCategory_id).val(machineInfos["mainCategoryName"]);
    $("#" + slct_subCategory_id).val(machineInfos["subCategoryName"]);
    $("#" + inpt_model_id).val(machineInfos["model"]);
    $("#" + inpt_brand_id).val(machineInfos["brandName"]);
    $("#" + inpt_year_id).val(machineInfos["year"]);
    $("#" + inpt_stock_id).val(machineInfos["stock"]);
    $(`input[name= handStatus][value=${machineInfos.handStatus}]`).attr("checked", "");
    $("#" + inpt_pdf_id).val(machineInfos["pdfName"]);
    $("#" + txt_descriptions_id).val(machineInfos.descriptions[language]);
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
    //#region set width and height
    let panelBodyWidth = $(".panel-body").prop("clientWidth");

    vid_machine.css(
        "width",
        panelBodyWidth - (panelBodyWidth * (60 / 100)));
    //#endregion
}
//#endregion