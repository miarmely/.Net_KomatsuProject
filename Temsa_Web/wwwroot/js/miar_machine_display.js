import {
    updateResultLabel, addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync,
    isAllObjectValuesNullAsync, getFileTypeFromFileName, updateElementText,
    getBase64StrOfFileAsync, autoObjectMapperAsync,
} from "./miar_tools.js";

import {
    addArticlesAsync, alignArticlesToCenterAsync, articleBuffer, art_baseId,
    click_articleVideoDivAsync, controlArticleWidthAsync, div_article_button_id,
    div_article_info_id, div_article_video_id, ended_articleVideoAsync,
    mouseout_articleVideoDivAsync, mouseover_articleVideoAsync,
    removeLastUploadedArticleVideoAsync, setHeightOfArticlesDivAsync,
    setVariablesForArticleAsync
} from "./miar_article.js"

import {
    addDefaultValuesToFormAsync, inpt_brand_id, inpt_chooseImage_id,
    inpt_choosePdf_id, inpt_chooseVideo_id, inpt_model_id, inpt_rented_id, inpt_sold_id,
    inpt_stock_id, inpt_year_id, populateFormAsync, setMachineVideoSizeAsync,
    slct_mainCategory_id, slct_subCategory_id, path_imageFolderAfterWwwroot,
    path_videoFolderAfterWwwroot, selectedImageInfos, selectedPdfInfos, resultLabel_id,
    img_loading, selectedVideoInfos, path_pdfFolderAfterWwwroot, removePosterAttrAsync,
    removeVideoAttrAsync,
} from "./miar_machine_inputForm.js";

