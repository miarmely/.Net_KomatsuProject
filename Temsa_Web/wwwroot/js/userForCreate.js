import { updateResultLabel } from "./miarTools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const resultLabel_errorColor = "red";
    const resultLabel_successColor = "rgb(16, 155, 16)";
    const div_form = $("#div_form");
    //#endregion

    //#region events
    $("form").submit((event) => {
        event.preventDefault();

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
                // reset inputs
                $("form")[0].reset();

                // write success message
                updateResultLabel(
                    resultLabel_id,
                    resultLabel_successMessageByLanguages[language],
                    resultLabel_successColor,
                    "30px"
                )
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
                    "30px"
                )
                //#endregion
            }
        });
    });
    //#endregion

    //#region functions
    function populateForm() {
        $("#header_formTitle").append(formTitleByLanguages[language]);

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

            //#region add role label and select
            else
            {
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

                //#region populate role <select> (ajax)
                $.ajax({
                    method: "GET",
                    url: baseApiUrl + `/user/display/role?language=${language}`,
                    headers: { "Authorization": jwtToken },
                    contentType: "application/json",
                    dataType: "json",
                    success: (response) => {
                        //#region add roles as <option>
                        for (let index in response) {
                            let roleName = response[index];
                        
                            $("#" + slct_roleName_id).append(
                                `<option>${roleName}</option>`
                            );
                        }
                        //#endregion
                    }
                })
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
                <div style="text-align:center">
                    <p id="p_resultLabel"></p>
                </div>
            </div>`
        )
        //#endregion
    }
    //#endregion

    populateForm();
});

