import { btn_descriptions_id, txt_descriptions_id, a_descriptions_class, descriptions_baseButtonNameByLanguages, setVariablesForDescriptionsAsync, ul_descriptions_id, uploadDescriptionsEvents }
    from "./miar_descriptions.js"
import { createInputFormAsync, div_form, populateInputFormAsync }
    from "./miar_module_inputForm.js"
import { displayFileByObjectUrlAsync, populateSelectAsync, populateElementByAjaxOrLocalAsync, isFileTypeValidAsync, isFileSizeValidAsync }
    from "./miar_tools.js"

//#region varibles
//export const btn_showImage = $("#btn_showImage");
//export const btn_showVideo = $("#btn_showVideo");
//export const btn_back = $("#btn_back");
//export const div_backButton = $("#div_backButton");
//export const div_panelTitle = $("#div_panelTitle");
//export const inpt_image_id = "inpt_image";
//export const inpt_video_id = "inpt_video";
//export const inpt_pdf_id = "inpt_pdf";
//export const inpt_model_id = "inpt_model";
//export const inpt_brand_id = "inpt_brand";
//export const inpt_year_id = "inpt_year";
//export const inpt_stock_id = "inpt_stock";
//export const inpt_sold_id = "inpt_sold";
//export const inpt_rented_id = "inpt_rented";
//export const inpt_chooseImage_id = "inpt_chooseImage";
//export const inpt_chooseVideo_id = "inpt_chooseVideo";
//export const inpt_choosePdf_id = "inpt_choosePdf";
//export const slct_mainCategory_id = "slct_mainCategory";
//export const slct_subCategory_id = "slct_subCategory";
//export const vid_machine = $("#vid_machine");
//export const src_machine = $("#src_machine");
//export const p_resultLabel_id = "p_resultLabel";
//export const p_resultLabel = $("#" + p_resultLabel_id);
//export const imageSizeLimitInMb = 20;
//export const videoSizeLimitInMb = 20;
//export const pdfSizeLimitInMb = 20;
//export const path_imageFolderAfterWwwroot = "images\\machines";
//export const path_videoFolderAfterWwwroot = "videos\\machines";
//export const path_pdfFolderAfterWwwroot = "pdfs";
//export const img_loading = $("#img_loading");
//export let selectedImageInfos;
//export let selectedPdfInfos;
//export let selectedVideoInfos;
//const spn_fileStatusLabel = $("#spn_fileStatusLabel");
//#endregion

