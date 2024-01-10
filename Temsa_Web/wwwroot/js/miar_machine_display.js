import {
    updateResultLabel, updateErrorRow, addPaginationButtonsAsync,
    controlPaginationBackAndNextButtonsAsync, isAllObjectValuesNullAsync, autoObjectMapperAsync,
    getFileTypeFromFileName, updateElementText, getBase64StrOfFileAsync,

} from "./miar_tools.js";

import {
    addArticlesAsync, alignArticlesToCenterAsync, art_baseId, click_playImageAsync,
    div_article_info_id, div_article_video_id, ended_articleVideoAsync,
    mouseout_articleVideoDivAsync, mouseover_articleVideoAsync,
    removeLastUploadedArticleVideoAsync, setVariablesForArticle
} from "./miar_article.js"

import {
    addDefaultValuesToFormAsync, inpt_brand_id, inpt_chooseImage_id,
    inpt_choosePdf_id, inpt_chooseVideo_id, inpt_model_id, inpt_rented_id, inpt_sold_id,
    inpt_stock_id, inpt_year_id, populateFormAsync, setMachineVideoSizeAsync, slct_mainCategory_id,
    slct_subCategory_id, path_imageFolderAfterWwwroot, path_videoFolderAfterWwwRoot,
    selectedImageInfos, selectedPdfInfos, resultLabel_id, img_loading, selectedVideoInfos, path_pdfFolderAfterWwwroot
} from "./miar_machine_inputForm.js";

