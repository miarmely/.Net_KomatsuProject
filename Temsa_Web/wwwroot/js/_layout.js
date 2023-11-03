$(function () {
    //#region variables
    const ul_sidebar_mainMenus = $("#nav-accordion");
    const ul_languages = $("#ul_languages");
    const sidebar_mainMenus = sidebar_mainMenus_byLanguages[language];
    const sidebar_allSubMenus = sidebar_subMenus_byLanguages[language];
    const footerInfo = footerInfoByLanguages[language];
    const allLanguagesKeyInLocal = "allLanguages";
    //#endregion

    //#region events
    $("#a_logout").click(() => {
        // remove token
        localStorage.removeItem("token");

        // logout and redirect to login
        $.ajax({
            method: "GET",
            url: "/authentication/logout",
            success: () => {
                // open login page
                location.replace(`/?language=${language}`);
            }
        })
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
    });
    ul_languages.click(() => {
        //#region get selected language
        let selectedElement = $(":focus");
        let selectedLanguage = selectedElement.prop("innerText");
        //#endregion

        //#region update language in local
        if (selectedLanguage != undefined) {
            language = selectedLanguage.trim() // update in _layout
            localStorage.setItem("language", language)  // update in local
        }
        //#endregion

        //#region update default flag and language and refresh page
        updateDefaultFlagAndLanguage();
        location.reload();
        //#endregion
    })
    //#endregion

    //#region function
    function updateDefaultFlagAndLanguage() {
        //#region add default flag picture and language of "language dropdown"
        // add flag
        $("#img_selectedFlag").attr("alt", language);
        $("#img_selectedFlag").attr("src", `/images/${language}.png`);

        // add language
        $("#spn_selectedLanguage").text(language);
        //#endregion
    }

    function populateLanguageDropdown(languagesInArray) {
        //#region add languages to dropdown
        for (let index in languagesInArray) {
            let language = languagesInArray[index];

            $("#ul_languages").append(
                `<li>
                    <a href="#">
                        <img alt="${language}" src="/images/${language}.png" />
                        <b>${language}</b>
                    </a>
                </li>`
            );
        }
        //#endregion
    }

    async function populateUserSettingsMenuAsync() {
        new Promise(resolve => {
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

            resolve();
        });
    }

    async function populateElementsOnHeaderAsync() {
        new Promise(resolve => {
            //#region add placeholder to search bar
            $("#inpt_searchBar").attr("placeholder", searchBarPlaceHolderByLanguages[language]);
            //#endregion

            updateDefaultFlagAndLanguage();

            //#region populate language dropdown from (ajax) or (local)
            let languagesInLocal = localStorage.getItem(allLanguagesKeyInLocal);

            //#region when languages not exists in local
            if (languagesInLocal == null)
                $.ajax({
                    method: "GET",
                    url: baseApiUrl + "/machine/display/language",
                    headers: {
                        "Authorization": jwtToken
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: (response) => {
                        populateLanguageDropdown(response);

                        //#region add languages to local
                        localStorage.setItem(
                            allLanguagesKeyInLocal,
                            JSON.stringify(response));
                        //#endregion
                    }
                });
            //#endregion

            //#region when languages exists in local
            else
                populateLanguageDropdown(
                    JSON.parse(languagesInLocal));
            //#endregion

            //#endregion

            resolve();
        })
    }

    async function populateSideBarMenuAsync() {
        new Promise(resolve => {
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

            resolve();
        });
    }

    function populateFooter() {
        $("#spn_footerInfo").append(footerInfo);
    }

    async function populateHtml() {
        await populateElementsOnHeaderAsync();
        await populateUserSettingsMenuAsync();
        await populateSideBarMenuAsync();
        populateFooter();
    }
    //#endregion

    populateHtml();
});



