import {
    changed_descriptionInput, clicked_descriptionDropdownButton,
    clicked_descriptionDropdownItem, displayImageByDataUrlAsync, getErrorMessageForMachineAsync, isFileTypeInvalidAsync, populateElementByAjaxOrLocalAsync,
    populateSelectAsync, updateResultLabel
} from "./miar_tools.js"


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const description_inputId = "#inpt_description";
    const description_buttonId = "#btn_description";
    const description_unsavedColor = "red";
    const description_savedColor = "lightgreen";
    const description_baseKeyForSession = "Machine-Create-Description";
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const ul_description_id = "ul_description";
    const div_form = $("#div_form");
    const inpt_description_id = "inpt_description";
    const img_machine = $("#img_machine");
    const inpt_image_id = "#inpt_image";
    const inpt_pdf_id = "#inpt_pdf";
    const spn_fileStatusLabel = $("#spn_fileStatusLabel");
    const imageFolderPathAfterWwwroot = "images\\machines";
    const pdfFolderPathAfterWwwroot = "images\\pdfs";
    let selectedImageInfos;
    let selectedPdfInfos;
    //#endregion

    //#region events
    $("form").submit(event => {
        //#region before start
        event.preventDefault();
        $(resultLabel_id).empty();
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

                $.ajax({
                    method: "POST",
                    url: (baseApiUrl + "/machine/create" +
                        `?language=${language}` +
                        `&imageFolderPathAfterWwwroot=${imageFolderPathAfterWwwroot}` +
                        `&pdfFolderPathAfterWwwroot=${pdfFolderPathAfterWwwroot}`),
                    headers: { "Authorization": jwtToken },
                    data: JSON.stringify({
                        "MainCategoryName": $("#slct_mainCategory").val(),
                        "SubCategoryName": $("#slct_subCategory").val(),
                        "Model": $("#inpt_model").val(),
                        "BrandName": $("#inpt_brand").val(),
                        "Stock": $("#inpt_stock").val(),
                        "Year": $("#inpt_year").val(),
                        "HandStatus": $("input[name = handStatus]:checked").val(),
                        "DescriptionInTR": sessionStorage.getItem(description_baseKeyForSession + "-TR"),
                        "DescriptionInEN": sessionStorage.getItem(description_baseKeyForSession + "-EN"),
                        "ImageName": selectedImageInfos.name,
                        "ImageContentInBase64Str": imageContentInBase64Str,
                        "PdfName": selectedPdfInfos.name,
                        "PdfContentInBase64Str": pdfContentInBase64Str
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    beforeSend: () => {
                        $(resultLabel_id).empty();  // reset resultLabel

                        //#region when any description of langauges not entered (throw)
                        let allLanguages = JSON.parse(
                            localStorage.getItem(localKeys_allLanguages))
                        [language];

                        for (let index in allLanguages) {
                            //#region get description by language in session
                            let languageInDb = allLanguages[index];

                            let descriptionInSession = sessionStorage
                                .getItem(description_baseKeyForSession + '-' + languageInDb);
                            //#endregion

                            //#region write error (throw)
                            if (descriptionInSession == null
                                || descriptionInSession == "") {
                                updateResultLabel(
                                    resultLabel_id,
                                    `"${languageInDb}" ${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                                    resultLabel_errorColor,
                                    "30px");

                                return false;
                            }
                            //#endregion
                        }
                        //#endregion
                    },
                    success: () => {
                        //#region resets
                        $("form")[0].reset();
                        img_machine.removeAttr("src");
                        //#endregion

                        //#region write successfull message to resultLabel
                        updateResultLabel(
                            resultLabel_id,
                            successMessagesByLanguages[language]["saveSuccessful"],
                            resultLabel_successColor,
                            "30px");
                        //#endregion

                        //#region remove descriptions in session
                        let allLanguages = JSON.parse(
                            localStorage.getItem(localKeys_allLanguages))
                        [language];

                        for (let index in allLanguages) {
                            let languageInLocal = allLanguages[index];

                            sessionStorage.removeItem(
                                description_baseKeyForSession + "-" + languageInLocal);
                        }
                        //#endregion
                    },
                    error: (response) => {
                        //#region write error message to result label
                        getErrorMessageForMachineAsync(response.responseText)
                            .then((errorMessage) => {
                                //write error
                                updateResultLabel(
                                    resultLabel_id,
                                    errorMessage,
                                    resultLabel_errorColor,
                                    "30px");
                            });
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
    div_form.click(() => {
        //#region when description button or dropdown clicked
        let clickedElement = $(":focus");

        //#region when clicked languages in description dropdown
        if (clickedElement.attr("class") == "a_description")
            clicked_descriptionDropdownItem(
                $(":focus"),
                description_inputId,
                description_buttonId,
                description_buttonNameByLanguages[language],
                description_unsavedColor,
                description_baseKeyForSession);
        //#endregion

        //#region when description button clicked
        else if (clickedElement.attr("id")
            == description_buttonId.substring(1))  // #btn_description => btn_description
            clicked_descriptionDropdownButton(
                description_inputId,
                description_buttonId,
                description_baseKeyForSession,
                description_savedColor);
        //#endregion

        //#endregion
    });
    div_form.on("input", () => {
        //#region when changed description <textarea>
        let inputtedElement = $(":focus");

        if (inputtedElement.attr("id") == inpt_description_id)
            changed_descriptionInput(
                description_buttonId,
                description_unsavedColor,
                description_savedColor);
        //#endregion
    })
    $(window).resize(async () => {
        await setMachineImageSizeAsync();
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
                    <input id="${inpt_image_id.substring(1)}" type="file" class="form-control" accept="image/*" required>
                    <span id="spn_help_${inpt_image_id.substring(1)}" class="help-block"></span>
                </div>
            </div>`
        );
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
                    <input id="${inpt_pdf_id.substring(1)}" type="file" class="form-control" accept="application/pdf" required>
                    <span id="spn_help_${inpt_pdf_id.substring(1)}" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add description

        //#region add description <div>
        div_form.append(
            `<div class="form-horizontal bucket-form">
                <div class="form-group">
                    <label class="col-sm-3 control-label">
                        <div class="input-group m-bot15">
                            <div class="input-group-btn">
                                <button id="btn_description" style="background-color:darkblue; color:red" tabindex="-1" class="btn btn-info" type="button">
                                    ${description_buttonNameByLanguages[language]} (${language})
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
                        <textarea id="${inpt_description_id}" style="resize:none" type="text" class="form-control" rows="10"></textarea>
                    </div>
                </div>
            </div`
        );
        //#endregion

        //#region populate description <ul> with languages
        populateElementByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            (data) => {
                //#region add languages as <li>
                for (let index in data) {
                    let languageInData = data[index];

                    $("#" + ul_description_id).append(
                        `<li>
                            <a class="a_description" href="#">${languageInData}</a>
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
                <div style="text-align:center;">
                    <p id="p_resultLabel"></p>
                </div>
            </div>`
        );
        //#endregion
    }

    async function addDynamicEventsAsync() {
        $("input").click((event) => {
            //#region reset help label of clicked <input>
            let inpt_id = event.target.id;

            $(`#spn_help_${inpt_id}`).empty();
            //#endregion
        })
        $(inpt_pdf_id).change(async (event) => {
            //#region when any file not selected (return)
            selectedPdfInfos = event.target.files[0];

            if (selectedPdfInfos == undefined)
                return;
            //#endregion

            //#region when file type is not "pdf" (error)
            if (await isFileTypeInvalidAsync(selectedPdfInfos, "application/pdf", $(inpt_pdf_id))) {
                // write error
                updateResultLabel(
                    `#spn_help_${inpt_pdf_id.substring(1)}`,
                    partnerErrorMessagesByLanguages[language]["invalidFileType"],
                    resultLabel_errorColor,
                    "10px");

                // reset pdf <input>
                $(inpt_pdf_id).val("");
                return;
            }
            //#endregion
        });
        $(inpt_image_id).change(async (event) => {
            //#region control the selected file (error)

            //#region when any file not selected
            selectedImageInfos = event.target.files[0];

            if (selectedImageInfos == undefined) {
                //#region remove current image
                img_machine.removeAttr("src");
                return;
                //#endregion
            }
            //#endregion

            //#region when file type is not image (error)
            if (await isFileTypeInvalidAsync(selectedImageInfos, "image", $(inpt_image))) {
                //#region write error message
                updateResultLabel(
                    `#spn_help_${inpt_image_id.substring(1)}`,
                    partnerErrorMessagesByLanguages[language]["invalidFileType"],
                    resultLabel_errorColor,
                    "10px");
                //#endregion

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

        });
    }
    //#endregion

    populateFormAsync()
        .then(async () => {
            await addDynamicEventsAsync();
        });
})