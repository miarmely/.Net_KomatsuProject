$(function () {
    //#region variables
    const img_sliders = $("#img_sliders");
    let currentSliderNo = 1;
    let slidersInSession;
    //#endregion

    //#region events
    $("#inpt_chooseFile").change((event) => {
        //#region get selected file
        let selectedFile = event.target.files[0];
        //#endregion

        //#region when selected file not image
        if (!selectedFile.type.startsWith("image/")) {
            return;
        }
        //#endregion
            
        //#region display selected file
        const fileReader = new FileReader();
        
        fileReader.readAsDataURL(selectedFile);
        fileReader.onload = function (event) {
            //#region add src to <img>
            let dataUrl = event.target.result;
            $("#img_sliders").attr("src", dataUrl);
            //#endregion

            $.ajax({
                method: "POST",
                url: baseApiUrl + "/file/upload",
                data: JSON.stringify({
                    "fileName": `${selectedFile.name}`,
                    "contentInBase64Str": dataUrl.replace("data:image/jpeg;base64,", "")
                }),
                contentType: "application/json",
                success: () => {
                    alert("success");
                }
            })
        }
        //#endregion
    })
    $(window).resize(async () => {
        await setSliderMaxSizesAsync();
    });
    //#endregion

    //#region functions
    async function populateSlider() {
        await setSliderMaxSizesAsync();

        //#region when sliders isn't exists in local
        slidersInSession = localStorage.getItem("sliders");

        if (slidersInSession == null) {
            slidersInSession = []
            img_sliders.attr("src", "../images/noImage.png");
        }
        //#endregion

        //#region when sliders is exists in local
        else {
            //#region add first slider on sliders
            slidersInSession = JSON.parse(slidersInSession);
            img_sliders.attr("src", slidersInSession[0])
            //#endregion
        }
        //#endregion
     }

    async function setSliderMaxSizesAsync() {
        //#region set max width and height of slider
        const divWidth = $(".panel-body")[0].clientWidth - 40;  // 40: i choosed as trying
        const divHeight = $("#container")[0].clientHeight / 2;

        img_sliders.css("max-width", divWidth);
        img_sliders.css("max-height", divHeight);
        //#endregion
    }
    //#endregion

    populateSlider();
})

