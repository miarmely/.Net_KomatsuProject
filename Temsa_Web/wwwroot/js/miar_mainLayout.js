import {
    updateDefaultFlagAndLanguage, populateLanguageDropdownAsync,
    clicked_languageDropdown
} from "./miar_header.js";
import { showOrHideInfoMessage } from "./miar_tools.js";


$(function () {
    //#region variables
    const ul_sidebar_mainMenus = $("#nav-accordion");
    const ul_languages = $("#ul_languages");
    const ul_profileOptions = $("#ul_profileOptions");
    const sidebar_mainMenus = sidebar_mainMenus_byLanguages[language];
    const sidebar_allSubMenus = sidebar_subMenus_byLanguages[language];
    const profileOption_logout_id = "a_logout";
    //#endregion

    //#region events
    ul_profileOptions.click((event) => {
        switch ($(event.target).attr("id")) {
            //#region when clicked to "logout"
            case profileOption_logout_id:
                //#region reset all local
                // reset all local
                let telNoForLogin = localStorage.getItem(localKeys_telNoForLogin);
                localStorage.clear();

                // add "telNo" to local again
                if (telNoForLogin != null)
                    localStorage.setItem(localKeys_telNoForLogin, telNoForLogin);

                // add "language" to local again
                localStorage.setItem("language", language);  // add language again
                //#endregion

                break;
            //#endregion
        }
    })
    ul_languages.click(() =>
        clicked_languageDropdown($(":focus"))
    )
    $(".div_infoMessageButton").on("click", "button", (event) => {
        let div_clickedInfoMessageButton = $(event.target).parent();

        showOrHideInfoMessage(div_clickedInfoMessageButton);
    });
    $(".sidebar-menu").click((event) => {
        //#region control whether click to main menu that have sub menus
        let a_selectedMenu = $(event.target);

        switch (a_selectedMenu.attr("class")) {
            //#region when select menu that have sub menus
            case "dcjq-parent":
                //#region display sub menus
                let ul_selectedMenu = a_selectedMenu.siblings();

                if (ul_selectedMenu.css("display") == "none")
                    ul_selectedMenu.css("display", "");
                //#endregion

                //#region hide sub menus
                else
                    ul_selectedMenu.css("display", "none");
                //#endregion

                break;
            //#endregion
        }
        //#endregion     
    })
    //#endregion

    //#region functions
    async function populateProfileOptionsAsync() {
        // #region add menus of user settings
        let profileOptions = profileOptionsByLanguages[language];

        for (let profileOption in profileOptions) {
            let optionInfos = profileOptions[profileOption];
            let a_option_id = "a_" + profileOption;
            
            ul_profileOptions.append(
                `<li>
				    <a id="${a_option_id}" href="${optionInfos["href"]}"> <i class="${optionInfos["icon"]}"></i>${optionInfos["label"]}</a>
			    </li>`
            );
        }
        //#endregion
    }
    async function populateElementsOnHeaderAsync() {
        //#region add placeholder to search bar
        $("#inpt_searchBar").attr(
            "placeholder",
            searchBarPlaceHolderByLanguages[language]);
        //#endregion

        //#region update displaying flag and language
        await updateDefaultFlagAndLanguage(
            img_displayingFlag_id,
            spn_displayingLanguage_id);
        //#endregion

        await populateLanguageDropdownAsync(ul_languages);
    }
    async function populateSideBarMenuAsync() {
        //#region add sidebar main menus
        for (let menuName in sidebar_mainMenus) {
            //#region set variables
            let sidebar_mainManu = sidebar_mainMenus[menuName];
            let li_sidebar_mainMenu_id = `li_sidebar_mainMenu_${menuName}`;
            let a_sidebar_mainMenu_id = `a_sidebar_mainMenu_${menuName}`;
            //#endregion

            //#region add menus to side bar 
            ul_sidebar_mainMenus.append(
                `<li id="${li_sidebar_mainMenu_id}">
					<a id="${a_sidebar_mainMenu_id}" href="${sidebar_mainManu.href}">
						<i class="${sidebar_mainManu.icon}"></i>
						<span>${sidebar_mainManu.label}</span>
					</a>
				</li>`
            );

            // when menu have submenus
            if (sidebar_allSubMenus[menuName] != null) {
                //#region configure dropdown
                let a_sidebar_mainMenu = $("#" + a_sidebar_mainMenu_id);

                // add class to <li> and <a>
                $("#" + li_sidebar_mainMenu_id).attr("class", "sub-menu dcjq-parent-li");
                a_sidebar_mainMenu.attr("class", "dcjq-parent");

                // add arrow icon to right
                a_sidebar_mainMenu.append(
                    `<span class="dcjq-icon"></span>`
                )
                //#endregion
            }
            //#endregion
        }
        //#endregion

        //#region add sidebar sub menus
        for (let menuName in sidebar_allSubMenus) {
            //#region set variables
            let li_sidebar_mainMenu = $(`#li_sidebar_mainMenu_${menuName}`);
            let ul_sidebar_subMenus_id = `ul_sidebar_subMenus_${menuName}`;
            let sidebar_subMenusOfMainMenu = sidebar_allSubMenus[menuName]
            //#endregion

            //#region add <ul> to sidebar sub menu
            li_sidebar_mainMenu.append(
                `<ul id="${ul_sidebar_subMenus_id}" class="sub sidebar_submenu" style="display: none">
                </ul>`
            );
            //#endregion

            //#region add sub menus to <ul>
            for (let subMenuName in sidebar_subMenusOfMainMenu) {
                let sidebar_subMenu = sidebar_subMenusOfMainMenu[subMenuName];

                $("#" + ul_sidebar_subMenus_id).append(
                    `<li>
    			        <a href="${sidebar_subMenu.href}">${sidebar_subMenu.label}</a>
    		        </li>`
                );
            }
            //#endregion
        }
        //#endregion

        $("#ul_sidebar_subMenus_machines a[href= '/machine/category']").append(
            `<img src="/images/new.png" alt="new" style="margin-left: 5px; width:30px; height:30px"/>`)
    }
    async function populateFooterAsync() {
        $("#spn_footerInfo").append(
            footerInfoByLanguages[language]);
    }
    async function populateHtmlAsync() {
        await populateElementsOnHeaderAsync();
        await populateProfileOptionsAsync();
        await populateSideBarMenuAsync();
        await populateFooterAsync();
    }
    //#endregion

    populateHtmlAsync();
});