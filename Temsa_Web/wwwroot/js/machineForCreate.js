import { changed_descriptionInput, clicked_descriptionDropdownButton, clicked_descriptionDropdownItem, getDescriptionKeyForSession, updateResultLabel } from "./miarTools.js"

$(function () {
    //#region variables
    const resultLabelId = "#p_resultLabel";
    const resultLabelErrorColor = "rgb(255, 75, 75)";
    const resultLabelSuccessColor = "green";
    const allLanguagesInDb = serializedAllLanguagesInDb;
    const description_inputId = "#inpt_description";
    const description_buttonId = "#btn_description";
    const description_unsavedColor = "red";
    const description_savedColor = "lightgreen";
    const description_baseKeyForSession = "Machine-Create-Description";
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

    function populateHtml() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        for (let formLabelName in formLabelsByLanguages[language]) {
            //#region add labels except description
            let formLabel = formLabelsByLanguages[language][formLabelName];
            let div_formlabelInput_id = `div_${ formLabel.label }Input`;

            $("#div_form").append(
                `<div class="form-group">
                    <label class="col-sm-3 control-label">
                        ${formLabel.label}
                    </label>
                    <div id="${div_formlabelInput_id}" class="col-sm-6">
                    </div>
                </div>`
            );
            //#endregion

            let div_formlabelInput = $("#" + div_formlabelInput_id);

            switch (formLabel.type) {
                case "select":
                    //#region add <select> to <div>
                    div_formlabelInput.append(
                        `<select id="slct_mainCategory" class="form-control m-bot15>
                        </select>`
                    );
                    //#endregion

                    


                    break;
                case "input":
                    break;
                case "radio":
                    break;
            }
        }

    }
})