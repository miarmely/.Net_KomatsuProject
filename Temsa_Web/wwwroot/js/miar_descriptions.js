//#region variables
export let descriptions = {
    "currentColor": null,
    "language": null,
    "byLanguages": {},
    "isChanged": false
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
    //#region set variables
    const btn_descriptions = $("#" + btn_descriptions_id);
    const txt_descriptions = $("#" + txt_descriptions_id);
    //#endregion

    btn_descriptions.click(async () => {
        //#region save new description

        //#region when description not changed
        let newDescription = txt_descriptions.val();

        if (newDescription == descriptions.byLanguages[descriptions.language])
            return;
        //#endregion

        //#region when changed
        descriptions.byLanguages[descriptions.language] = newDescription;
        descriptions.isChanged = true;
        //#endregion

        //#endregion

        //#region change description button color to "saved color"
        await changeDescriptionsButtonColorAsync(
            btn_descriptions,
            descriptions_savedColor);
        //#endregion
    })
    $("#" + ul_descriptions_id).click(async (event) => {
        descriptions.language = event.target.innerText;

        //#region change descriptions <button> color as "unsaved_color"
        txt_descriptions.val("");

        await changeDescriptionsButtonColorAsync(
            btn_descriptions,
            descriptions_unsavedColor);
        //#endregion

        //#region change descriptions <button> name
        btn_descriptions.empty();
        btn_descriptions.append(
            `<b>${descriptions_baseButtonNameByLanguages[language]} (${descriptions.language})</b>`);
        //#endregion

        //#region add description to <textarea> if exists
        if (descriptions.byLanguages[descriptions.language] != null)
            txt_descriptions.val(
                descriptions.byLanguages[descriptions.language]);
        //#endregion
    })
}
//#endregion

//#region functions


export async function setVariablesForDescriptionsAsync(bufferName, variables) {
    //#region set variables as dynamic
    switch (bufferName) {
        case "descriptions":
            //#region initialize variables
            for (let variableName in variables)
                // when variable name is exists in buffer
                if (descriptions[variableName] != undefined)
                    descriptions[variableName] = variables[variableName];
            //#endregion
            break;
    }
    //#endregion
}

export async function getDescriptionKeyForSessionAsync(descriptionBaseKeyForSession) {
    return descriptionBaseKeyForSession + '-' + descriptions.language;
}

export async function change_descriptionsTextareaAsync(descriptionsButton) {
    //#region initialize descriptions current color if not initialized
    if (descriptions["currentColor"] == null)
        descriptions["currentColor"] = descriptions_unsavedColor;
    //#endregion

    //#region change descriptions <button> color as "unsaved color"
    if (descriptions["currentColor"] == descriptions_savedColor)
        await changeDescriptionsButtonColorAsync(
            descriptionsButton,
            descriptions_unsavedColor);
    //#endregion
}

export async function changeDescriptionsButtonColorAsync(descriptionsButton, color) {
    descriptionsButton.css("color", color);
    descriptions["currentColor"] = color;
}
//#endregion