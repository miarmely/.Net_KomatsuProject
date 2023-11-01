import { updateResultLabel } from "./miarTools.js";

$(function () {
    //#region variables
    const resultLabelId = "#p_resultLabel";
    const errorMessageColor = "red";
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

                //#region populate local storage
                let token = response["token"];
                populateLocalStorage(token);
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
    function populateLocalStorage(token) {
        //#region add token
        localStorage.setItem("token", token);
        //#endregion

        //#region add roles, main category names, languages and hand status
        let localStorageKeysAndUrls = {
            "allRoles": `/user/display/role?language=${language}`,
            "allMainCategoryNames": `/machine/display/mainCategory?language=${language}`,
            "allLanguages": `/machine/display/language`,
            "allHandStatuses": `/machine/display/handStatus?language=${language}`,
        }

        for (let localStorageKey in localStorageKeysAndUrls) 
            // send request when data not exists local
            if (localStorage.getItem(localStorageKey) == null) {
                let specialUrl = localStorageKeysAndUrls[localStorageKey];

                $.ajax({
                    method: "GET",
                    url: baseApiUrl + specialUrl,
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: (response) => {
                        localStorage.setItem(localStorageKey, response);
                    }
                });
            }
        //#endregion
    }
    //#endregion
});