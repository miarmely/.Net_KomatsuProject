$(function () {
    $("form").submit(event => {
        event.preventDefault();

        let data = {
            "mainCategoryName": $("#slct_mainCategory option:selected").text(),
            "subCategoryName": $("#slct_subCategory option:selected").text(),
            "brandName": $("#inpt_brand").val().trim(),
            "model": $("#inpt_model").val().trim(),
            "year": $("#inpt_year").val().trim(),
            "isSecondHand": $("#radioButtons").val(),
            "stock": $("#inpt_stock").val().trim()
        }

        //$.ajax({
        //    method: "POST",
        //    url: "https://localhost:7091/api/services/machine/create",
        //    data: 

        //});
    });
})