//#region events
function uploadEvents(
    inpt_chooseImage,
    inpt_chooseVideo,
    inpt_choosePdf,
    inpt_image,
    inpt_video,
    inpt_pdf,
    vid_machine
) {
    $("input").click((event) => {
        //#region reset help label of clicked <input>
        let clickedInputId = event.target.id;
        let spn_help = $(`#spn_help_${clickedInputId}`);

        spn_help.removeAttr("style"); // rese style
        spn_help.empty();  // reset input
        //#endregion

        p_resultLabel.empty();
    })
    $("textarea").click(() => {
        p_resultLabel.empty();
    })
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
        let selectedFileInfos = event.target.files[0];

        if (selectedFileInfos == undefined)
            return;
        //#endregion

        //#region when file type is not image (error)
        if (!await isFileTypeValidAsync(selectedFileInfos, "image")) {
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
        if (!await isFileSizeValidAsync(selectedFileInfos.size, imageSizeLimitInMb)) {
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
        selectedImageInfos = selectedFileInfos;
        inpt_chooseImage.val(selectedImageInfos.name);

        await displayFileByObjectUrlAsync(
            selectedImageInfos,
            vid_machine,
            "poster",
            spn_fileStatusLabel,
            () => {
                // hide machine video
                vid_machine.attr("hidden", "");
            },
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
        let selectedFileInfos = event.target.files[0];

        if (selectedFileInfos == undefined)
            return;
        //#endregion

        //#region when file type isn't video (error)
        if (!await isFileTypeValidAsync(selectedFileInfos, "video/")) {
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
        if (!await isFileSizeValidAsync(selectedFileInfos.size, videoSizeLimitInMb)) {
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
        selectedVideoInfos = selectedFileInfos;
        inpt_chooseVideo.val(selectedVideoInfos.name)

        await displayFileByObjectUrlAsync(
            selectedVideoInfos,
            src_machine,
            "src",
            spn_fileStatusLabel,
            () => {
                // hide machine video
                vid_machine.attr("hidden", "");

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
        let selectedFileInfos = event.target.files[0];

        if (selectedFileInfos == undefined)
            return;
        //#endregion

        //#region when file type is not "pdf" (error)
        if (!await isFileTypeValidAsync(selectedFileInfos, "application/pdf")) {
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
        if (!await isFileSizeValidAsync(selectedFileInfos.size, pdfSizeLimitInMb)) {
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
        selectedPdfInfos = selectedFileInfos;
        inpt_choosePdf.val(selectedPdfInfos.name);
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
export async function createMachineFormPageAsync(descriptions) {
    //#region before start
    div_form.empty();
    window.scrollTo(0, 0);  // scroll the page to start of page
    //#endregion

    //#region add panel title
    div_panelTitle.append(
        langPack_panelTitle[language]);
    //#endregion

    //#region create form
    let formLabelNames = langPack_formLabelNames[language];

    await createInputFormAsync($("form"), 14);
    await populateInputFormAsync(1,
        formLabelNames["image"],
        `<input id="${inpt_chooseImage_id}"  type="text"  class="form-control  form_file_input"  readonly/>
        <span id="spn_help_${inpt_chooseImage_id}" class="help-block"></span>
        <div hidden>
            <input id="${inpt_image_id}"  type="file"  class=""  accept="image/*">
        </div>`
    );  // image input
    await populateInputFormAsync(2,
        formLabelNames["video"],
        `<input id="${inpt_chooseVideo_id}"  type="text"  class="form-control  form_file_input"  readonly/>
        <span id="spn_help_${inpt_chooseVideo_id}" class="help-block"></span>
        <div hidden>
            <input  id="${inpt_video_id}"  type= "file"  accept= "video/*"/>
        </div>`
    );  // video input
    await populateInputFormAsync(3,
        formLabelNames["mainCategory"],
        `<select id="${slct_mainCategory_id}" class="form-control m-bot15"></select>
         <span id="spn_help_${slct_mainCategory_id}" class="help-block"></span>`
    );  // mainCategory
    await populateInputFormAsync(4,
        formLabelNames["subCategory"],
        `<select id="${slct_subCategory_id}" class="form-control m-bot15">
        </select>
        <span id="spn_help_${slct_subCategory_id}" class="help-block"></span>`
    );  // subCategory
    await populateInputFormAsync(5,
        formLabelNames["model"],
        `<input id="${inpt_model_id}" type="text" class="form-control" required>
        <span id="spn_help_${inpt_model_id}" class="help-block"></span>`
    );  // model
    await populateInputFormAsync(6,
        formLabelNames["brand"],
        `<input id="${inpt_brand_id}" type="text" class="form-control" required>
         <span id="spn_help_${inpt_brand_id}" class="help-block"></span>`
    );  // brand
    await populateInputFormAsync(7,
        formLabelNames["year"],
        `<input id="${inpt_year_id}" type="number" class="form-control" min=1900 max=2099 required>
         <span id="spn_help_${inpt_year_id}" class="help-block"></span>`
    );  // year
    await populateInputFormAsync(8,
        formLabelNames["stock"],
        `<input id="${inpt_stock_id}" type="number" class="form-control" min=0 max=5000 required>
        <span id="spn_help_${inpt_stock_id}" class="help-block"></span>`
    );  // stock
    await populateInputFormAsync(9,
        formLabelNames["sold"],
        `<input id="${inpt_sold_id}" type="number" class="form-control" min=0 max=5000 required>
        <span id="spn_help_${inpt_sold_id}" class="help-block"></span>`
    );  // sold
    await populateInputFormAsync(10,
        formLabelNames["rented"],
        `<input id="${inpt_rented_id}" type="number" class="form-control" min=0 max=5000 required>
        <span id="spn_help_${inpt_rented_id}" class="help-block"></span>`
    );  // rented
    await populateInputFormAsync(11,
        formLabelNames["pdf"],
        `<input id="${inpt_choosePdf_id}"  type="text"  class="form-control  form_file_input"  readonly>
        <span id="spn_help_${inpt_choosePdf_id}" class="help-block"></span>
        <div hidden>
            <input id="${inpt_pdf_id}" type="file" class="form-control" accept="application/pdf"  name="pdf">
        </div>`
    );  // pdf
    await populateInputFormAsync(12,
        formLabelNames.handStatus.labelName,
        `<div class="radio">
            <label style="margin-right:10px">
                <input type="radio" name="handStatus" value="${formLabelNames.handStatus.radio1}"  checked="">
                    ${formLabelNames.handStatus.radio1}
            </label>
            <label>
                <input type="radio" name="handStatus" value="${formLabelNames.handStatus.radio2}">
                    ${formLabelNames.handStatus.radio2}
            </label>
        </div>`
    );  // handStatus
    await populateInputFormAsync(13,
        `<div class="input-group m-bot15">
            <div class="input-group-btn">
                <button id="${btn_descriptions_id}" style="background-color:darkblue; color:red" tabindex="-1" class="btn btn-info" type="button">
                    <b>${descriptions_baseButtonNameByLanguages[language]} (${language})</b>
                </button>

                <button tabindex="-1" style="background-color: darkblue;" data-toggle="dropdown" class="btn btn-info dropdown-toggle" type="button">
                    <span class="caret"></span>
                </button>

                <ul id="${ul_descriptions_id}"  role="menu" class="dropdown-menu pull-right" style="text-align:center">
                </ul>
            </div>
        </div>`,
        `<textarea id="${txt_descriptions_id}"  style="resize:none"  type="text"  class="form-control"  rows="10"  required></textarea>`
    );  // description

    $("form").append(
        `<div style="text-align:center">
            <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">${langPack_saveButton[language]}</button>
        </div>`
    );  // save button
    //#endregion

    //#region populate form
    // add name to image and video buttons
    btn_showImage.append(
        langPack_imageAndVideoButtons[language]["imageButton"]);
    btn_showVideo.append(
        langPack_imageAndVideoButtons[language]["videoButton"]);

    // populate dropdowns
    await setVariablesForDescriptionsAsync(
        "descriptions",
        { "byLanguages": descriptions });
    await populateElementByAjaxOrLocalAsync(
        localKeys_allMainCategories,
        `/machine/display/mainCategory?language=${language}`,
        (data) => {
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
    );  // mainCategory and subCategory
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
    );  // description
    //#endregion

    await uploadEvents();
}

export async function showOrHideBackButtonAsync(
    div_backButton,
    div_panelTitle,
    btn_back,
    mode
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

export async function addDefaultValuesToFormAsync(machineInfos) {
    //#region upload video

    await setMachineVideoSizeAsync();

    //#region add poster, src and type attributes
    vid_machine.attr({
        "poster": "/" + path_imageFolderAfterWwwroot + "/" + machineInfos["imageName"],
        "controls": ""
    });

    src_machine.attr({
        "src": "/" + path_videoFolderAfterWwwroot + "/" + machineInfos["videoName"],
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
    $(`input[name= "handStatus"][value= "${machineInfos.handStatus}"]`).attr("checked", "");
    $("#" + inpt_choosePdf_id).val(machineInfos["pdfName"]);
    $("#" + txt_descriptions_id).val(machineInfos.descriptions[language]);
    //#endregion

    await changeDescriptionsButtonColorAsync(
        $("#" + btn_descriptions_id),
        descriptions_savedColor);  // change descriptions color as "saved" color
}

export async function removePosterAttrAsync() {
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

export async function removeVideoAttrAsync() {
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