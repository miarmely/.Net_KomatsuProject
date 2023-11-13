import { populateElementByAjaxOrLocalAsync } from "./miar_tools.js"
import { updateDefaultFlagAndLanguage, populateLanguageDropdown, clicked_languageDropdown } from "./miar_header.js";

$(function() {
    //#region variables
    const ul_sidebar_mainMenus = $("#nav-accordion");
    const ul_languages = $("#ul_languages");
    const sidebar_mainMenus = sidebar_mainMenus_byLanguages[language];
    const sidebar_allSubMenus = sidebar_subMenus_byLanguages[language];
    const ul_languages_id = "ul_languages";
    //#endregion

    //#region events
    $("#ul_userSettingsMenu").click(() => {
        let selectedMenu = $(":focus");

        //#region when logout selected (ajax)
        if (selectedMenu.attr("id") == "a_logout") {
            //#region reset local
            localStorage.clear();
            localStorage.setItem("language", language);  // add language again
            //#endregion
            
            // logout and redirect to login
            $.ajax({
                method: "GET",
                url: "/authentication/logout",
                success: () => {
                    // open login page
                    location.replace(`/`);
                }
            })
        }
        //#endregion
    })
    $(".sidebar-menu").click(() => {
        //#region control whether click to main menu that have sub menus
        let a_selectedMenu = $(":focus");

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
    ul_languages.click(() =>
        clicked_languageDropdown($(":focus"))
    )
    //#endregion

    //#region function
    async function populateUserSettingsMenuAsync() {
        // #region add menus of user settings
        let userSettingsMenu = userSettingsMenuByLanguages[language];

        for (let menuName in userSettingsMenu) {
            let iconClass = userSettingsMenu[menuName]["icon"];
            let label = userSettingsMenu[menuName]["label"];

            $("#ul_userSettingsMenu").append(
                `<li>
				    <a id="a_${menuName}" href="#">
					    <i class="${iconClass}"></i>
					    ${label}
				    </a>
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

        //#region populate language dropdown
        await populateElementByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            (data) => {
                populateLanguageDropdown(
                    ul_languages_id,
                    data);
            }
        );
        //#endregion       
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
                `<ul id="${ul_sidebar_subMenus_id}" class="sub" style="display: none">
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
    }

    async function populateFooterAsync() {
        $("#spn_footerInfo").append(
            footerInfoByLanguages[language]);
    }

    async function populateHtmlAsync() {
        await populateElementsOnHeaderAsync();
        await populateUserSettingsMenuAsync();
        await populateSideBarMenuAsync();
        await populateFooterAsync();
    }
    //#endregion

    populateHtmlAsync();
});



