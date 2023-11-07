import { updateResultLabel } from "./miarTools.js";

$(function () {
    //#region variables
    const resultLabelId = "#p_resultLabel";
    const errorMessageColor = "red";
    const inputPlaceHolders = inputPlaceHoldersByLanguages[language];
    //#endregion

    //#region events
    $("form").submit((event) => {
        event.preventDefault();

        //#region reset resultLabel
        var resultLabel = $(resultLabelId);
        resultLabel.empty();
        //#endregion

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

                //#region add token to local
                let token = response["token"];
                localStorage.setItem("token", token);
                //#endregion

                //#region call afterLogin action
                location.replace("/authentication/afterLogin" +
                    `?token=${token}`);
                //#endregion
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
        });
    });
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        await new Promise(resolve => {
            $("#h2_mainTitle").append(mainTitleByLanguages[language])
            $("#inpt_telNo").attr("placeholder", inputPlaceHolders.telNo)
            $("#inpt_password").attr("placeholder", inputPlaceHolders.password)
            $("#a_iForgotMyPassword").append(iForgotMyPasswordByLanguages[language])
            $("#btn_login").attr("value", loginButtonNameByLanguages[language]);

            resolve();
        });
    }
    //#endregion

    populateHtmlAsync();
});