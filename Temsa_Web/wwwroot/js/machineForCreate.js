import { updateResultLabel } from "./miarTools.js"

$(function () {
    //#region variables
    const descriptionSavedColor = "lightgreen";
    const descriptionUnsavedColor = "red";
    const resultLabelId = "#p_resultLabel";
    const resultLabelErrorColor = "rgb(255, 75, 75)";
    const resultLabelSuccessColor = "green";
    const allLanguagesInDb = serializedAllLanguagesInDb;
    let inpt_description = $("#inpt_description");
    let btn_description = $("#btn_description");
    let descriptionBaseKeyInSession = "User-Create-Description";
    let descriptionLanguage = language;
    let descriptionCurrentColor = descriptionUnsavedColor;
    //#endregion

    //#region events
    $("form").submit(event => {
        event.preventDefault();
        $(resultLabelId).empty(); // reset resultLabel

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/machine/create?language=${language}`,
            data: JSON.stringify({
                "MainCategoryName": $("#slct_mainCategory").val(),
                "SubCategoryName": $("#slct_subCategory").val(),
                "Model": $("#inpt_model").val(),
                "BrandName": $("#inpt_brand").val(),
                "Stock": $("#inpt_stock").val(),
                "Year": $("#inpt_year").val(),
                "HandStatus": $("input[name = handStatus]:checked").val(),
                "DescriptionInTR": sessionStorage.getItem(getDescriptionKeyInSessionByLanguage("TR")),
                "DescriptionInEN": sessionStorage.getItem(getDescriptionKeyInSessionByLanguage("EN")),
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
                        .getItem(getDescriptionKeyInSessionByLanguage(languageInDb));
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
                    convertErrorCodeToErrorMessage(response.responseText),
                    resultLabelErrorColor,
                    "30px");
                //#endregion
            }
        });
    });
    $("#ul_description").click(() => {
        //#region reset
        // <input>
        inpt_description.val("");

        // button color
        btn_description.css("color", descriptionUnsavedColor);
        descriptionCurrentColor = descriptionUnsavedColor;
        //#endregion

        //#region change description button name
        var a = $(":focus");
        descriptionLanguage = a.prop("innerText");

        btn_description.empty();
        btn_description.append(
            `${descriptionButtonName} (${descriptionLanguage})`);
        //#endregion

        //#region populate description <input> with in session value
        var descriptionInfosInSession = sessionStorage.getItem(
            getDescriptionKeyInSession());

        if (descriptionInfosInSession != null)
            inpt_description.val(descriptionInfosInSession);
        //#endregion    
    })
    btn_description.click(() => {
        //#region add description informations to session
        sessionStorage.setItem(
            getDescriptionKeyInSession(),
            inpt_description.val());
        //#endregion

        //#region change button color to "saved color"
        btn_description.css("color", descriptionSavedColor);
        descriptionCurrentColor = descriptionSavedColor;
        //#endregion
    })
    inpt_description.on("input", () => {
        //#region change description color to "unsaved color" when input changed
        if (descriptionCurrentColor == descriptionSavedColor) {
            btn_description.css("color", descriptionUnsavedColor);
            descriptionCurrentColor = descriptionUnsavedColor;
        }
        //#endregion
    })
    //#endregion

    //#region functions
    function getDescriptionKeyInSession() {
        return descriptionBaseKeyInSession + '-' + descriptionLanguage;
    }

    function getDescriptionKeyInSessionByLanguage(language) {
        return descriptionBaseKeyInSession + '-' + language;
    }
    //#endregion
})
