import {
    populateElementByAjaxOrLocalAsync, populateSelectAsync, updateResultLabel
} from "./miar_tools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const div_form = $("#div_form");
    const img_loading = $("#img_loading");
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
                let errorMessage= JSON
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

        //#region add labels and <input>'s or <select>'s
        for (let formLabelName in formLabelNamesAndFeaturesByLanguages[language]) {
            //#region add labels and inputs without role
            let formLabel = formLabelNamesAndFeaturesByLanguages[language][formLabelName];

            if (formLabelName != "roles")
                div_form.append(
                    `<div class="form-group">
                    <label class="col-sm-3 control-label">${formLabel.label}</label>
                    <div class="col-sm-6">
                        <input id="inpt_${formLabelName}" type="${formLabel.type}" class="form-control" required>
                            <span class="help-block">${formLabel.helpMessage}</span>
                    </div>
                </div>`
                );
            //#endregion

            //#region add role label and <select>
            else {
                //#region add role <select>
                let slct_roleName_id = `slct_${formLabelName}`;

                $("#div_form").append(
                    `<div class="form-group">
                        <label class="col-sm-3 control-label">${formLabel.label}</label>
                        <div class="col-sm-6">
                            <select id="${slct_roleName_id}" class="form-control m-bot15">             
                                </select>
                        </div>
                    </div>`
                );
                //#endregion

                //#region populate role <select>
                await populateElementByAjaxOrLocalAsync(
                    localKeys_allRoles,
                    `/user/display/role?language=${language}`,
                    (data) => {
                        populateSelectAsync(
                            $("#slct_roles"),
                            data);
                    });
                //#endregion
            }
            //#endregion
        }
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

