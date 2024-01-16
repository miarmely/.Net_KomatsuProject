import { addArticlesAsync, alignArticlesToCenterAsync, setVariablesForArticle } from "./miar_article.js";


$(function () {
    //#region variables
    const div_articles = $("#div_articles");
    const pageNumber = 1;
    const pageSize = 10;
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        setVariablesForArticle({
            "div_articles": div_articles,
            "totalArticalCount": pageSize,
            "articleStyle": {
                "width": 500,
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
        await addArticlesAsync("text");
        await alignArticlesToCenterAsync();
    }
    //#endregion

    populateHtmlAsync();
})