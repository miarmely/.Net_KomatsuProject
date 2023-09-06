$(function () {
    var token;

    $("form").submit((event) => {
        event.preventDefault();

        //#region set login data
        let data = {
            telNo: $("#inpt_telNo").val().trim(),
            password: $("#inpt_password").val().trim()
        };
        //#endregion

        $.ajax({
            method: "POST",
            url: "https://localhost:7091/api/services/user/login",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: (response) => {
                token = response["token"];
                alert(token);
            },
            error: (response) => {
                alert(response.responseText);
            }
        });
    });
})