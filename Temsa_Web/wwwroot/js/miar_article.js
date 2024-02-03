//#region variables
export const div_article_video_id = "div_article_video";
export const div_article_image_id = "div_article_image";
export const div_article_info_id = "div_article_info";
export const div_article_button_id = "div_article_button";
export const art_baseId = "art_";
export const path_playImage = "images/play.png";
export const btn_pdf_id = "btn_pdf";
export const headerOfPageHeight = 80;
export const article_class = "article";
export let articleBuffer = {
    "div_articles": "",  // should be set
    "path_articleVideos": "",
    "totalArticleCount": 0,  // should be set
    "articleCountOnOneRow" : 0,
    "articleType": "",  // should be set 
    "articleStyle": {  // should be set
        "width": 0,
        "height": 0,
        "marginT": 0,
        "marginB": 0,
        "marginR": 0,
        "marginL": 0,
        "paddingT": 0,
        "paddingB": 0,
        "paddingR": 0,
        "paddingL": 0,
        "border": 0,
        "borderColor": "",
        "boxShadow": "",
        "bgColorForDelete": "",
    }  // firstly articleType should be set
}
let articleInfos_lastUploadedPlayImage = {};
let articleInfos_lastUploadedVideo = {
    "article": null
};
let article_desiredWidth = 0;
let article_isWidthReduced = false;
let isCriticalSection = false;

//#region article elements styles
// when article type is "video and text" (VT)
export let style_a_pdfButton_fontSize;
export let style_a_pdfButton_paddingTB;
export let style_a_pdfButton_paddingRL;
export let style_div_video_marginB_VT;
export let style_div_video_width_VT;
export let style_div_video_height_VT;
export let style_div_button_width_VT;
export let style_div_button_height_VT;
export let style_div_info_width_VT;
export let style_div_info_height_VT;
export let style_vid_width_VT;
export let style_vid_height_VT;
export let style_img_play_width_VT;
export let style_img_play_height_VT;
export let style_img_play_marginT_VT;
export let style_img_play_marginB_VT;
export let style_img_play_marginR_VT;
export let style_img_play_marginL_VT;

// when article type is "image and text" (IT)
export let style_div_img_width_IT;
export let style_div_img_height_IT;
export let style_div_img_marginB_IT;
export let style_div_info_width_IT;
export let style_div_info_height_IT;
export let style_img_width_IT;
export let style_img_height_IT;

// when article type is "text" (T)
export let style_div_info_width_T;
export let style_div_info_height_T;
//#endregion

//#endregion

//#region events
export async function click_articleVideoDivAsync(article) {
    removeLastUploadedArticleVideoAsync();
    hidePlayImage(article);

    //#region load article video
    let videoName = article_idsAndMachineInfos[article.attr("id")]["videoName"];

    article
        .find("video")
        .attr({
            "src": "/" + articleBuffer.path_articleVideos + "/" + videoName,
            "controls": "",
            "autoplay": ""
        });

    // save article of last uploaded video 
    articleInfos_lastUploadedVideo["article"] = article;
    //#endregion
}

export async function mouseover_articleVideoAsync(event, article) {
    //#region when page mode is "delete"
    if (slct_menubar_value == "delete")
        return;
    //#endregion

    //#region when video is exists on article
    if (isVideoExists(article))
        return;
    //#endregion

    //#region save article video infos

    //#region save video infos
    let minPageX = event.pageX - event.offsetX;
    let minPageY = event.pageY - event.offsetY;

    // save infos
    articleInfos_lastUploadedPlayImage = {
        "article": article,
        "minPageX": minPageX,
        "maxPageX": minPageX + style_vid_width_VT,
        "minPageY": minPageY,
        "maxPageY": minPageY + style_vid_height_VT
    };
    //#endregion

    //#endregion

    showPlayImage(article);
}

export async function mouseout_articleVideoDivAsync(event, article) {
    //#region when page mode is "delete"
    if (slct_menubar_value == "delete")
        return;
    //#endregion

    //#region when video is exists on article
    if (isVideoExists(article))
        return;
    //#endregion

    //#region when mouse isn't over on header AND is over article video 
    if (event.clientY > headerOfPageHeight) {
        //#region when mouse is over article video (return)
        let currentMouseX = event.pageX;
        let currentMouseY = event.pageY;

        if (currentMouseX > articleInfos_lastUploadedPlayImage["minPageX"]
            && currentMouseX < articleInfos_lastUploadedPlayImage["maxPageX"]
            && currentMouseY > articleInfos_lastUploadedPlayImage["minPageY"]
            && currentMouseY < articleInfos_lastUploadedPlayImage["maxPageY"]) {
            return;
        }
        //#endregion
    }
    //#endregion

    //#region when mouse is over on header OR is out from article video
    hidePlayImage(article);
    //#endregion
}