import {
    descriptions, setVariablesForDescriptionsAsync
} from "./miar_descriptions.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const nameOfPaginationHeader = "Machine-Pagination";
    const errorMessageColor = "rgb(255, 75, 75)";
    const ul_pagination = $("#ul_pagination");
    const entityQuantity_id = "#small_entityQuantity";
    const entityQuantity_color = "#7A7A7A";
    const path_pdfs = "pdfs";
    const div_article_display = $("#div_article_display");
    const div_articles = $("#div_articles");
    const div_article_update = $("#div_article_update");
    const div_backButton = $("#div_backButton");
    const div_panelTitle = $("#div_panelTitle");
    const div_menubar_button = $("#div_menubar_button");
    const descriptions_charQuantityToBeDisplayOnArticle = 200;
    const btn_back = $("#btn_back");
    const btn_menubar_apply = $("#btn_menubar_apply")
    const slct_menubar = $("#slct_menubar");
    let paginationInfos = {};
    let machineCountOnPage;
    let idOfLastViewedArticle = null;
    let article_idsToBeDelete = [];
    let isWindowResizeInCriticalSection = false;
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
            //#region wait until time out
            if (isWindowResizeInCriticalSection)
                return;
        //#endregion

        //#region update article styles
        isWindowResizeInCriticalSection = true;

        setTimeout(async () => {
            await controlArticleWidthAsync();
            await alignArticlesToCenterAsync();
            await setHeightOfArticlesDivAsync();

            isWindowResizeInCriticalSection = false;
        }, 500);
        //#endregion
        //#endregion
    });
    //#endregion

    //#region for update page
    $("form").submit(async (event) => {
        //#region show loading image
        event.preventDefault();
        img_loading.removeAttr("hidden");
        //#endregion

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
        let dataForUpdate = {
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

        //#region when any changes wasn't do
        if (await isAllObjectValuesNullAsync(dataForUpdate)) {
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
            await updateMachineAsync(dataForUpdate, oldMachineInfos.id, oldMachineInfos.mainCategoryName, oldMachineInfos.subCategoryName) ?
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
                dataForUpdate,
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

        //#region reset descriptions variables
        await setVariablesForDescriptionsAsync("descriptions", {
            "isChanged": false
        });
        //#endregion
    })
    btn_back.click(async () => {
        //#region reset form
        $("form")[0].reset();
        $(resultLabel_id).empty();

        await removePosterAttrAsync();
        await removeVideoAttrAsync();
        //#endregion

        //#region show articles
        div_article_update.attr("hidden", "");
        div_article_display.removeAttr("hidden");
        //#endregion

        await showOrHideBackButtonAsync("hide");
        await controlArticleWidthAsync();
        await alignArticlesToCenterAsync();
    })
    //#endregion

    //#region for articles page
    $("#div_sidebarMenuButton").click(async () => {
        // wait 0.3sn until sidebar closed
        setTimeout(async () => {
            await controlArticleWidthAsync();
            await alignArticlesToCenterAsync();
        }, 450);
    });
    slct_menubar.change(async () => {
        //#region set page mode
        let selectedMode = slct_menubar.val();

        switch (selectedMode) {
            case '0':  // display
                await changePageModeAsync("display");
                break;
            case '1':  // delete
                await changePageModeAsync("delete");
                break;
        }
        //#endregion
    })
    btn_menubar_apply.click(async () => {
        switch (slct_menubar.val()) {
            case "1":  // delete
                await deleteSelectedMachinesAsync();
                break;
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
    spn_eventManager.on("click_articleVideoDiv", async (_, event) => {
        //#region when page mode is "delete"
        if (pageMode == "delete")
            return;
        //#endregion

        //#region get article id of clicked play <img>
        let articleId = event.target
            .closest("article")
            .id;
        //#endregion

        await click_articleVideoDivAsync($("#" + articleId));
    })
    spn_eventManager.on("click_article", async (_, event) => {
        //#region when click to article <div> or play <image>
        if (event.target.id == div_article_video_id  // when article video clicked
            || event.target.className == "img_play"  // when play image clicked
            || event.target.innerText == "PDF")  // when pdf button clicked
            return;
        //#endregion

        //#region when click to other places
        let articleId = event.currentTarget.closest("article").id;

        switch (pageMode) {
            case "display":
                //#region open update page
                await removeLastUploadedArticleVideoAsync();

                //#region hide machine articles
                div_article_display.attr("hidden", "");
                div_article_update.removeAttr("hidden");
                //#endregion

                //#region get machine infos of clicked article
                idOfLastViewedArticle = articleId;
                let machineInfosOfArticle = article_idsAndMachineInfos[articleId];
                //#endregion

                await setVariablesForDescriptionsAsync("descriptions", {
                    "byLanguages": machineInfosOfArticle.descriptions
                })
                await populateFormAsync(false);
                await addDefaultValuesToFormAsync(machineInfosOfArticle);
                await showOrHideBackButtonAsync("show");
                //#endregion

                break;
            case "delete":
                //#region when click article for "undelete"
                let article = $("#" + articleId);

                if (article.css("background-color") == articleBuffer.articleStyle.bgColorForDelete) {
                    // change article <style>
                    article.css("background-color", "white");

                    // remove article id from "article_idsToBeDelete"
                    let articleIdIndex = article_idsToBeDelete.indexOf(articleId);
                    article_idsToBeDelete.splice(articleIdIndex, 1);
                }
                //#endregion

                //#region when click article for "delete"
                else {
                    // change article style
                    article.css("background-color", articleBuffer.articleStyle.bgColorForDelete);

                    // save article id
                    article_idsToBeDelete.push(articleId);
                }
                //#endregion

                break;
        }
        //#endregion
    })
    spn_eventManager.on("ended_articleVideo", async () => {
        await ended_articleVideoAsync();
    })
    //#endregion

    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add panel title
        $("#div_panelTitle").append(
            panelTitleByLanguages[language]);
        //#endregion

        //#region populate menubar
        let menubarOptions = menubar_optionsByLanguages[language];

        for (let index = 0; index < menubarOptions.length; index += 1) {
            let menubarOption = menubarOptions[index];

            slct_menubar.append(`
                <option value="${index}">${menubarOption}</option>`);
        }
        //#endregion

        //#region add apply button name
        btn_menubar_apply.append(
            menubar_applyButtonName[language])
        //#endregion

        //#region add entity quantity message
        $(entityQuantity_id).append(
            `<b>0</b> ${entityQuantity_messageByLanguages[language]}`
        );
        //#endregion

        await addMachineArticlesAsync(pageNumber, pageSize, true);
    }

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
                    "src": "/" + path_videoFolderAfterWwwroot + "/" + data.videoName,
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
                    `&fileFolderPathAfterWwwroot=${path_videoFolderAfterWwwroot}`),
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

    async function deleteSelectedMachinesAsync() {
        //#region set data
        let data = [];  // [{}, {}, ...]

        for (let index in article_idsToBeDelete) {
            let machineInfos = article_idsAndMachineInfos[article_idsToBeDelete[index]];

            data.push({
                "machineId": machineInfos.id,
                "imageName": machineInfos.imageName,
                "videoName": machineInfos.videoName,
                "pdfName": machineInfos.pdfName
            });
        }
        //#endregion

        $.ajax({
            method: "DELETE",
            url: (baseApiUrl + "/machine/delete" +
                `?language=${language}` +
                `&imageFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}` +
                `&videoFolderPathAfterWwwroot=${path_videoFolderAfterWwwroot}` +
                `&pdfFolderPathAfterWwwroot=${path_pdfs}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                article_idsToBeDelete = [];  // reset

                //#region when all machines on page deleted
                let currentPageNo = paginationInfos.CurrentPageNo;

                if (data.length == paginationInfos.CurrentPageCount) {
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
                        //#region reset articles <div>
                        div_articles.empty();
                        div_articles.removeAttr("style");
                        //#endregion

                        updateResultLabel(
                            entityQuantity_id,
                            `<b>0/${pageSize}<b> ${entityQuantity_messageByLanguages[language]}`,
                            entityQuantity_color);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    addMachineArticlesAsync(currentPageNo, pageSize, true);  // refresh current page
                //#endregion

                //#region change page mode
                pageMode = "display";
                slct_menubar.val(0);  // select "display"

                // hide apply button
                div_menubar_button.attr("hidden", "");
                //#endregion
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
        article_idsAndMachineInfos = {};  // reset

        for (let index in response) {
            //#region add machines

            //#region save article infos
            let machineInfos = response[index];
            let articleId = art_baseId + index;

            article_idsAndMachineInfos[articleId] = machineInfos;
            //#endregion

            //#region add machine video poster
            let article = $('#' + articleId);

            article
                .find("video")
                .attr("poster", "/" + path_imageFolderAfterWwwroot + "/" + machineInfos.imageName);
            //#endregion

            //#region add machine infos 
            let div_article_info = article
                .children("#" + div_article_info_id);

            div_article_info.append(`
                <h2 style="margin-bottom: 5px">${machineInfos.model}</h2>
                <h3 style="margin-bottom: 3px">${machineInfos.mainCategoryName}</h3>
                <h4 style="margin-bottom: 20px">${machineInfos.subCategoryName}</h4>
                <h5>${machineInfos.descriptions[language].substring(0, descriptions_charQuantityToBeDisplayOnArticle)}...</h5>
            `);
            //#endregion

            //#region add link to pdf button 
            article
                .find("#" + div_article_button_id + " a")
                .attr("href", "/" + path_pdfFolderAfterWwwroot + "/" + machineInfos.pdfName);
            //#endregion

            //#endregion

            //#region declare article page events
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
        $(".article #" + div_article_video_id).click((event) => {
            spn_eventManager.trigger("click_articleVideoDiv", [event]);
        });
        $(".article video").on("ended", () => {
            spn_eventManager.trigger("ended_articleVideo");
        })
        $(".article").click((event) => {
            spn_eventManager.trigger("click_article", [event]);
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
                setVariablesForArticleAsync({
                    "div_articles": div_articles,
                    "path_articleVideos": path_videoFolderAfterWwwroot,
                    "totalArticleCount": response.length,
                    "articleType": "videoAndText",
                    "articleStyle": {
                        "width": 370,
                        "height": 580,
                        "marginT": 10,
                        "marginB": 10,
                        "marginR": 20,
                        "marginL": 20,
                        "paddingT": 10,
                        "paddingB": 10,
                        "paddingR": 10,
                        "paddingL": 10,
                        "border": 6,
                        "bgColorForDelete": "rgb(220, 0, 0)"
                    },
                });
                //#endregion

                addArticlesAsync(true)
                    .then(async () => {
                        await controlArticleWidthAsync();
                        await alignArticlesToCenterAsync();
                        await setHeightOfArticlesDivAsync();
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

    async function showOrHideBackButtonAsync(mode) {
        switch (mode) {
            case "show":
                // show back button
                div_backButton.removeAttr("hidden");

                // shift the panel title to right
                let backButtonWidth = btn_back.css("width");
                div_panelTitle.css("padding-left", backButtonWidth);

                break;
            case "hide":
                // hide back button
                div_backButton.attr("hidden", "");

                // shift the panel title to left
                div_panelTitle.css("padding-left", "");

                break;
        }
    }

    async function changePageModeAsync(mode) {
        switch (mode) {
            case "display":
                //#region reset bg color of selected articles for delete 
                for (let index in article_idsToBeDelete) {
                    let articleId = article_idsToBeDelete[index];

                    $("#" + articleId).css("background-color", "");
                }
                //#endregion

                //#region hide apply <button>
                pageMode = "display";
                article_idsToBeDelete = [];
                div_menubar_button.attr("hidden", "");
                //#endregion

                break;
            case "delete":
                await removeLastUploadedArticleVideoAsync();

                //#region show apply <button>
                pageMode = "delete";
                div_menubar_button.removeAttr("hidden");
                //#endregion

                break;
        }
    }
    //#endregion

    populateHtmlAsync();
})