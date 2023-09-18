$(function () {
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
                window.writeErrorMessage(response.responseText, resultLabelId);
            }
        });
    });
})
