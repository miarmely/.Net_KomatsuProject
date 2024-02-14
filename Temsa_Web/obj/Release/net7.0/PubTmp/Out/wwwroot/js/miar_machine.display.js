import {
    updateResultLabel, addPaginationButtonsAsync, getFileTypeFromFileName,
    controlPaginationBackAndNextButtonsAsync, isAllObjectValuesNullAsync,
    updateElementText, getBase64StrOfFileAsync, autoObjectMapperAsync, showOrHideBackButtonAsync
} from "./miar_tools.js";

import {
    addArticlesAsync, articleBuffer, art_baseId, setVariablesForArticleAsync,
    mouseover_articleVideoAsync, click_articleVideoDivAsync, controlArticleWidthAsync,
    div_article_button_id, div_article_info_id, div_article_video_id, getValidArticleWidthAsync,
    ended_articleVideoAsync, alignArticlesAsAutoAsync, mouseout_articleVideoDivAsync,
    removeLastUploadedArticleVideoAsync, getArticleCountOnOneRowAsync,    
} from "./miar_article.js";

import {
    machineForm_setMachineVideoSizeAsync, machineForm_removeVideoAttrAsync,
    change_pdfInputAsync, machineForm_removePosterAttrAsync,
    machineForm_addElementNamesAsync, machineForm_populateSelectsAsync,
    click_showImageButtonAsync, click_showVideoButtonAsync,
    click_inputAsync, click_textAreaAsync, change_imageInputAsync, change_videoInputAsync,
    machineForm_activeOrPassiveTheImageOrVideoBtnAsync,
    machineForm_checkWhetherBlankTheInputsAsync, machineForm_populateInfoMessagesAsync
} from "./miar_machine.js"

import {
    btn_descriptions_id, changeDescriptionsButtonColorAsync, descriptions,
    descriptions_baseButtonNameByLanguages,
    setVariablesForDescriptionsAsync, uploadDescriptionsEventsAsync
} from "./miar_descriptions.js"

