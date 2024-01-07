import {
    click_descriptionsButtonAsync, click_descriptionDropdownItemAsync,
    updateResultLabel, updateErrorRow, setDisabledOfOtherUpdateButtonsAsync,
    resetErrorRowAsync, populateElementByAjaxOrLocalAsync, setDescriptionsLanguageAsync,
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync,
    displayFileByDataUrlAsync, change_descriptionsTextareaAsync,
    isFileTypeInvalidAsync, isAllObjectValuesNullAsync
} from "./miar_tools.js";

import {
    addArticlesAsync, alignArticlesToCenterAsync, art_baseId, click_playImageAsync, div_article_info_id,
    div_article_video_id, ended_articleVideoAsync, mouseout_articleVideoDivAsync, mouseover_articleVideoAsync,
    setVariablesForArticle
} from "./miar_article.js"
import { populateFormAsync, setMachineVideoSizeAsync } from "./miar_machine_inputForm.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 15;
    const paginationButtonQuantity = 5;
    const nameOfPaginationHeader = "Machine-Pagination";
    const errorMessageColor = "rgb(255, 75, 75)";
    const th_descriptions_id = "th_descriptions";
    const table_body = $("#tbl_machine tbody");
    const ul_pagination = $("#ul_pagination");
    const entityQuantity_id = "#small_entityQuantity";
    const entityQuantity_color = "#7A7A7A";
    const path_machineImages = "images/machines";
    const path_machineVideos = "videos/machines";
    const path_pdfs = "pdfs";
    const columnNames = Object.keys(columnNamesByLanguages[language]);
    const img_imageButton_id = "img_imageButton";
    const spn_pdfButton_pdfName_id = "spn_pdfButton_pdfName";
    const div_articles_panel = $("#div_articles_panel");
    const div_articles = $("#div_articles");
    const div_articleDetails = $("#div_articleDetails");
    let paginationInfos = {};
    let machineCountOnPage;
    //#endregion

    //#region events
    $(window).resize(async () => {
        //#region when machine details page is open
        if (div_articleDetails.attr("hidden") == undefined)
            await setMachineVideoSizeAsync();
        //#endregion

        //#region when machine articles page is open
        else
            setTimeout(async () =>
                await alignArticlesToCenterAsync(),
                400);
        //#endregion
    });
    $("#div_sidebarMenuButton").click(async () => {
        // wait 0.3sn until sidebar closed
        setTimeout(async () =>
            await alignArticlesToCenterAsync(),
            450);
    });
    $("#box_all").click(async () => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        await new Promise(resolve => {
            for (let rowNo = 1; rowNo <= machineCountOnPage; rowNo += 1) {
                var checkBoxInRow = $(`#tr_row${rowNo} #td_checkbox input`);

                //#region do checked of checkbox
                if (isBoxAllChecked
                    && !checkBoxInRow.is(":checked")) // if not checked
                    checkBoxInRow.prop("checked", true);
                //#endregion

                //#region do unchecked of checkbox
                else if (!isBoxAllChecked
                    && checkBoxInRow.is(":checked")) // if checked
                    checkBoxInRow.prop("checked", false);
                //#endregion
            }

            resolve();
        })
        //#endregion
    })
    $("#btn_apply").click(async () => {
        let slct_tableMenubar = $("#slct_tableMenubar");

        switch (slct_tableMenubar.val()) {
            //#region delete selected values
            case "0":
                await deleteSelectedMachinesAsync();
                break;
            //#endregion 
        }
    })
    ul_pagination.click(async () => {
        //#region do unchecked "box_all"
        if ($("#box_all").is(":checked"))
            $("#box_all").prop("checked", false);
        //#endregion

        //#region click control of pagination buttons
        let clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (paginationInfos.HasPrevious)
                    await addMachineArticlesAsync(
                        paginationInfos.CurrentPageNo - 1,
                        pageSize,
                        true);

                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfos.HasNext)
                    await addMachineArticlesAsync(
                        paginationInfos.CurrentPageNo + 1,
                        pageSize,
                        true);

                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                //#region populate table
                let pageNo = clickedButton.prop("innerText");

                await addMachineArticlesAsync(
                    pageNo,
                    pageSize,
                    true);
                //#endregion

                break;
            //#endregion
        }
        //#endregion 
    })
    spn_eventManager.on("click_saveButton", async () => {
        //#region set variables
        let row = $(":focus").closest("tr");
        let rowId = row.attr("id");
        let machineId = row.attr("class");
        let oldColumnValues = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        //#region set data
        let data = {
            "imageName": null,
            "mainCategoryName": null,
            "subCategoryName": null,
            "model": null,
            "brandName": null,
            "handStatus": null,
            "pdfName": null,
            "stock": null,
            "rented": null,
            "sold": null,
            "year": null,
            "descriptions": null,
            "imageContentInBase64Str": null,
            "pdfContentInBase64Str": null,
            "imageFolderPathAfterWwwroot": null,
            "pdfFolderPathAfterWwwroot": null,
            "oldImageName": null,
            "oldPdfName": null,
        }

        //#region add values on column to data
        for (let index in columnNames) {
            //#region check columns whether changed
            let columnName = columnNames[index];
            let td = row.children(`#td_${columnName}`);

            switch (columnName) {
                case "image":
                    //#region add image name to data if changed
                    let imageNameOnButton = $("#" + img_imageButton_id)
                        .attr("alt");

                    // if image name changed
                    if (imageNameOnButton != oldColumnValues[columnName]) {
                        // save image infos
                        data["imageName"] = imageNameOnButton;
                        data["imageFolderPathAfterWwwroot"] = path_machineImages;
                        data["oldImageName"] = oldColumnValues[columnName];

                        // save image content in base64 string
                        data["imageContentInBase64Str"] = row
                            .children("#td_image")
                            .find("img")
                            .attr("src")
                            .replace(`data:${selectedImageInfos.type};base64,`, "");
                    }

                    //#endregion
                    break;
                case "mainCategory":
                    //#region add main category to data if changed
                    let mainCategory = td
                        .children("select")
                        .val();

                    // if main category changed
                    if (mainCategory != oldColumnValues[columnName])
                        data["mainCategoryName"] = mainCategory;
                    //#endregion
                    break;
                case "subCategory":
                    //#region add subcategory to data if changed
                    let subCategory = td
                        .children("select")
                        .val();

                    // if subcategory changed
                    if (subCategory != oldColumnValues[columnName])
                        data["subCategoryName"] = subCategory;
                    //#endregion
                    break;
                case "model":
                    //#region add model to data if changed
                    let model = td
                        .children("input")
                        .val();

                    // if model changed
                    if (model != oldColumnValues[columnName])
                        data["model"] = model;
                    //#endregion
                    break;
                case "brand":
                    //#region add brand to data if changed
                    let brand = td
                        .children("input")
                        .val();

                    // if brand changed
                    if (brand != oldColumnValues[columnName])
                        data["brandName"] = brand;
                    //#endregion
                    break;
                case "handStatus":
                    //#region add hand Status to data if changed
                    let handStatus = td
                        .children("select")
                        .val();

                    // if hand status changed
                    if (handStatus != oldColumnValues[columnName])
                        data["handStatus"] = handStatus;
                    //#endregion
                    break;
                case "stock":
                    //#region add stock to data if changed
                    let stock = td
                        .children("input")
                        .val();

                    // if model changed
                    if (stock != oldColumnValues[columnName])
                        data["stock"] = stock;
                    //#endregion
                    break;
                case "rented":
                    //#region add rented to data if changed
                    let rented = td
                        .children("input")
                        .val();

                    // if rented changed
                    if (rented != oldColumnValues[columnName])
                        data["rented"] = rented;
                    //#endregion
                    break;
                case "sold":
                    //#region add sold to data if changed
                    let sold = td
                        .children("input")
                        .val();

                    // if sold changed
                    if (sold != oldColumnValues[columnName])
                        data["sold"] = sold;
                    //#endregion
                    break;
                case "year":
                    //#region add year to data if changed
                    let year = td
                        .children("input")
                        .val();

                    // if year changed
                    if (year != oldColumnValues[columnName])
                        data["year"] = year;
                    //#endregion
                    break;
                case "pdf":
                    //#region add pdf name to data if changed
                    let pdfNameOnButton = $("#" + spn_pdfButton_pdfName_id)
                        .text();

                    // if pdf name changed
                    if (pdfNameOnButton != oldColumnValues[columnName]) {
                        data["pdfName"] = pdfNameOnButton;
                        data["pdfFolderPathAfterWwwroot"] = path_pdfs;
                        data["oldPdfName"] = oldColumnValues[columnName];
                    }
                    //#endregion
                    break;
                case "descriptions":
                    //#region get new descriptions in session
                    let newDescriptionsInSession = JSON.parse(sessionStorage
                        .getItem(sessionKeys_descriptionsOnDisplayPage));
                    //#endregion

                    //#region when description in any language changed
                    if (newDescriptionsInSession["TR"] != oldColumnValues[columnName]["TR"]
                        || newDescriptionsInSession["EN"] != oldColumnValues[columnName]["EN"]) {
                        //#region when "TR" description changed
                        data[columnName] = {};

                        if (newDescriptionsInSession["TR"] != oldColumnValues[columnName]["TR"])
                            data[columnName]["TR"] = newDescriptionsInSession["TR"];
                        //#endregion

                        //#region when "EN" description changed
                        if (newDescriptionsInSession["EN"] != oldColumnValues[columnName]["EN"])
                            data[columnName]["EN"] = newDescriptionsInSession["EN"];
                        //#endregion
                    }
                    //#endregion

                    break;
            }
            //#endregion
        }
        //#endregion

        //#region when any changes wasn't do (error)
        if (await isAllObjectValuesNullAsync(data)) {
            // write error to error row
            updateErrorRow(
                `#${rowId}_error`,
                partnerErrorMessagesByLanguages[language]["nullArguments"],
                resultLabel_errorColor);

            return;
        }
        //#endregion

        //#endregion

        //#region set url
        let url = baseApiUrl + "/machine/update?" +
            `language=${language}` +
            `&id=${machineId}` +
            `&oldMainCategoryName=${oldColumnValues.mainCategory}` +
            `&oldSubCategoryName=${oldColumnValues.subCategory}`
        //#endregion

        //#region update machine

        //#region when pdf changed
        if (data["pdfName"] != null) {
            let fileReader = new FileReader();

            fileReader.readAsDataURL(selectedPdfInfos)
            fileReader.onloadend = async function (event) {
                //#region when reading successfuly
                if (fileReader.readyState == fileReader.DONE) {
                    //#region save pdf content in base64 string to data
                    let dataUrl = event.target.result;

                    data["pdfContentInBase64Str"] = dataUrl
                        .replace(`data:${selectedPdfInfos.type};base64,`, "");
                    //#endregion

                    await updateMachineAsync(url, data, rowId, oldColumnValues);
                }
                //#endregion
            }
        }
        //#endregion

        //#region when pdf not changed
        else
            await updateMachineAsync(url, data, rowId, oldColumnValues);
        //#endregion

        //#endregion
    })
    //#endregion

    //#region functions
    async function updateMachineAsync(url, data, rowId, oldColumnValues) {
        let propertyNamesAndColumnNamesGuide = {
            "imageName": "image",
            "mainCategoryName": "mainCategory",
            "subCategoryName": "subCategory",
            "model": "model",
            "brandName": "brand",
            "handStatus": "handStatus",
            "pdfName": "pdf",
            "stock": "stock",
            "rented": "rented",
            "sold": "sold",
            "year": "year",
            "descriptions": "descriptions"
        };

        $.ajax({
            method: "PUT",
            url: url,
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region update "oldColumnValues" with new column values
                for (let propertyName in data) {
                    let propertyValue = data[propertyName];

                    // when column changed
                    if (propertyValue != null) {
                        //#region when "descriptions" column
                        if (propertyValue == "descriptions") {
                            //#region when "TR" description changed
                            if (newColumnValue["TR"] != undefined)
                                oldColumnValues[propertyValue]["TR"] = newColumnValue["TR"]
                            //#endregion

                            //#region when "EN" description changed
                            if (newColumnValue["EN"] != undefined)
                                oldColumnValues[propertyValue]["EN"] = newColumnValue["EN"]
                            //#endregion
                        }
                        //#endregion

                        //#region for other columns
                        else {
                            //#region when property name matched a column
                            let columnName = propertyNamesAndColumnNamesGuide[propertyName];

                            if (columnName != undefined)
                                oldColumnValues[columnName] = propertyValue;
                            //#endregion
                        }
                        //#endregion
                    }
                }
                //#endregion

                //#region save updated "oldColumnValues" to session
                sessionStorage.setItem(
                    rowId,
                    JSON.stringify(oldColumnValues));
                //#endregion

                spn_eventManager.trigger("click_cancelButton", [$("#" + rowId)]);
            },
            error: (response) => {
                //#region write error to error row
                updateErrorRow(
                    `#${rowId}_error`,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            }
        })
    }

    async function removeDescriptionButtonOnColumnAsync() {
        //#region remove descriptions button
        let th_descriptions = $("#" + th_descriptions_id);

        th_descriptions.empty();
        th_descriptions.append(
            description_baseButtonNameByLanguages[language]);
        //#endregion
    }

    async function deleteSelectedMachinesAsync() {
        //#region set data
        let machineInfos = [];

        //#region populate "machineInfos" array
        for (let rowNo = 1; rowNo <= machineCountOnPage; rowNo += 1) {
            //#region set variables
            let checkBox = $(`#tr_row${rowNo} #td_checkbox input`);
            let row = $(`#tr_row${rowNo}`);
            //#endregion

            //#region add machine infos to "machineInfos" if checked
            if (checkBox.is(":checked")) {
                //#region when update process continuing
                if (row.children("td>input").length != 0)  // when any <input> exists
                    await clicked_cancelButtonAsync(rowNo);  // cancel update process
                //#endregion

                //#region get machine id, image name and pdf name
                let machineId = row.attr("class");

                let imageName = row.children("#td_image")
                    .children("img")
                    .attr("alt");

                let pdfName = row.children("#td_pdf")
                    .children("a")
                    .attr("title");
                //#endregion

                //#region populate "machineInfos"
                machineInfos.push({
                    "MachineId": machineId,
                    "ImageName": imageName,
                    "PdfName": pdfName,
                });
                //#endregion
            }
            //#endregion
        }
        //#endregion

        //#region when any machine not select
        if (machineInfos.length == 0)
            return;
        //#endregion

        //#endregion

        $.ajax({
            method: "DELETE",
            url: (baseApiUrl + "/machine/delete" +
                `?language=${language}` +
                `&imageFolderPathAfterWwwroot=${path_machineImages}` +
                `&pdfFolderPathAfterWwwroot=${path_pdfs}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(machineInfos),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region when all machines on page deleted
                let currentPageNo = paginationInfos.CurrentPageNo;

                if (machineInfos.length == paginationInfos.CurrentPageCount) {
                    //#region when next page exists
                    if (paginationInfos.HasNext)
                        addMachineArticlesAsync(currentPageNo, pageSize, true);  // refresh current page
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfos.HasPrevious)
                        addMachineArticlesAsync(currentPageNo - 1, pageSize, true);
                    //#endregion

                    //#region when any machines not found
                    else {
                        table_body.empty();

                        updateResultLabel(
                            entityQuantity_id,
                            `<b>0/${pageSize}<b> ${entityQuantity_message}`,
                            errorMessageColor);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    addMachineArticlesAsync(currentPageNo, pageSize, true);  // refresh current page
                //#endregion

                //#region do unchecked "box_all"
                $("#box_all").prop("checked", false);
                //#endregion

                removeDescriptionButtonOnColumnAsync();
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    entityQuantity_id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor
                );
                //#endregion
            }
        });
    }

    async function populateArticlesAsync(response) {
        //#region add machines to articles
        let articleInfos = {};
        for (let index in response) {
            //#region add machines

            //#region save machine infos
            let machineInfos = response[index];
            let articleId = art_baseId + index;

            articleInfos[articleId] = {
                "machineId": machineInfos.id,
                "videoName": machineInfos.videoName
            };
            //#endregion

            //#region add machine image
            let art_machine = $('#' + articleId);

            art_machine
                .find("video")
                .attr("poster", "/" + path_machineImages + "/" + machineInfos.imageName);
            //#endregion

            //#region add machine infos 
            let div_article_info = art_machine
                .children("#" + div_article_info_id);

            div_article_info.append(`
                <div>
                    <h2 style="margin-bottom: 5px">${machineInfos.model}</h2>
                    <h3 style="margin-bottom: 3px">${machineInfos.mainCategoryName}</h3>
                    <h4 style="margin-bottom: 20px">${machineInfos.subCategoryName}</h4>
                    <h5>${machineInfos.descriptions[language].substring(0, 200)}...</h5>
                </div>
            `);
            //#endregion

            //#endregion

            //#region save descriptions of machine to session
            sessionStorage.setItem(
                articleId,
                JSON.stringify({
                    "descriptions": machineInfos.descriptions
                }));
            //#endregion

            //#region declare events
            let article = $("#" + articleId);

            article.find("video").mouseover(async (event) =>
                await mouseover_articleVideoAsync(event, article)
            );
            article.find("#" + div_article_video_id).mouseout(async (event) =>
                await mouseout_articleVideoDivAsync(event, article)
            );
            //#endregion
        }
        //#endregion

        //#region declare articles page events
        $(".img_play").click(async (event) => {
            //#region get article id of clicked play <img>
            let articleId = event.target
                .closest("article")
                .id;
            //#endregion

            await click_playImageAsync($("#" + articleId));
        });
        $(".article video").on("ended", async () =>
            await ended_articleVideoAsync());
        $(".article #" + div_article_info_id).click(async () => {
            // hide machine articles panel
            div_articles_panel.attr("hidden", "");
            div_articleDetails.removeAttr("hidden");

            await populateFormAsync(false);
        })
        //#endregion

        setVariablesForArticle({
            "articleInfos": articleInfos
        });
    }

    async function addMachineArticlesAsync(pageNumber, pageSize, refreshPaginationButtons) {
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/machine/display/all" +
                `?language=${language}` +
                `&pageNumber=${pageNumber}` +
                `&pageSize=${pageSize}`),
            headers: { "Authorization": jwtToken },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                // reset machine articles
                div_articles.empty();
            },
            success: (response, status, xhr) => {
                setVariablesForArticle({
                    "div_articles": div_articles,
                    "path_articleVideos": path_machineVideos,
                    "articleCount": response.length
                });
                addArticlesAsync("videoAndText", div_articles, response.length)
                    .then(async () => {
                        await populateArticlesAsync(response);

                        //#region get pagination infos from headers
                        paginationInfos = JSON.parse(
                            xhr.getResponseHeader(nameOfPaginationHeader));
                        //#endregion

                        //#region update entity count label
                        if (response.length != 0) {  // if any machine exists
                            machineCountOnPage = paginationInfos.CurrentPageCount;

                            updateResultLabel(
                                entityQuantity_id,
                                `<b>${machineCountOnPage}/${pageSize}</b> ${entityQuantity_messageByLanguages[language]}`,
                                entityQuantity_color
                            )
                        }
                        //#endregion

                        //#region add pagination buttons
                        if (refreshPaginationButtons)
                            addPaginationButtonsAsync(
                                paginationInfos,
                                paginationButtonQuantity,
                                ul_pagination);
                        //#endregion

                        await controlPaginationBackAndNextButtonsAsync(paginationInfos);
                    });
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    entityQuantity_id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            },
        });
    }

    async function populateHtmlAsync() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add table menubars
        let tableMenubarOptions = tableMenubar_optionsByLanguages[language];

        for (let index = 0; index < tableMenubarOptions.length; index += 1) {
            let tableMenubarOption = tableMenubarOptions[index];

            $("#slct_tableMenubar").append(`
                <option value="${index}">${tableMenubarOption}</option>
            `);
        }
        //#endregion

        //#region add apply button name
        $("#btn_apply").append(
            tableMenubar_applyButtonName[language])
        //#endregion

        //#region add entity quantity message
        $(entityQuantity_id).append(
            `<b>0</b> ${entityQuantity_messageByLanguages[language]}`
        );
        //#endregion

        await addMachineArticlesAsync(pageNumber, pageSize, true);
    }
    //#endregion

    populateHtmlAsync();
})

//spn_eventManager.on("click_updateButton", async (_, row) => {
//    //#region add <input>, <select> and <button> to columns
//    let oldColumnValues = {};

//    for (let index in columnNames) {
//        let columnName = columnNames[index];
//        let td = row.children(`#td_${columnName}`);

//        switch (columnName) {
//            case "image":
//                //#region add machine image <button>
//                // save old value
//                oldColumnValues[columnName] = td
//                    .children("img")
//                    .attr("alt");

//                // add <button>
//                td.empty();
//                td.append(
//                    `<button id="${btn_image_id}" type="button">
//                            <img id="${img_imageButton_id}"  src="/${path_machineImages}/${oldColumnValues[columnName]}"  alt="${oldColumnValues[columnName]}"  style="max-width: ${machineImage_maxWidth}px; max-height: ${machineImage_maxHeight - 70}px">
//                            <div>
//                                <span id="${spn_imageButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${machineImageButtonNameByLanguages[language]}</span>
//                            </div>
//                         </button>
//                         <div hidden>
//                            <input id="${inpt_chooseImage_id}"  type="file"  accept="image/*"/>
//                         </div>`);
//                //#endregion

//                //#region add events
//                $("#" + btn_image_id).click(() =>
//                    spn_eventManager.trigger("click_imageButton", [row])
//                );
//                $("#" + inpt_chooseImage_id).change((event) => {
//                    //#region trigger the "change_chooseFileInput_image" event
//                    let selectedFileInfos = event.target.files[0];

//                    spn_eventManager.trigger(
//                        "change_chooseFileInput_image",
//                        [row.attr("id"), selectedFileInfos]);
//                    //#endregion
//                });
//                //#endregion

//                break;
//            case "mainCategory":
//                //#region add main category <select>
//                // save old value
//                oldColumnValues[columnName] = td.text();

//                // add <select>
//                td.empty();
//                td.append(
//                    `<select id="slct_${columnName}">
//                        </select`);

//                // populate <select>
//                await populateElementByAjaxOrLocalAsync(
//                    localKeys_allMainCategories,
//                    `/machine/display/mainCategory?language=${language}`,
//                    (mainCategoryNames) => {
//                        //#region add main category names to <select>
//                        let slct_mainCategory = $("#" + slct_mainCategory_id);

//                        for (let index in mainCategoryNames) {
//                            let mainCategoryName = mainCategoryNames[index];

//                            //#region !!!!!!!!!!! disable some maincategory names (TEMPOARARY) !!!!!!!!!!!!!!!!!!
//                            if (mainCategoryName != "Work Machines"
//                                && mainCategoryName != "İş Makineleri") {
//                                slct_mainCategory.append(
//                                    `<option style="color: darkgrey"  disabled >${mainCategoryName}</option>`
//                                );
//                            }
//                            //#endregion !!!!!!!!!!!!!!!!!!!!!!!!!!

//                            else
//                                slct_mainCategory.append(
//                                    `<option>${mainCategoryName}</option>`
//                                );
//                        }
//                        //#endregion

//                        //#region display default main category
//                        slct_mainCategory.val(
//                            oldColumnValues[columnName]);
//                        //#endregion
//                    }
//                )
//                //#endregion
//                break;
//            case "subCategory":
//                //#region add sub category <select>
//                // save old value
//                oldColumnValues[columnName] = td.text();

//                // add <select>
//                td.empty();
//                td.append(
//                    `<select id="slct_${columnName}">
//                        </select`);

//                // populate <select>
//                await populateElementByAjaxOrLocalAsync(
//                    localKeys_allSubCategories,
//                    `/machine/display/subCategory?language=${language}&mainCategoryName=${oldColumnValues["mainCategory"]}`,
//                    (subCategoryNames) => {
//                        //#region add sub category names to <select>
//                        let slct_subCategory = $("#" + slct_subCategory_id);

//                        for (let index in subCategoryNames) {
//                            let subCategoryName = subCategoryNames[index];

//                            slct_subCategory.append(
//                                `<option>${subCategoryName}</option>`
//                            )
//                        }
//                        //#endregion

//                        //#region display default subcategory
//                        slct_subCategory.val(
//                            oldColumnValues[columnName]);
//                        //#endregion
//                    }
//                )
//                //#endregion
//                break;
//            case "model":
//                //#region add model <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type="text"
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "brand":
//                //#region add brand <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type="text" 
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "handStatus":
//                //#region add handStatus <select>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <select>
//                td.empty();
//                td.append(
//                    `<select id="slct_${columnName}">
//                         </select>`);

//                // populate <select>
//                await populateElementByAjaxOrLocalAsync(
//                    localKeys_handStatuses,
//                    `/machine/display/handStatus?language=${language}`,
//                    (handStatuses) => {
//                        //#region add hand statuses to <select>
//                        let slct_handStatus = $("#" + slct_handStatus_id);

//                        for (let index in handStatuses) {
//                            let handStatus = handStatuses[index];

//                            slct_handStatus.append(
//                                `<option>${handStatus}</option>`
//                            );
//                        }
//                        //#endregion

//                        //#region display default hand status
//                        slct_handStatus.val(
//                            oldColumnValues[columnName]);
//                        //#endregion
//                    }
//                )
//                //#endregion
//                break;
//            case "stock":
//                //#region add stock <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type= "number"
//                                min= 1
//                                max= 5000
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "rented":
//                //#region add rented <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type="number" 
//                                min= 1
//                                max= 5000
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "sold":
//                //#region add sold <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type= "number" 
//                                min= 1
//                                max= 5000
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "year":
//                //#region add year <input>
//                // save old value
//                oldColumnValues[columnName] = td.text()

//                // add <input>
//                td.empty();
//                td.append(
//                    `<input id="inpt_${columnName}" 
//                                type="number" 
//                                min=1900
//                                max=2099
//                                value= ${oldColumnValues[columnName]}>`);
//                //#endregion
//                break;
//            case "descriptions":
//                //#region save descriptions to different place in session
//                let rowInfosInSession = JSON.parse(sessionStorage
//                    .getItem(row.attr("id")));

//                // add descriptions to object
//                let descriptionByLanguages = rowInfosInSession[columnName];

//                // save descriptions to session
//                sessionStorage.setItem(
//                    sessionKeys_descriptionsOnDisplayPage,
//                    JSON.stringify(descriptionByLanguages));
//                //#endregion

//                //#region add description <textarea>        
//                // save old value by language
//                oldColumnValues[columnName] = descriptionByLanguages;

//                // add <textarea>
//                td.empty();
//                td.append(
//                    `<textarea id="${txt_descriptions_id}"  style="${style_descriptionsTextarea}">${oldColumnValues[columnName][language]}</textarea>`);
//                //#endregion

//                //#region add description dropdown

//                //#region create dropdown
//                let th_descriptions = $("#" + th_descriptions_id);

//                th_descriptions.empty();
//                th_descriptions.append(
//                    `<div class="btn-group">
//                            <button id= "${btn_descriptions_id}"  type="button"  style= "background-color: darkblue;  color: red"  class= "btn btn-danger"> <b>${description_baseButtonNameByLanguages[language]} (${language})</b></button>
//                            <button value="${language}"  type="button"  style="background-color: darkblue"  class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span> </button>
//                            <div class="dropdown-menu">
//                                <div class="col-xs-1" style="padding:0px">
//                                    <ul id="${ul_descriptions_id}" style="list-style-type:none">
//                                    </ul>
//                                </div>
//                            </div>
//                        </div>`
//                );
//                //#endregion

//                //#region add languages to description dropdown
//                await populateElementByAjaxOrLocalAsync(
//                    localKeys_allLanguages,
//                    "/machine/display/language",
//                    (languages) => {
//                        //#region populate dropdown
//                        for (let index in languages) {
//                            //#region add languages
//                            let languageInDb = languages[index];

//                            $("#" + ul_descriptions_id).append(
//                                `<li class="dropdown-item">
//                                        <a href="#"  class="${a_descriptionsDropdown_class}"  style="padding: 3px 75px;  color: black">${languageInDb}</a>
//                                    </li>`
//                            );
//                            //#endregion
//                        }
//                        //#endregion
//                    }
//                )
//                //#endregion

//                //#endregion

//                //#region declare events
//                $("#" + btn_descriptions_id).click(() =>
//                    spn_eventManager.trigger("click_descriptionsButton")
//                );
//                $("." + a_descriptionsDropdown_class).click((event) => {
//                    // for prevent coming to head of web page when clicked to <a>
//                    event.preventDefault();

//                    // trigger event
//                    spn_eventManager.trigger("click_descriptionsDropdownItem")
//                });
//                $("#" + txt_descriptions_id).on("input", () =>
//                    spn_eventManager.trigger("change_descriptionsTextarea")
//                );
//                //#endregion

//                break;
//            case "pdf":
//                //#region add pdf <button>
//                // save old value
//                oldColumnValues[columnName] = td
//                    .children("a")
//                    .attr("title");

//                // add <button>
//                td.empty();
//                td.append(
//                    `<button id="${btn_pdf_id}"  type="button"  title="${pdfButtonNameByLanguages[language]}">
//                            <div>
//                                <img id="${img_pdfButton_id}"  src="/images/pdf.png"  alt="pdf.png"  style="max-width=50px;  max-height:50px">
//                                <i>(<span id="${spn_pdfButton_pdfName_id}" style="font-size:${style_fontSize_pdfButton_pdfName}">${oldColumnValues[columnName]}</span>)</i>
//                            </div>
//                            <span id="${spn_pdfButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${pdfButtonNameByLanguages[language]}</span>
//                         </button>
//                         <div hidden>
//                            <input id="${inpt_choosePdf_id}"  type="file"  accept="application/pdf"/>
//                         </div>`);
//                //#endregion

//                //#region declare events
//                $("#" + btn_pdf_id).click(() =>
//                    spn_eventManager.trigger("click_pdfButton", [row])
//                )
//                $("#" + inpt_choosePdf_id).change((event) => {
//                    //#region trigger the "change_chooseFileInput_image" event
//                    let selectedFileInfos = event.target.files[0];

//                    spn_eventManager.trigger(
//                        "change_chooseFileInput_pdf",
//                        [row.attr("id"), selectedFileInfos]);
//                    //#endregion
//                })
//                //#endregion

//                break;
//            case "processes":
//                //#region add "save" and "cancel" buttons
//                // remove 'update' button
//                td.empty();

//                // add buttons
//                td.append(
//                    `<button id="${btn_save_id}" class="active" ui-toggle-class="">
//                            <i class="fa fa-check text-success" style="width:15px"></i>
//                        </button>
//                        <button id="${btn_cancel_id}" class="active" ui-toggle-class="">
//                            <i class="fa fa-times text-danger" style="width:15px"></i>
//                        </button>`
//                );
//                //#endregion

//                //#region declare events
//                $("#" + btn_save_id).click(() =>
//                    spn_eventManager.trigger("click_saveButton")
//                )
//                $("#" + btn_cancel_id).click(() =>
//                    spn_eventManager.trigger("click_cancelButton", [row])
//                )
//                //#endregion
//                break;
//        }
//    }
//    //#endregion

//    //#region save old column values to session
//    // add registration data as extra (for cancel button)
//    oldColumnValues["createdAt"] = row
//        .children("#td_createdAt")
//        .text();

//    // save to session
//    sessionStorage.setItem(
//        row.attr("id"),
//        JSON.stringify(oldColumnValues));
//    //#endregion
//})