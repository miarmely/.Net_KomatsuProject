import {
    addArticlesAsync, setVariablesForArticleAsync, art_baseId, div_article_info_id,
    articleBuffer, addMsgWithImgToDivArticlesAsync, alignArticlesAsync
} from "./miar_article.js";

import {
    addAnswererInfosToFormAsync, addSendererInfosToFormAsync, langPack_sendererInfosTable,
    langPack_answererInfosTable,
    resetPanelFooterAsync
} from "./miar_form.js";

import {
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync, updateResultLabel,
    getPassedTimeInStringAsync
} from "./miar_tools.js"


$(function () {
    //#region variables
    const div_articles = $("#div_articles");
    const pageSize = 3;
    const pagination_buttonCount = 5;
    const pagination_headerNames = {
        "unanswered": "Form-Gc-Unanswered",
        "answered": "Form-Gc-Answered",
        "all": "Form-Gc-All"
    }
    const ul_pagination = $("#ul_pagination");
    const article_maxMessageCount = 100;
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
    const slct_menubar = $("#slct_menubar");
    const btn_complete = $("#btn_complete");
    const td_message = $("#td_message");
    const td_subject = $("#td_subject");
    const lbl_entityQuantity_id = "small_entityQuantity";
    const lbl_entityQuantity_color = "#7A7A7A";
    const lbl_passedTime_id = "lbl_passedTime";
    const style_passedTimeLabel_answered = {
        "color": "#40C800",
    }
    const style_passedTimeLabel_unanswered = {
        "color": "red",
    }
    const img_loading = $("#img_loading");
    const langPack_panelTitle = {
        "TR": "GENEL İLETİŞİM FORMU",
        "EN": "GENERAL COMMUNICATION FORM"
    }
    const langPack_panelMenubar = {
        "TR": {
            "unanswered": "Tamamlanmamış",
            "answered": "Tamamlanmış",
            "all": "Hepsi"
        },
        "EN": {
            "unanswered": "Not Completed",
            "answered": "Completed",
            "all": "All"
        }
    }
    const langPack_completeButton = {
        "TR": "Tamamlandı",
        "EN": "Completed"
    }
    const langPack_msgWhenFormNotExists = {
        "TR": {
            "unanswered": {
                "msg": "Tüm Formlar Cevaplanmış",
                "imgPath": path_checkedImage,
            },
            "answered": {
                "msg": "Form Bulunamadı",
                "imgPath": path_questionImage,
            },
            "all": {
                "msg": "Form Bulunamadı",
                "imgPath": path_questionImage,
            }
        },
        "EN": {
            "unanswered": {
                "msg": "All Forms Is Answered",
                "imgPath": path_checkedImage,
            },
            "answered": {
                "msg": "Form Not Found",
                "imgPath": path_questionImage,
            },
            "all": {
                "msg": "Form Not Found",
                "imgPath": path_questionImage,
            }
        }
    }
    const langPack_entityQuantityMessage = {
        "TR": "form gösteriliyor",
        "EN": "form displaying"
    };
    let pageNumber = 1;
    let pagination_formInfos = {};
    let article_IdsAndFormInfos = {};
    let slct_menubar_value = "unanswered";
    let lastClickedArticleInfos = {};
    let isLastFormAnswered = false;
    //#endregion

    //#region events
    $(window).resize(async () => {
        // realign articles
        if (articleBuffer.totalArticleCount > 0)
            await alignArticlesAsync()
    })
    $("#div_sidebarMenuButton").click(async () => {
        // realing articles
        if (articleBuffer.totalArticleCount > 0)
            await alignArticlesAsync();
    })
    slct_menubar.change(async () => {
        slct_menubar_value = slct_menubar.val();

        await resetPanelFooterAsync(
            $("#" + lbl_entityQuantity_id),
            pageSize,
            langPack_entityQuantityMessage[language],
            ul_pagination);
        await addFormArticlesAsync();
    })
    div_backButton.click(async () => {
        await resetFormDetailsPageAsync(
            div_sendererInfos,
            div_answererInfos);

        //#region show articles
        // hide form details
        div_panelTitle.css("padding-left", "");
        div_article_details.attr("hidden", "");
        div_backButton.attr("hidden", "");

        // show articles pages
        div_article_display.removeAttr("hidden");
        //#endregion

        //#region when any form on page is exists
        if (articleBuffer.totalArticleCount > 0) {
            //#region when last form is answered
            if (isLastFormAnswered) {
                isLastFormAnswered = false;  // reset

                await addFormArticlesAsync();
            }
            //#endregion

            //#region when last closed form isn't answered
            else
                await alignArticlesAsync();
            //#endregion
        }
        //#endregion

        //#region when all forms on page is answered
        else {
            //#region when previous page is exists
            isLastFormAnswered = false;  // reset

            if (pagination_formInfos.HasPrevious) {
                pageNumber--;
                await addFormArticlesAsync();
            }
            //#endregion

            //#region when all form is answered
            else {
                //#region reset div_articles
                div_articles.empty();
                div_articles.removeAttr("style");
                //#endregion

                await resetPanelFooterAsync(
                    $("#" + lbl_entityQuantity_id),
                    pageSize,
                    langPack_entityQuantityMessage[language],
                    ul_pagination);
                await addMsgWithImgToDivArticlesAsync(
                    langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgPath"],
                    langPack_msgWhenFormNotExists[language][slct_menubar_value]["imgAlt"],
                    langPack_msgWhenFormNotExists[language][slct_menubar_value]["msg"]);
            }
            //#endregion
        }
        //#endregion
    })
    btn_complete.click(async () => {
        // answer the form
        $.ajax({
            method: "PUT",
            url: (baseApiUrl + "/form/answer/generalCommunication" +
                `?language=${language}` +
                `&FormId=${lastClickedArticleInfos.formId}`),
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
                    btn_complete.attr("disabled", "");
                    isLastFormAnswered = true;
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
                        answererInfos);

                    //#region add checked image to article when "all" from is displaying"
                    let answeredArticle = $("#" + lastClickedArticleInfos.articleId);

                    if (slct_menubar_value == "all") {
                        // add checkedImage to article
                        answeredArticle
                            .find("img")
                            .attr("src", path_checkedImage);

                        // change color of lbl_passedTime
                        answeredArticle
                            .find("#" + lbl_passedTime_id)
                            .css("color", style_passedTimeLabel_answered.color)
                    }

                    //#endregion

                    resolve();
                });
            },
            error: () => {
                // hide loading image
                img_loading.attr("hidden", "");
            }
        })

        return;
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
        let btn_back_width = div_backButton.prop("offsetWidth");
        div_panelTitle.css("padding-left", btn_back_width);
        //#endregion

        await addSendererInfosToFormAsync(
            tbl_sendererInfos,
            langPack_sendererInfosTable[language],
            lastClickedArticleInfos);

        //#region add answerer infos if form answered
        if (slct_menubar_value == "answered"
            || (slct_menubar_value == "all" && lastClickedArticleInfos.isAnswered == true))  // when all form type is displaying
        {
            btn_complete.attr("disabled", "");

            await addAnswererInfosToFormAsync(
                tbl_answererInfos,
                langPack_answererInfosTable[language],
                lastClickedArticleInfos);
        }
        //#endregion

        //#region add subject and message
        td_subject.append(lastClickedArticleInfos.subject);
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

        //#region populate "complete button"
        btn_complete.append(
            langPack_completeButton[language]);
        //#endregion

        await addFormArticlesAsync();
    }

    async function addFormArticlesAsync() {
        //#region set "getAnsweredForms" param
        let selectedMenubar = slct_menubar.val();

        let query_getAnsweredForms = (selectedMenubar == "answered" ?
            true  // get answered forms
            : selectedMenubar == "unanswered" ?
                false  // get unanswered forms
                : '');  // get answered and unanswered forms;
        //#endregion

        //#region add form articles and populate (ajax)
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/form/display/generalCommunication/all" +
                `?language=${language}` +
                `&PageNumber=${pageNumber}` +
                `&PageSize=${pageSize}` +
                `&GetAnsweredForms=${query_getAnsweredForms}`),
            headers: {
                "authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                // reset div_articles
                div_articles.empty();
                div_articles.removeAttr("style");

                setVariablesForArticleAsync({ "div_articles": div_articles })
            },
            success: (response, status, xhr) => {
                new Promise(async (resolve) => {
                    //#region add <article>s
                    setVariablesForArticleAsync({
                        "totalArticleCount": response.length,
                        "articleType": "text",
                        "articleStyle": {
                            "width": 300,
                            "height": 350,
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
                        }
                    });
                    await addArticlesAsync(true);
                    await alignArticlesAsync();
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
                        let div_article_info = article.children("#" + div_article_info_id);
                        let formType = "unanswered";
                        //#endregion

                        //#region save article infos
                        let formInfos = response[index];
                        article_IdsAndFormInfos[articleId] = formInfos;
                        //#endregion

                        //#region set form type

                        //#region when "all" form types is displaying
                        if (query_getAnsweredForms == '') {
                            // when form type is "answered"
                            if (formInfos.isAnswered)
                                formType = "answered";

                            // when form type is "unanswered"
                            else
                                formType = "unanswered";
                        }
                        //#endregion

                        //#region when "answered" form types is displaying
                        else if (query_getAnsweredForms)
                            formType = "answered";
                        //#endregion

                        //#region when "unanswered" form types is displaying
                        else
                            formType = "unanswered";
                        //#endregion

                        //#endregion

                        //#region populate articles
                        div_article_info.append(`
                            <div id="${div_identity_id}">
                                <img src="" style="width:40px; height:40px; margin-bottom:10px"></img>
                                <h2 style="margin-top:5px">${formInfos.company}</h2>
                                <h4 style="margin-top:5px;">${formInfos.firstName} ${formInfos.lastName}</h4>
                                <h4 style="margin-top:25px; margin-bottom:8px">${formInfos.subject}</h4>
                                <p>${formInfos.message.substring(0, article_maxMessageCount)}...</p>
                            </div>                                
                            <div id="${div_passedTimeLabel_id}">
                                <h4 id="${lbl_passedTime_id}">${await getPassedTimeInStringAsync(formInfos.createdAt)}</h4>
                            </div>
                        `);
                        //#endregion

                        //#region add img to article and style to passedTimeLabel

                        //#region when form type is "answered"
                        if (formType == "answered") {
                            // add image to article
                            div_article_info.find("img")
                                .attr("src", path_checkedImage);

                            // add style to "passedTimeLabel"
                            div_article_info.find("#" + lbl_passedTime_id)
                                .css(style_passedTimeLabel_answered)
                        }
                        //#endregion

                        //#region when form type is "unanswered"
                        else {
                            // add image to article
                            div_article_info.find("img")
                                .attr("src", path_questionImage);

                            // add style to "passedTimeLabel"
                            div_article_info.find("#" + lbl_passedTime_id)
                                .css(style_passedTimeLabel_unanswered)

                        }
                        //#endregion

                        //#endregion

                        //#region shift lbl_passedTime to end of article
                        let style = articleBuffer.articleStyle;
                        let netArticleHeight = style.height - ((style.border * 2) + style.paddingT + style.paddingB);
                        let div_identity = div_article_info.children("#" + div_identity_id);
                        let div_passedTimeLabel = div_article_info.children("#" + div_passedTimeLabel_id);
                        let div_passedTimeLabel_marginT = netArticleHeight - div_identity.prop("offsetHeight") - div_passedTimeLabel.prop("offsetHeight");

                        div_passedTimeLabel.css("margin-top", div_passedTimeLabel_marginT);
                        //#endregion
                    }
                    //#endregion

                    //#region update entity quantity label
                    pagination_formInfos = JSON.parse(
                        xhr.getResponseHeader(pagination_headerNames[slct_menubar_value]));

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

    async function resetFormDetailsPageAsync() {
        // remove sender infos
        div_sendererInfos.find("thead").empty();
        div_sendererInfos.find("tbody").empty();

        // remove answerer infos
        div_answererInfos.find("thead").empty();
        div_answererInfos.find("tbody").empty();

        // remove subject and message
        td_subject.empty();
        td_message.empty();

        // remove button
        btn_complete.reset;
        btn_complete.removeAttr("disabled");
    }
    //#endregion

    populateHtmlAsync();
})