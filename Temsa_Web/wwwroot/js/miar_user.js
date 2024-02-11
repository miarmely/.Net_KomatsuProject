import { populateElementByAjaxOrLocalAsync } from "./miar_tools";


async function populateRoleSelectByAccountRoleAsync() {
    await populateElementByAjaxOrLocalAsync(
        localKeys_allRoles,
        `/user/display/role?language=${language}`,
        (roles) => {
            new Promise(async resolve => {
                //#region reset role <select>
                slct_roles.empty();
                slct_roles.removeAttr("disabled");
                //#endregion

                //#region when account role is editor
                if (userRole == "Editör" || userRole == "Editor") {

                    //#region when role of clicked user is admin
                    if (userInfos.roleNames == "Admin" || userInfos.roleNames == "Yönetici") {
                        // only add admin role and disable role select
                        slct_roles.append(`<option>${userInfos.roleNames}</option>`);
                        slct_roles.attr("disabled", "");
                    }
                    //#endregion

                    //#region when role of clicked user is not admin
                    else
                        await populateRoleSelectForEditorAsync(
                            roles,
                            userInfos.roleNames);
                    //#endregion
                }
                //#endregion

                //#region when user role is not editor
                else
                    await populateSelectAsync(
                        slct_roles,
                        roles,
                        userInfos.roleNames);
                //#endregion

                resolve();
            })
        });  // role select


}