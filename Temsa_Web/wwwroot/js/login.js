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
            url: baseApiUrl + `/user/login?language=${language}`,
            contentType: "application/json",
            data: JSON.stringify({
                "TelNo": $("#inpt_telNo").val().trim(),
                "Password": $("#inpt_password").val().trim()
            }),
            dataType: "json",
            success: (response) => {
                $("form")[0].reset();  // reset inputs

                //#region save token to localStorage
                let token = response["token"];
                localStorage.setItem("token", token);
                //#endregion

                window.location.href = "user/create?language=TR"
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