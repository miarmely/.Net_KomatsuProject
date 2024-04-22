import { updateResultLabel } from "./miar_tools.js";
import {
    clicked_languageDropdown, populateLanguageDropdownAsync,
    updateDefaultFlagAndLanguage
} from "./miar_header.js";


$(function () {
    //#region variables
    const resultLabelId = "#p_resultLabel";
    const errorMessageColor = "red";
    const img_loading = $("#img_loading");
    const spn_rememberMe = $("#spn_rememberMe");
    const inpt_telNo = $("#inpt_telNo");
    const check_rememberMe = $("#check_rememberMe");
    //#endregion

    //#region events
    $("form").submit((event) => {
        //#region resets
        event.preventDefault();

        // reset result label
        var resultLabel = $(resultLabelId);
        resultLabel.empty();

        // show loading gif
        img_loading.removeAttr("hidden");
        //#endregion

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/user/login/web?language=${language}`,
            contentType: "application/json",
            data: JSON.stringify({
                "TelNo": inpt_telNo.val().trim(),
                "Password": $("#inpt_password").val().trim()
            }),
            dataType: "json",
            success: (response) => {
                //#region update local

                //#region add token and language
                localStorage.setItem(localKeys_token, response["token"]);
                localStorage.setItem(localKeys_language, language);
                //#endregion

                //#region add/remove telNo
                // when "remember me" is checked (add)
                if (check_rememberMe.prop("checked"))
                    localStorage.setItem(
                        localKeys_telNoForLogin,
                        inpt_telNo.val())

                // when "remember me" is unchecked (remove)
                else 
                    localStorage.removeItem(localKeys_telNoForLogin)
                //#endregion

                $("form")[0].reset();  

                //#endregion

                //#region call afterLogin action
                location.replace("/authentication/afterLogin" +
                    `?token=${response.token}`);
                //#endregion
            },
            error: () => {
                //#region write error to resultLabel
                updateResultLabel(
                    resultLabelId,
                    errorMessagesByLanguages[language]["PhoneOrEmailWrong"],
                    errorMessageColor,
                    "30px",
                    img_loading)
                //#endregion
            }
        });
    });
    $("#" + ul_languages_id).click(() =>
        clicked_languageDropdown($(":focus"))
    )
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region populate telNo input
        const inputPlaceHolders = inputPlaceHoldersByLanguages[language];
        let savedTelNo = localStorage.getItem(localKeys_telNoForLogin);

        // when telNo is saved previously
        if (savedTelNo != null)
            inpt_telNo.val(savedTelNo);

        // when telNo isn't saved
        else
            inpt_telNo.attr("placeholder", inputPlaceHolders.telNo);
        //#endregion

        //#region populate other elements
        $("#inpt_password").attr("placeholder", inputPlaceHolders.password);
        spn_rememberMe.append(rememberMeByLanguages[language]);
        $("#a_forgotPassword").append(forgotPasswordByLanguages[language])
        $("#btn_login").append(loginButtonNameByLanguages[language]);
        //#endregion

        //#region set default flag and language on language dropdown
        updateDefaultFlagAndLanguage(
            img_displayingFlag_id,
            spn_displayingLanguage_id);
        //#endregion

        await populateLanguageDropdownAsync($("#" + ul_languages_id));
    }
    //#endregion

    populateHtmlAsync();
});