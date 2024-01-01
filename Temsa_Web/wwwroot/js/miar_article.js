//#region variables
let div_article
let totalArticleCount;
let articleWidth;
let articleHeight;
let articleMarginT;
let articleMarginB;
let articleMarginR;
let articleMarginL;
//#endregion

//#region functions
export async function setArticleStyleAsync(
    _div_article,
    _totalArticleCount,
    _articleWidth,
    _articleHeight,
    _articleMarginT,
    _articleMarginB,
    _articleMarginR,
    _articleMarginL
) {
    div_article = _div_article;
    totalArticleCount = _totalArticleCount;
    articleWidth = _articleWidth;
    articleHeight = _articleHeight;
    articleMarginT = _articleMarginT;
    articleMarginB = _articleMarginB;
    articleMarginR = _articleMarginR;
    articleMarginL = _articleMarginL;
}

export async function updateStyleOfArticleDivAsync(){
    //#region set padding left and right
    let divClientWidth = div_article.prop("clientWidth")
    let netArticleWidth = articleWidth + articleMarginL + articleMarginR;
    let articleCountOnOneRow = Math.floor(divClientWidth / netArticleWidth);
    let whiteSpaceWidth = divClientWidth - (netArticleWidth * articleCountOnOneRow);

    div_article.css({
        "padding-left": Math.floor(whiteSpaceWidth / 2) + "px",
        "padding-right": Math.floor(whiteSpaceWidth / 2) + "px"
    });
    //#endregion

    //#region set height
    let netArticleHeight = articleHeight + articleMarginT + articleMarginB;
    let totalRowCount = totalArticleCount % articleCountOnOneRow == 0 ?
        Math.floor(totalArticleCount / articleCountOnOneRow)  // when article count of all rows is equal
        : Math.floor(totalArticleCount / articleCountOnOneRow) + 1  // when article count of last row is different

    div_article.css(
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