export async function ended_articleVideoAsync() {
    removeArticleVideo(articleInfos_lastUploadedVideo["article"]);
}
//#endregion

//#region functions
export async function setVariablesForArticleAsync(variables) {
    //#region initialize buffer
    for (let variableName in variables) {
        //#region when variable name is exists in "articleBuffer"
        if (articleBuffer[variableName] != undefined)
            articleBuffer[variableName] = variables[variableName];
        //#endregion

        //#region when article styles entered
        if (variableName == "articleStyle") {
            article_desiredWidth = articleBuffer.articleStyle.width;  // i saved wanting width as extra because width in buffer can be change so if change then i am losing wanting width.
            setStylesOfArticleElements();
        }
        //#endregion
    }
    //#endregion
}

export async function addArticlesAsync(autoAlign=true) {
    // articleType: "imageAndText", "videoAndText", "text"

    //#region add articles
    for (let index = 0; index < articleBuffer.totalArticleCount; index++) {
        //#region add articles by article type
        let articleId = art_baseId + index;

        switch (articleBuffer.articleType) {
            case "videoAndText":
                //#region add article with video and text
                articleBuffer.div_articles.append(`
                    <article id="${articleId}"  class="${article_class}" style="text-align: center">
                        <div id="${div_article_video_id}">
                            <img class="img_play"  hidden/>
                            <video poster="">
                                <source src="" type=""></source>
                            </video>
                        </div>

                        <div id="${div_article_info_id}">
                        </div>

                        <div id="${div_article_button_id}">
                            <ul>
                                <li class="btn btn_article">
                                    <a target="blank">PDF</a>
                                </li>
                            </ul>  
                        </div>
                    </article>`
                );
                //#endregion

                await addStyleToArticleElements($("#" + articleId));
                break;
            case "imageAndText":
                //#region add article with image and text
                articleBuffer.div_articles.append(`
                    <article id="${articleId}"  class="${article_class}">
                        <div id="${div_article_image_id}"></div>
                        <div id="${div_article_info_id}" ></div>
                    </article>`
                );
                //#endregion

                await addStyleToArticleElements($("#" + articleId));
                break;
            case "text":
                //#region add article with only text
                articleBuffer.div_articles.append(`
                    <article id="${articleId}"  class="${article_class}">
                        <div id="${div_article_info_id}" >
                        </div>
                    </article>`
                );
                //#endregion

                await addStyleToArticleElements($("#" + articleId));
                break;
        }
        //#endregion
    }
    //#endregion

    //#region add <article> style
    $("." + article_class).css({
        "width": articleBuffer.articleStyle.width,
        "height": articleBuffer.articleStyle.height,
        "margin-top": articleBuffer.articleStyle.marginT,
        "margin-bottom": articleBuffer.articleStyle.marginB,
        "margin-right": articleBuffer.articleStyle.marginR,
        "margin-left": articleBuffer.articleStyle.marginL,
        "padding-top": articleBuffer.articleStyle.paddingT,
        "padding-bottom": articleBuffer.articleStyle.paddingB,
        "padding-right": articleBuffer.articleStyle.paddingR,
        "padding-left": articleBuffer.articleStyle.paddingL,
        "border-width": articleBuffer.articleStyle.border,
        "border-color": articleBuffer.articleStyle.borderColor,
        "box-shadow": articleBuffer.articleStyle.boxShadow
    });
    //#endregion

    //#region align articles and set height of div_articles
    if (autoAlign) {
        await alignArticlesToCenterAsync();
        await setHeightOfArticlesDivAsync();
    }
    //#endregion
}

