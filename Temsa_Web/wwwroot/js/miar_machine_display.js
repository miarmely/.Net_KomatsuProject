import {
    updateResultLabel, updateErrorRow, addPaginationButtonsAsync,
    controlPaginationBackAndNextButtonsAsync, isAllObjectValuesNullAsync,
    getFileTypeFromFileName, updateElementText, getBase64StrOfFileAsync, autoObjectMapperAsync,
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
    selectedImageInfos, selectedPdfInfos, resultLabel_id, img_loading, selectedVideoInfos,
    path_pdfFolderAfterWwwroot,
    inpt_image_id,
    inpt_video_id,
    inpt_pdf_id
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

        //#region set variables
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
        //#endregion

        //#region when any changes wasn't do (data)
        if (await isAllObjectValuesNullAsync(data)) {
            // write error
            updateResultLabel(
                resultLabel_id,
                partnerErrorMessagesByLanguages[language]["nullArguments"],
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        //#region update machine
        let isUpdatingSuccess =
            await updateMachineAsync(data, oldMachineInfos.id, oldMachineInfos.mainCategoryName, oldMachineInfos.subCategoryName) ?
                await updateMachineImageOnFolderAsync(oldMachineInfos, newMachineInfos) ?
                    await updateMachineVideoOnFolderAsync(oldMachineInfos, newMachineInfos) ?
                        await updateMachinePdfOnFolderAsync(oldMachineInfos, newMachineInfos) ?
                            true  // when all update process is successfull
                            : false
                        : false
                    : false
                : false;
        //#endregion

        //#region update machine article
        if (isUpdatingSuccess) {
            await updateArticleAsync(idOfLastViewedArticle, newMachineInfos);

            //#region update "article_idsAndMachineInfos"
            await autoObjectMapperAsync(
                article_idsAndMachineInfos[idOfLastViewedArticle],
                data,
                true);
            //#endregion

            //#region write successful message
            updateResultLabel(
                resultLabel_id,
                successMessagesByLanguages[language]["successfulUpdate"],
                resultLabel_successColor,
                "30px",
                img_loading);
            //#endregion
        }
        //#endregion
    });
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
    async function updateMachineAsync(
        data,
        oldMachineId,
        oldMainCategoryName,
        oldSubCategoryName
    ) {
        return new Promise(resolve => {
            $.ajax({
                method: "PUT",
                url: (baseApiUrl + "/machine/update?" +
                    `language=${language}` +
                    `&id=${oldMachineId}` +
                    `&oldMainCategoryName=${oldMainCategoryName}` +
                    `&oldSubCategoryName=${oldSubCategoryName}`),
                headers: { "Authorization": jwtToken },
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
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

                    resolve(false);
                }
            });
        });
    }

    async function updateMachineImageOnFolderAsync(oldMachineInfos, newMachineInfos) {
        return new Promise(async resolve => {
            //#region when machine image not changed
            if (newMachineInfos.imageName == oldMachineInfos.imageName) {
                resolve(true);
                return;
            }
            //#endregion

            $.ajax({
                type: "PUT",
                url: (baseApiUrl + "/machine/update/image?" +
                    `language=${language}` +
                    `&newFileName=${newMachineInfos.imageName}` +
                    `&oldFileName=${oldMachineInfos.imageName}` +
                    `&fileFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedImageInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    // write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulImageUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
    }

    async function updateMachineVideoOnFolderAsync(oldMachineInfos, newMachineInfos) {
        return new Promise(async resolve => {
            //#region when machine video not changed
            if (newMachineInfos.videoName == oldMachineInfos.videoName) {
                resolve(true);
                return;
            }
            //#endregion

            $.ajax({
                type: "PUT",
                url: (baseApiUrl + "/machine/update/video?" +
                    `language=${language}` +
                    `&newFileName=${newMachineInfos.videoName}` +
                    `&oldFileName=${oldMachineInfos.videoName}` +
                    `&fileFolderPathAfterWwwroot=${path_videoFolderAfterWwwRoot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedVideoInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: (response) => {
                    // write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulVideoUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            })
        });
    }

    async function updateMachinePdfOnFolderAsync(oldMachineInfos, newMachineInfos) {
        return new Promise(async resolve => {
            //#region when pdf not changed
            if (newMachineInfos.pdfName == oldMachineInfos.pdfName) {
                resolve(true);
                return;
            }
            //#endregion

            $.ajax({
                type: "PUT",
                url: (baseApiUrl + "/machine/update/pdf?" +
                    `language=${language}` +
                    `&newFileName=${newMachineInfos.pdfName}` +
                    `&oldFileName=${oldMachineInfos.pdfName}` +
                    `&fileFolderPathAfterWwwroot=${path_pdfFolderAfterWwwroot}`),
                headers: {
                    "authorization": jwtToken
                },
                data: JSON.stringify({
                    "fileContentInBase64Str": await getBase64StrOfFileAsync(selectedPdfInfos)
                }),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: () => {
                    //write error
                    updateResultLabel(
                        resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulPdfUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
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
        $("#div_panelTitle").append(
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