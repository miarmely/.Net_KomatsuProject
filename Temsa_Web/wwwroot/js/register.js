import { updateResultLabel, writeErrorMessage } from "./tools.js";

$(function () {
    $("form").submit((event) => {
        event.preventDefault();

        //#region reset resultLabel
        var resultLabelId = "#p_resultLabel";
        $(resultLabelId).empty();
        //#endregion

        //#region set data
        let data = {
            firstName: $("#inpt_firstName").val().trim(),
            lastName: $("#inpt_lastName").val().trim(),
            companyName: $("#inpt_companyName").val().trim(),
            telNo: $("#inpt_telNo").val().trim(),
            email: $("#inpt_email").val().trim(),
            password: $("#inpt_password").val().trim(),
        };
        //#endregion

        //#region when password not equal each other
        let confirmPassword = $("#inpt_confirmPassword").val().trim();

        if (data.password != confirmPassword) {
            updateResultLabel("Şifreler eşleşmiyor", "rgb(255, 75, 75)", resultLabelId);
            return;
        }
        //#endregion

        $.ajax({
            method: "POST",
            url: "https://localhost:7091/api/services/user/register",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                // reset inputs
                $("form")[0].reset();

                updateResultLabel("Kayıt Olma İşlemi Başarılı", "greenyellow", resultLabelId);
            },
            error: (response) => {
                writeErrorMessage(response.responseText, resultLabelId)
            }
        })
    });

    $("#box_showPasswords").click(() => {
        let password = $("#inpt_password");
        let confirmPassword = $("#inpt_confirmPassword");

        //#region show passwords
        if (password.attr("type") == "password") {
            password.attr("type", "text");
            confirmPassword.attr("type", "text");
        }
        //#endregion

        //#region hide passwords
        else {  // type == "text"
            password.attr("type", "password");
            confirmPassword.attr("type", "password");
        }
        //#endregion        
    });
});