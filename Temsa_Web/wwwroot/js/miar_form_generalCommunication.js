import {
    addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticle, art_baseId,
    div_article_info_id,
    setHeightOfArticlesDivAsync
} from "./miar_article.js";

import { getDateTimeInString } from "./miar_tools.js"


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
    const tbl_ownerInfos = $("#div_ownerInfos table");
    const tbl_answererInfos = $("#div_answererInfos table");
    const path_checkedImage = "/images/checked.png";
    const path_questionImage = "/images/question.png";
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
    async function addFormArticlesAsync() {
        //#region populate form articles (ajax)
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/form/display/oneUser/generalCommunication" +
                `?language=${language}` +
                `&PageNumber=${pageNumber}` +
                `&PageSize=${pageSize}`),
            headers: {
                "authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
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
                        let path_articleImage = formInfos.isAnswered ?
                            path_checkedImage
                            : path_questionImage
                        //#endregion

                        //#region populate articles
                        div_article_info.append(`
                            <div id="${div_identity_id}">
                                <img src="${path_articleImage}" style="width:40px; height:40px; margin-bottom:10px"></img>
                                <h2 style="margin-top:5px">${formInfos.company}</h2>
                                <h4 style="margin-top:5px;">${formInfos.firstName} ${formInfos.lastName}</h4>
                                <h4 style="margin-top:25px; margin-bottom:8px">${formInfos.subject}</h4>
                                <p>${formInfos.message.substring(0, article_maxMessageCount)}...</p>
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
    //#endregion

    addFormArticlesAsync();
})
