//#region variables
export let description_currentColor;
export let description_infoInSession;
export let description_language;
//#endregion

//#region function
export function setDescriptionLanguage(language) {
    description_language = language;
}

export function changeDescriptionButtonColor(descriptionButtonId, color) {
    $(descriptionButtonId).css("color", color);
    description_currentColor = color;
}

export function getDateTimeInString(dateTime) {
    //#region set year
    let date = new Date(dateTime);
    let year = date.getFullYear();
    //#endregion

    //#region set month
    let month = date.getMonth() + 1;

    // add '0' to head
    let monthInString = month < 10 ?
        `0${month}`  // add 0
        : month.toString();  // don't add
    //#endregion

    //#region set day
    let day = date.getDate();

    // add '0' to head
    let dayInString = day < 10 ?
        `0${day}`  // add 0
        : day.toString(); // don't add
    //#endregion

    //#region set hours
    let hours = date.getHours() + 3;

    // add '0' to head
    let hoursInString = hours < 10 ?
        `0${hours}`  // add 0
        : hours.toString();  // don't add
    //#endregion

    //#region set minutes
    let minutes = date.getMinutes();

    // add '0' to head
    let minutesInString = minutes < 10 ?
        `0${minutes}`  // add 0
        : minutes.toString();  // don't add
    //#endregion

    return `${dayInString}.${monthInString}.${year} - ${hoursInString}:${minutesInString}`;
}

export function getHeaderFromLocalInJson(headerName) {
    return JSON.parse(
        localStorage.getItem(headerName));
}

export function updateResultLabel(resultLabelId, message, color,
    marginT = "0px", marginR = "0px", marginB = "0px", marginL = "0px") {
    //#region reset resultLabel
    let resultLabel = $(resultLabelId);
    resultLabel.empty();
    //#endregion

    //#region change style
    resultLabel.attr("style",
        `color:	${color}; 
		margin-top: ${marginT}; 
		margin-right: ${marginR};
		margin-bottom: ${marginB};
		margin-left: ${marginL};
		text-align: center`);
    //#endregion

    //#region write error to resultLabel
    resultLabel.removeAttr("hidden");  // show resultLabel
    resultLabel.append(message);
    //#endregion
}

export function clicked_descriptionDropdownItem(
    clickedElement,
    decriptionInputId,
    descriptionButtonId,
    baseDescriptionButtonName,
    descriptionUnsavedColor,
    descriptionBaseKeyForSession) {
    //#region set variables
    let inpt_descriptions = $(decriptionInputId);
    let btn_description = $(descriptionButtonId)
    description_language = clickedElement.prop("innerText");
    //#endregion

    //#region reset
    // <input>
    inpt_descriptions.val("");

    // button color
    btn_description.css("color", descriptionUnsavedColor);
    description_currentColor = descriptionUnsavedColor;
    //#endregion

    //#region change description button name
    btn_description.empty();
    btn_description.append(
        `<b>
            ${baseDescriptionButtonName} (${description_language})
        </b>`);
    //#endregion

    //#region populate description <input> with in session value
    description_infoInSession = sessionStorage.getItem(
        getDescriptionKeyForSession(descriptionBaseKeyForSession));

    // when any info is exists on session
    if (description_infoInSession != null)
        inpt_descriptions.val(description_infoInSession);
    //#endregion
}

export function clicked_descriptionDropdownButton(
    pageLanguage,
    descriptionInputId,
    descriptionButtonId,
    descriptionBaseKeyForSession,
    descriptionSavedColor) {
    //#region add description informations to session
    sessionStorage.setItem(
        getDescriptionKeyForSession(descriptionBaseKeyForSession),
        $(descriptionInputId).val());
    //#endregion

    //#region change description button color to "saved color"
    changeDescriptionButtonColor(descriptionButtonId, descriptionSavedColor);
    //#endregion
}

export function changed_descriptionInput(
    descriptionButtonId,
    descriptionUnsavedColor, 
    descriptionSavedColor) {
    //#region set description current color if empty 
    if (description_currentColor == undefined)
        description_currentColor = descriptionUnsavedColor;
    //#endregion

    //#region change description color to "unsaved color"
    if (description_currentColor == descriptionSavedColor)
        changeDescriptionButtonColor(descriptionButtonId, descriptionUnsavedColor);
    //#endregion
}

export function getDescriptionKeyForSession(descriptionBaseKeyForSession, descriptionLanguage=null) {
    return descriptionLanguage == null?
        descriptionBaseKeyForSession + '-' + description_language  // set language as auto
        : descriptionBaseKeyForSession + '-' + descriptionLanguage  // set language as manuel
}
//#endregion