import { checkValueOfNumberInputAsync } from "./miar_module_inputForm.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageRow = 2;
    const paginationButtonQuantity = 5;
    const nameOfPaginationHeader = "Machine-Pagination";
    const errorMessageColor = "rgb(255, 75, 75)";
    const ul_pagination = $("#ul_pagination");
    const entityQuantity_id = "#small_entityQuantity";
    const entityQuantity_color = "#7A7A7A";
    const div_articles = $("#div_articles");
    const div_article_display = $("#div_article_display");
    const div_article_update_id = "div_article_update";
    const div_article_update = $("#" + div_article_update_id);
    const div_menubar_button = $("#div_menubar_button");
    const div_backButton = $("#div_backButton");
    const div_panelTitle = $("#div_panelTitle");
    const descriptions_charQuantityToBeDisplayOnArticle = 200;
    const btn_menubar_apply = $("#btn_menubar_apply");
    const btn_save = $("#btn_save");
    const btn_showImage = $("#btn_showImage");
    const btn_showVideo = $("#btn_showVideo");
    const btn_back = $("#btn_back");
    const slct_menubar = $("#slct_menubar");
    const inpt_model_id = "inpt_model";
    const inpt_brand_id = "inpt_brand";
    const inpt_year_id = "inpt_year";
    const inpt_stock_id = "inpt_stock";
    const inpt_sold_id = "inpt_sold";
    const inpt_rented_id = "inpt_rented";
    const inpt_image = $("#inpt_image");
    const inpt_video = $("#inpt_video");
    const inpt_pdf = $("#inpt_pdf");
    const inpt_chooseImage = $("#inpt_chooseImage");
    const inpt_chooseVideo = $("#inpt_chooseVideo");
    const inpt_choosePdf = $("#inpt_choosePdf");
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const path_imageFolderAfterWwwroot = "images\\machines";
    const path_videoFolderAfterWwwroot = "videos\\machines";
    const path_pdfFolderAfterWwwroot = "pdfs";
    const vid_machine = $("#vid_machine");
    const src_machine = $("#src_machine");
    const spn_resultLabel_id = "p_resultLabel";
    const spn_resultLabel = $("#" + spn_resultLabel_id);
    const spn_fileStatus = $("#spn_fileStatus");
    const img_loading = $("#img_loading");
    const langPack_menubarOptions = {
        "TR": [
            "Görüntüle",
            "Sil"
        ],
        "EN": [
            "Display",
            "Delete"
        ]
    };
    const langPack_applyButton = {
        "TR": "Uygula",
        "EN": "Apply"
    };
    const langPack_entityQuantity = {
        "TR": "makine gösteriliyor",
        "EN": "machine displaying"
    };
    const langPack_successMessage = {
        "TR": "başarıyla güncellendi",
        "EN": "update successfully",
    };
    const langPack_panelTitle = {
        "TR": "KAYITLI MAKİNELER",
        "EN": "REGISTERED MACHINES"
    }
    let pageSize;
    let paginationInfos = {};
    let machineCountOnPage;
    let idOfLastClickedArticle = null;
    let article_idsToBeDelete = [];
    let isWindowResizeInCriticalSection = false;
    let isUpdatePageOpenedBefore = false;
    let imageAndVideoButtons_activeButton = "image";
    //#endregion

    //#region events

    //#region partner
    $(window).resize(async () => {
        //#region when machine update page is open
        if (div_article_update.attr("hidden") == undefined)
            await machineForm_setMachineVideoSizeAsync(vid_machine);
        //#endregion

        //#region when machine articles page is open
        else {
            //#region wait until the previous resize event finishes
            if (isWindowResizeInCriticalSection)
                return;
            //#endregion

            //#region update article styles
            isWindowResizeInCriticalSection = true;

            setTimeout(async () => {
                await controlArticleWidthAsync();
                await alignArticlesAsAutoAsync();

                isWindowResizeInCriticalSection = false;
            }, 500);
            //#endregion
        }
        //#endregion
    });
    //#endregion

    //#region for update page
    $("#" + div_article_update_id + " input").click(async (event) => {
        await click_inputAsync(event, spn_resultLabel);
    })
    $("#" + div_article_update_id + " textarea").click(async (event) => {
        await click_textAreaAsync(event, spn_resultLabel);
    })
    $("#" + div_article_update_id + " input[type= number]").change(async (event) => {
        //#region check number input whether max or min value violation
        let inpt_id = event.target.id;

        switch (inpt_id) {
            case inpt_year_id:
                await checkValueOfNumberInputAsync(
                    $("#" + event.target.id),
                    numberInputLimits.year.min,
                    numberInputLimits.year.max);
                break;
            case inpt_stock_id:
                await checkValueOfNumberInputAsync(
                    $("#" + event.target.id),
                    numberInputLimits.stock.min,
                    numberInputLimits.stock.max);
                break;
            case inpt_sold_id:
                await checkValueOfNumberInputAsync(
                    $("#" + event.target.id),
                    numberInputLimits.sold.min,
                    numberInputLimits.sold.max);
                break;
            case inpt_rented_id:
                await checkValueOfNumberInputAsync(
                    $("#" + event.target.id),
                    numberInputLimits.rented.min,
                    numberInputLimits.rented.max);
                break;
        }
        //#endregion
    })
    btn_save.click(async (event) => {
        //#region check whether blank that inputs
        let isAnyInputBlank = await machineForm_checkWhetherBlankTheInputsAsync(
            errorMessagesByLanguages[language]["blankInput"],
            [
                inpt_chooseImage,
                inpt_chooseVideo,
                inpt_choosePdf,
                $("#" + inpt_model_id),
                $("#" + inpt_brand_id),
                $("#" + inpt_year_id),
                $("#" + inpt_stock_id),
                $("#" + inpt_sold_id),
                $("#" + inpt_rented_id)
            ]);

        if (isAnyInputBlank)
            return;
        //#endregion

        //#region show loading image
        event.preventDefault();
        spn_resultLabel.empty();
        spn_resultLabel.removeAttr("style");
        img_loading.removeAttr("hidden");
        //#endregion

        //#region set variables
        let oldMachineInfos = article_idsAndMachineInfos[idOfLastClickedArticle];
        let newMachineInfos = {
            "imageName": inpt_chooseImage.val(),
            "videoName": inpt_chooseVideo.val(),
            "pdfName": inpt_choosePdf.val(),
            "mainCategoryName": $("#" + slct_mainCategory_id).val(),
            "subCategoryName": $("#" + slct_subCategory_id).val(),
            "model": $("#" + inpt_model_id).val(),
            "brandName": $("#" + inpt_brand_id).val(),
            "handStatus": $("input[name= handStatus]:checked").val(),
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
                "#" + spn_resultLabel_id,
                langPack_partnerErrorMessages.nullArguments[language],
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
            await updateArticleAsync(idOfLastClickedArticle, newMachineInfos);

            //#region update "article_idsAndMachineInfos"
            await autoObjectMapperAsync(
                article_idsAndMachineInfos[idOfLastClickedArticle],
                dataForUpdate,
                true);
            //#endregion

            //#region write successful message
            updateResultLabel(
                "#" + spn_resultLabel_id,
                langPack_successMessage[language],
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
        spn_resultLabel.empty();

        await machineForm_removePosterAttrAsync(vid_machine, src_machine);
        await machineForm_removeVideoAttrAsync(vid_machine, src_machine);
        //#endregion

        //#region show articles
        div_article_update.attr("hidden", "");
        div_article_display.removeAttr("hidden");
        //#endregion

        await showOrHideBackButtonAsync(
            "hide",
            div_backButton,
            div_panelTitle,
            btn_back);
        await alignArticlesAsAutoAsync();
    })
    btn_showImage.click(async () => {
        await machineForm_activeOrPassiveTheImageOrVideoBtnAsync(
            "image",
            btn_showImage,
            btn_showVideo);

        //#region show image if video shows
        if (imageAndVideoButtons_activeButton != "image")
            await click_showImageButtonAsync(btn_showImage, btn_showVideo, vid_machine);

        imageAndVideoButtons_activeButton = "image";
        //#endregion

        await click_showImageButtonAsync(btn_showImage, btn_showVideo, vid_machine);
    })
    btn_showVideo.click(async () => {
        await machineForm_activeOrPassiveTheImageOrVideoBtnAsync(
            "video",
            btn_showImage,
            btn_showVideo);

        //#region show video if image shows
        if (imageAndVideoButtons_activeButton != "video")
            await click_showVideoButtonAsync(btn_showImage, btn_showVideo, vid_machine);

        imageAndVideoButtons_activeButton = "video";
        //#endregion
    })
    inpt_chooseImage.click(() => {
        inpt_image.trigger("click");
    })
    inpt_chooseVideo.click(() => {
        inpt_video.trigger("click");
    })
    inpt_choosePdf.click(() => {
        inpt_pdf.trigger("click");
    })
    inpt_image.change(async (event) => {
        await change_imageInputAsync(
            event,
            inpt_chooseImage,
            inpt_image,
            vid_machine,
            spn_fileStatus);
    })
    inpt_video.change(async (event) => {
        await change_videoInputAsync(
            event,
            inpt_chooseVideo,
            inpt_video,
            src_machine,
            vid_machine,
            spn_fileStatus);
    })
    inpt_pdf.change(async (event) => {
        await change_pdfInputAsync(
            event,
            inpt_choosePdf,
            inpt_pdf);
    })
    //#endregion

    //#region for articles page
    $("#div_sidebarMenuButton").click(async () => {
        //#region when articles page is opened
        if (div_article_display.attr("hidden") == undefined)
            setTimeout(async () => {
                await controlArticleWidthAsync();
                await alignArticlesAsAutoAsync();
            }, 500);
        //#endregion
    });
    slct_menubar.change(async () => {
        //#region set page mode
        let selectedMode = slct_menubar.val();

        switch (selectedMode) {
            case '0':  // display
                //#region reset bg color of selected articles for delete 
                for (let index in article_idsToBeDelete) {
                    let articleId = article_idsToBeDelete[index];

                    $("#" + articleId).css("background-color", "");
                }
                //#endregion

                //#region hide apply <button>
                slct_menubar_value = "display";
                article_idsToBeDelete = [];
                div_menubar_button.attr("hidden", "");
                //#endregion

                break;
            case '1':  // delete
                await removeLastUploadedArticleVideoAsync();

                //#region show apply <button>
                slct_menubar_value = "delete";
                div_menubar_button.removeAttr("hidden");
                //#endregion

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
        //#region click control of pagination buttons
        let clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (paginationInfos.HasPrevious)
                    await addMachineArticlesAsync(
                        paginationInfos.CurrentPageNo - 1,
                        true);

                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfos.HasNext)
                    await addMachineArticlesAsync(
                        paginationInfos.CurrentPageNo + 1,
                        true);

                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                //#region populate table
                let pageNo = clickedButton.prop("innerText");

                await addMachineArticlesAsync(
                    pageNo,
                    true);
                //#endregion

                break;
            //#endregion
        }
        //#endregion 
    })
    spn_eventManager.on("click_article", async (_, event) => {
        //#region when click to video, play image or pdf (return)
        if (event.target.id == div_article_video_id  // when article video clicked
            || event.target.className == "img_play"  // when play image clicked
            || event.target.innerText == "PDF")  // when pdf button clicked
            return;
        //#endregion

        //#region when click to other places
        let articleId = event.currentTarget.closest("article").id;
        idOfLastClickedArticle = articleId;

        switch (slct_menubar_value) {
            case "display":
                //#region open update page
                await removeLastUploadedArticleVideoAsync();

                //#region hide machine articles
                div_article_display.attr("hidden", "");
                div_article_update.removeAttr("hidden");
                //#endregion

                //#region set update page
                if (!isUpdatePageOpenedBefore) {
                    await machineForm_addElementNamesAsync(
                        btn_showImage,
                        btn_showVideo,
                        $("#div_imageInput"),
                        $("#div_videoInput"),
                        $("#div_pdfInput"),
                        $("#div_mainCategory"),
                        $("#div_subCategory"),
                        $("#div_model"),
                        $("#div_brand"),
                        $("#div_year"),
                        $("#div_stock"),
                        $("#div_sold"),
                        $("#div_rented"),
                        $("#div_handStatus"),
                        btn_descriptions_id,
                        btn_save);
                    await machineForm_populateSelectsAsync(
                        $("#" + slct_mainCategory_id));
                    await machineForm_populateInfoMessagesAsync();

                    isUpdatePageOpenedBefore = true;
                }

                else {
                    // show machine image
                    btn_showImage.trigger("click");

                    // update description button name
                    $("#" + btn_descriptions_id).empty()
                    $("#" + btn_descriptions_id).append(
                        `<b>${descriptions_baseButtonNameByLanguages[language]} (${language})</b>`)
                }
                //#endregion

                await addDefaultValueToInputsAsync();
                await showOrHideBackButtonAsync(
                    "show",
                    div_backButton,
                    div_panelTitle,
                    btn_back);
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
    spn_eventManager.on("click_articleVideoDiv", async (_, event) => {
        //#region when page mode is "delete"
        if (slct_menubar_value == "delete")
            return;
        //#endregion

        //#region get article id of clicked play <img>
        let articleId = event.target
            .closest("article")
            .id;
        //#endregion

        await click_articleVideoDivAsync($("#" + articleId));
    })
    spn_eventManager.on("ended_articleVideo", async () => {
        await ended_articleVideoAsync();
    })
    //#endregion

    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add panel title
        div_panelTitle.append(
            langPack_panelTitle[language]);
        //#endregion

        //#region populate menubar (dynamic)
        let menubarOptions = langPack_menubarOptions[language];

        for (let index = 0; index < menubarOptions.length; index += 1) {
            let menubarOption = menubarOptions[index];

            slct_menubar.append(`<option value="${index}">${menubarOption}</option>`);
        }
        //#endregion

        //#region add apply button name
        btn_menubar_apply.append(
            langPack_applyButton[language])
        //#endregion

        //#region add entity quantity message
        $(entityQuantity_id).append(
            `<b>0</b> ${langPack_entityQuantity[language]}`
        );
        //#endregion

        await addMachineArticlesAsync(pageNumber, true);
        await uploadDescriptionsEventsAsync();
    }
    async function addMachineArticlesAsync(pageNumber, refreshPaginationButtons) {
        //#region set page size
        await setVariablesForArticleAsync({
            "div_articles": div_articles,
            "path_articleVideos": path_videoFolderAfterWwwroot,
            "articleType": "videoAndText",
            "articleStyle": {
                "width": await getValidArticleWidthAsync(
                    { "width": 300, "marginR": 20, "marginL": 20 },
                    div_articles
                ),
                "height": 550,  // 560
                "marginT": 10,
                "marginB": 10,
                "marginR": 20,
                "marginL": 20,
                "paddingT": 10,
                "paddingB": 10,
                "paddingR": 10,
                "paddingL": 10,
                "border": 1,
                "borderColor": "blue",
                "boxShadow": "5px 5px 10px rgba(0, 0, 0, 0.3)",
                "bgColorForDelete": "rgb(220, 0, 0)"
            },
        });
        let articleCountOnOneRow = await getArticleCountOnOneRowAsync();

        pageSize = articleCountOnOneRow * pageRow;
        //#endregion

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
                    "totalArticleCount": response.length,
                });
                //#endregion

                addArticlesAsync(true)
                    .then(async () => {
                        await controlArticleWidthAsync();
                        await alignArticlesAsAutoAsync();
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
                                `<b>${machineCountOnPage}/${pageSize}</b> ${langPack_entityQuantity[language]}`,
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
                <h6>${machineInfos.descriptions[language].substring(0, descriptions_charQuantityToBeDisplayOnArticle)}...</h5>
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
    async function updateMachineAsync(
        data,
        oldMachineId,
        oldMainCategoryName,
        oldSubCategoryName
    ) {
        return new Promise(resolve => {
            $.ajax({
                method: "POST",
                url: (baseApiUrl + "/machine/update?" +
                    `language=${language}` +
                    `&id=${oldMachineId}` +
                    `&oldMainCategoryName=${oldMainCategoryName}` +
                    `&oldSubCategoryName=${oldSubCategoryName}`),
                headers: { "Authorization": jwtToken },
                crossDomain: true,
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: "json",
                success: () => {
                    resolve(true);
                },
                error: (response) => {
                    //#region write error
                    updateResultLabel(
                        "#" + spn_resultLabel_id,
                        JSON.parse(response.responseText).errorMessage,
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
                method: "POST",
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
                        "#" + spn_resultLabel_id,
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
                method: "POST",
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
                error: () => {
                    // write error
                    updateResultLabel(
                        "#" + spn_resultLabel_id,
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
                method: "POST",
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
                        "#" + spn_resultLabel_id,
                        errorMessagesByLanguages[language]["unsuccessfulPdfUpdating"],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);

                    resolve(false);
                }
            });
        });
    }
    async function updateArticleAsync(articleId, data) {
        //#region when image is changed
        let article = $("#" + articleId);

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

        //#region when pdf is changed
        if (data.pdfName != null) {
            article
                .find("#" + div_article_button_id + " a")
                .attr("href", "/" + path_pdfFolderAfterWwwroot + "/" + data.pdfName);
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
            method: "POST",
            url: (baseApiUrl + "/machine/delete" +
                `?language=${language}` +
                `&imageFolderPathAfterWwwroot=${path_imageFolderAfterWwwroot}` +
                `&videoFolderPathAfterWwwroot=${path_videoFolderAfterWwwroot}` +
                `&pdfFolderPathAfterWwwroot=${path_pdfFolderAfterWwwroot}`),
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
                        addMachineArticlesAsync(currentPageNo, true);  // refresh current page
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfos.HasPrevious)
                        addMachineArticlesAsync(currentPageNo - 1, true);
                    //#endregion

                    //#region when any machines not found
                    else {
                        //#region reset articles <div>
                        div_articles.empty();
                        div_articles.removeAttr("style");
                        //#endregion

                        updateResultLabel(
                            entityQuantity_id,
                            `<b>0/${pageSize}<b> ${langPack_entityQuantity[language]}`,
                            entityQuantity_color);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    addMachineArticlesAsync(currentPageNo, true);  // refresh current page
                //#endregion

                //#region change page mode
                slct_menubar_value = "display";
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
    async function saveClaimInfosToLocalAsync() {
        // if not exists on local
        if (localStorage.getItem(localKeys_claimInfos) == undefined) {
            claimInfos["roleLanguage"] = language;

            localStorage.setItem(
                localKeys_claimInfos,
                JSON.stringify(claimInfos));
        }
    }
    async function addDefaultValueToInputsAsync() {
        //#region machine image and video

        //#region add machine image and video
        let infosOFLastClickedArticle = article_idsAndMachineInfos[idOfLastClickedArticle];
        let videoExtensionStartIndex = infosOFLastClickedArticle.videoName.lastIndexOf('.') + 1;
        let videoType = infosOFLastClickedArticle.videoName.substring(videoExtensionStartIndex);

        // image
        vid_machine.attr(
            "poster",
            "/" + path_imageFolderAfterWwwroot + "/" + infosOFLastClickedArticle.imageName);

        // video
        src_machine.attr({
            "src": "/" + path_videoFolderAfterWwwroot + "/" + infosOFLastClickedArticle.videoName,
            "type": "video/" + videoType,
        })
        //#endregion

        //#region show machine image
        await machineForm_setMachineVideoSizeAsync(vid_machine);
        vid_machine.removeAttr("hidden");
        //#endregion

        //#endregion

        //#region other inputs
        inpt_chooseImage.val(infosOFLastClickedArticle["imageName"]);
        inpt_chooseVideo.val(infosOFLastClickedArticle["videoName"]);
        inpt_choosePdf.val(infosOFLastClickedArticle["pdfName"]);
        $("#slct_mainCategory").val(infosOFLastClickedArticle["mainCategoryName"]);
        $("#slct_subCategory").val(infosOFLastClickedArticle["subCategoryName"]);
        $("#inpt_model").val(infosOFLastClickedArticle["model"]);
        $("#inpt_brand").val(infosOFLastClickedArticle["brandName"]);
        $("#inpt_year").val(infosOFLastClickedArticle["year"]);
        $("#inpt_stock").val(infosOFLastClickedArticle["stock"]);
        $("#inpt_sold").val(infosOFLastClickedArticle["sold"]);
        $("#inpt_rented").val(infosOFLastClickedArticle["rented"]);
        $(`input[name= "handStatus"][value= "${infosOFLastClickedArticle.handStatus}"]`).attr("checked", "");
        //#endregion

        //#region descriptions
        $("#txt_descriptions").val(infosOFLastClickedArticle.descriptions[language]);

        await changeDescriptionsButtonColorAsync(
            $("#btn_descriptions"),
            descriptions_savedColor);
        await setVariablesForDescriptionsAsync("descriptions", {
            "byLanguages": infosOFLastClickedArticle.descriptions
        })
        //#endregion
    }
    //#endregion

    saveClaimInfosToLocalAsync();  // temporary!!!!! (until homepage ready)
    populateHtmlAsync();
})