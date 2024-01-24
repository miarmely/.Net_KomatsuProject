import {
    addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticle, art_baseId,
    div_article_info_id,
    setHeightOfArticlesDivAsync
} from "./miar_article.js";

import { getDateTimeInString, getPassedTimeInStringAsync } from "./miar_tools.js"


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
    const div_ownerInfos = $("#div_ownerInfos");
    const div_answererInfos = $("#div_answererInfos");
    const div_content = $("#div_content");
    const tbl_ownerInfos = div_ownerInfos.children("table");
    const tbl_answererInfos = div_answererInfos.children("table");
    const path_checkedImage = "/images/checked.png";
    const path_questionImage = "/images/question.png";
    const slct_menubar = $("#slct_menubar");
    const btn_complete = $("#btn_complete");
    const languagePackage_ownerInfosKeys = {
        "TR": {
            "title": "Gönderen",
            "firstName": "Ad",
            "lastName": "Soyad",
            "company": "Şirket",
            "email": "Email",
            "phone": "Telefon",
        },
        "EN": {
            "title": "Senderer",
            "firstName": "Firstname",
            "lastName": "Lastname",
            "company": "Company",
            "email": "Email",
            "phone": "Phone",
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
        "TR": "GENEL İLETİŞİM FORMU",
        "EN": "GENERAL COMMUNICATION FORM"
    }
    const languagePackage_panelMenubar = {
        "TR": {
            "answered": "Tamamlanmış",
            "unanswered": "Tamamlanmamış",
            "all": "Hepsi"
        },
        "EN": {
            "answered": "Completed",
            "unanswered": "Not Completed",
            "all": "All"
        }
    }
    const languagePackage_completeButton = {
        "TR": "Tamamla",
        "EN": "Complete"
    }
    let article_IdsAndFormInfos = {};
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
    div_backButton.click(async () => {
        await resetFormDetailsPageAsync();

        //#region show articles
        div_article_details.attr("hidden", "");  // hide form details page
        div_backButton.attr("hidden", "");  // remove back button
        div_article_display.removeAttr("hidden");  // show articles page
        //#endregion

        await alignArticlesToCenterAsync();
     })
    slct_menubar.change(async () => {
        await addFormArticlesAsync();
    })
    spn_eventManager.on("click_article", async (_, event) => {
        //#region hide articles
        let article_id = event.currentTarget.id;
        div_article_display.attr("hidden", "");
        //#endregion

        //#region show form details
        div_article_details.removeAttr("hidden");
        div_backButton.removeAttr("hidden");
        //#endregion

        //#region add owner infos
        let formInfos = article_IdsAndFormInfos[article_id];
        let ownerInfosKeys = languagePackage_ownerInfosKeys[language];

        // add table title
        tbl_ownerInfos.children("thead")
            .append(`
                <tr>
                    <th colspan=3;  style="text-align:center">${languagePackage_ownerInfosKeys[language].title}</th>
                </tr>`
            );

        // populate table
        tbl_ownerInfos.children("tbody")
            .append(`
                <tr>
                    <td>${ownerInfosKeys.firstName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.firstName}</td>
                </tr>
                <tr>
                    <td>${ownerInfosKeys.lastName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.lastName}</td>
                </tr>
                <tr>
                    <td>${ownerInfosKeys.company}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.company}</td>
                </tr>
                <tr>
                    <td>${ownerInfosKeys.phone}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.phone}</td>
                </tr>
                <tr>
                    <td>${ownerInfosKeys.email}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${formInfos.email}</td>
                </tr>
            `);
        //#endregion

        //#region add answerer infos if form answered
        if (formInfos.isAnswered) {
            let answererInfosKeys = languagePackage_answererInfosKeys[language];

            // add table title
            tbl_answererInfos.children("thead")
                .append(`
                    <tr>
                        <th colspan=3  style="text-align:center">${languagePackage_answererInfosKeys[language].title}</th>
                    </tr>
                `);

            // populate table
            tbl_answererInfos.children("tbody")
                .append(`
                    <tr>
                        <td>${answererInfosKeys.firstName}</td>
                        <td class="td_spaceAfterKey"></td>
                        <td>${formInfos.answererFirstName}</td>
                    </tr>
                    <tr>
                        <td>${answererInfosKeys.lastName}</td>
                        <td class="td_spaceAfterKey"></td>
                        <td>${formInfos.answererLastName}</td>
                    </tr>
                    <tr>
                        <td>${answererInfosKeys.email}</td>
                        <td class="td_spaceAfterKey"></td>
                        <td>${formInfos.answererEmail}</td>
                    </tr>
                    <tr>
                        <td>${answererInfosKeys.answeredDate}</td>
                        <td class="td_spaceAfterKey"></td>
                        <td>${getDateTimeInString(formInfos.answeredDate)}</td >
                    </tr>
                `);
        }
        //#endregion
    })
    //#endregion

    //#region functions
    async function resetFormDetailsPageAsync() {
        // remove sender infos
        div_ownerInfos.find("thead").empty();
        div_ownerInfos.find("tbody").empty();

        // remove answerer infos
        div_answererInfos.find("thead").empty();
        div_answererInfos.find("tbody").empty();

        // remove subject and message
        div_content.find("thead").empty();
        div_content.find("tbody").empty();

        // remove button
        btn_complete.reset;
    }

    async function addFormArticlesAsync() {
        //#region set "getAnsweredForms" query params
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
            url: (baseApiUrl + "/form/display/oneUser/generalCommunication" +
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
            },
            success: (response, status, xhr) => {
                new Promise(async (resolve) => {
                    //#region add <article>s
                    setVariablesForArticle({
                        "div_articles": div_articles,
                        "totalArticalCount": response.length,
                        "articleCountOnOneRow": 1,
                        "articleStyle": {
                            "width": 300,
                            "height": 300,
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
                    await alignArticlesToCenterAsync();
                    await addArticlesAsync("text");
                    //#endregion

                    //#region declare events
                    $(".article").click((event) =>
                        spn_eventManager.trigger("click_article", [event]));
                    //#endregion

                    //#region populate articles
                    for (let index in response) {
                        //#region set variables
                        let formInfos = response[index];
                        let articleId = art_baseId + index;
                        let article = $("#" + articleId);
                        let div_article_info = article.children("#" + div_article_info_id);

                        // save article infos
                        article_IdsAndFormInfos[articleId] = formInfos;
                        //#endregion

                        //#region set article image
                        let path_articleImage = query_getAnsweredForms == '' ?
                            formInfos.isAnswered ?  // when all form displaying  (query_getAnsweredForms == null)
                                path_checkedImage
                                : path_questionImage
                            : query_getAnsweredForms == true ?
                                path_checkedImage  // when answered forms displaying
                                : path_questionImage  // when unanswered forms displaying
                        //#endregion

                        let x = await getPassedTimeInStringAsync(formInfos.createdAt);


                        //#region populate articles
                        div_article_info.append(`
                            <div id="${div_identity_id}">
                                <img src="${path_articleImage}" style="width:40px; height:40px; margin-bottom:10px"></img>
                                <h2 style="margin-top:5px">${formInfos.company}</h2>
                                <h4 style="margin-top:5px;">${formInfos.firstName} ${formInfos.lastName}</h4>
                                <h4 style="margin-top:25px; margin-bottom:8px">${formInfos.subject}</h4>
                                <p>${formInfos.message.substring(0, article_maxMessageCount)}...</p>
                                <h2 style="margin-top:15px">${getDateTimeInString(formInfos.createdAt)}</h2 >
                            </div>
                        `);
                        //#endregion
                    }
                    //#endregion

                    resolve();
                })
            },
        })
        //#endregion
    }

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
    //#endregion

    populateHtmlAsync();
})
