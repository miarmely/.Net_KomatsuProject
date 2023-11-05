import { changed_descriptionInput, clicked_descriptionDropdownButton, clicked_descriptionDropdownItem, getDescriptionKeyForSession, populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel } from "./miarTools.js"

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
                "DescriptionInTR": sessionStorage.getItem(
                    getDescriptionKeyForSession(description_baseKeyForSession)),
                "DescriptionInEN": sessionStorage.getItem(
                    getDescriptionKeyForSession(description_baseKeyForSession)),
                "ImagePath": "",
                "PdfPath": "",
            }),
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                // reset resultLabel
                $(resultLabelId).empty();

                //#region when any description of langauges missing (throw)
                for (let index in allLanguagesInDb) {
                    //#region get description by language in session
                    let languageInDb = allLanguagesInDb[index];
                    let descriptionByLanguageInSession = sessionStorage
                        .getItem(getDescriptionKeyForSession(description_baseKeyForSession));
                    //#endregion

                    //#region write error
                    if (descriptionByLanguageInSession == null) {
                        updateResultLabel(
                            resultLabelId,
                            `"${languageInDb}" dilinde açıklama girilmedi.`,
                            resultLabelErrorColor,
                            "30px");

                        return false;
                    }
                    //#endregion
                }
                //#endregion
            },
            success: () => {
                //#region write successfull message to resultLabel
                updateResultLabel(
                    resultLabelId,
                    "başarıyla kaydedildi",
                    resultLabelSuccessColor,
                    "30px");
                //#endregion

                // reset form
                $("form")[0].reset();
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
    $("#ul_description").click(() =>
        clicked_descriptionDropdownItem(
            $(":focus"),
            description_inputId,
            description_buttonId,
            description_buttonName,
            description_unsavedColor,
            description_baseKeyForSession)
    );
    $(description_buttonId).click(() =>
        clicked_descriptionDropdownButton(
            language,
            description_inputId,
            description_buttonId,
            description_baseKeyForSession,
            description_savedColor)
    );
    $(description_inputId).on("input", () => {
        changed_descriptionInput(
            description_buttonId,
            description_unsavedColor,
            description_savedColor);
    })
    //#endregion

    async function populateForm() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add mainCategory and subcategory

        //#region add mainCategory label and <select>
        $("#div_form").append(
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
        $("#div_form").append(
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
            (data) => {
                //#region populate mainCategory <select>
                populateSelectAsync(
                    $("#" + slct_mainCategory_id),
                    data
                )
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
        $("#div_form").append(
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

        //#region add year
        $("#div_form").append(
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
        $("#div_form").append(
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

        $("#div_form").append(
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

        //#region add save button
        $("#div_form").append(
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

    populateForm();
})