import { createInputFormAsync, div_form, populateInputFormAsync } from "./miar_module_inputForm.js";

import {
    populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel
} from "./miar_tools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const img_loading = $("#img_loading");
    const slct_roles_id = "slct_roles";
    //#endregion

    //#region events
    $("form").submit((event) => {
        //#region display loading gif
        event.preventDefault();
        img_loading.removeAttr("hidden");
        //#endregion

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/user/create?language=${language}`,
            data: JSON.stringify({
                FirstName: $("#inpt_firstName").val().trim(),
                LastName: $("#inpt_lastName").val().trim(),
                companyName: $("#inpt_companyName").val().trim(),
                TelNo: $("#inpt_telNo").val().trim(),
                Email: $("#inpt_email").val().trim(),
                Password: $("#inpt_password").val().trim(),
                RoleNames: [
                    $("#slct_roles").val()
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
                //#region get errorMessage
                let errorMessage = JSON
                    .parse(response.responseText)
                    .errorMessage
                //#endregion

                //#region write error message to resultLabel
                updateResultLabel(
                    resultLabel_id,
                    errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading)
                //#endregion
            }
        });
    });
    //#endregion

    //#region functions
    async function populateFormAsync() {
        //#region add form title
        $("#header_formTitle").append(
            formTitleByLanguages[language]);
        //#endregion

        await createInputFormAsync($("form"), 7);

        //#region populate input form
        let formLabelNamesAndFeatures = formLabelNamesAndFeaturesByLanguages[language];

        await populateInputFormAsync(1,
            formLabelNamesAndFeatures.firstName.label,
            `<input id="inpt_firstName" type="${formLabelNamesAndFeatures.firstName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.firstName.helpMessage}</span>`
        ); // firstName
        await populateInputFormAsync(2,
            formLabelNamesAndFeatures.lastName.label,
            `<input id="inpt_lastName" type="${formLabelNamesAndFeatures.lastName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.lastName.helpMessage}</span>`
        ); // lastName
        await populateInputFormAsync(3,
            formLabelNamesAndFeatures.telNo.label,
            `<input id="inpt_telNo" type="${formLabelNamesAndFeatures.telNo.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.telNo.helpMessage}</span>`
        ); // telNo
        await populateInputFormAsync(4,
            formLabelNamesAndFeatures.email.label,
            `<input id="inpt_email" type="${formLabelNamesAndFeatures.email.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.email.helpMessage}</span>`
        ); // email
        await populateInputFormAsync(5,
            formLabelNamesAndFeatures.companyName.label,
            `<input id="inpt_companyName" type="${formLabelNamesAndFeatures.companyName.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.companyName.helpMessage}</span>`
        ); // companyName
        await populateInputFormAsync(6,
            formLabelNamesAndFeatures.roles.label,
            `<select id="${slct_roles_id}" class="form-control m-bot15">             
            </select>`); // roles
        await populateInputFormAsync(7,
            formLabelNamesAndFeatures.password.label,
            `<input id="inpt_password" type="${formLabelNamesAndFeatures.password.type}" class="form-control" required>
             <span class="help-block">${formLabelNamesAndFeatures.password.helpMessage}</span>`); // password

        // populate roles <select>
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (data) => {
                populateSelectAsync(
                    $("#" + slct_roles_id),
                    data);
            });
        //#endregion

        //#region add save button
        div_form.append(
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
    //#endregion

    populateFormAsync();
});

