import {
    addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticle, art_baseId,
    div_article_info_id,
    setHeightOfArticlesDivAsync,
    articleBuffer
} from "./miar_article.js";

import { getDateTimeInString, getPassedTimeInStringAsync, updateResultLabel } from "./miar_tools.js"


$(function () {
    //#region variables
    const div_articles = $("#div_articles");
    const pageNumber = 1;
    const pageSize = 10;
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
    const btn_accept = $("#btn_accept");
    const btn_reject = $("#btn_reject");
    const td_message = $("#td_message");
    const td_subject = $("#td_subject");
    const lbl_passedTime_id = "lbl_passedTime";
    const style_passedTimeLabel_answered = {
        "color": "#40C800",
    }
    const style_passedTimeLabel_unanswered = {
        "color": "red",
    }
    const img_loading = $("#img_loading");
    const languagePackage_sendererInfosKeys = {
        "TR": {
            "title": "Gönderen",
            "firstName": "Ad",
            "lastName": "Soyad",
            "company": "Şirket",
            "email": "Email",
            "phone": "Telefon",
            "createdAt": "Oluşturulma Tarihi"
        },
        "EN": {
            "title": "Senderer",
            "firstName": "Firstname",
            "lastName": "Lastname",
            "company": "Company",
            "email": "Email",
            "phone": "Phone",
            "createdAt": "Created Date"
        }
    }
    const languagePackage_answererInfosKeys = {
        "TR": {
            "title": "Cevaplayan",
            "firstName": "Ad",
            "lastName": "Soyad",
            "email": "Email",
            "answeredDate": "Cevaplanma Tarihi"
        },
        "EN": {
            "title": "Answerer",
            "firstName": "Firstname",
            "lastName": "Lastname",
            "email": "Email",
            "answeredDate": "Answered Date"
        }
    }
    const languagePackage_panelTitle = {
        "TR": "TEKLİF ALMA FORMU",
        "EN": "GET OFFER FORM"
    }
    const languagePackage_panelMenubar = {
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
    const languagePackage_completeButton = {
        "TR": "Tamamlandı",
        "EN": "Completed"
    }
    const languagePackage_formButtons = {
        "TR": {
            "accept": "Kabul Et",
            "reject": "Reddet"
        },
        "EN": {
            "accept": "Accept",
            "reject": "Reject"
        }
    }
    let article_IdsAndFormInfos = {};
    let displayingMode = "unanswered";
    let lastClickedArticleInfos = {};
    //#endregion

    //#region events
    $(window).resize(() => {
        //#region realign articles to center
        setTimeout(async () => {
            await alignArticlesToCenterAsync()
        }, 500);
        //#endregion
    })
    $("#div_sidebarMenuButton").click(async () => {
        //#region realign articles to center
        setTimeout(async () => {
            await alignArticlesToCenterAsync()
        }, 500);
        //#endregion
    })
    slct_menubar.change(async (event) => {
        displayingMode = slct_menubar.val();

        await addFormArticlesAsync();
    })
    div_backButton.click(async () => {
        await resetFormDetailsPageAsync();

        //#region show articles
        div_panelTitle.css("padding-left", "");
        div_article_details.attr("hidden", "");  // hide form details page
        div_backButton.attr("hidden", "");  // remove back button
        div_article_display.removeAttr("hidden");  // show articles page
        //#endregion

        await alignArticlesToCenterAsync();
    })
    btn_complete.click(async () => {
        // answer the form
        $.ajax({
            method: "GET",
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
                img_loading.attr("hidden", "");  // show loading image

                //#region add answerer infos to form
                btn_complete.attr("disabled", "");
                addAnswererInfosToFormAsync(answererInfos);
                //#endregion

                //#region hide article when "unanswered" form is displaying
                let answeredArticle = div_articles
                    .find("#" + lastClickedArticleInfos.articleId);

                if (displayingMode == "unanswered")
                    answeredArticle.attr("hidden", "");
                //#endregion

                //#region add checked image to article when "all" from is displaying"
                else if (displayingMode == "all") {
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
            },
            error: () => {
                alert("An Error Occured, Please Try Again.");
            }
        })

        return;
    });
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

        //#region add senderer infos
        let formInfos = article_IdsAndFormInfos[article_id];
        let sendererInfosKeys = languagePackage_sendererInfosKeys[language];

        // add senderer table title
        tbl_sendererInfos.children("thead")
            .append(`
                <tr>
                    <th colspan=3;  style="text-align:center">${languagePackage_sendererInfosKeys[language].title}</th>
                </tr>`
            );

        // populate senderer table
        tbl_sendererInfos.children("tbody")
            .append(`
                <tr>
                    <td>${sendererInfosKeys.firstName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.firstName}</td>
                </tr>
                <tr>
                    <td>${sendererInfosKeys.lastName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.lastName}</td>
                </tr>
                <tr>
                    <td>${sendererInfosKeys.company}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.company}</td>
                </tr>
                <tr>
                    <td>${sendererInfosKeys.phone}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.phone}</td>
                </tr>
                <tr>
                    <td>${sendererInfosKeys.email}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.email}</td>
                </tr>
                <tr>
                    <td>${sendererInfosKeys.createdAt}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${getDateTimeInString(formInfos.createdAt)}</td >
                </tr>
            `);
        //#endregion

        //#region add answerer infos if form answered
        if (displayingMode == "answered"
            || (displayingMode == "all" && formInfos.isAnswered == true))  // when all form type is displaying
        {
            btn_complete.attr("disabled", "");
            await addAnswererInfosToFormAsync();
        }
        //#endregion

        //#region add subject and message
        td_subject.append(formInfos["subject"]);
        td_message.append(formInfos["message"]);
        //#endregion
    })
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region add panel title
        $("#div_panelTitle").append(
            languagePackage_panelTitle[language])
        //#endregion

        //#region populate panel menubar
        for (let key in languagePackage_panelMenubar[language]) {
            let option = languagePackage_panelMenubar[language][key];

            slct_menubar.append(`
                <option value=${key}>${option}</option>
            `);
        }
        //#endregion

        //#region populate "complete button"
        btn_complete.append(
            languagePackage_completeButton[language]);
        //#endregion

        await addFormArticlesAsync();
    }

    async function addFormArticlesAsync() {
        //#region set params which "getAnsweredForms"
        let selectedMenubar = slct_menubar.val();

        let query_getAnsweredForms = (selectedMenubar == "answered" ?
            true  // get answered forms
            : selectedMenubar == "unanswered" ?
                false  // get unanswered forms
                : '');  // get answered and unanswered forms;
        //#endregion

        //#region add form articles (ajax)
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/form/display/generalCommunication" +
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
                // reset articles
                div_articles.empty();

                setVariablesForArticle({
                    "div_articles": div_articles
                })
            },
            success: (response, status, xhr) => {
                new Promise(async (resolve) => {
                    //#region add <article>s
                    setVariablesForArticle({
                        "totalArticalCount": response.length,
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
                    await setHeightOfArticlesDivAsync();
                    await addArticlesAsync("text");
                    await alignArticlesToCenterAsync();
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

                        div_article_info
                            .children("#" + div_passedTimeLabel_id)
                            .css("margin-top", div_passedTimeLabel_marginT);
                        //#endregion
                    }
                    //#endregion

                    resolve();
                });
            },
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

    async function addAnswererInfosToFormAsync(answererInfos = null) {
        //#region add answerer table title
        let answererInfosKeys = languagePackage_answererInfosKeys[language];

        tbl_answererInfos.children("thead")
            .append(`
                <tr>
                    <th colspan=3  style="text-align:center">${languagePackage_answererInfosKeys[language].title}</th>
                </tr>
            `);
        //#endregion

        //#region populate answerer table
        // when answererInfos is not entered
        if (answererInfos == null)
            answererInfos = lastClickedArticleInfos;

        // populate table
        tbl_answererInfos.children("tbody")
            .append(`
                <tr>
                    <td>${answererInfosKeys.firstName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${answererInfos.answererFirstName}</td>
                </tr>
                <tr>
                    <td>${answererInfosKeys.lastName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${answererInfos.answererLastName}</td>
                </tr>
                <tr>
                    <td>${answererInfosKeys.email}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${answererInfos.answererEmail}</td>
                </tr>
                <tr>
                    <td>${answererInfosKeys.answeredDate}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${getDateTimeInString(answererInfos.answeredDate)}</td >
                </tr>
            `);
        //#endregion
    }
    //#endregion

    populateHtmlAsync();
})