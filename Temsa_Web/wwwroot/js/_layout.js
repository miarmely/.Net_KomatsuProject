$(() => {
    $("#a_logout").click(() => {
        // remove token
        localStorage.removeItem("token");
        
        // sign out and and redirect to login page
        $.ajax({
            method: "GET",
            url: "/authentication/logout",
            success: () => {
                // open login page
                location.replace(`/?language=${language}`);
            }
        })
    })
});
