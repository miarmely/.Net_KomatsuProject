import { updateResultLabel } from "./miarTools.js"

$(function () {
    //#region variables
    let btn_description = $("#btn_description");
    //#endregion

    //#region events
    $("form").submit(event => {
        event.preventDefault();

        //#region reset resultLabel
        let resultLabelId = "#p_resultLabel";
        $(resultLabelId).empty();
        //#endregion

        //#region set data
        let data = {
            "mainCategoryName": $("#slct_mainCategory option:selected").text(),
            "subCategoryName": $("#slct_subCategory option:selected").text(),
            "brandName": $("#inpt_brand").val().trim(),
            "model": $("#inpt_model").val().trim(),
            "year": $("#inpt_year").val().trim(),
            "zerothHandOrSecondHand": $("input[Name = usageStatus]:checked").val(),
            "stock": $("#inpt_stock").val().trim()
        }
        //#endregion

        $.ajax({
            method: "POST",
            url: "https://localhost:7091/api/services/machine/create",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                $("form")[0].reset();
                window.updateResultLabel("Başarıyla Kaydedildi", "green", "#p_resultLabel");
            },
            error: (response) => {
                //#region write error message to resultLabel
                updateResultLabel(
                    resultLabelId,
                    window.convertErrorCodeToErrorMessage(response.responseText),
                    "rgb(255, 75, 75)",
                    "30px");
                //#endregion
            }
        });
    });
    $("#ul_description").click(() => {
        //#region reset description input
        $("#inpt_description").val("");
        //#endregion
        
        //#region change description button name
        var a = $(":focus");
        var selectedLanguage = a.prop("innerText");

        btn_description.empty();
        btn_description.append(
            `${descriptionButtonName} (${selectedLanguage})`);
        //#endregion
    });
    btn_description.click(() => {
        //#region add description informations to session
        var descriptionLanguage = btn_description.prop("innerText");

        sessionStorage.setItem(
            `User-Create-Description-${descriptionLanguage}`,
            $("#inpt_description").val());
        //#endregion
    })
    //#endregion
})
