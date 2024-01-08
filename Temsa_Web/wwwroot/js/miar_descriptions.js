//#region variables
export let buffer = {
    "currentColor": null,
    "language": null,
    "descriptionsByLanguages": {
        "TR": null,
        "EN": null
    }
}
export const a_descriptions_class = "a_descriptions";
export const txt_descriptions_id = "txt_descriptions";
export const btn_descriptions_id = "btn_descriptions";
export const ul_descriptions_id = "ul_descriptions";
export const descriptions_baseButtonNameByLanguages = {
    "TR": "Açıklama",
    "EN": "Description"
};
//#endregion

//#region events
export function uploadDescriptionsEvents() {
    const btn_descriptions = $("#" + btn_descriptions_id);
    const txt_descriptions = $("#" + txt_descriptions_id);

    btn_descriptions.click(async () => {
        //#region save new description
        let newDescription = txt_descriptions.val();

        newDescriptionsByLanguages[buffer["language"]] = newDescription;
        //#endregion

        //#region change description button color to "saved color"
        await changeDescriptionsButtonColorAsync(
            btn_descriptions,
            descriptions_savedColor);
        //#endregion
    })
    $("#" + ul_descriptions_id).click(async (event) => {
        buffer["language"] = event.target.innerText;

        //#region change descriptions <button> color as "unsaved_color"
        txt_descriptions.val("");

        await changeDescriptionsButtonColorAsync(
            btn_descriptions,
            descriptions_unsavedColor);
        //#endregion

        //#region change descriptions <button> name
        btn_descriptions.empty();
        btn_descriptions.append(
            `<b>${descriptions_baseButtonNameByLanguages[language]} (${buffer["language"]})</b>`);
        //#endregion

        //#region add description to <textarea> if exists
        if (buffer.descriptionsByLanguages[buffer["language"]] != null)
            txt_descriptions.val(
                newDescriptionsByLanguages[buffer["language"]]);
        //#endregion
    })
}
//#endregion


//#region functions
export function setVariablesForDescriptions(variables) {
    //#region initialize variables
    for (let variableName in variables)
        // when variable name is exists in "buffers"
        if (buffer[variableName] != undefined)
            buffer[variableName] = variables[variableName];
    //#endregion
}

export async function setDescriptionsLanguageAsync(newLanguage) {
    buffer["language"] = newLanguage;
}

export async function getDescriptionKeyForSessionAsync(descriptionBaseKeyForSession) {
    return descriptionBaseKeyForSession + '-' + buffer["language"];
}

export async function click_descriptionsButtonAsync(
    descriptionsTextArea,
    descriptionsButton,
    descriptionsSessionKey) {
    //#region get descriptions in session 
    let descriptionsInSession = JSON.parse(sessionStorage
        .getItem(descriptionsSessionKey));

    // when any descriptions not exist on session
    if (descriptionsInSession == null)
        descriptionsInSession = {}
    //#endregion

    //#region save updated descriptions to session
    descriptionsInSession[buffer["language"]] = descriptionsTextArea.val();

    sessionStorage.setItem(
        descriptionsSessionKey,
        JSON.stringify(descriptionsInSession));
    //#endregion

    //#region change description button color to "saved color"
    await changeDescriptionsButtonColorAsync(
        descriptionsButton,
        descriptions_savedColor);
    //#endregion
}

export async function click_descriptionDropdownItemAsync(
    clickedElement,
    descriptionsTextarea,
    descriptionsButton,
    descriptionsSessionKey) {
    //#region change descriptions <button> color as "unsaved_color"
    descriptionsTextarea.val("");

    await changeDescriptionsButtonColorAsync(
        descriptionsButton,
        descriptions_unsavedColor);
    //#endregion

    //#region change descriptions <button> name
    buffer["language"] = clickedElement.prop("innerText");

    descriptionsButton.empty();
    descriptionsButton.append(
        `<b>${description_baseButtonNameByLanguages[language]} (${buffer["language"]})</b>`);
    //#endregion

    //#region populate descriptions in session to <textarea>
    // get descriptions from session
    let descriptionsInSession = JSON.parse(sessionStorage
        .getItem(descriptionsSessionKey));

    // when any description is exists in session
    if (descriptionsInSession != null  // when any descriptions exists in session
        && descriptionsInSession[buffer["language"]] != undefined)  // when descriptions in selected language 
        //#region add description in session to <textarea>
        descriptionsTextarea.val(
            descriptionsInSession[buffer["language"]]);
    //#endregion
    //#endregion
}

export async function change_descriptionsTextareaAsync(descriptionsButton) {
    //#region initialize descriptions current color if not initialized
    if (buffer["currentColor"] == null)
        buffer["currentColor"] = descriptions_unsavedColor;
    //#endregion

    //#region change descriptions <button> color as "unsaved color"
    if (buffer["currentColor"] == descriptions_savedColor)
        await changeDescriptionsButtonColorAsync(
            descriptionsButton,
            descriptions_unsavedColor);
    //#endregion
}

export async function changeDescriptionsButtonColorAsync(descriptionsButton, color) {
    descriptionsButton.css("color", color);
    buffer["currentColor"] = color;
}
//#endregion