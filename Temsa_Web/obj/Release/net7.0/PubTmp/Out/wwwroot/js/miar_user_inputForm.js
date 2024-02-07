import { writeErrorToBelowOfInputAsync } from "./miar_module_inputForm.js";

//#region variables
const langPack_infoMessages = {
    "TR": {
        "div_firstName": [
            "Max 50 karakter uzunluğunda olmalı."
        ],
        "div_lastName": [
            "Max 50 karakter uzunluğunda olmalı."
        ],
        "div_phone": [
            "Başında 0 olmadan girilmeli. (5xxxxxxxxx)"
        ],
        "div_email": [
            "Uzantısı hariç max 50 karakter uzunluğunda olmalı."
        ],
        "div_company": [
            "Max 50 karakter uzunluğunda olmalı."
        ],
        "div_password": [
            "6 ile 16 karakter uzunluğunu arasında olmalı."
        ],
    },
    "EN": {
        "div_firstName": [
            "It must be max 50 chars length."
        ],
        "div_lastName": [
            "It must be max 50 chars length."
        ],
        "div_phone": [
            "You must enter without leading zero. (5xxxxxxxxx)"
        ],
        "div_email": [
            "It must be max 50 chars length except extension."
        ],
        "div_company": [
            "It must be max 50 chars length."
        ],
        "div_password": [
            "Chars length must be between 6 and 16."
        ],
    }
};
//#endregion

//#region events
export async function click_userForm_showPasswordButtonAsync(inpt_password, btn_showPassword) {
    //#region show password
    if (inpt_password.attr("type") == "password") {
        inpt_password.attr("type", "text");
        btn_showPassword.css("background-image", "url(../images/hide.png)");
    }
    //#endregion

    //#region hide password
    else {
        inpt_password.attr("type", "password");
        btn_showPassword.css("background-image", "url(../images/show.png)");
    }
    //#endregion
}
export async function click_userForm_inputAsync(event, spn_resultLabel) {
    //#region remove "red" color from input
    let input = $("#" + event.target.id);
    input.removeAttr("style");
    //#endregion

    //#region reset spn help of clicked input
    let spn_help = input.siblings("span");
    spn_help.attr("hidden", "");
    spn_help.empty();
    //#endregion

    //#region reset result label
    spn_resultLabel.empty();
    spn_resultLabel.removeAttr("style");
    //#endregion
}
export async function keyup_userForm_inputAsync(event, spn_resultLabel) {
    //#region when clicked key is "TAB"
    let clickedKeyNo = event.which;

    if (clickedKeyNo == 9)
        await click_userForm_inputAsync(event, spn_resultLabel);
    //#endregion
}
//#endregion

//#region functions
export async function populateElementNamesAsync(elementNames) {
    //#region firstName
    $("#div_firstName")
        .children("label")
        .append(elementNames.firstName);
    //#endregion

    //#region lastName
    $("#div_lastName")
        .children("label")
        .append(elementNames.lastName);
    //#endregion

    //#region phone
    $("#div_phone")
        .children("label")
        .append(elementNames.phone);
    //#endregion

    //#region email
    $("#div_email")
        .children("label")
        .append(elementNames.email);
    //#endregion

    //#region company
    $("#div_company")
        .children("label")
        .append(elementNames.company);
    //#endregion

    //#region roles
    $("#div_roles")
        .children("label")
        .append(elementNames.roles);
    //#endregion

    //#region password
    $("#div_password")
        .children("label")
        .append(elementNames.password);
    //#endregion

    //#region save button
    $("#div_saveButton #btn_save").append(elementNames.saveButton)
    //#endregion
}
export async function populateInfoMessagesAsync() {
    //#region fill in info messages
    let infoMessages = langPack_infoMessages[language];

    for (let div_id in infoMessages)
        for (let index in infoMessages[div_id]) {
            let message = infoMessages[div_id][index];

            $("#" + div_id + " .div_infoMessage" + " ul")
                .append(`<li>* ${message}</li>`);
        }
    //#endregion
}
export async function checkWhetherBlankTheInputsAsync(errorMessage_blankInput, inputList) {
    //#region check whether blank of inputs
    let isAnyInputBlank = false;

    for (let index in inputList) {
        //#region when input is blank
        let input = inputList[index];

        if (input.val() == '') {
            await writeErrorToBelowOfInputAsync(
                input,
                errorMessage_blankInput);

            isAnyInputBlank = true;
        }
        //#endregion
    }
    //#endregion

    return isAnyInputBlank;
}
//#endregion