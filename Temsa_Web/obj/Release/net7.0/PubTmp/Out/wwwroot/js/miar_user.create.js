import {
    populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel
} from "./miar_tools.js";

import {
    checkInputsWhetherBlankAsync, click_userForm_inputAsync, populateInfoMessagesAsync,
    click_userForm_showPasswordButtonAsync, keyup_userForm_inputAsync,
    populateElementNamesAsync
} from "./miar_user.inputForm.js";


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
    const langPack_elementNames = {
        "TR": {
            "firstName": "Ad",
            "lastName": "Soyad",
            "phone": "Telefon",
            "email": "Email",
            "company": "Şirket",
            "roles": "Rol",
            "password": "Şifre",
            "saveButton": "Kaydet"
        },
        "EN": {
            "firstName": "Firstname",
            "lastName": "Lastname",
            "phone": "Phone",
            "email": "Email",
            "company": "Company",
            "roles": "Role",
            "password": "Password",
            "saveButton": "Save"
        }
    };
    //#endregion

    //#region events
    $("form").submit(async (event) => {
        //#region check whether blank value on inputs
        event.preventDefault();
        let isBlankValueExists = await checkInputsWhetherBlankAsync(
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
    })
    $("input").click(async (event) => {
        await click_userForm_inputAsync(event, $(resultLabel_id));
    })
    $("input").on("keyup", async (event) => {
        await keyup_userForm_inputAsync(event, $(resultLabel_id));
    })
    btn_showPassword.click(async () => {
        await click_userForm_showPasswordButtonAsync(
            inpt.password,
            btn_showPassword);
    })
    //#endregion

    //#region functions
    async function populateFormAsync() {
        //#region add form title
        $("#header_formTitle").append(
            formTitleByLanguages[language]);
        //#endregion

        await populateElementNamesAsync(langPack_elementNames[language]);
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (data) => {
                populateSelectAsync(
                    slct_roles,
                    data);
            });  // populate roles
        await populateInfoMessagesAsync();
    }
    //#endregion

    populateFormAsync();
});