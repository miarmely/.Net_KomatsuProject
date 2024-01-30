import { populateElementByAjaxOrLocalAsync, populateSelectAsync } from "./miar_tools";


//#region functions
export async function populateFormAsync(
    panelTitleId,
    div_form,
    formTitleByLanguages,
    saveButtonNameByLanguages,
    slct_roleName_id,
) {
    //#region add form title
    $("#" + panelTitleId).append(
        formTitleByLanguages[language]);
    //#endregion

    //#region add role <select>    
    $("#div_form").append(
        `<div class="form-group">
            <label class="col-sm-3 control-label">${formLabel.label}</label>
            <div class="col-sm-6">
                <select id="${slct_roleName_id}" class="form-control m-bot15">             
                    </select>
            </div>
        </div>`
    );
    
    // populate role <select>
    await populateElementByAjaxOrLocalAsync(
        localKeys_allRoles,
        `/user/display/role?language=${language}`,
        (data) => {
            populateSelectAsync(
                $("#slct_roles"),
                data);
        });
    //#endregion
    
    //#region add save button
    div_form.append(
        `<div class="form-group">
            <div class="col-sm-6; text-center">
                <button id="btn_save" type="submit" class="btn btn-danger" style="background-color: darkblue">
                    ${saveButtonNameByLanguages[language]}
                </button>
            </div>
        </div>`
    );
    //#endregion
}
//#endregion