export async function controlArticleWidthAsync() {
    //#region when article width bigger than div_articles width (reduce)

    //#region variables
    let article_style = articleBuffer.articleStyle;
    let div_articles_width = articleBuffer.div_articles.prop("clientWidth");
    let article_maxWidth = div_articles_width - article_style.marginR - article_style.marginL;
    let article_netCurrentWidth = article_style.width + article_style.marginR + article_style.marginL;
    //#endregion

    //#region reduce article width
    if (article_netCurrentWidth > article_maxWidth) {
        //#region change article width
        article_style.width = article_maxWidth;
        article_netCurrentWidth = article_style.width + article_style.marginR + article_style.marginL;
        article_isWidthReduced = true;
        //#endregion

        setStylesOfArticleElements();
        await updateArticleAndArticleElementsStylesAsync();
    }
    //#endregion

    //#endregion

    //#region when article width reduced
    if (article_isWidthReduced) {
        //#region when the desired width smaller than max width
        let article_netDesiredWidth = (article_desiredWidth +
            article_style.marginR +
            article_style.marginL);

        if (article_netDesiredWidth <= article_maxWidth) {
            //#region update article styles with desired values
            articleBuffer.articleStyle.width = article_desiredWidth;
            article_netCurrentWidth = (article_desiredWidth +
                articleBuffer.articleStyle.marginR +
                articleBuffer.articleStyle.marginL);
            article_isWidthReduced = false;  // reset
            //#endregion

            setStylesOfArticleElements();
            await updateArticleAndArticleElementsStylesAsync();
        }
        //#endregion
    }
    //#endregion
}

export async function alignArticlesToCenterAsync(widthUnit = "px") {
    //#region set variables
    let article_style = articleBuffer.articleStyle;
    let div_articles_width = articleBuffer.div_articles.prop("clientWidth");
    let article_netCurrentWidth = (widthUnit == "px" ?
        article_style.width + article_style.marginR + article_style.marginL
        : $(".article").prop("offsetWidth"));  // widthUnit == "%"
    //#endregion

    //#region set padding left and right of article
    articleBuffer.articleCountOnOneRow = Math.floor(div_articles_width / article_netCurrentWidth);
    let whiteSpaceWidth = div_articles_width - (article_netCurrentWidth * articleBuffer.articleCountOnOneRow);
    
    articleBuffer.div_articles.css({
        "padding-left": Math.floor(whiteSpaceWidth / 2),
        "padding-right": Math.floor(whiteSpaceWidth / 2)
    });
    //#endregion
}

export async function setHeightOfArticlesDivAsync() {
    //#region set height of articles <div>
    let netArticleHeight = articleBuffer.articleStyle.height + articleBuffer.articleStyle.marginT + articleBuffer.articleStyle.marginB;
    let totalRowCount = (articleBuffer.totalArticleCount % articleBuffer.articleCountOnOneRow == 0 ?
        Math.floor(articleBuffer.totalArticleCount / articleBuffer.articleCountOnOneRow)  // when article count of all rows is equal
        : Math.floor(articleBuffer.totalArticleCount / articleBuffer.articleCountOnOneRow) + 1)  // when article count of last row is different

    articleBuffer.div_articles.css(
        "height",
        netArticleHeight * totalRowCount);
    //#endregion
}

