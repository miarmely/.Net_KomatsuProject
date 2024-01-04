//#region variables

//#region export variables
export let articleCountOnPage;
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
    "border": 6,
};
export const div_article_video_id = "div_article_video";
export const div_article_image_id = "div_articl_image";
export const div_article_info_id = "div_article_info";
export const art_baseId = "art_";
//#endregion

//#region private variables
let div_articles;

//#region article elements styles

//#region when article type is "video and text" (VT)
const style_div_video_marginB_VT = 20;
const style_div_video_width_VT = style_article.width - (style_article.border * 2) - style_article.paddingR - style_article.paddingL
const style_div_video_height_VT = (style_article.height - (style_article.border * 2) - style_article.paddingT - style_article.paddingB - style_div_video_marginB_VT) / 2;

const style_div_info_width_VT = style_div_video_width_VT;
const style_div_info_height_VT = style_div_video_height_VT;

const style_vid_width_VT = style_div_video_width_VT;
const style_vid_height_VT = style_div_video_height_VT;

const style_img_play_width_VT = style_vid_width_VT / 2.5;
const style_img_play_height_VT = style_vid_height_VT / 2;
const style_img_play_marginT_VT = (style_vid_height_VT - style_img_play_height_VT) / 2;
const style_img_play_marginB_VT = style_img_play_marginT_VT;
const style_img_play_marginR_VT = (style_vid_width_VT - style_img_play_width_VT) / 2;
const style_img_play_marginL_VT = style_img_play_marginR_VT;
//#endregion

//#region when article type is "image and text" (IT)
const style_div_img_width_IT = style_div_video_width_VT;
const style_div_img_height_IT = style_div_video_height_VT;
const style_div_img_marginB_IT = style_div_video_marginB_VT;

const style_div_info_width_IT = style_div_info_width_VT;
const style_div_info_height_IT = style_div_info_height_VT;

const style_img_width_IT = style_div_video_width_VT;
const style_img_height_IT = style_div_video_height_VT;
//#endregion

//#region when article type is only "text" (T)
const style_div_info_width_T = style_div_info_width_VT;
const style_div_info_height_T = style_div_info_height_VT;
//#endregion

//#endregion

//#endregion

//#endregion

//#region functions
export async function addArticlesAsync(articleType, _div_articles, articleCount) { // articleType: "imageAndText", "videoAndText", "text"
    //#region save parameters
    articleCountOnPage = articleCount;
    div_articles = _div_articles;
    //#endregion

    //#region add articles
    for (let index = 0; index < articleCountOnPage; index++) {
        //#region add articles by article type
        let articleId = art_baseId + index;
        let article;

        switch (articleType) {
            case "videoAndText":
                //#region add article with video and text
                if (articleType == "videoAndText")
                    div_articles.append(`
                        <article id="${articleId}"  class="article">
                            <div id="${div_article_video_id}">
                                <img src="/images/play.png"  alt="play" hidden/>
                                <video poster="" >
                                    <source src="" type=""></source>
                                </video>
                            </div>

                            <div id="${div_article_info_id}"  style="text-align: center">
                            </div>
                        </article>`
                    );
                //#endregion

                //#region add styles of article elements
                // play <img> styles
                article = $('#' + articleId);
                article
                    .find("img")
                    .css({
                        "width": style_img_play_width_VT,
                        "height": style_img_play_height_VT,
                        "margin-top": style_img_play_marginT_VT,
                        "margin-bottom": style_img_play_marginB_VT,
                        "margin-right": style_img_play_marginR_VT,
                        "margin-left": style_img_play_marginL_VT
                    });

                // <video> styles
                article
                    .find("video")
                    .css({
                        "width": style_vid_width_VT,
                        "height": style_vid_height_VT
                    });

                // video <div> styles
                article
                    .find('#' + div_article_video_id)
                    .css({
                        "width": style_div_video_width_VT,
                        "height": style_div_video_height_VT,
                        "margin-bottom": style_div_video_marginB_VT
                    });

                // info <div> styles
                article
                    .find('#' + div_article_info_id)
                    .css({
                        "width": style_div_info_width_VT,
                        "height": style_div_info_height_VT
                    });
                //#endregion

                break;
            case "imageAndText":
                //#region add article with image and text
                div_articles.append(`
                    <article id="${articleId}"  class="article">
                        <div id="${div_article_image_id}" >
                            <img src=""  alt=""  title="" />
                        </div>

                        <div id="${div_article_info_id}" >
                        </div>
                    </article>`
                );
                //#endregion

                //#region add styles of article elements
                // <img> styles
                article = $('#' + articleId);
                article
                    .find("img")
                    .css({
                        "width": style_img_width_IT,
                        "height": style_img_height_IT
                    });

                // image <div> styles
                article
                    .find('#' + div_article_image_id)
                    .css({
                        "width": style_div_img_width_IT,
                        "height": style_div_img_height_IT,
                        "margin-bottom": style_div_img_marginB_IT
                    });

                // info <div> styles
                article
                    .find('#' + div_article_info_id)
                    .css({
                        "width": style_div_info_width_IT,
                        "height": style_div_info_height_IT
                    });
                //#endregion

                break;
            case "text":
                //#region add article with only text
                div_articles.append(`
                    <article id="${articleId}"  class="article">
                        <div id="${div_article_info_id}" >
                        </div>
                    </article>`
                );
                //#endregion

                //#region add styles of article elements
                // info <div> styles
                article = $('#' + articleId);
                article
                    .find('#' + div_article_info_id)
                    .css({
                        "width": style_div_info_width_T,
                        "height": style_div_info_height_T
                    });
                //#endregion

                break;
        }
        //#endregion

        //#region add <article> style
        article.css({
            "width": style_article.width,
            "height": style_article.height,
            "margin-top": style_article.marginT,
            "margin-bottom": style_article.marginB,
            "margin-right": style_article.marginR,
            "margin-left": style_article.marginL,
            "padding-top": style_article.paddingT,
            "padding-bottom": style_article.paddingB,
            "padding-right": style_article.paddingR,
            "padding-left": style_article.paddingL,
            "border-width": style_article.border
        });
        //#endregion
    }
    //#endregion

    await alignArticlesToCenterAsync();
}

export async function alignArticlesToCenterAsync() {
    //#region set padding left and right of articles <div>
    let divClientWidth = div_articles.prop("clientWidth");
    let netArticleWidth = style_article.width + style_article.marginL + style_article.marginR;
    let articleCountOnOneRow = Math.floor(divClientWidth / netArticleWidth);
    let whiteSpaceWidth = divClientWidth - (netArticleWidth * articleCountOnOneRow);

    div_articles.css({
        "padding-left": Math.floor(whiteSpaceWidth / 2),
        "padding-right": Math.floor(whiteSpaceWidth / 2)
    });
    //#endregion

    //#region set height of articles <div>
    let netArticleHeight = style_article.height + style_article.marginT + style_article.marginB;
    let totalRowCount = articleCountOnPage % articleCountOnOneRow == 0 ?
        Math.floor(articleCountOnPage / articleCountOnOneRow)  // when article count of all rows is equal
        : Math.floor(articleCountOnPage / articleCountOnOneRow) + 1  // when article count of last row is different

    div_articles.css(
        "height",
        netArticleHeight * totalRowCount);
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