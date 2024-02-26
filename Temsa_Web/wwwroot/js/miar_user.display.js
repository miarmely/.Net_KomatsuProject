import {
    paginationInfosInJson, updateResultLabel, entityCountOnTable, getDateTimeInString,
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync,
    populateElementByAjaxOrLocalAsync, populateSelectAsync, showOrHideBackButtonAsync,
    isUserRoleThisRoleAsync, autoObjectMapperAsync
} from "./miar_tools.js"

import {
    click_userForm_inputAsync, populateElementNamesAsync, keyup_userForm_inputAsync,
    populateInfoMessagesAsync, click_userForm_showPasswordButtonAsync,
    checkInputsWhetherBlankAsync
} from "./miar_user.inputForm.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const pagination = {
        "headerName": "User-Pagination",
        "buttonCount": 5,
        "infos": {}
    };
    const entityQuantity = {
        "id": "lbl_entityQuantity",
        "color": "#7A7A7A"
    };
    const lbl_entityQuantity = $("#" + entityQuantity.id);
    const routeForDisplay = "user/display/all";
    const routeForDelete = "user/delete";
    const entityType = "user"
    const errorMessageColor = "red";
    const table_body = $("#tbl_user tbody");
    const table_head = $("#tbl_user thead tr");
    const ul_pagination = $("#ul_pagination");
    const box_all = $("#box_all");
    const slct_menubar = $("#slct_menubar");
    const slct_roles = $("#slct_roles");
    const p_resultLabel_id = "p_resultLabel";
    const p_resultLabel = $("#" + p_resultLabel_id);
    const img_loading = $("#img_loading");
    const security = {
        "validRolesForRoleSelect": {
            "editor": {
                "TR": ["Kullanıcı"],
                "EN": ["User"]
            },
            "admin": {
                "TR": ["Kullanıcı", "Editör", "Yönetici"],
                "EN": ["User", "Editor", "Admin"]
            }
        }
    }
    const btn = {
        "apply": $("#btn_apply"),
        "save": $("#btn_save"),
        "showPassword": $("#btn_showPassword"),
        "back": $("#btn_back")
    }
    const div = {
        "userUpdate": $("#div_userUpdate"),
        "userDisplay": $("#div_userDisplay"),
        "panelTitle": $("#div_panelTitle"),
        "backButton": $("#div_backButton")
    }
    const inpt = {
        "firstName": $("#inpt_firstName"),
        "lastName": $("#inpt_lastName"),
        "phone": $("#inpt_phone"),
        "email": $("#inpt_email"),
        "company": $("#inpt_company"),
        "password": $("#inpt_password")
    };
    const langPack = {
        "panelTitle": {
            "displayPage": {
                "TR": "KAYITLI KULLANICILAR",
                "EN": "REGISTERED USERS"
            },
            "updatePage": {
                "TR": "KULLANICI GÜNCELLEME",
                "EN": "USER UPDATE"
            }
        },
        "columnNames": {
            "TR": [
                "Ad",
                "Soyad",
                "Şirket",
                "Telefon",
                "Email",
                "Rol",
                "Kayıt Tarihi",
            ],
            "EN": [
                "First Name",
                "Last Name",
                "Company",
                "Telephone",
                "Email",
                "Role",
                "Registration Date",
            ]
        },
        "entityQuantity": {
            "TR": "kullanıcı gösteriliyor",
            "EN": "user displaying"
        },
        "menubarOptions": {
            "TR": [
                "Görüntüle",
                "Sil"
            ],
            "EN": [
                "Display",
                "Delete"
            ]
        },
        "applyButton": {
            "TR": "Uygula",
            "EN": "Apply"
        },
        "formElementNames": {
            "TR": {
                "firstName": "Ad",
                "lastName": "Soyad",
                "phone": "Telefon",
                "email": "Email",
                "company": "Şirket",
                "roles": "Rol",
                "password": "Yeni Şifre",
                "saveButton": "Kaydet"
            },
            "EN": {
                "firstName": "Firstname",
                "lastName": "Lastname",
                "phone": "Phone",
                "email": "Email",
                "company": "Company",
                "roles": "Role",
                "password": "New Password",
                "saveButton": "Save"
            }
        },
        "errorMessages": {
            "noPermission": {
                "TR": "yetkiniz bulunmamaktadır",
                "EN": "you don't have permission"
            },
            "anErrorOccured": {
                "TR": "bir hata oluştu",
                "EN": "an error occured"
            }
        },
        "successMessages": {
            "update": {
                "TR": "başarıyla yüklendi",
                "EN": "update successful"
            }
        }
    }
    let rowIdsAndUserInfos = {};
    let isUpdatePageOpenedBefore = false
    let idOfLastClickedRow = null;
    let slct_menubar_value = '0';  // '0': display
    let rowIdsForDelete = [];
    //#endregion

    //#region events

    //#region update page
    $("form").submit(async (event) => {
        //#region reset
        event.preventDefault();
        p_resultLabel.empty();
        //#endregion

        //#region control inputs wheter blank
        if (await checkInputsWhetherBlankAsync([
            inpt.firstName,
            inpt.lastName,
            inpt.company,
            inpt.phone,
            inpt.email
        ]))
            return;
        //#endregion

        //#region security control for save button (error)
        let userInfos = rowIdsAndUserInfos[idOfLastClickedRow];

        // when account is "editor" and displayed user is "admin" or "editor" 
        if (await isUserRoleThisRoleAsync(accountRole, "editor")
            && (await isUserRoleThisRoleAsync(userInfos.roleNames[0], "admin")
                || await isUserRoleThisRoleAsync(userInfos.roleNames[0], "editor"))) {
            // write error
            updateResultLabel(
                "#" + p_resultLabel.attr("id"),
                langPack.errorMessages.anErrorOccured[language],
                resultLabel_errorColor,
                "30px",
                img_loading);

            return;
        }
        //#endregion

        await checkInputsWhetherBlankAsync([
            inpt.firstName,
            inpt.lastName,
            inpt.company,
            inpt.phone,
            inpt.email]);

        //#region update user (ajax)
        let newValues = {
            "firstName": inpt.firstName.val(),
            "lastName": inpt.lastName.val(),
            "companyName": inpt.company.val(),
            "telNo": inpt.phone.val(),
            "email": inpt.email.val(),
            "roleNames": slct_roles.val(),
            "password": inpt.password.val()
        };
        let data = {
            "firstName": newValues.firstName == userInfos.firstName ? null : newValues.firstName,
            "lastName": newValues.lastName == userInfos.lastName ? null : newValues.lastName,
            "companyName": newValues.companyName == userInfos.companyName ? null : newValues.companyName,
            "telNo": newValues.telNo == userInfos.telNo ? null : newValues.telNo,
            "email": newValues.email == userInfos.email ? null : newValues.email,
            "roleNames": newValues.roleNames == userInfos.roleNames ? null : newValues.roleNames,
            "password": newValues.password == "" ? null : newValues.password
        };

        $.ajax({
            method: "POST",
            url: (`${baseApiUrl}/user/update` +
                `?language=${language}` +
                `&telNo=${userInfos.telNo}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                img_loading.removeAttr("hidden");
            },
            success: () => {
                new Promise(async resolve => {
                    //#region update "rowIdsAndUserInfos" buffer
                    await autoObjectMapperAsync(
                        rowIdsAndUserInfos[idOfLastClickedRow],
                        data,
                        true);
                    //#endregion

                    //#region update table row
                    let updatedUserInfos = rowIdsAndUserInfos[idOfLastClickedRow];
                    let row = table_body.children("#" + idOfLastClickedRow);

                    row.empty()
                    row.append(`
                        <td>${updatedUserInfos.firstName}</td>
                        <td>${updatedUserInfos.lastName}</td>
                        <td>${updatedUserInfos.companyName}</td>
                        <td>${updatedUserInfos.telNo}</td>
                        <td>${updatedUserInfos.email}</td>
                        <td>${updatedUserInfos.roleNames}</td>
                        <td>${getDateTimeInString(updatedUserInfos.createdAt)}</td>`);
                    //#endregion

                    // write success message
                    updateResultLabel(
                        "#" + p_resultLabel_id,
                        langPack.successMessages.update[language],
                        resultLabel_successColor,
                        "30px",
                        img_loading);

                    resolve();
                })
            },
            error: (response) => {
                // write error
                updateResultLabel(
                    "#" + p_resultLabel_id,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);
            },
        })
        //#endregion
    });
    $("input").click(async (event) => {
        await click_userForm_inputAsync(event, p_resultLabel);
    })
    $("input").on("keyup", async (event) => {
        await keyup_userForm_inputAsync(event, p_resultLabel);
    })
    btn.showPassword.click(async () => {
        await click_userForm_showPasswordButtonAsync(
            inpt.password,
            btn.showPassword);
    })
    btn.back.click(async () => {
        // reset form
        $("form")[0].reset();
        p_resultLabel.empty();

        // show user display page
        div.userUpdate.attr("hidden", "");
        div.userDisplay.removeAttr("hidden");

        await showOrHideBackButtonAsync(
            "hide",
            div.backButton,
            div.panelTitle,
            btn.back);
    })
    //#endregion

    //#region display page
    btn.apply.click(async () => {
        switch (slct_menubar.val()) {
            case '1':  // delete
                await deleteSelectedUsersAsync();
                break;
        }
    })
    ul_pagination.click(() => {
        //#region do unchecked "box_all"
        if ($("#box_all").is(":checked"))
            $("#box_all").prop("checked", false);
        //#endregion

        //#region click control of pagination buttons
        let clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (paginationInfosInJson.HasPrevious)
                    break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfosInJson.HasNext)
                    break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                let pageNo = clickedButton.prop("innerText");
                break;
            //#endregion
        }
        //#endregion 
    })
    box_all.click(() => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        for (let rowNo = 1; rowNo <= entityCountOnTable; rowNo++) {
            var checkBoxInRow = $(`#tr_row${rowNo} #td_checkBox input`);

            //#region do checked of checkbox
            if (isBoxAllChecked
                && !checkBoxInRow.is(":checked")) // if not checked
                checkBoxInRow.prop("checked", true);
            //#endregion

            //#region do unchecked of checkbox
            else if (!isBoxAllChecked
                && checkBoxInRow.is(":checked")) // if checked
                checkBoxInRow.prop("checked", false);
            //#endregion
        }
        //#endregion
    })
    slct_menubar.change(() => {
        slct_menubar_value = slct_menubar.val();

        switch (slct_menubar_value) {
            case '0':  // display
                // reset row colors
                table_body
                    .children("tr")
                    .removeAttr("style");

                // reset td colors
                table_body
                    .find("td")
                    .removeAttr("style");

                // hide apply button and reset colors
                btn.apply.attr("hidden", "");
                btn.apply.removeAttr("style");

                break;

            case '1':
                // add "red" color to apply button
                btn.apply.css({
                    "background-color": "red",
                    "color": "white"
                })
                btn.apply.removeAttr("hidden");
        }
    })
    spn_eventManager.on("click_row", async (_, event) => {
        //#region set variables
        idOfLastClickedRow = event.currentTarget.id;
        let userInfos = rowIdsAndUserInfos[idOfLastClickedRow];
        //#endregion

        switch (slct_menubar_value) {
            case '0':  // display
                //#region show inputs (reset)
                $("input").removeAttr("disabled");
                slct_roles.removeAttr("disabled");
                btn.save.removeAttr("disabled");
                //#endregion

                //#region change panel title
                div.panelTitle.empty();
                div.panelTitle.append(
                    langPack.panelTitle.updatePage[language]);

                await showOrHideBackButtonAsync(
                    "show",
                    div.backButton,
                    div.panelTitle,
                    btn.back);
                //#endregion

                //#region show user update page
                div.userDisplay.attr("hidden", "");
                div.userUpdate.removeAttr("hidden");
                //#endregion

                //#region when user page is not opened before
                if (!isUpdatePageOpenedBefore) {
                    await populateElementNamesAsync(langPack.formElementNames[language]);
                    await populateRoleSelectAsync(slct_roles, accountRole, userInfos.roleNames[0]);
                    await populateInfoMessagesAsync();

                    isUpdatePageOpenedBefore = true;
                }
                //#endregion

                await populateInputsWithUserInfosAsync(userInfos);

                //#region authorization control
                // when user role is editor and role of clicked user is not user
                if (await isUserRoleThisRoleAsync(accountRole, "editor")
                    && !await authorizationAsync(userInfos.roleNames[0], ["User", "Kullanıcı"])
                ) {
                    //#region disable the inputs if desired
                    $("input").attr("disabled", "");
                    slct_roles.attr("disabled", "");
                    btn.save.attr("disabled", "");
                    //#endregion

                    //#region write "no permission" error
                    updateResultLabel(
                        "#" + p_resultLabel_id,
                        langPack.errorMessages.noPermission[language],
                        resultLabel_errorColor,
                        "30px",
                        img_loading);
                    //#endregion
                }
                //#endregion

                break;
            case '1':  // delete
                //#region when account is "editor" and clicked user is "editor" or "admin"
                let roleNameOfClickedRow = rowIdsAndUserInfos[idOfLastClickedRow].roleNames[0];

                if (await isUserRoleThisRoleAsync(accountRole, "editor")
                    && (await isUserRoleThisRoleAsync(roleNameOfClickedRow, "editor")
                        || await isUserRoleThisRoleAsync(roleNameOfClickedRow, "admin")))
                    return;
                //#endregion

                //#region change color of clicked row as "red"
                let row = table_body.children("#" + idOfLastClickedRow);

                if (row.attr("style") == null) {
                    row.css("background-color", "red");
                    row.children("td").css("color", "white");

                    rowIdsForDelete.push(idOfLastClickedRow);
                }
                //#endregion

                //#region reset color of clicked row
                else {
                    // reset
                    row.removeAttr("style");
                    row.children("td").removeAttr("style");

                    // delete id from "rowIdsForDelete" buffer
                    let indexOfRowId = rowIdsForDelete.indexOf(idOfLastClickedRow);
                    rowIdsForDelete.splice(indexOfRowId, 1);
                }
                //#endregion

                break;
        }
    })
    //#endregion

    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region panel title
        div.panelTitle.append(
            langPack.panelTitle.displayPage[language]);
        //#endregion

        //#region panel menubar
        let tableMenubarOptions = langPack.menubarOptions[language];

        for (let index = 0; index < tableMenubarOptions.length; index += 1) {
            let tableMenubarOption = tableMenubarOptions[index];

            slct_menubar.append(
                `<option value="${index}">
                ${tableMenubarOption}
                </option>`
            )
        }
        //#endregion

        //#region apply button name
        btn.apply.append(
            langPack.applyButton[language])
        //#endregion

        await addColumnNamesToTableAsync();
    }
    async function populateTableAsync(_pageNumber = pageNumber, addPagingButtons = true) {
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/user/display/all" +
                `?language=${language}` +
                `&pageNumber=${_pageNumber}` +
                `&pageSize=${pageSize}`),
            headers: { "authorization": jwtToken },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                table_body.empty();
                addEntityQuantityMessageAsync(0);
            },
            success: (response, status, xhr) => {
                new Promise(async resolve => {
                    await addUsersToTableAsync(response);

                    //#region declare events
                    table_body.children("tr").click((event) => {
                        spn_eventManager.trigger("click_row", [event]);
                    })
                    //#endregion

                    //#region update entity quantity message
                    pagination.infos = JSON.parse(
                        xhr.getResponseHeader(pagination.headerName));

                    await addEntityQuantityMessageAsync(pagination.infos.CurrentPageCount);
                    //#endregion

                    //#region add paging button if desired
                    if (addPagingButtons)
                        await addPaginationButtonsAsync(
                            pagination.infos,
                            pagination.buttonCount,
                            ul_pagination);
                    //#endregion

                    await controlPaginationBackAndNextButtonsAsync(pagination.infos);
                    resolve();
                })
            },
            error: (response) => {
                //#region write error to resultLabel
                updateResultLabel(
                    "#" + entityQuantity.id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            },
        });
    }
    async function populateRoleSelectAsync(slct_roles, accountRole, roleToBeDisplay) {
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            (allRoles) => {
                new Promise(async resolve => {
                    //#region populate role <select>
                    slct_roles.empty();

                    await populateSelectAsync(
                        slct_roles,
                        allRoles,
                        roleToBeDisplay);
                    //#endregion

                    //#region get valid roles by account role
                    let validRoles = [];

                    // when user is editör
                    if (accountRole == "Editör" || accountRole == "Editor") {
                        validRoles = security.validRolesForRoleSelect.editor[language];
                    }

                    // when user is admin
                    else if (accountRole == "Yönetici" || accountRole == "Admin") {
                        validRoles = security.validRolesForRoleSelect.admin[language];
                    }
                    //#endregion

                    //#region disable the invalid roles
                    for (let index in allRoles) {
                        let role = allRoles[index];
                        let indexOfRole = validRoles.indexOf(role);

                        // disable
                        if (indexOfRole == -1)
                            slct_roles
                                .children(`option:nth-child(${+index + 1})`)
                                .attr("disabled", "");
                    }
                    //#endregion

                    resolve();
                })
            });
    }
    async function populateInputsWithUserInfosAsync(userInfos) {
        inpt.firstName.val(userInfos.firstName);
        inpt.lastName.val(userInfos.lastName);
        inpt.company.val(userInfos.companyName);
        inpt.phone.val(userInfos.telNo);
        inpt.email.val(userInfos.email);
        slct_roles.val(userInfos.roleNames);
    }
    async function addColumnNamesToTableAsync() {
        let columnNames = langPack.columnNames[language];

        for (let index in columnNames)
            table_head
                .children(`th:nth-child(${+index + 1})`)
                .append(columnNames[index]);
    }
    async function addUsersToTableAsync(response) {
        for (let index in response) {
            //#region set variables
            let rowId = `tr_row${index}`;
            let userInfos = response[index];
            rowIdsAndUserInfos[rowId] = userInfos;
            //#endregion

            table_body.append(
                `<tr id= "${rowId}">
                    <td>${userInfos.firstName}</td>
                    <td>${userInfos.lastName}</td>
                    <td>${userInfos.companyName}</td>
                    <td>${userInfos.telNo}</td>
                    <td>${userInfos.email}</td>
                    <td>${userInfos.roleNames}</td>
                    <td>${getDateTimeInString(userInfos.createdAt)}</td>
                </tr>`);
        }
    }
    async function deleteSelectedUsersAsync() {
        //#region set telNoList
        let telNoList = [];

        for (let index in rowIdsForDelete) {
            let rowId = rowIdsForDelete[index];

            telNoList.push(
                rowIdsAndUserInfos[rowId].telNo);
        }
        //#endregion

        //#region when any user not select
        if (telNoList.length == 0)
            return;
        //#endregion

        $.ajax({
            method: "POST",
            url: baseApiUrl + `/user/delete?language=${language}`,
            headers: {
                "authorization": jwtToken
            },
            data: JSON.stringify({
                "telNoList": telNoList
            }),
            contentType: "application/json",
            dataType: "json",
            before: () => {
                img_loading.removeAttr("hidden");
            },
            success: () => {
                new Promise(async resolve => {
                    //#region when all users on page deleted
                    if (telNoList.length == pagination.infos.CurrentPageCount) {
                        //#region when next page exists
                        if (pagination.infos.HasNext)
                            await populateTableAsync();  // refresh current page
                        //#endregion

                        //#region when previous page exists
                        else if (paginationInfosInJson.HasPrevious)
                            await populateTableAsync(pagination.infos.CurrentPageNo - 1);
                        //#endregion

                        //#region when any machines not found
                        else {
                            table_body.empty();

                            updateResultLabel(
                                "#" + entityQuantity.id,
                                `<b>0/${pageSize}<b> ${langPack.entityQuantity[language]}`,
                                resultLabel_errorColor);
                        }
                        //#endregion
                    }
                    //#endregion

                    //#region when some users on page deleted
                    else
                        await populateTableAsync(); // refresh current page
                    //#endregion

                    img_loading.removeAttr("hidden");
                    resolve();
                })
            },
            error: (response) => {
                // write error to entity quantity label
                updateResultLabel(
                    "#" + entityQuantity.id,
                    JSON.parse(response.responseText).errorMessage,
                    resultLabel_errorColor,
                    "30px",
                    img_loading);
            }
        });
    }
    async function addEntityQuantityMessageAsync(entityCount) {
        updateResultLabel(
            "#" + entityQuantity.id,
            `<b>${entityCount}/${pageSize}</b> ${langPack.entityQuantity[language]}`,
            entityQuantity.color);
    }
    async function authorizationAsync(accountRole, validRoles = []) {
        //#region when no permission of account
        if (validRoles.indexOf(accountRole) == -1)
            return false;
        //#endregion

        return true;
    }
    //#endregion

    populateHtmlAsync();
    populateTableAsync();
});