import { descriptions, setVariablesForDescriptionsAsync } from "./miar_descriptions.js";

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
    const path_pdfs = "pdfs";
    const img_imageButton_id = "img_imageButton";
    const spn_pdfButton_pdfName_id = "spn_pdfButton_pdfName";
    const div_articles_panel = $("#div_articles_panel");
    const div_articles = $("#div_articles");
    const div_article_update = $("#div_article_update");
    const descriptions_charQuantityToBeDisplayOnArticle = 200;
    let paginationInfos = {};
    let machineCountOnPage;
    let idOfLastViewedArticle = null;
    //#endregion

    //#region events

    //#region partner
    $(window).resize(async () => {
        //#region when machine update page is open
        if (div_article_update.attr("hidden") == undefined)
            await setMachineVideoSizeAsync();
        //#endregion

        //#region when machine articles page is open
        else
            setTimeout(async () =>
                await alignArticlesToCenterAsync(),
                400);
        //#endregion
    });
    //#endregion

    //#region for machine update page
    $("form").submit(async (event) => {
        event.preventDefault();

        //#region set data for update machine
        let oldMachineInfos = article_idsAndMachineInfos[idOfLastViewedArticle];
        let newMachineInfos = {
            "imageName": $("#" + inpt_chooseImage_id).val(),
            "videoName": $("#" + inpt_chooseVideo_id).val(),
            "mainCategoryName": $("#" + slct_mainCategory_id).val(),
            "subCategoryName": $("#" + slct_subCategory_id).val(),
            "model": $("#" + inpt_model_id).val(),
            "brandName": $("#" + inpt_brand_id).val(),
            "handStatus": $("input[name= handStatus]:checked").val(),
            "pdfName": $("#" + inpt_choosePdf_id).val(),
            "stock": $("#" + inpt_stock_id).val(),
            "rented": $("#" + inpt_rented_id).val(),
            "sold": $("#" + inpt_sold_id).val(),
            "year": $("#" + inpt_year_id).val(),
            "descriptions": descriptions.isChanged ? descriptions.byLanguages : null,
        };
        //#endregion

        let data = {
            "imageName": newMachineInfos.imageName == oldMachineInfos.imageName ? null : newMachineInfos.imageName,
            "videoName": newMachineInfos.videoName == oldMachineInfos.videoName ? null : newMachineInfos.videoName,
            "mainCategoryName": newMachineInfos.mainCategoryName == oldMachineInfos.mainCategoryName ? null : newMachineInfos.mainCategoryName,
            "subCategoryName": newMachineInfos.subCategoryName == oldMachineInfos.subCategoryName ? null : newMachineInfos.subCategoryName,
            "model": newMachineInfos.model == oldMachineInfos.model ? null : newMachineInfos.model,
            "brandName": newMachineInfos.brandName == oldMachineInfos.brandName ? null : newMachineInfos.brandName,
            "handStatus": newMachineInfos.handStatus == oldMachineInfos.handStatus ? null : newMachineInfos.handStatus,
            "pdfName": newMachineInfos.pdfName == oldMachineInfos.pdfName ? null : newMachineInfos.pdfName,
            "stock": newMachineInfos.stock == oldMachineInfos.stock ? null : newMachineInfos.stock,
            "rented": newMachineInfos.rented == oldMachineInfos.rented ? null : newMachineInfos.rented,
            "sold": newMachineInfos.sold == oldMachineInfos.sold ? null : newMachineInfos.sold,
            "year": newMachineInfos.year == oldMachineInfos.year ? null : newMachineInfos.year,
            "descriptions": newMachineInfos.descriptions
        }

        //#region when any changes wasn't do (data)
        if (await isAllObjectValuesNullAsync(data)) {
            // write error
            updateResultLabel(
                resultLabel_id,
                partnerErrorMessagesByLanguages[language]["nullArguments"],
                resultLabel_errorColor,
                "30px");

            return;
        }
        //#endregion

        //#region update machine
        let isUpdatingSuccess = updateMachineInfos(data) ?
            updateMachineImageOnFolder(oldMachineInfos, newMachineInfos) ?
                updateMachineVideoOnFolder(oldMachineInfos, newMachineInfos) ?
                    updateMachinePdfOnFolder(oldMachineInfos, newMachineInfos) ?
                        true
                        : false
                    : false
                : false
            : false;
        //#endregion

        //#region when machine infos and files updated with successful
        if (isUpdatingSuccess) {
            await updateArticleAsync(idOfLastViewedArticle, newMachineInfos);

            // update "article_idsAndMachineInfos"
            await autoObjectMapperAsync(
                article_idsAndMachineInfos[idOfLastViewedArticle],
                data,
                true);

            // write successful message
            updateResultLabel(
                resultLabel_id,
                successMessagesByLanguages[language]["successfulUpdate"],
                resultLabel_successColor,
                "30px",
                img_loading);
        }
        //#endregion

    });
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
                        data["imageFolderPathAfterWwwroot"] = path_imageFolderAfterWwwroot;
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

    //#region for articles page
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
    spn_eventManager.on("click_playImage", async (_, event) => {
        //#region get article id of clicked play <img>
        let articleId = event.target
            .closest("article")
            .id;
        //#endregion

        await click_playImageAsync($("#" + articleId));
    })
    spn_eventManager.on("click_articleInfoDiv", async (_, event) => {
        await removeLastUploadedArticleVideoAsync();

        //#region hide machine articles
        div_articles_panel.attr("hidden", "");
        div_article_update.removeAttr("hidden");
        //#endregion

        //#region get machine infos of clicked article
        idOfLastViewedArticle = event.currentTarget.closest("article").id;
        let machineInfosOfArticle = article_idsAndMachineInfos[idOfLastViewedArticle];
        //#endregion

        await setVariablesForDescriptionsAsync("descriptions", {
            "byLanguages": machineInfosOfArticle.descriptions
        })
        await populateFormAsync(false);
        await addDefaultValuesToFormAsync(machineInfosOfArticle);
    })
    spn_eventManager.on("ended_articleVideo", async () => {
        await ended_articleVideoAsync();
    })
    //#endregion

    //#endregion


    async function updateMachineAsync(data) {
        //#region get file contents in base64 string
        let imageContentInBase64Str = data.imageName != null ?
            await getBase64StrOfFileAsync(selectedImageInfos)
            : null

        let videoContentInBase64Str = data.videoName != null ?
            await getBase64StrOfFileAsync(selectedVideoInfos)
            : null

        let pdfContentInBase64Str = data.pdfName != null ?
            await getBase64StrOfFileAsync(selectedPdfInfos)
            : null
        //#endregion

            $.ajax({
                method: "PUT",
                url: (baseApiUrl + "/machine/update?" +
                    `language=${language}` +
                    `&id=${oldMachineInfos.id}` +
                    `&oldMainCategoryName=${oldMachineInfos.mainCategoryName}` +
                    `&oldSubCategoryName=${oldMachineInfos.subCategoryName}`),
                headers: { "Authorization": jwtToken },
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: () => {

                    $.ajax({
                        type: "PUT",
                        url: (baseApiUrl + "machine/update/image?" +
                            `newImageName=${newMachineInfos.imageName}` +
                            `&oldImageName=${oldMachineInfos.oldImageName}` +
                            `&imageFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}`),
                        data: JSON.stringify({
                            "imageContentInBase64Str": 
                        }),
                        contentType: "application/json",
                        dataType: "json",
                        success: () => {

                        },
                        error: () => {
                            //#region write error to error row
                            updateResultLabel(
                                resultLabel_id,
                                errorMessagesByLanguages[language]["unsuccessfulImageUpdating"],
                                resultLabel_errorColor,
                                "30px",
                                img_loading);
                            //#endregion

                            resolve(false);
                        }
                    }));
                },
                error: () => {
                    //#region write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulInfosUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);
                    //#endregion
                }
            }));
    }

    async function updateMachineImageOnFolder(oldMachineInfos, newMachineInfos) {
        await new Promise(async resolve =>
            
    }

    async function updateMachineVideoOnFolder(oldMachineInfos, newMachineInfos) {
        await new Promise(async resolve =>
            $.ajax({
                type: "PUT",
                url: (baseApiUrl + "machine/update/video?" +
                    `newVideoName=${newMachineInfos.videoName}` +
                    `&oldVideoName=${oldMachineInfos.oldVideoName}` +
                    `&videoFolderPathAfterWwwroot=${path_videoFolderAfterWwwRoot}`),
                data: JSON.stringify({
                    "videoContentInBase64Str": await getBase64StrOfFileAsync(selectedVideoInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    //#region write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulVideoUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);
                    //#endregion

                    resolve(false);
                }
            }));
    }

    async function updateMachinePdfOnFolder(oldMachineInfos, newMachineInfos) {
        await new Promise(async resolve =>
            $.ajax({
                type: "PUT",
                url: (baseApiUrl + "machine/update/pdf?" +
                    `newPdfName=${newMachineInfos.pdfName}` +
                    `&oldPdfName=${oldMachineInfos.oldPdfName}` +
                    `&pdfFolderPathAfterWwwroot=${path_pdfFolderAfterWwwroot}`),
                data: JSON.stringify({
                    "pdfContentInBase64Str": await getBase64StrOfFileAsync(selectedPdfInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    //#region write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulPdfUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);
                    //#endregion

                    resolve(false);
                }
            }));
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
                `&imageFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}` +
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
        //#region add machines to <article>
        for (let index in response) {
            //#region add machines

            //#region save article infos
            let machineInfos = response[index];
            let articleId = art_baseId + index;

            article_idsAndMachineInfos[articleId] = machineInfos;
            //#endregion

            //#region add machine video poster
            let art_machine = $('#' + articleId);

            art_machine
                .find("video")
                .attr("poster", "/" + path_imageFolderAfterWwwroot + "/" + machineInfos.imageName);
            //#endregion

            //#region add machine infos 
            let div_article_info = art_machine
                .children("#" + div_article_info_id);

            div_article_info.append(`
                <div>
                    <h2 style="margin-bottom: 5px">${machineInfos.model}</h2>
                    <h3 style="margin-bottom: 3px">${machineInfos.mainCategoryName}</h3>
                    <h4 style="margin-bottom: 20px">${machineInfos.subCategoryName}</h4>
                    <h5>${machineInfos.descriptions[language].substring(0, descriptions_charQuantityToBeDisplayOnArticle)}...</h5>
                </div>
            `);
            //#endregion

            //#endregion

            //#region declare article page events
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
        $(".img_play").click((event) => {
            spn_eventManager.trigger("click_playImage", [event]);
        });
        $(".article video").on("ended", () => {
            spn_eventManager.trigger("ended_articleVideo");
        })
        $(".article #" + div_article_info_id).click((event) => {
            spn_eventManager.trigger("click_articleInfoDiv", [event]);
        })
        //#endregion
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
                //#region set variables
                article_totalCount = response.length;

                setVariablesForArticle({
                    "div_articles": div_articles,
                    "path_articleVideos": path_videoFolderAfterWwwRoot,
                });
                //#endregion

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

    async function updateArticleAsync(
        articleId,
        data
    ) {
        let article = $("#" + articleId);

        //#region when image is changed
        if (data.imageName != null)
            article
                .find("#" + div_article_video_id + " video")
                .attr("poster", "/" + path_imageFolderAfterWwwroot + "/" + data.imageName);
        //#endregion

        //#region when video is changed
        if (data.videoName != null) {
            article
                .find("#" + div_article_video_id + " source")
                .attr({
                    "src": "/" + path_videoFolderAfterWwwRoot + "/" + data.videoName,
                    "type": "video/" + getFileTypeFromFileName(data.videoName)
                })

            article.find("video").load()
        }
        //#endregion

        //#region when model is changed
        if (data.model != null)
            updateElementText(
                article.find("#" + div_article_info_id + " h2"),
                data.model);
        //#endregion

        //#region when mainCategoryName is changed
        if (data.mainCategoryName != null)
            updateElementText(
                article.find("#" + div_article_info_id + " h3"),
                data.mainCategoryName);
        //#endregion

        //#region when subCategoryName is changed
        if (data.subCategoryName != null)
            updateElementText(
                article.find("#" + div_article_info_id + " h4"),
                data.subCategoryName);
        //#endregion

        //#region when descriptions is changed
        if (data.descriptions != null)
            updateElementText(
                article.find("#" + div_article_info_id + " h5"),
                data.descriptions[language].substring(0, descriptions_charQuantityToBeDisplayOnArticle));
        //#endregion
    }

    async function populateHtmlAsync() {
        //#region add panel title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add panel menubars
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