export async function removeLastUploadedArticleVideoAsync() {
    //#region remove last uploaded article video if exists
    let article = articleInfos_lastUploadedVideo["article"];

    if (article != null  // when at least one video has been opened previously
        && isVideoExists(article))
        removeArticleVideo(article);
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

export async function addMsgWithImgToDivArticlesAsync(imagePath, imageAlt, message) {
    //#region add message with image to div_articles
    let div_articles = articleBuffer.div_articles;

    div_articles.append(`
        <div class="div_articles_message">
            <img src="${imagePath}"  alt="${imageAlt}"/>
            <h3>${message}</h3>  
        </div>`);
    //#endregion

    //#region add style to div_articles_message
    let div_articles_message = div_articles.children(".div_articles_message");
    let div_articles_message_height = div_articles_message.prop("offsetHeight");
    let div_articles_height = div_articles.prop("offsetHeight");

    div_articles_message.css({
        "padding-top": (div_articles_height - div_articles_message_height) / 2,
        "padding-bottom": (div_articles_height - div_articles_message_height) / 2
    })
    //#endregion
}

export async function alignArticlesAsync() {
    //#region realign articles to center
    if (!isCriticalSection) {
        isCriticalSection = true;

        // aling articles
        setTimeout(async () => {
            await alignArticlesToCenterAsync();
            await setHeightOfArticlesDivAsync();

            isCriticalSection = false;
        }, 500);
    }
    //#endregion
}

export function showPlayImage(article) {
    //#region hide video
    article.find("video")
        .attr("hidden", "");
    //#endregion

    //#region load play image
    let img_play = article.find("img");
    img_play.attr({
        "src": "/" + path_playImage,
        "alt": "play"
    });
    //#endregion

    //#region add play image styles
    img_play.css({
        "width": style_img_play_width_VT,
        "height": style_img_play_height_VT,
        "margin-top": style_img_play_marginT_VT,
        "margin-bottom": style_img_play_marginB_VT,
        "margin-right": style_img_play_marginR_VT,
        "margin-left": style_img_play_marginL_VT
    });
    //#endregion

    img_play.removeAttr("hidden"); // show play <img>
}

export function hidePlayImage(article) {
    // remove attributes of play image
    let img_play = article.find("img");
    img_play.removeAttr("src alt style");

    // hide play image
    img_play.attr("hidden", "");

    // show video poster
    article
        .find("video")
        .removeAttr("hidden");
}

export function isVideoExists(article) {
    let src = article
        .find("video")
        .attr("src");

    return src != undefined;
}

export function removeArticleVideo(article) {
    //#region remove attributes article video
    let video = article
        .find("video");

    video.removeAttr("src controls autoplay");
    //#endregion

    video.load();
}

async function updateArticleAndArticleElementsStylesAsync() {
    //#region update styles
    for (let no = 0; no < articleBuffer.totalArticleCount; no++) {
        //#region update article style
        let article = $("#" + art_baseId + no);
        article.css("width", articleBuffer.articleStyle.width);
        //#endregion

        addStyleToArticleElements(article,);
    }
    //#endregion
}

function setStylesOfArticleElements() {
    //#region initialize variables by article type
    let article_style = articleBuffer.articleStyle;
    let article_netWidth = article_style.width - (article_style.border * 2) - article_style.paddingR - article_style.paddingL;
    let article_netHeight = article_style.height - (article_style.border * 2) - article_style.paddingT - article_style.paddingB;

    switch (articleBuffer.articleType) {
        case 'videoAndText':
            style_a_pdfButton_fontSize = 18;
            style_a_pdfButton_paddingTB = 6;
            style_a_pdfButton_paddingRL = 40;

            style_div_video_marginB_VT = 20;
            style_div_video_width_VT = article_netWidth;
            style_div_video_height_VT = (article_netHeight - style_div_video_marginB_VT) / 2;

            style_div_button_width_VT = style_div_video_width_VT;
            style_div_button_height_VT = (style_a_pdfButton_fontSize + 9) + (style_a_pdfButton_paddingTB * 2);

            style_div_info_width_VT = style_div_video_width_VT;
            style_div_info_height_VT = style_div_video_height_VT - style_div_button_height_VT;

            style_vid_width_VT = style_div_video_width_VT;
            style_vid_height_VT = style_div_video_height_VT;

            style_img_play_width_VT = style_vid_width_VT / 2.7;
            style_img_play_height_VT = style_vid_height_VT / 2.2;
            style_img_play_marginT_VT = (style_vid_height_VT - style_img_play_height_VT) / 2;
            style_img_play_marginB_VT = style_img_play_marginT_VT;
            style_img_play_marginR_VT = (style_vid_width_VT - style_img_play_width_VT) / 2;
            style_img_play_marginL_VT = style_img_play_marginR_VT;
            break;
        case "imageAndText":
            style_div_img_width_IT = article_netWidth;
            style_div_img_height_IT = article_netHeight / 2;
            style_div_img_marginB_IT = 10;

            style_div_info_width_IT = article_netWidth;
            style_div_info_height_IT = article_netHeight - style_div_img_height_IT - style_div_img_marginB_IT;

            style_img_width_IT = style_div_img_width_IT;
            style_img_height_IT = style_div_img_height_IT;
            break;
        case "text":
            style_div_info_width_T = article_netWidth;
            style_div_info_height_T = article_netHeight;
            break;
    }
    //#endregion
}

function addStyleToArticleElements(article) {
    //#region add style to one article by article type
    switch (articleBuffer.articleType) {
        case "videoAndText":
            //#region add styles of article elements
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

            // button <div> styles
            article
                .find("#" + div_article_button_id)
                .css({
                    "width": style_div_button_width_VT,
                    "height": style_div_button_height_VT,
                })

            // pdf button <li> styles
            article
                .find("#" + div_article_button_id + " li")
                .css({
                    "padding-top": style_a_pdfButton_paddingTB,
                    "padding-bottom": style_a_pdfButton_paddingTB,
                    "padding-right": 0,
                    "padding-left": 0
                });

            // pdf button <a> styles
            article
                .find("#" + div_article_button_id + " a")
                .css({
                    "padding-top": style_a_pdfButton_paddingTB,
                    "padding-bottom": style_a_pdfButton_paddingTB,
                    "padding-right": style_a_pdfButton_paddingRL,
                    "padding-left": style_a_pdfButton_paddingRL,
                    "font-size": style_a_pdfButton_fontSize
                });
            //#endregion

            break;
        case "imageAndText":
            //#region add styles of article elements
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
            //#region add styles of article elements
            // info <div> styles
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
}
//#endregion