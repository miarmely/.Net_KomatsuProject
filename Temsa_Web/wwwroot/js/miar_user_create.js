import { writeErrorToBelowOfInputAsync } from "./miar_module_inputForm.js";
import {
    populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel
} from "./miar_tools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const img_loading = $("#img_loading");
    const slct_roles = $("#slct_roles");
    const btn_showPassword = $("#btn_showPassword");
    const inpt = {
        "firstName": $("#inpt_firstName"),
        "lastName": $("#inpt_lastName"),
        "phone": $("#inpt_phone"),
        "email": $("#inpt_email"),
        "company": $("#inpt_company"),
        "password": $("#inpt_password")
    };
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
    const langPack_elementNames = {
        "TR": {
            "firstName": "Ad",
            "lastName": "Soyad",
            "phone": "Telefon",
            "email": "Email",
            "company": "Şirket",
            "roles": "Rol",
            "password": "Şifre",
        },
        "EN": {
            "firstName": "Firstname",
            "lastName": "Lastname",
            "phone": "Phone",
            "email": "Email",
            "company": "Company",
            "roles": "Role",
            "password": "Password",
        }
    };
    //#endregion

    //#region events
    $("form").submit(async (event) => {
        //#region check whether blank value on inputs
        event.preventDefault();
        let isBlankValueExists = await checkWhetherBlankTheInputsAsync(
            langPack_errorMessages[language]["blankInput"],
            [
                inpt.firstName,
                inpt.lastName,
                inpt.phone,
                inpt.email,
                inpt.company,
                slct_roles,
                inpt.password
            ]
        )

        // when any value is blank
        if (isBlankValueExists)
            return;

        img_loading.removeAttr("hidden");
        //#endregion

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/user/create?language=${language}`,
            data: JSON.stringify({
                FirstName: inpt.firstName.val().trim(),
                LastName: inpt.lastName.val().trim(),
                companyName: inpt.company.val().trim(),
                TelNo: inpt.phone.val().trim(),
                Email: inpt.email.val().trim(),
                Password: inpt.password.val().trim(),
                RoleNames: [
                    slct_roles.val()
                ]
            }),
            headers: { "Authorization": jwtToken },
            contentType: "application/json",
            beforeSend: () => {
                // reset result label
                $(resultLabel_id).empty();
            },
            success: () => {
                //#region write success message
                $("form")[0].reset();  // reset inputs

                updateResultLabel(
                    resultLabel_id,
                    resultLabel_successMessageByLanguages[language],
                    resultLabel_successColor,
                    "30px",
                    img_loading);
                //#endregion
            },
            error: (response) => {
                //#region write error message to resultLabel
                updateResultLabel(
                    resultLabel_id,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading)
                //#endregion
            }
        });
    });
    $("input").click((event) => {
        //#region remove "red" color from input
        let input = $("#" + event.target.id);
        input.removeAttr("style");
        //#endregion

        //#region reset spn help of clicked input
        let spn_help = input.siblings("span");
        spn_help.attr("hidden", "");
        spn_help.empty();
        //#endregion
    })
    btn_showPassword.click(() => {
        //#region show password
        if (inpt.password.attr("type") == "password") {
            inpt.password.attr("type", "text");
            btn_showPassword.css("background-image", "url(../images/hide.png)");
        }
        //#endregion

        //#region hide password
        else {
            inpt.password.attr("type", "password");
            btn_showPassword.css("background-image", "url(../images/show.png)");
        }
        //#endregion
    })
    //#endregion

    //#region functions
    async function populateFormAsync() {
        //#region add form title
        $("#header_formTitle").append(
            formTitleByLanguages[language]);
        //#endregion

        await populateElementNamesAsync();
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (data) => {
                populateSelectAsync(
                    slct_roles,
                    data);
            });  // populate roles
        await populateInfoMessagesAsync();

        //#region add save button
        $("#div_form").append(
            `<div class="form-group">
                <div class="col-sm-6; text-center">
                    <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">
                        ${saveButtonNameByLanguages[language]}
                    </button>
                </div>
            </div>`
        )
        //#endregion
    }
    async function populateInfoMessagesAsync() {
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
    async function populateElementNamesAsync() {
        //#region firstName
        let elementNames = langPack_elementNames[language];

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
    }
    async function checkWhetherBlankTheInputsAsync(errorMessage_blankInput, inputList) {
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

    populateFormAsync();
});

