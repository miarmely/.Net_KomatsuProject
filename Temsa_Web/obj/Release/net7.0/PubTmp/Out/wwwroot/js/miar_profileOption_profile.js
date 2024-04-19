import {
    autoObjectMapperAsync, isUserRoleThisRoleAsync, populateElementByAjaxOrLocalAsync,
    populateSelectAsync, updateResultLabel
} from "./miar_tools.js";

import {
    checkInputsWhetherBlankAsync, click_userForm_inputAsync, populateInfoMessagesAsync,
    click_userForm_showPasswordButtonAsync, keyup_userForm_inputAsync, roleTranslator,
    populateElementNamesAsync, getRoleNameByPageLanguageAsync
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
    const langPack_formTitle = {
        "TR": "PROFİLE",
        "EN": "PROFILE"
    };
    const langPack_successMessage = {
        "TR": "başarıyla kaydedildi",
        "EN": "save successfull"
    };
    const langPack_elementNames = {
        "TR": {
            "firstName": "Ad",
            "lastName": "Soyad",
            "phone": "Telefon",
            "email": "Email",
            "company": "Şirket",
            "roles": "Rol",
            "password": "Yeni Şifre",
            "saveButton": "Güncelle"
        },
        "EN": {
            "firstName": "Firstname",
            "lastName": "Lastname",
            "phone": "Phone",
            "email": "Email",
            "company": "Company",
            "roles": "Role",
            "password": "New Password",
            "saveButton": "Update"
        }
    };
    let claimInfos = JSON.parse(localStorage
        .getItem(localKeys_claimInfos));
    //#endregion

    //#region events
    $("form").submit(async (event) => {
        //#region check whether blank value on inputs
        // check
        event.preventDefault();
        let isBlankValueExists = await checkInputsWhetherBlankAsync(
            [
                inpt.firstName,
                inpt.lastName,
                inpt.phone,
                inpt.email,
                inpt.company,
                slct_roles
            ]
        )

        // when any value is blank
        if (isBlankValueExists)
            return;

        // show loading gif
        img_loading.removeAttr("hidden");
        $(resultLabel_id).empty();
        //#endregion

        //#region when account is editor and role is changed (security)
        if (await isUserRoleThisRoleAsync(claimInfos.roleNames, "editor")
            && !await isUserRoleThisRoleAsync(slct_roles.val(), "editor")
        ) {
            //#region write error
            updateResultLabel(
                resultLabel_id,
                langPack_partnerErrorMessages.anErrorOccured[language],
                resultLabel_errorColor,
                "30px",
                img_loading);
            //#endregion

            //#region add account role to select again
            let accountRoleByPageLanguage = await getRoleNameByPageLanguageAsync(
                claimInfos.roleNames,
                claimInfos.roleLanguage);

            slct_roles.val(accountRoleByPageLanguage);
            slct_roles.attr("disabled", "");  // disable select
            //#endregion

            return;
        }
        //#endregion

        //#region set data
        let currentValues = {
            "firstName": inpt.firstName.val(),
            "lastName": inpt.lastName.val(),
            "telNo": inpt.phone.val(),
            "email": inpt.email.val(),
            "companyName": inpt.company.val(),
            "role": slct_roles.val(),
            "password": inpt.password.val()
        };
        let data = {
            "firstName": currentValues.firstName == claimInfos.firstName ? null : currentValues.firstName,
            "lastName": currentValues.lastName == claimInfos.lastName ? null : currentValues.lastName,
            "telNo": currentValues.telNo == claimInfos.telNo ? null : currentValues.telNo,
            "email": currentValues.email == claimInfos.email ? null : currentValues.email,
            "companyName": currentValues.companyName == claimInfos.companyName ? null : currentValues.companyName,
            "roleNames": currentValues.role == claimInfos.roleNames ? null : currentValues.role,
            "password": currentValues.password == "" ? null : currentValues.password,
        }
        //#endregion

        //#region when no any change (error)
        // get total null value count
        let nullCounter = 0;
        for (let key in data) {
            if (data[key] == null)
                nullCounter++;
        }

        // when all data is null
        if (nullCounter == Object.keys(data).length) {
            updateResultLabel(
                resultLabel_id,
                langPack_partnerErrorMessages.nullArguments[language],
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        $.ajax({
            method: "POST",
            url: (baseApiUrl + "/user/update/panel?" +
                `language=${language}` +
                `&telNo=${claimInfos.telNo}`),
            headers: {
                "authorization": jwtToken
            },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                new Promise(async resolve => {
                    $("form")[0].reset();

                    // update claims infos
                    await updateClaimInfosAsync(data);
                    await populateInputsWithClaimInfosAsync();

                    // write success message
                    updateResultLabel(
                        resultLabel_id,
                        langPack_successMessage[language],
                        resultLabel_successColor,
                        "30px",
                        img_loading);
                    resolve();
                })
            },
            error: (response) => {
                // write error message
                updateResultLabel(
                    resultLabel_id,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);
            }
        })  // update user infos
    });
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
    spn_eventManager.on("click_input", () => {
        // reset result label
        $(resultLabel_id).empty();
    });
    spn_eventManager.on("click_select", () => {
        // reset result label
        $(resultLabel_id).empty();
    });
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add form title
        $("#header_formTitle").append(
            langPack_formTitle[language]);
        //#endregion

        await populateElementNamesAsync(langPack_elementNames[language]);
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (data) => {
                populateSelectAsync(slct_roles, data);  // populate roles
                populateInputsWithClaimInfosAsync();
            });
        await populateInfoMessagesAsync();
    }
    async function populateInputsWithClaimInfosAsync() {
        inpt.firstName.val(claimInfos.firstName);
        inpt.lastName.val(claimInfos.lastName);
        inpt.company.val(claimInfos.companyName);
        inpt.phone.val(claimInfos.telNo);
        inpt.email.val(claimInfos.email);
        //#region role name
        // populate role select with account role
        slct_roles.val(await getRoleNameByPageLanguageAsync(
            claimInfos.roleNames,
            claimInfos.roleLanguage));

        // disable role select when account is editor
        if (await isUserRoleThisRoleAsync(claimInfos.roleNames, "editor"))
            slct_roles.attr("disabled", "");
        //#endregion
    }
    async function updateClaimInfosAsync(data) {
        // update claimInfos object
        await autoObjectMapperAsync(claimInfos, data, true);

        // update claimInfos in local
        localStorage.setItem(
            localKeys_claimInfos,
            JSON.stringify(claimInfos));
    }
    //#endregion

    populateHtmlAsync();
});