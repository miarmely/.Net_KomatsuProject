import { writeErrorMessage } from "./tools.js";

$(function () {
    $("form").submit(async (event) => {
        event.preventDefault();

        //#region reset resultLabel
        var resultLabel = $("#p_resultLabel");
        resultLabel.empty();
        //#endregion

        //#region set login data
        let data = {
            telNo: $("#inpt_telNo").val().trim(),
            password: $("#inpt_password").val().trim()
        };
        //#endregion

        //#region control login (ajax)
        $.ajax({
            method: "POST",
            url: "https://localhost:7091/api/services/user/login",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: (response) => {
                // reset inputs
                $("form")[0].reset();

                // save token to localStorage
                let token = response["token"];
                localStorage.setItem("token", token);

                // open homepage
                window.location = "Home";
            },
            error: (response) => {
                writeErrorMessage(response.responseText, "#p_resultLabel");
            }
        })
        //#endregion
    });
});