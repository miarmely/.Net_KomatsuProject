import {
    change_descriptionsTextareaAsync, click_descriptionDropdownItemAsync,
    click_descriptionsButtonAsync, populateSelectAsync,
    isFileTypeInvalidAsync, updateResultLabel, populateElementByAjaxOrLocalAsync,
    changeDescriptionsButtonColorAsync, displayFileByObjectUrlAsync,
    removeObjectUrlFromElementAsync, getBase64StrOfFileAsync,
} from "./miar_tools.js"


$(function () {
    //#region variables
    const resultLabel_id = "#p_resultLabel";
    const btn_descriptions_id = "btn_descriptions";
    const a_descriptions_class = "a_descriptions";
    const txt_descriptions_id = "txt_descriptions";
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const ul_description_id = "ul_description";
    const div_form = $("#div_form");
    const inpt_image_id = "inpt_image";
    const inpt_video_id = "inpt_video";
    const inpt_pdf_id = "inpt_pdf";
    const spn_fileStatusLabel = $("#spn_fileStatusLabel");
    const path_imageFolderAfterWwwroot = "images\\machines";
    const path_pdfFolderAfterWwwroot = "pdfs";
    const path_videoFolderAfterWwwRoot = "videos\\machines";
    const img_loading = $("#img_loading");
    const vid_machine_id = "vid_machine";
    const src_machine_id = "src_machine";
    const vid_machine = $("#" + vid_machine_id);
    const src_machine = $("#" + src_machine_id);
    let selectedImageInfos;
    let selectedPdfInfos;
    let selectedVideoInfos;
    //#endregion

    //#region events
    $("form").submit(async event => {
        //#region resets
        // reset result label
        event.preventDefault();
        $(resultLabel_id).empty();

        // display loading gif
        img_loading.removeAttr("hidden");
        //#endregion

        //#region control the descriptions whether entered (error)

        //#region when any description not entered (error)
        // get descriptions from session
        let descriptionsInSession = JSON.parse(sessionStorage
            .getItem(sessionKeys_descriptionsOnCreatePage));

        // when any description not entered
        if (descriptionsInSession == null) {
            updateResultLabel(
                resultLabel_id,
                `${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        //#region descriptions in some language not entered (error)
        // get languages in session
        let languagesInSession = JSON.parse(
            localStorage.getItem(localKeys_allLanguages))[language];

        // control description by language
        for (let index in languagesInSession) {
            //#region control the descriptions whether some languages entered (error)
            let languageInSession = languagesInSession[index];

            if (descriptionsInSession[languageInSession] == undefined  // when relevant language not entered
                || descriptionsInSession[languageInSession] == "") {  // when blank value entered
                updateResultLabel(
                    resultLabel_id,
                    `"${languageInSession}" ${errorMessagesByLanguages[language]["descriptionNotEntered"]}`,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);

                return;
            }
            //#endregion
        }
        //#endregion

        //#endregion

        $.ajax({
            method: "POST",
            url: (baseApiUrl + "/machine/create" +
                `?language=${language}` +
                `&imageFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}` +
                `&videoFolderPathAfterWwwroot=${path_videoFolderAfterWwwRoot}` +
                `&pdfFolderPathAfterWwwroot=${path_pdfFolderAfterWwwroot}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify({
                "ImageName": selectedImageInfos.name,
                "VideoName": selectedVideoInfos.name,
                "MainCategoryName": $("#slct_mainCategory").val(),
                "SubCategoryName": $("#slct_subCategory").val(),
                "Model": $("#inpt_model").val(),
                "BrandName": $("#inpt_brand").val(),
                "HandStatus": $("input[name = handStatus]:checked").val(),
                "PdfName": selectedPdfInfos.name,
                "Stock": $("#inpt_stock").val(),
                "Year": $("#inpt_year").val(),
                "Descriptions": {
                    "TR": descriptionsInSession.TR,
                    "EN": descriptionsInSession.EN
                },
                "ImageContentInBase64Str": await getBase64StrOfFileAsync(selectedImageInfos),
                "VideoContentInBase64Str": await getBase64StrOfFileAsync(selectedVideoInfos),
                "PdfContentInBase64Str": await getBase64StrOfFileAsync(selectedPdfInfos)
            }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region resets
                $("form")[0].reset();

                // remove machine video
                vid_machine.removeAttr("poster")
                src_machine.removeAttr("src type");  // multiple delete attributes                       

                // change description <button> color
                changeDescriptionsButtonColorAsync(
                    $("#" + btn_descriptions_id),
                    descriptions_unsavedColor);
                //#endregion

                //#region write successfull message to resultLabel
                updateResultLabel(
                    resultLabel_id,
                    successMessagesByLanguages[language]["saveSuccessful"],
                    resultLabel_successColor,
                    "30px",
                    img_loading);
                //#endregion

                //#region remove descriptions in session
                sessionStorage.removeItem(
                    sessionKeys_descriptionsOnCreatePage);
                //#endregion
            },
            error: (response) => {
                //#region write error message to result label
                updateResultLabel(
                    resultLabel_id,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);
                //#endregion
            }
        });
    })
    $(window).resize(async () => {
        await setMachineVideoSizeAsync();
    })
    vid_machine.on("ended", () => {
        // restart to video when video finished
        vid_machine.load();
    });
    spn_eventManager.on("click_descriptionButton", async () => {
        await click_descriptionsButtonAsync(
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    spn_eventManager.on("click_descriptionDropdownItem", async (_, clickedItem) => {
        await click_descriptionDropdownItemAsync(
            clickedItem,
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id),
            sessionKeys_descriptionsOnCreatePage);
    })
    spn_eventManager.on("change_descriptionsTextarea", async () => {
        await change_descriptionsTextareaAsync(
            $("#" + btn_descriptions_id));
    })
    spn_eventManager.on("click_input", async (_, clickedInputId) => {
        //#region reset help label of clicked <input>
        $(`#spn_help_${clickedInputId}`).empty();
        //#endregion
    })
    spn_eventManager.on("change_imageInput", async () => {
        //#region control the selected file (error)

        //#region when any file not selected
        if (selectedImageInfos == undefined) {
            await removePosterOrVideoAsync("poster");
            return;
        }
        //#endregion

        //#region when file type is not image (error)
        if (await isFileTypeInvalidAsync(
            selectedImageInfos,
            "image",
            $("#" + inpt_image_id))
        ) {
            await removePosterOrVideoAsync("poster");
            
            // write error
            updateResultLabel(
                `#spn_help_${inpt_image_id}`,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor,
                "10px");

            return;
        }
        //#endregion

        //#endregion

        await displayFileByObjectUrlAsync(
            selectedImageInfos,
            vid_machine,
            "poster",
            spn_fileStatusLabel,
            null,
            () => {
                // show video and set video sizes
                vid_machine.removeAttr("hidden");
                setMachineVideoSizeAsync();
                vid_machine.load();
            });
    })
    spn_eventManager.on("change_videoInput", async () => {
        //#region control selected file (error)

        //#region when any file not selected (return)
        if (selectedVideoInfos == undefined) {
            await removePosterOrVideoAsync("video");
            return;
        }
        //#endregion

        //#region when file type isn't video (error)
        if (await isFileTypeInvalidAsync(
            selectedVideoInfos,
            "video/",
            $('#' + inpt_video_id))
        ) {
            await removePosterOrVideoAsync("video");
           
            // write error
            updateResultLabel(
                "#spn_help_" + inpt_video_id,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor,
                "10px");

            return;
        }
        //#endregion

        //#endregion

        await displayFileByObjectUrlAsync(
            selectedVideoInfos,
            src_machine,
            "src",
            spn_fileStatusLabel,
            () => {
                // set type of video <source>
                src_machine.attr("type", selectedVideoInfos.type);
            },
            () => {
                // show video and set sizes
                vid_machine.removeAttr("hidden");
                setMachineVideoSizeAsync();
                vid_machine.load();
            }
        )
    })
    spn_eventManager.on("change_pdfInput", async () => {
        //#region when any file not selected (return)
        if (selectedPdfInfos == undefined)
            return;
        //#endregion

        //#region when file type is not "pdf" (error)
        if (await isFileTypeInvalidAsync(
            selectedPdfInfos,
            "application/pdf",
            $("#" + inpt_pdf_id))) {
            // write error
            updateResultLabel(
                `#spn_help_${inpt_pdf_id}`,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor,
                "10px",
                img_loading);

            // reset pdf <input>
            $("#" + inpt_pdf_id).val("");
            return;
        }
        //#endregion
    })
    //#endregion

    //#region functions
    async function removePosterOrVideoAsync(which) {
        //#region remove video or poster on video
        switch (which) {
            case "poster":
                await removeObjectUrlFromElementAsync(
                    vid_machine,
                    "poster",
                    () => {
                        // when video isn't exists too
                        if (src_machine.attr("src") == undefined)
                            vid_machine.attr("hidden", "");  // hide <video>

                        vid_machine.load();
                    });
                break;
            case "video":
                await removeObjectUrlFromElementAsync(
                    src_machine,
                    "src",
                    () => {
                        // when image isn't exists
                        if (vid_machine.attr("poster") == undefined)
                            vid_machine.attr("hidden", "");  // hide <video>

                        vid_machine.load();
                    });
                break;
        }
        //#endregion
    }

    async function setMachineVideoSizeAsync() {
        //#region set width and height
        let panelBodyWidth = $(".panel-body").prop("clientWidth");

        vid_machine.css(
            "width",
            panelBodyWidth - (panelBodyWidth * (60 / 100)));
        //#endregion
    }

    async function populateFormAsync() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add image
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label" style="text-align">
                    ${formLabelNamesByLanguages[language].image}
                </label>
                <div class="col-sm-6">
                <div>
                    <input id="${inpt_image_id}"  type="file"  class="form-control"  accept="image/*"  required>
                    <span id="spn_help_${inpt_image_id}" class="help-block"></span>
                </div>
            </div>`
        );

        // declare events
        $("#" + inpt_image_id).change((event) => {
            // save selected file infos
            selectedImageInfos = event.target.files[0];

            spn_eventManager.trigger("change_imageInput");
        });
        //#endregion

        //#region add video
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label" style="text-align">${formLabelNamesByLanguages[language].video}</label>
                <div class="col-sm-6">
                <div>
                    <input  id= "${inpt_video_id}" 
                            type= "file"  
                            class= "form-control"  
                            accept= "video/*"  
                            required />
                    <span id="spn_help_${inpt_video_id}" class="help-block"></span>
                </div>
            </div>`
        );

        // declare events
        $('#' + inpt_video_id).change((event) => {
            // save selected file infos
            selectedVideoInfos = event.target.files[0];

            spn_eventManager.trigger("change_videoInput");
        })
        //#endregion

        //#region add mainCategory and subcategory

        //#region add mainCategory label and <select>
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].mainCategory}
                </label>
                <div class="col-sm-6">
                    <select id="${slct_mainCategory_id}" class="form-control m-bot15">
                    </select>
                    <span id="spn_help_${slct_mainCategory_id}" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add subCategory label and <select>
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].subCategory}
                </label>
                <div class="col-sm-6">
                    <select id="${slct_subCategory_id}" class="form-control m-bot15">
                    </select>
                    <span id="spn_help_${slct_subCategory_id}" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region populate mainCategory and subCategory <select>'s
        await populateElementByAjaxOrLocalAsync(
            localKeys_allMainCategories,
            `/machine/display/mainCategory?language=${language}`,
            async (data) => {
                //#region populate mainCategory <select>
                populateSelectAsync(
                    $("#" + slct_mainCategory_id),
                    data
                )
                //#endregion

                //#region !!!!!!!!!!!!!!! disable mainCategoryNames !!!!!!!!!!!!!!! (TEMPORARY)
                for (let index = 2; index <= data.length; index += 1) {
                    let option = $("#" + slct_mainCategory_id)
                        .children(`option:nth-child(${index})`)

                    option.attr("disabled", "")
                    option.attr("style", "color:darkgrey")
                }
                //#endregion
            },
            () => {
                //#region populate subCategory <select> after mainCategory populated
                let selectedMainCategory = $("#" + slct_mainCategory_id).val();

                populateElementByAjaxOrLocalAsync(
                    localKeys_allSubCategories,
                    `/machine/display/subCategory?language=${language}&mainCategoryName=${selectedMainCategory}`,
                    (data) => {
                        populateSelectAsync(
                            $("#" + slct_subCategory_id),
                            data
                        );
                    }
                );
                //#endregion
            }
        );
        //#endregion

        //#endregion

        //#region add model
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].model}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_model" type="text" class="form-control" required>
                    <span id="spn_help_inpt_model" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add brand
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].brand}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_brand" type="text" class="form-control" required>
                    <span id="spn_help_inpt_brand" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add year
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].year}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_year" type="number" class="form-control" min=1900 max=2099 required>
                    <span id="spn_help_inpt_year" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add stock
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].stock}
                </label>
                <div class="col-sm-6">
                    <input id="inpt_stock" type="number" class="form-control" min=1 max=5000 required>
                    <span id="spn_help_inpt_stock" class="help-block"></span>
                </div>
            </div>`
        );
        //#endregion

        //#region add handStatus
        let handStatus = formLabelNamesByLanguages[language].handStatus;

        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${handStatus.label}
                </label>
                <div class="col-sm-6">
                    <div class="radio">
                        <label style="margin-right:10px">
                            <input type="radio" name="handStatus" value="${handStatus.radio1}"  checked="">
                                ${handStatus.radio1}
                        </label>
                        <label>
                            <input type="radio" name="handStatus" value="${handStatus.radio2}">
                                ${handStatus.radio2}
                        </label>
                    </div>
                </div>
            </div>`
        );
        //#endregion

        //#region add pdf
        div_form.append(
            `<div class="form-group">
                <label class="col-sm-3 control-label">
                    ${formLabelNamesByLanguages[language].pdf}
                </label>
                <div class="col-sm-6">
                    <input id="${inpt_pdf_id}" type="file" class="form-control" accept="application/pdf" required>
                    <span id="spn_help_${inpt_pdf_id}" class="help-block"></span>
                </div>
            </div>`
        );

        // declare events
        $("#" + inpt_pdf_id).change(async (event) => {
            // save file infos
            selectedPdfInfos = event.target.files[0];

            spn_eventManager.trigger("change_pdfInput");
        });
        //#endregion

        //#region add descriptions

        //#region add descriptions <div>
        div_form.append(
            `<div class="form-horizontal bucket-form">
                <div class="form-group">
                    <label class="col-sm-3 control-label">
                        <div class="input-group m-bot15">
                            <div class="input-group-btn">
                                <button id="${btn_descriptions_id}" style="background-color:darkblue; color:red" tabindex="-1" class="btn btn-info" type="button">
                                    <b>${description_baseButtonNameByLanguages[language]} (${language})</b>
                                </button>
                                <button tabindex="-1" style="background-color: darkblue;" data-toggle="dropdown" class="btn btn-info dropdown-toggle" type="button">
                                    <span class="caret"></span>
                                </button>
                                <ul id="${ul_description_id}"  role="menu" class="dropdown-menu pull-right" style="text-align:center">
                                </ul>
                            </div>
                        </div>
                    </label>
                    <div class="col-sm-6">
                        <textarea id="${txt_descriptions_id}"  style="resize:none"  type="text"  class="form-control"  rows="10"  required></textarea>
                    </div>
                </div>
            </div`
        );
        //#endregion

        //#region populate descriptions <ul> and declare events
        populateElementByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            (data) => {
                //#region add languages as <li>
                for (let index in data) {
                    let languageInData = data[index];

                    $("#" + ul_description_id).append(
                        `<li>
                            <a class="${a_descriptions_class}" href="#">${languageInData}</a>
                        </li>`
                    );
                }
                //#endregion

                //#region declare events
                $("#" + btn_descriptions_id).click(() =>
                    spn_eventManager.trigger("click_descriptionButton")
                );
                $("." + a_descriptions_class).click((event) => {
                    // for prevent coming to head of web page when clicked to <a>
                    event.preventDefault();

                    // trigger click event
                    spn_eventManager.trigger(
                        "click_descriptionDropdownItem",
                        [$(":focus")])
                });
                $("#" + txt_descriptions_id).on("input", () =>
                    spn_eventManager.trigger("change_descriptionsTextarea")
                );
                //#endregion
            }
        )
        //#endregion

        //#region add default value to descriptions <text>
        let descriptionsInSession = JSON.parse(sessionStorage
            .getItem(sessionKeys_descriptionsOnCreatePage));

        // when description in page language exists on session
        if (descriptionsInSession != null)
            $("#" + txt_descriptions_id).val(
                descriptionsInSession[language]);
        //#endregion

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
        );
        //#endregion

        //#region declare events
        $("input").click((event) =>
            spn_eventManager.trigger("click_input", [event.target.id])
        )
        //#endregion
    }
    //#endregion

    populateFormAsync();
})