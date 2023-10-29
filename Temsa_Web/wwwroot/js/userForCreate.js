import { updateResultLabel } from "./miarTools.js";


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const resultLabel_errorColor = "red";
    const resultLabel_successColor = "rgb(16, 155, 16)";
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
                    $("#slct_role").val()
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
                    resultLabel_successMessage,
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

    function populateHtml() {



    }
});