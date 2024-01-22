import {
    addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticle, art_baseId,
    div_article_info_id,
    isSidebarOpenAsync,
    setHeightOfArticlesDivAsync
} from "./miar_article.js";


$(function () {
    //#region variables
    const div_articles = $("#div_articles");
    const pageNumber = 1;
    const pageSize = 10;
    const article_maxMessageCount = 100;
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
                            "width": "100%",
                            "height": 200,
                            "marginT": 10,
                            "marginB": 10,
                            "marginR": 0,
                            "marginL": 0,
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
                    //#endregion

                    //#region populate articles with form infos
                    for (let index in response) {
                        //#region set variables
                        let formInfos = response[index];
                        let article = $("#" + art_baseId + index);
                        let div_article_info = article.children("#" + div_article_info_id);
                        //#endregion

                        //#region populate articles
                        div_article_info.append(`
                            <div style="float:left">
                                <h3>${formInfos.company}</h3>
                                <h4>${formInfos.firstName} ${formInfos.lastName}</h4>
                                <h5>${formInfos.subject}</h5>
                            </div>
                            <div>
                                <p class="article_form_message">${formInfos.message.substring(0, article_maxMessageCount)}...</p>
                            </div>                            
                        `);
                        //#endregion
                    }
                    //#endregion

                    resolve();
                })
            },
            error: (response) => {
                alert("error");
            }
        })
        //#endregion
    }
    //#endregion

    addFormArticlesAsync();
})