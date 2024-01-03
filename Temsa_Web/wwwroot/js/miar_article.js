//#region variables
export let articleCountOnPage;
export const div_video_id = "div_article_video";
export const div_info_id = "div_article_info"; 
export const art_baseId = "art_";

//#region styles
export const style_article = {
    "width": 300,
    "height": 400,
    "marginT": 10,
    "marginB": 10,
    "marginR": 20,
    "marginL": 20,
    "paddingT": 10,
    "paddingB": 10,
    "paddingR": 10,
    "paddingL": 10,
    "border": 8,
};
export const style_div_video_width = style_article.width - (style_article.border * 2);
export const style_div_video_height = (style_article.height - (style_article.border * 2)) / 2;
export const style_div_info_width = style_div_video_width;
export const style_div_info_height = style_div_video_height;
export const style_vid_width = style_article.width - (style_article.border * 2);
export const style_vid_height = (style_article.height - (style_article.border * 2)) / 2;
export const style_img_play_width = style_vid_width / 2.5;
export const style_img_play_height = style_vid_height / 2;
export const style_img_play_marginT = (style_vid_height - style_img_play_height) / 2;
export const style_img_play_marginB = style_img_play_marginT;
export const style_img_play_marginR = (style_vid_width - style_img_play_width) / 2;
export const style_img_play_marginL = style_img_play_marginR;
//#endregion

//#endregion

//#region functions
export async function addArticlesAsync(articleType, div_articles, articleCount) {
    // articleType: "image", "video"

    //#region add articles
    articleCountOnPage = articleCount;

    for (let index = 0; index < articleCountOnPage; index++) {
        //#region add article
        let articleId = art_baseId + index;

        //#region when you wanting display video
        if (articleType == "video")
            div_articles.append(`
                <article id="${articleId}"  class="article">
                    <div id="${div_video_id}">
                        <img src="/images/play.png"  alt="play"  hidden/>
                        <video poster="">
                            <source src="" type=""></source>
                        </video>
                    </div>

                    <div id="${div_info_id}">
                    </div>
                </article>
            `);
        //#endregion

        //#region when you wanting display image
        else  //articleType == "image"
            div_articles.append(`
                <article id="${articleId}"  class="article">
                    <div id="${div_video_id}">
                        <img src=""  alt="" title=""/>
                    </div>

                    <div id="${div_info_id}">
                    </div>
                </article>
            `);
        //#endregion

        //#region add styles to article

        //#region set <article> style
        let article = div_articles.children(`#${articleId}`);

        article.attr("style", {
            "width": style_article.width + "px",
            "height": style_article.height + "px",
            "margin-top": style_article.marginT + "px",
            "margin-bottom": style_article.marginB + "px",
            "margin-right": style_article.marginR + "px",
            "margin-left": style_article.marginL + "px",
            "border-width": style_article.border + "px"
        });
        //#endregion

        //#region set <img> style
        article
            .find("img")
            .attr("style", {
                "width": style_img_play_width + "px",
                "height": style_img_play_height + "px",
                "margin-top": style_img_play_marginT + "px",
                "margin-bottom": style_img_play_marginB + "px",
                "margin-right": style_img_play_marginR + "px",
                "margin-left": style_img_play_marginL + "px",
            });
        //#endregion

        //#region set <video> style
        article
            .find("video")
            .attr("style", {
                "width": style_vid_width + "px",
                "height": style_vid_height + "px"
            });
        //#endregion

        //#region set video <div> style
        article
            .find("#" + div_video_id)
            .attr("style", {
                "width": style_div_video_width + "px",
                "height": style_div_video_height + "px",
                "text-align": "center"
            });
        //#endregion

        //#region set info <div> style
        article
            .find("#" + div_info_id)
            .attr("style", {
                "width": style_div_info_width + "px",
                "height": style_div_video_height + "px",
                "text-align": "center"
            });
        //#endregion

        //#endregion
    }
    //#endregion
}

export async function updateStyleOfArticleDivAsync(div_articles, articleCountOnPage) {
    //#region set padding left and right
    let divClientWidth = div_articles.prop("clientWidth");
    let netArticleWidth = style_article.width + style_article.marginL + style_article.marginR;
    let articleCountOnOneRow = Math.floor(divClientWidth / netArticleWidth);
    let whiteSpaceWidth = divClientWidth - (netArticleWidth * articleCountOnOneRow);

    div_articles.css({
        "padding-left": Math.floor(whiteSpaceWidth / 2) + "px",
        "padding-right": Math.floor(whiteSpaceWidth / 2) + "px"
    });
    //#endregion

    //#region set height
    let netArticleHeight = style_article.height + style_article.marginT + style_article.marginB;
    let totalRowCount = articleCountOnPage % articleCountOnOneRow == 0 ?
        Math.floor(articleCountOnPage / articleCountOnOneRow)  // when article count of all rows is equal
        : Math.floor(articleCountOnPage / articleCountOnOneRow) + 1  // when article count of last row is different

    div_articles.css(
        "height",
        netArticleHeight * totalRowCount + "px");
    //#endregion
}

export async function isSidebarOpenAsync() {
    //#region when sidebar is closed
    let closedSidebarClass = "nav-collapse hide-left-bar";

    if ($("#sidebar").attr("class") == closedSidebarClass)
        return false;
    //#endregion

    return true;
}
//#endregion