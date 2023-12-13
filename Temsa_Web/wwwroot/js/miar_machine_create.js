import {
    change_descriptionsTextareaAsync, click_descriptionDropdownItemAsync,
    click_descriptionsButtonAsync, displayImageByDataUrlAsync, populateSelectAsync,
    isFileTypeInvalidAsync, updateResultLabel, populateElementByAjaxOrLocalAsync, changeDescriptionsButtonColorAsync,
} from "./miar_tools.js"


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const btn_descriptions_id = "btn_descriptions";
    const a_descriptions_class = "a_descriptions";
    const txt_descriptions_id = "txt_descriptions";
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const ul_description_id = "ul_description";
    const div_form = $("#div_form");
    const img_machine = $("#img_machine");
    const inpt_image_id = "inpt_image";
    const inpt_pdf_id = "inpt_pdf";
    const spn_fileStatusLabel = $("#spn_fileStatusLabel");
    const imageFolderPathAfterWwwroot = "images\\machines";
    const pdfFolderPathAfterWwwroot = "pdfs";
    let selectedImageInfos;
    let selectedPdfInfos;
    //#endregion

    //#region events
    $("form").submit(event => {
        //#region before start
        event.preventDefault();
        $(resultLabel_id).empty();
        //#endregion

        //#region control the descriptions whether entered (error)

        //#region when any description not entered (error)
        // get descriptions from session
        let descriptionsInSession = JSON.parse(sessionStorage
            .getItem(sessionKeys_descriptionsOnCreatePage));

        // when any description not entered
        if (descriptionsInSession == null) {
            updateResultLabel(
                resultLabel_id,
                `${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                resultLabel_errorColor,
                "30px");

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

            if (descriptionsInSession[languageInSession] == undefined  // when relevant language not entered
                || descriptionsInSession[languageInSession] == "") {  // when blank value entered
                updateResultLabel(
                    resultLabel_id,
                    `"${languageInSession}" ${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                    resultLabel_errorColor,
                    "30px");

                return;
            }
            //#endregion
        }
        //#endregion

        //#endregion

        //#region read pdf and save machine (ajax)
        let fileReader = new FileReader();

        fileReader.readAsDataURL(selectedPdfInfos);
        fileReader.onloadend = function (event) {
            //#region when pdf read with successfull (ajax)
            if (fileReader.readyState == fileReader.DONE) {
                //#region get pdf content in base64 string
                let dataUrl = event.target.result;
                let pdfContentInBase64Str = dataUrl
                    .replace(`data:${selectedPdfInfos.type};base64,`, "")
                //#endregion

                //#region get image content in base64 string
                let imageContentInBase64Str = img_machine
                    .attr("src")
                    .replace(`data:${selectedImageInfos.type};base64,`, "");
                //#endregion

                //#region get descriptions from session
                let descriptionsInSession = JSON.parse(sessionStorage
                    .getItem(sessionKeys_descriptionsOnCreatePage));
                //#endregion

                $.ajax({
                    method: "POST",
                    url: (baseApiUrl + "/machine/create" +
                        `?language=${language}` +
                        `&imageFolderPathAfterWwwroot=${imageFolderPathAfterWwwroot}` +
                        `&pdfFolderPathAfterWwwroot=${pdfFolderPathAfterWwwroot}`),
                    headers: { "Authorization": jwtToken },
                    data: JSON.stringify({
                        "ImageName": selectedImageInfos.name,
                        "MainCategoryName": $("#slct_mainCategory").val(),
                        "SubCategoryName": $("#slct_subCategory").val(),
                        "Model": $("#inpt_model").val(),
                        "BrandName": $("#inpt_brand").val(),
                        "HandStatus": $("input[name = handStatus]:checked").val(),
                        "PdfName": selectedPdfInfos.name,
                        "Stock": $("#inpt_stock").val(),
                        "Year": $("#inpt_year").val(),
                        "Descriptions": {
                            "TR": descriptionsInSession.TR,
                            "EN": descriptionsInSession.EN
                        },
                        "ImageContentInBase64Str": imageContentInBase64Str,
                        "PdfContentInBase64Str": pdfContentInBase64Str
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    success: () => {
                        //#region resets
                        $("form")[0].reset();

                        // remove machine image
                        img_machine.removeAttr("src");

                        // change description <button> color
                        changeDescriptionsButtonColorAsync(
                            $("#", btn_descriptions_id),
                            descriptions_unsavedColor);
                        //#endregion

                        //#region write successfull message to resultLabel
                        updateResultLabel(
                            resultLabel_id,
                            successMessagesByLanguages[language]["saveSuccessful"],
                            resultLabel_successColor,
                            "30px");
                        //#endregion

                        //#region remove descriptions in session
                        sessionStorage.removeItem(
                            sessionKeys_descriptionsOnCreatePage);
                        //#endregion
                    },
                    error: (response) => {
                        //#region write error message to result label
                        updateResultLabel(
                            resultLabel_id,
                            JSON.parse(response.responseText).errorMessage,
                            resultLabel_errorColor,
                            "30px");
                        //#endregion
                    }
                });
            }
            //#endregion

            //#region when any error occured in pdf reading
            else {
                //#region write error
                updateResultLabel(
                    resultLabel_id,
                    errorMessagesByLanguages[language]["pdfReadingError"],
                    resultLabel_errorColor,
                    "30px");
                //#endregion

                return;
            }
            //#endregion
        }
        //#endregion
    });
    $(window).resize(async () => {
        await setMachineImageSizeAsync();
    })
    spn_eventManager.on("click_descriptionButton", async () => {
        await click_descriptionsButtonAsync(
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    spn_eventManager.on("click_descriptionDropdownItem", async (_, clickedItem) => {
        await click_descriptionDropdownItemAsync(
            clickedItem,
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    spn_eventManager.on("click_input", async (_, clickedInputId) => {
        //#region reset help label of clicked <input>
        $(`#spn_help_${clickedInputId}`).empty();
        //#endregion
    })
    spn_eventManager.on("change_descriptionsTextarea", async () => {
        await change_descriptionsTextareaAsync(
            $("#" + btn_descriptions_id));
    })
    spn_eventManager.on("change_imageInput", async (_, selectedFileInfos) => {
        //#region control the selected file (error)

        //#region when any file not selected
        selectedImageInfos = selectedFileInfos;

        // remove current image
        if (selectedImageInfos == undefined) {
            img_machine.removeAttr("src");
            return;
        }
        //#endregion

        //#region when file type is not image (error)
        if (await isFileTypeInvalidAsync(
            selectedImageInfos,
            "image",
            $("#" + inpt_image_id))) {
            // remove current image
            img_machine.removeAttr("src");

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

        await setMachineImageSizeAsync();

        //#region display machine image
        await displayImageByDataUrlAsync(
            selectedImageInfos,
            img_machine,
            spn_fileStatusLabel)
        //#endregion
    })
    spn_eventManager.on("change_pdfInput", async (_, selectedFileInfos) => {
        //#region when any file not selected (return)
        selectedPdfInfos = selectedFileInfos;

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
                "10px");

            // reset pdf <input>
            $("#" + inpt_pdf_id).val("");
            return;
        }
        //#endregion
    })
    //#endregion

    //#region functions
    async function setMachineImageSizeAsync() {
        //#region set max width
        let panelBodyWidth = $(".panel-body").prop("clientWidth");

        img_machine.css(
            "max-width",
            panelBodyWidth - (panelBodyWidth * (60 / 100)));
        //#endregion
    }

    async function populateFormAsync() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add image
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label" style="text-align">
                    ${formLabelNamesByLanguages[language].image}
                </label>
                <div class="col-sm-6">
                <div>
                    <input id="${inpt_image_id}" type="file" class="form-control" accept="image/*" required>
                    <span id="spn_help_${inpt_image_id}" class="help-block"></span>
                </div>
            </div>`
        );

        // declare events
        $("#" + inpt_image_id).change(async (event) =>
            spn_eventManager.trigger("change_imageInput", [event.target.files[0]])
        )
        //#endregion

        //#region add mainCategory and subcategory

        //#region add mainCategory label and <select>
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].mainCategory}
                </label>
                <div class="col-sm-6">
                    <select id="${slct_mainCategory_id}" class="form-control m-bot15">
                    </select>
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
                    data
                )
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
                            data
                        );
                    }
                );
                //#endregion
            }
        );
        //#endregion

        //#endregion

        //#region add model
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].model}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_model" type="text" class="form-control" required>
                    <span id="spn_help_inpt_model" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add brand
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].brand}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_brand" type="text" class="form-control" required>
                    <span id="spn_help_inpt_brand" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add year
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].year}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_year" type="number" class="form-control" required>
                    <span id="spn_help_inpt_year" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add stock
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].stock}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_stock" type="number" class="form-control" required>
                    <span id="spn_help_inpt_stock" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add handStatus
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

        //#region add pdf
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

        // declare events
        $("#" + inpt_pdf_id).change(async (event) =>
            spn_eventManager.trigger("change_pdfInput", [event.target.files[0]])
        )
        //#endregion

        //#region add descriptions

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

        //#region populate descriptions <ul> and declare events
        populateElementByAjaxOrLocalAsync(
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

                //#region declare events
                $("#" + btn_descriptions_id).click(() =>
                    spn_eventManager.trigger("click_descriptionButton")
                );
                $("." + a_descriptions_class).click((event) => {
                    // for prevent coming to head of web page when clicked to <a>
                    event.preventDefault();

                    // trigger click event
                    spn_eventManager.trigger(
                        "click_descriptionDropdownItem",
                        [$(":focus")])
                });
                $("#" + txt_descriptions_id).on("input", () =>
                    spn_eventManager.trigger("change_descriptionsTextarea")
                );
                //#endregion
            }
        )
        //#endregion

        //#region add default value to descriptions <text>
        let descriptionsInSession = JSON.parse(sessionStorage
            .getItem(sessionKeys_descriptionsOnCreatePage));

        // when description in page language exists on session
        if (descriptionsInSession != null)
            $("#" + txt_descriptions_id).val(
                descriptionsInSession[language]);
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
                <div style="text-align:center;">
                    <p id="p_resultLabel"></p>
                </div>
            </div>`
        );
        //#endregion

        //#region declare events
        $("input").click((event) =>
            spn_eventManager.trigger("click_input", [event.target.id])
        )
        //#endregion
    }
    //#endregion

    populateFormAsync();
})