import {
    addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticleAsync, art_baseId,
    div_article_info_id, setHeightOfArticlesDivAsync, articleBuffer, div_article_image_id,
    style_img_width_IT, style_img_height_IT, style_div_info_height_IT,
    addMsgWithImgToDivArticlesAsync
} from "./miar_article.js";

import {
    addAnswererInfosToFormAsync, addSendererInfosToFormAsync, langPack_answererInfosTable,
    langPack_sendererInfosTable, resetFormDetailsPageAsync
} from "./miar_form.js";

import {
    getPassedTimeInStringAsync, updateResultLabel, addPaginationButtonsAsync,
    controlPaginationBackAndNextButtonsAsync
} from "./miar_tools.js"


$(function () {
    //#region variables
    const div_articles = $("#div_articles");
    const pageSize = 10;
    const pagination_buttonCount = 5;
    const pagination_headerNames = {
        "waiting": "Form-Go-Waiting",
        "accepted": "Form-Go-Accepted",
        "rejected": "Form-Go-Rejected"
    }
    const ul_pagination = $("#ul_pagination");
    const article_maxMessageCount = 150;
    const div_identity_id = "div_identity";
    const div_article_display = $("#div_article_display");
    const div_article_details = $("#div_article_details");
    const div_backButton = $("#div_backButton");
    const div_sendererInfos = $("#div_sendererInfos");
    const div_answererInfos = $("#div_answererInfos");
    const div_panelTitle = $("#div_panelTitle");
    const div_passedTimeLabel_id = "div_passedTimeLabel";
    const tbl_sendererInfos = div_sendererInfos.children("table");
    const tbl_answererInfos = div_answererInfos.children("table");
    const path_checkedImage = "/images/checked.png";
    const path_questionImage = "/images/question.png";
    const path_cancelImage = "/images/cancel.png";
    const path_machineImageFolderPath = "/images/machines";
    const slct_menubar = $("#slct_menubar");
    const btn_accept = $("#btn_accept");
    const btn_reject = $("#btn_reject");
    const td_model = $("#td_model");
    const td_mainCategory = $("#td_mainCategory");
    const td_subCategory = $("#td_subCategory");
    const td_message = $("#td_message");
    const lbl_entityQuantity_id = "small_entityQuantity";
    const lbl_entityQuantity_color = "#7A7A7A";
    const lbl_passedTime_id = "lbl_passedTime";
    const style_passedTimeLabel_waiting = {
        "color": "red",
    };
    const style_passedTimeLabel_accepted = {
        "color": "#40C800"  // green
    };
    const style_passedTimeLabel_rejected = {
        "color": "red"  // green
    };
    const img_loading = $("#img_loading");
    const img_machine_id = "img_machine";
    const img_formStatus_id = "img_formStatus";
    const img_formStatus_style = {
        "width": 40,
        "height": 40,
        "marginB": 10
    };
    const langPack_panelTitle = {
        "TR": "TEKLİF ALMA FORMU",
        "EN": "GET OFFER FORM"
    };
    const langPack_panelMenubar = {
        "TR": {
            "waiting": "Bekleyen",
            "accepted": "Kabul Edilen",
            "rejected": "Reddedilen"
        },
        "EN": {
            "waiting": "Waiting",
            "accepted": "Accepted",
            "rejected": "Rejected"
        }
    };
    const langPack_formButtons = {
        "TR": {
            "accept": "Kabul Et",
            "reject": "Reddet"
        },
        "EN": {
            "accept": "Accept",
            "reject": "Reject"
        }
    };
    const langPack_msgWhenFormNotExists = {
        "TR": {
            "waiting": {
                "msg": "Tüm Formlar Cevaplanmış",
                "imgAlt": "answered",
                "imgPath": path_checkedImage
            },
            "accepted": {
                "msg": "Form Bulunamadı",
                "imgAlt": "not found",
                "imgPath": path_questionImage
            },
            "rejected": {
                "msg": "Form Bulunamadı",
                "imgAlt": "not found",
                "imgPath": path_questionImage
            }
        },
        "EN": {
            "waiting": {
                "msg": "All Forms Is Answered",
                "imgAlt": "answered",
                "imgPath": path_checkedImage
            },
            "accepted": {
                "msg": "Form Not Found",
                "imgAlt": "not found",
                "imgPath": path_questionImage
            },
            "rejected": {
                "msg": "Form Not Found",
                "imgAlt": "not found",
                "imgPath": path_questionImage
            }
        }
    };
    const langPack_entityQuantityMessage = {
        "TR": "form gösteriliyor",
        "EN": "form displaying"
    };
    let pageNumber = 1;
    let pagination_formInfos = {};
    let article_IdsAndFormInfos = {};
    let slct_menubar_value = "waiting";
    let lastClickedArticleInfos = {};
    let isWindowResizeInCriticalSection = false;
    //#endregion

    //#region events
    $(window).resize(() => {
        //#region realign articles to center
        if (!isWindowResizeInCriticalSection
            && articleBuffer.totalArticleCount > 0
        ) {
            isWindowResizeInCriticalSection = true;

            // realign
            setTimeout(async () => {
                await alignArticlesToCenterAsync();
                await setHeightOfArticlesDivAsync();

                isWindowResizeInCriticalSection = false;
            }, 500);
        }
        //#endregion
    })
    $("#div_sidebarMenuButton").click(async () => {
        //#region realign articles to center
        if (!isWindowResizeInCriticalSection
            && articleBuffer.totalArticleCount > 0
        ) {
            isWindowResizeInCriticalSection = true;

            setTimeout(async () => {
                await alignArticlesToCenterAsync()
                await setHeightOfArticlesDivAsync();

                isWindowResizeInCriticalSection = false;
            }, 500);
        }
        //#endregion
    })
    slct_menubar.change(async (event) => {
        slct_menubar_value = slct_menubar.val();

        await addFormArticlesAsync();
    })
    div_backButton.click(async () => {
        await resetFormDetailsPageAsync(
            div_sendererInfos,
            div_answererInfos);

        //#region show articles
        div_panelTitle.css("padding-left", "");
        div_article_details.attr("hidden", "");  // hide form details page
        div_backButton.attr("hidden", "");  // remove back button
        div_article_display.removeAttr("hidden");  // show articles page
        //#endregion

        //#region when any unanswered article is exists
        if (articleBuffer.totalArticleCount > 0) {
            await alignArticlesToCenterAsync();
            await setHeightOfArticlesDivAsync();
        }
        //#endregion

        //#region when all articles is answered
        else
            await addMsgWithImgToDivArticlesAsync(
                langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgPath"],
                langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgAlt"],
                langPack_msgWhenFormNotExists[language][slct_menubar_value]["msg"]);
        //#endregion
    })
    btn_accept.click(async () => {
        await answerTheFormAsync("accepted");
    });
    btn_reject.click(async () => {
        await answerTheFormAsync("rejected");
    })
    ul_pagination.click(async () => {
        //#region click control of pagination buttons
        let clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (pagination_formInfos.HasPrevious) {
                    pageNumber--;
                    await addFormArticlesAsync();
                }
                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (pagination_formInfos.HasNext) {
                    pageNumber++;
                    await addFormArticlesAsync();
                }
                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                let clickedPageNo = clickedButton.prop("innerText");
                pageNumber = clickedPageNo;

                await addFormArticlesAsync();
                break;
            //#endregion
        }
        //#endregion 
    })
    spn_eventManager.on("click_article", async (_, event) => {
        //#region save clicked article infos
        let article_id = event.currentTarget.id;
        lastClickedArticleInfos = article_IdsAndFormInfos[article_id];
        lastClickedArticleInfos["articleId"] = article_id;
        //#endregion

        //#region hide articles and show article details
        div_article_display.attr("hidden", "");
        div_article_details.removeAttr("hidden");
        div_backButton.removeAttr("hidden");
        //#endregion

        //#region shift panel title to right
        div_panelTitle.css(
            "padding-left",
            div_backButton.prop("offsetWidth"));
        //#endregion

        await addSendererInfosToFormAsync(
            tbl_sendererInfos,
            langPack_sendererInfosTable[language],
            lastClickedArticleInfos,);

        //#region add answerer infos if form answered
        if (slct_menubar_value == "accepted"
            || slct_menubar_value == "rejected") {
            // disable form buttons
            btn_accept.attr("disabled", "");
            btn_reject.attr("disabled", "");

            await addAnswererInfosToFormAsync(
                tbl_answererInfos,
                langPack_answererInfosTable[language],
                lastClickedArticleInfos);
        }
        //#endregion

        //#region add form contents
        td_model.append(lastClickedArticleInfos.model);
        td_mainCategory.append(lastClickedArticleInfos.mainCategoryName);
        td_subCategory.append(lastClickedArticleInfos.subCategoryName);
        td_message.append(lastClickedArticleInfos.message);
        //#endregion
    })
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add panel title
        $("#div_panelTitle").append(
            langPack_panelTitle[language])
        //#endregion

        //#region populate panel menubar
        for (let key in langPack_panelMenubar[language]) {
            let option = langPack_panelMenubar[language][key];

            slct_menubar.append(`
                <option value=${key}>${option}</option>
            `);
        }
        //#endregion

        //#region populate "accept" and "reject" buttons
        btn_accept.append(
            langPack_formButtons[language]["accept"]);

        btn_reject.append(
            langPack_formButtons[language]["reject"]);
        //#endregion

        await addFormArticlesAsync();
    }

    async function addFormArticlesAsync() {
        //#region set "formStatus" param
        let selectedOption = slct_menubar.val();

        let param_formStatus = selectedOption == "waiting" ?
            1
            : selectedOption == "accepted" ?
                2 : 3  // formStatuses == "rejected"
        //#endregion

        //#region add form articles and populate (ajax)
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/form/display/getOffer/all" +
                `?language=${language}` +
                `&pageNumber=${pageNumber}` +
                `&pageSize=${pageSize}` +
                `&formStatus=${param_formStatus}`),
            headers: {
                "authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                // reset div_articles
                div_articles.empty();
                div_articles.removeAttr("style");

                setVariablesForArticleAsync({ "div_articles": div_articles });
            },
            success: (response, status, xhr) => {
                new Promise(async (resolve) => {
                    //#region add <article>s
                    setVariablesForArticleAsync({
                        "totalArticleCount": response.length,
                        "articleType": "imageAndText",
                        "articleStyle": {
                            "width": 370,
                            "height": 560,
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
                    await addArticlesAsync(true);
                    await alignArticlesToCenterAsync();
                    await setHeightOfArticlesDivAsync();
                    //#endregion

                    //#region declare events
                    $(".article").click((event) =>
                        spn_eventManager.trigger("click_article", [event]));
                    //#endregion

                    //#region populate articles
                    for (let index in response) {
                        //#region set variables
                        let articleId = art_baseId + index;
                        let article = $("#" + articleId);
                        let div_article_image = article.find("#" + div_article_image_id);
                        let div_article_info = article.find("#" + div_article_info_id);
                        //#endregion

                        //#region save article infos
                        let formInfos = response[index];
                        article_IdsAndFormInfos[articleId] = formInfos;
                        //#endregion

                        //#region populate articles
                        // add machine image
                        div_article_image.append(`
                            <div>
                                <img id="${img_formStatus_id}"  style="width:${img_formStatus_style.width}px;  height:${img_formStatus_style.height}px;  margin-bottom:${img_formStatus_style.marginB}px;"  src="" />
                            </div>
                            <div>
                                <img id="${img_machine_id}"  src="${path_machineImageFolderPath}/${formInfos.imageName}"  style="max-width:${style_img_width_IT}px;  max-height:${style_img_height_IT - img_formStatus_style.height - img_formStatus_style.marginB}px"/>
                            </div>
                        `);

                        // add form infos
                        div_article_info.append(`
                            <div id="${div_identity_id}">
                                <h2 style="margin-bottom: 20px">${formInfos.model}</h2>
                                <h3 style="margin-bottom: 3px">${formInfos.company}</h3>
                                <h4 style="margin-bottom: 20px">${formInfos.firstName} ${formInfos.lastName}</h4>
                                <h5>${formInfos.message.substring(0, article_maxMessageCount)}...</h5>
                            </div>
                            <div id="${div_passedTimeLabel_id}">
                                <h4 id="${lbl_passedTime_id}">${await getPassedTimeInStringAsync(formInfos.createdAt)}</h4>
                            </div>
                        `);
                        //#endregion

                        //#region add form status image and passedTimeLabel style
                        let img_formStatus = div_article_image.find("#" + img_formStatus_id);
                        let lbl_passedTime = div_article_info.find("#" + lbl_passedTime_id);

                        switch (param_formStatus) {
                            case 1:  // "waiting"
                                img_formStatus.attr("src", path_questionImage);
                                lbl_passedTime.css(style_passedTimeLabel_waiting);
                                break;

                            case 2:  // "accepted"
                                img_formStatus.attr("src", path_checkedImage);
                                lbl_passedTime.css(style_passedTimeLabel_accepted);
                                break;

                            case 3:  // "rejected"
                                img_formStatus.attr("src", path_cancelImage);
                                lbl_passedTime.css(style_passedTimeLabel_rejected);
                                break;
                        }
                        //#endregion

                        //#region shift div_passedTimeLabel to end of article
                        let div_identity = div_article_info.children("#" + div_identity_id);
                        let div_passedTimeLabel = div_article_info.children("#" + div_passedTimeLabel_id);
                        let div_article_infos_whiteSpace = style_div_info_height_IT - div_identity.prop("offsetHeight") - div_passedTimeLabel.prop("offsetHeight");

                        div_passedTimeLabel.css("margin-top", div_article_infos_whiteSpace);
                        //#endregion
                    }
                    //#endregion

                    //#region update entity quantity label
                    pagination_formInfos = JSON.parse(xhr
                        .getResponseHeader(pagination_headerNames[slct_menubar_value]));

                    updateResultLabel(
                        "#" + lbl_entityQuantity_id,
                        `<b>${pagination_formInfos.CurrentPageCount}/${pageSize}</b> ${langPack_entityQuantityMessage[language]}`,
                        lbl_entityQuantity_color
                    );
                    //#endregion

                    //#region add pagination buttons
                    // get pagination infos from header
                    await addPaginationButtonsAsync(
                        pagination_formInfos,
                        pagination_buttonCount,
                        ul_pagination);

                    await controlPaginationBackAndNextButtonsAsync(pagination_formInfos);
                    //#endregion

                    resolve();
                });
            },
            error: (response) => {
                new Promise(async resolve => {
                    //#region when all forms is answered
                    let errorDetails = JSON.parse(response.responseText);

                    if (errorDetails.errorCode == "NF-Fo")  // NF-Fo: Not Found - Form
                        await addMsgWithImgToDivArticlesAsync(
                            langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgPath"],
                            langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgAlt"],
                            langPack_msgWhenFormNotExists[language][slct_menubar_value]["msg"]);
                    //#endregion

                    resolve();
                })
            }
        })
        //#endregion
    }

    async function answerTheFormAsync(formStatus) {
        //#region set form status param
        let param_formStatus = formStatus == "accepted" ?
            2 : 3  // rejected
        //#endregion

        // answer the form
        $.ajax({
            method: "PUT",
            url: (baseApiUrl + "/form/answer/getOffer" +
                `?language=${language}` +
                `&FormId=${lastClickedArticleInfos.formId}` +
                `&FormStatus=${param_formStatus}`),
            headers: { "authorization": jwtToken },
            contentType: "appication/json",
            dataType: "json",
            beforeSend: () => {
                // show loading image
                img_loading.removeAttr("hidden");
            },
            success: (answererInfos) => {
                new Promise(async resolve => {
                    //#region before start
                    img_loading.attr("hidden", "");
                    btn_accept.attr("disabled", "");
                    btn_reject.attr("disabled", "");
                    //#endregion

                    //#region when all articles is answered
                    // reduce total artical count
                    await setVariablesForArticleAsync({
                        "totalArticleCount": articleBuffer.totalArticleCount - 1
                    });

                    // reset article style
                    if (articleBuffer.totalArticleCount == 0)
                        div_articles.removeAttr("style");
                    //#endregion

                    await addAnswererInfosToFormAsync(
                        tbl_answererInfos,
                        langPack_answererInfosTable[language],
                        answererInfos
                    );

                    //#region hide article when "waiting" forms is displaying
                    if (slct_menubar_value == "waiting") {
                        let answeredArticle = div_articles
                            .find("#" + lastClickedArticleInfos.articleId);

                        answeredArticle.attr("hidden", "");
                    }
                    //#endregion

                    resolve();
                })
            },
            error: () => {
                alert("An Error Occured, Please Try Again.");
            }
        })
    }
    //#endregion

    populateHtmlAsync();
})