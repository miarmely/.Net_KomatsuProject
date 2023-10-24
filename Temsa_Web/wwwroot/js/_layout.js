import { getTokenInSession } from "./miarTools.js"


$(function () {
    //#region variables
    const sideBarMenuIdsAndHrefs = {
        "#a_homepage": "#",
        "#a_newUser": `/user/create`,
        "#a_registeredUser": `/user/display`,
        "#a_newMachine": `/machine/create`,
        "#a_registeredMachine": `/machine/display`,
        "#a_buyingDemandForm": "#",
        "#a_rentingDemandForm": "#",
        "#a_secondHandDemandForm": "#",
        "#a_informationDemandForm": "#",
        "#a_settings": "#"
    }
    //#endregion

    //#region functions
    function populateHrefOfSideBarMenus() {
        //#region add href to side bar menus
        for (let sideBarMenuId in sideBarMenuIdsAndHrefs) {
            //#region add parameters to href
            let href = sideBarMenuIdsAndHrefs[sideBarMenuId];

            href += `?language=${language}` +
                `&token=${jwtToken}`
            //#endregion

            // add href to <a> of sidebar menu
            $(sideBarMenuId).attr("href", href);
        }
        //#endregion
    }
    //#endregion

    populateHrefOfSideBarMenus();
})
