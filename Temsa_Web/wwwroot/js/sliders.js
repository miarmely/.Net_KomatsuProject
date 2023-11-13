$(function () {
    //#region variables
    const maxSliderQuantity = 10;
    const img_sliders_id = "img_sliders";
    const img_sliders = $("#" + img_sliders_id);
    const btn_previous = $("#btn_previous");
    const btn_next = $("#btn_next");
    const btn_sliderNo = $("#btn_sliderNo");
    const noImagePath = "../images/noImage.png";
    const inpt_chooseFile = $("#inpt_chooseFile");
    let currentSliderNo = 1;
    let sliderFiles;
    //#endregion

    //#region events
    $(window).resize(async () => {
        await setSliderMaxHeightAndWidthAsync();
    })
    $("#btn_save").click(async () => {
        //#region any slider not added
        if (Object.keys(sliderFiles).length == 0)
            return;
        //#endregion

        await uploadSliderFilesAsync();
    })
    inpt_chooseFile.change(async (event) => {
        //#region get selected file
        let selectedFile = event.target.files[0];
        //#endregion

        //#region when selected file not image
        if (!selectedFile.type.startsWith("image/")) {
            return;
        }
        //#endregion

        //#region display image
        sliderFiles[currentSliderNo] = selectedFile // save selectedFile
        await displayImageAsync();
        //#endregion
    })
    btn_previous.click(async () => {
        //#region update slider no button
        currentSliderNo -= 1;
        await updateSliderNoButtonAsync();
        //#endregion

        //#region hide previous button and show next button
        if (currentSliderNo == 1)
            btn_previous.attr("hidden", "")

        btn_next.removeAttr("hidden");
        //#endregion

        //#region display image
        inpt_chooseFile.val(""); // reset choose file input
        await displayImageAsync();
        //#endregion
    })
    btn_next.click(async () => {
        //#region update slider no button
        currentSliderNo += 1;
        await updateSliderNoButtonAsync();
        //#endregion

        //#region hide next button and show previous button
        if (currentSliderNo == maxSliderQuantity)
            btn_next.attr("hidden", "")

        btn_previous.removeAttr("hidden");
        //#endregion

        //#region display image
        inpt_chooseFile.val(""); // reset choose file input
        await displayImageAsync();
        //#endregion
    })
    //#endregion

    //#region functions
    async function setSliderMaxHeightAndWidthAsync() {
        //#region set max width and height of slider
        const divWidth = $(".panel-body")[0].clientWidth - 40;  // 40: i choosed as trying
        const divHeight = $("#container")[0].clientHeight / 2;

        img_sliders.css("max-width", divWidth);
        img_sliders.css("max-height", divHeight);
        //#endregion
    }

    async function displayImageAsync() {
        //#region get current slider file
        let file = sliderFiles[currentSliderNo];

        if (file == undefined) {
            img_sliders.attr("src", noImagePath);
            return;
        }

        //#endregion

        //#region add src to <img>
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = function (event) {
            let blob = event.target.result;
            img_sliders.attr("src", blob);
        }
        //#endregion
    }

    async function updateSliderNoButtonAsync() {
        btn_sliderNo.empty();
        btn_sliderNo.append(currentSliderNo + "/" + maxSliderQuantity);
    }

    async function uploadSliderFilesAsync() {
        let sliderFileNames = {}

        for (let sliderNo in sliderFiles) {
            //#region set variables
            let sliderFile = sliderFiles[sliderNo];
            sliderFileNames[sliderNo] = sliderFile.name;
            //#endregion

            //#region read file and upload (ajax)
            let reader = new FileReader();

            reader.readAsDataURL(sliderFile);
            reader.onload = function (event) {
                //#region upload sliders (ajax)
                let dataUrl = event.target.result;

                $.ajax({
                    method: "POST",
                    url: baseApiUrl + "/file/upload",
                    headers: { "authorization": jwtToken },
                    data: JSON.stringify({
                        "fileName": sliderFile.name,
                        "contentInBase64Str": dataUrl.replace("data:image/jpeg;base64,", "")  // add only base64 part
                    }),
                    contentType: "application/json",
                    error: () => {
                        alert("File Upload Error");
                    }
                })
                //#endregion
            }
            //#endregion
        }

        //#region add sliderto local
        localStorage(
            localKeys_sliderFileNames,
            JSON.stringify(sliderFiles));
        //#endregion
    }

    async function populateSlider() {
        await setSliderMaxHeightAndWidthAsync();

        //#region populate "slider no" button
        btn_sliderNo.append(`1/${maxSliderQuantity}`);
        //#endregion

        //#region when sliderFiles isn't exists in local
        sliderFiles = localStorage.getItem(localKeys_sliderFileNames);

        if (sliderFiles == null) {
            sliderFiles = {};
            img_sliders.attr("src", noImagePath);
        }
        //#endregion

        //#region when sliderFiles is exists in local
        else {
            //#region add first slider on sliderFiles
            sliderFiles = JSON.parse(sliderFiles);

            await displayImageAsync();
            //#endregion

            //#region show next button
            if (Object.keys(sliderFiles).length > 1)
                btn_previous.removeAttr("disabled");
            //#endregion
        }
        //#endregion
    }
    //#endregion

    populateSlider();
})

