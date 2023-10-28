$(function () {
    const ul_sidebarMenu = $("#nav-accordion");

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
        $("#inpt_searchbBar").attr("placeholder", searchBarPlaceHolder);
        //#endregion

        //#region add default flag picture and language of "language dropdown"
        $("#img_selectedFlag").attr("alt", language); // for flag
        $("#img_selectedFlag").attr("src", `~/images/${language}.png`);  // for flag
        $("#spn_selectedLanguage").text(language);  // for language
        //#endregion

        populateUserSettingsMenu();
    }

    function populateSideBarMenu() {
        for (let sidebarMenuName in sideBarMenus_sorting) {
            // #region when sidebar menu haven't dropdown
            if (sidebarMenus_withoutDropDown[sidebarMenuName] != null) {

                ul_sidebarMenu.append(
                    `<li>
						<a id="a_sideBar_homepage" href="#" class="active">
							<i class="fa fa-dashboard"></i>
							<span></span>
						</a>
				    </li>`
                );
            }
            //#endregion

            //#region when sidebar menu have dropdown
            else {


                ul_sidebarMenu.append(
                    `<li class="sub-menu">
						<a href="${}">
							<i class="fa fa-book"></i>
							<span></span>
						</a>
						<ul class="sub">
							<li>
								<a href="@sidebarMenu.Users.SubMenus.NewUser.Href">
									@sidebarMenu.Users.SubMenus.NewUser.Label
								</a>
							</li>
							<li>
								<a href="@sidebarMenu.Users.SubMenus.RegisteredUsers.Href">
									@sidebarMenu.Users.SubMenus.RegisteredUsers.Label
								</a>
							</li>
						</ul>
					</li>`
                );

            }
            //#endregion
        }

    }
    In  //#endregion


});
