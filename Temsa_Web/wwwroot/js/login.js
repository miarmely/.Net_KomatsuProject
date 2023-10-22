import { updateResultLabel } from "./miarTools.js";

$(function () {
    const resultLabelId = "#p_resultLabel";
    const errorMessageColor = "red";

    $("form").submit((event) => {
        event.preventDefault();

        //#region reset resultLabel
        var resultLabel = $(resultLabelId);
        resultLabel.empty();
        //#endregion

        //#region control login (ajax)
        $.ajax({
            method: "POST",
            url: `https://localhost:7091/api/services/user/login?language=${language}`,
            contentType: "application/json",
            data: JSON.stringify({
                "TelNo": $("#inpt_telNo").val().trim(),
                "Password": $("#inpt_password").val().trim()
            }),
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
                //#region write error to resultLabel
                updateResultLabel(
                    resultLabelId,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor,
                    "50px")
                //#endregion
            }
        })
        //#endregion
    });
});