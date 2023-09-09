import { updateResultLabel, writeErrorMessage } from "./tools.js";

$(function () {
    $("form").submit((event) => {
        event.preventDefault();

        //#region set data
        var data = {
            firstName: $("#inpt_firstName").val().trim(),
            lastName: $("#inpt_lastName").val().trim(),
            telNo: $("#inpt_telNo").val().trim(),
            email: $("#inpt_email").val().trim(),
            companyName: $("#inpt_companyName").val().trim(),
            password: $("#inpt_password").val().trim(),
            roleName: $("#slct_role option:selected").val()
        };
        //#endregion

        $.ajax({
            method: "POST",
            url: "https://localhost:7091/api/services/user/create",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: () => {
                // reset inputs
                $("form")[0].reset();

                updateResultLabel("Başarıyla Kaydedildi", "rgb(16, 155, 16)" , "#p_resultLabel");
            },
            error: (response) => {
                writeErrorMessage(response.responseText, "#p_resultLabel");
            }
        });
    });
});