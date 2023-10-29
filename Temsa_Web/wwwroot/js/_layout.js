$(function () {
    //#region variables
    const ul_sidebarMenu = $("#nav-accordion");
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
    //#endregion

    //#region function
    function populateUserSettingsMenu() {
        // #region add menus of user settings
        for (let menuId in userSettingsMenu) {
            let iconClass = userSettingsMenu[menuId]["Icon"];
            let menuName = userSettingsMenu[menuId]["Label"];

            $("#ul_userSettingsMenu").append(
                `<li>
				    <a id="${menuId}" href="#">
					    <i class="${iconClass}"></i>
					    ${menuName}
				    </a>
			    </li>`
            );
        }
        //#endregion
    }

    function populateElementsOnHeader() {
        //#region add placeholder to search bar
        $("#inpt_searchBar").attr("placeholder", searchBarPlaceHolder);
        //#endregion

        //#region add default flag picture and language of "language dropdown"
        // add flag
        $("#img_selectedFlag").attr("alt", language);
        $("#img_selectedFlag").attr("src", `/images/${language}.png`);

        // add language
        $("#spn_selectedLanguage").text(language);
        //#endregion

        populateUserSettingsMenu();
    }

    function populateSideBarMenu() {
        //#region add all sidebar menus without dropdown
        for (let sidebarMenuName in sidebarMenus) {
            //#region set variables
            let sidebarMenu = sidebarMenus[sidebarMenuName];
            let li_sidebarMenu_id = `li_sidebarMenu_${sidebarMenuName}`;
            //#endregion

            //#region add menus to side bar 
            ul_sidebarMenu.append(
                `<li id="${li_sidebarMenu_id}">
					<a  href="${sidebarMenu.Href}">
						<i class="${sidebarMenu.Icon}"></i>
						<span>
                            ${sidebarMenu.Label}
                        </span>
					</a>
				</li>`
            );
            //#endregion
        }
        //#endregion

        //#region add dropdown to sidebar menus with dropdown
        for (let sidebarMenuName in sidebarMenusWithDropdown) {
            //#region set variables
            let li_sidebarMenu = $(`#li_sidebarMenu_${sidebarMenuName}`);
            let ul_sidebarMenuWithDropdown_id = `ul_sidebarMenusWithDropdown_${sidebarMenuName}`;
            let sidebarMenusOnDropdown = sidebarMenusWithDropdown[sidebarMenuName]
            //#endregion

            //#region add <ul> to sidebar menu
            li_sidebarMenu.append(
                `<ul id="${ul_sidebarMenuWithDropdown_id}" class="sub">
                </ul>`
            );
            //#endregion

            //#region add dropdown sidebar menus to <ul>
            for (let sidebarMenuNameOnDropdown in sidebarMenusOnDropdown) {
                let sidebarMenuOnDropdown = sidebarMenusOnDropdown[sidebarMenuNameOnDropdown];

                $("#" + ul_sidebarMenuWithDropdown_id).append(
                    `<li class="sub-menu">
    			        <a href="${sidebarMenuOnDropdown.Href}">
    				        ${sidebarMenuOnDropdown.Label}
    			        </a>
    		        </li>`
                );
            }
            //#endregion
        }
        //#endregion
    }

    function populateFooter() {
        // add footer info
        $("#spn_footerInfo").append(footerInfo);
    }
    //#endregion

    populateElementsOnHeader();
    populateSideBarMenu();
    populateFooter();
});
