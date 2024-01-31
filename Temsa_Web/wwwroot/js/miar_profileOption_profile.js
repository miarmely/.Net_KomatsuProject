import { createInputFormAsync, populateInputFormAsync } from "./miar_module_inputForm.js";
import { autoObjectMapperAsync, populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel } from "./miar_tools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const div_form = $("#div_form");
    const img_loading = $("#img_loading");
    const inpt_firstName_id = "inpt_firstName";
    const inpt_lastName_id = "inpt_lastName";
    const inpt_email_id = "inpt_email";
    const inpt_telNo_id = "inpt_telNo";
    const inpt_companyName_id = "inpt_companyName";
    const inpt_password_id = "inpt_password";
    const slct_roles_id = "slct_roles";
    const langPack_formTitle = {
        "TR": "PROFİLE",
        "EN": "PROFILE"
    }
    const langPack_formLabelNamesAndFeatures = {
        "TR": {
            "firstName": {
                "label": "Ad",
                "type": "text",
                "helpMessage": ""
            },
            "lastName": {
                "label": "Soyad",
                "type": "text",
                "helpMessage": ""
            },
            "telNo": {
                "label": "Telefon",
                "type": "phone",
                "helpMessage": "* Başında sıfır olmadan 10 haneli olarak giriniz."
            },
            "email": {
                "label": "Email",
                "type": "email",
                "helpMessage": ""
            },
            "companyName": {
                "label": "Şirket",
                "type": "text",
                "helpMessage": ""
            },
            "roles": {
                "label": "Rol",
                "type": null,
                "helpMessage": ""
            },
            "password": {
                "label": "Yeni Şifre",
                "type": "text",
                "helpMessage": "* 6 ile 16 karakter arasında giriniz."
            }
        },
        "EN": {
            "firstName": {
                "label": "Firstname",
                "type": "text",
                "helpMessage": ""
            },
            "lastName": {
                "label": "Lastname",
                "type": "text",
                "helpMessage": ""
            },
            "telNo": {
                "label": "Telephone",
                "type": "phone",
                "helpMessage": "* enter as 10 digits without zero at head"
            },
            "email": {
                "label": "Email",
                "type": "email",
                "helpMessage": ""
            },
            "companyName": {
                "label": "Company",
                "type": "text",
                "helpMessage": ""
            },
            "roles": {
                "label": "Role",
                "type": null,
                "helpMessage": ""
            },
            "password": {
                "label": "New Password",
                "type": "text",
                "helpMessage": "* enter between 6 and 16 chars"
            }
        }
    }
    const langPack_saveButton = {
        "TR": "Kaydet",
        "EN": "Save"
    }
    const langPack_successMessage = {
        "TR": "başarıyla kaydedildi",
        "EN": "save successfull"
    }
    let claimInfos = JSON.parse(
        localStorage.getItem(localKeys_claimInfos));
    //#endregion

    //#region events
    $("form").submit((event) => {
        //#region show loading gif
        event.preventDefault();
        $(resultLabel_id).empty();

        img_loading.removeAttr("hidden");
        //#endregion

        //#region set data
        let currentValues = {
            "firstName": $("#" + inpt_firstName_id).val(),
            "lastName": $("#" + inpt_lastName_id).val(),
            "telNo": $("#" + inpt_telNo_id).val(),
            "email": $("#" + inpt_email_id).val(),
            "companyName": $("#" + inpt_companyName_id).val(),
            "role": $("#" + slct_roles_id).val(),
            "password": $("#" + inpt_password_id).val()
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

        //#region when all data values is null (error)
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
                partnerErrorMessagesByLanguages[language]["nullArguments"],
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        // update user infos
        $.ajax({
            method: "PUT",
            url: (baseApiUrl + "/user/update" +
                `?language=${language}` +
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
        })
    });
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

        await createInputFormAsync($("form"), 7);

        //#region populate input form
        let formLabelNamesAndFeatures = langPack_formLabelNamesAndFeatures[language];

        await populateInputFormAsync(1,
            formLabelNamesAndFeatures.firstName.label,
            `<input id="${inpt_firstName_id}" type="${formLabelNamesAndFeatures.firstName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.firstName.helpMessage}</span>`
        ); // firstName
        await populateInputFormAsync(2,
            formLabelNamesAndFeatures.lastName.label,
            `<input id="${inpt_lastName_id}" type="${formLabelNamesAndFeatures.lastName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.lastName.helpMessage}</span>`
        ); // lastName
        await populateInputFormAsync(3,
            formLabelNamesAndFeatures.telNo.label,
            `<input id="${inpt_telNo_id}" type="${formLabelNamesAndFeatures.telNo.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.telNo.helpMessage}</span>`
        ); // telNo
        await populateInputFormAsync(4,
            formLabelNamesAndFeatures.email.label,
            `<input id="${inpt_email_id}" type="${formLabelNamesAndFeatures.email.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.email.helpMessage}</span>`
        ); // email
        await populateInputFormAsync(5,
            formLabelNamesAndFeatures.companyName.label,
            `<input id="${inpt_companyName_id}" type="${formLabelNamesAndFeatures.companyName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.companyName.helpMessage}</span>`
        ); // companyName
        await populateInputFormAsync(6,
            formLabelNamesAndFeatures.roles.label,
            `<select id="${slct_roles_id}" class="form-control m-bot15">
            </select>`
        ); // roles
        await populateInputFormAsync(7,
            formLabelNamesAndFeatures.password.label,
            `<input id="${inpt_password_id}" type="${formLabelNamesAndFeatures.password.type}" class="form-control">
             <span class="help-block">${formLabelNamesAndFeatures.password.helpMessage}</span>`
        ); // password

        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (data) => {
                populateSelectAsync($("#" + slct_roles_id), data);
                populateInputsWithClaimInfosAsync();
            });  // add <option> to roles <select>
        //#endregion

        //#region add save button
        div_form.append(
            `<div class="form-group">
                <div class="col-sm-6; text-center">
                    <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">
                        ${langPack_saveButton[language]}
                    </button>
                </div>
            </div>`
        )
        //#endregion

        //#region declare events
        $("input").click(() => spn_eventManager.trigger("click_input"));
        $("select").click(() => spn_eventManager.trigger("click_select"));
        //#endregion
    }

    async function populateInputsWithClaimInfosAsync() {
        for (let key in claimInfos) {
            let claimValue = claimInfos[key];

            switch (key) {
                case "firstName": $("#" + inpt_firstName_id).val(claimValue); break;
                case "lastName": $("#" + inpt_lastName_id).val(claimValue); break;
                case "telNo": $("#" + inpt_telNo_id).val(claimValue); break;
                case "email": $("#" + inpt_email_id).val(claimValue); break;
                case "companyName": $("#" + inpt_companyName_id).val(claimValue); break;
                case "roleNames":
                    $("#" + slct_roles_id).val(claimValue);
                    break;
                case "password": $("#" + inpt_password_id).val(claimValue); break;
            }
        }
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