import { changed_descriptionInput, clicked_descriptionDropdownButton, clicked_descriptionDropdownItem, getDescriptionKeyForSession, populateElementByAjaxOrLocalAsync, populateSelectAsync, setDescriptionLanguage, updateResultLabel } from "./miarTools.js"

$(function () {
    //#region variables
    const resultLabelId = "#p_resultLabel";
    const resultLabelErrorColor = "rgb(255, 75, 75)";
    const resultLabelSuccessColor = "green";
    const description_inputId = "#inpt_description";
    const description_buttonId = "#btn_description";
    const description_unsavedColor = "red";
    const description_savedColor = "lightgreen";
    const description_baseKeyForSession = "Machine-Create-Description";
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const ul_description_id = "ul_description";
    const div_form_id = "#div_form";
    const inpt_description_id = "inpt_description";
    //#endregion

    //#region events
    $("form").submit(event => {
        //#region reset resultLabel
        event.preventDefault();
        $(resultLabelId).empty();
        //#endregion

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/machine/create?language=${language}`,
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
                "ImagePath": "",
                "PdfPath": "",
            }),
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                $(resultLabelId).empty();  // reset resultLabel

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
                            resultLabelId,
                            `"${languageInDb}" ${description_missingLanguageErrorByLanguages[language]}`,
                            resultLabelErrorColor,
                            "30px");

                        return false;
                    }
                    //#endregion
                }
                //#endregion
            },
            success: () => {
                $("form")[0].reset();  // reset form

                //#region write successfull message to resultLabel
                updateResultLabel(
                    resultLabelId,
                    successfulMessageByLanguages[language],
                    resultLabelSuccessColor,
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
                //#region write error message to resultLabel
                updateResultLabel(
                    resultLabelId,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabelErrorColor,
                    "30px");
                //#endregion
            }
        });
    });
    $(div_form_id).click(() => {
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
    $(div_form_id).on("input", () => {
        //#region when changed description <textarea>
        let inputtedElement = $(":focus");

        if (inputtedElement.attr("id") == inpt_description_id)
            changed_descriptionInput(
                description_buttonId,
                description_unsavedColor,
                description_savedColor);
        //#endregion
    })
    //#endregion

    //#region functions
    async function populateForm() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add mainCategory and subcategory

        //#region add mainCategory label and <select>
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].mainCategory}
                </label>
                <div class="col-sm-6">
                    <select id="${slct_mainCategory_id}" class="form-control m-bot15">
                    </select>
                    <span id="span_help_mainCategory" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add subCategory label and <select>
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].subCategory}
                </label>
                <div class="col-sm-6">
                    <select id="${slct_subCategory_id}" class="form-control m-bot15">
                    </select>
                    <span id="span_help_subCategory" class="help-block"></span>
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
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].model}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_model" type="text" class="form-control" required>
                    <span id="span_help_model" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add brand
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].brand}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_brand" type="text" class="form-control" required>
                    <span id="span_help_brand" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add year
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].year}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_year" type="number" class="form-control" required>
                    <span id="span_help_year" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add stock
        $(div_form_id).append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].stock}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_stock" type="number" class="form-control" required>
                    <span id="span_help_stock" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add handStatus
        let handStatus = formLabelNamesByLanguages[language].handStatus;

        $(div_form_id).append(
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

        //#region add description

        //#region add description <div>
        $(div_form_id).append(
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
        $(div_form_id).append(
            `<div class="form-group">
                <div class="col-sm-6; text-center">
                    <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">
                        ${updateButtonNameByLanguages[language]}
                    </button>
                </div>
                <div style="text-align:center;">
                    <p id="p_resultLabel"></p>
                </div>
            </div>`
        );
        //#endregion
    }
    //#endregion

    populateForm();
})