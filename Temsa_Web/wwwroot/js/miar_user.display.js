import {
    paginationInfosInJson, updateResultLabel, entityCountOnTable, getDateTimeInString,
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync,
    populateElementByAjaxOrLocalAsync, populateSelectAsync, showOrHideBackButtonAsync,
    isUserRoleThisRoleAsync,
    autoObjectMapperAsync
} from "./miar_tools.js"

import {
    checkInputsWhetherBlankAsync, click_userForm_inputAsync, populateElementNamesAsync,
    click_userForm_showPasswordButtonAsync, keyup_userForm_inputAsync,
    populateInfoMessagesAsync
} from "./miar_user.inputForm.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const routeForDisplay = "user/display/all";
    const routeForDelete = "user/delete";
    const entityType = "user"
    const errorMessageColor = "red";
    const table_body = $("#tbl_user tbody");
    const table_head = $("#tbl_user thead tr");
    const ul_pagination = $("#ul_pagination");
    const box_all = $("#box_all");
    const slct_menubar = $("#slct_menubar");
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
                "Seçilenleri Sil"
            ],
            "EN": [
                "Delete Selected"
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

        //#region update user
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
            //#region delete selected values
            case "0":
                await deleteSelectedUsersAsync();
                break;
            //#endregion 
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
    spn_eventManager.on("click_row", async (_, event) => {
        //#region set variables
        idOfLastClickedRow = event.currentTarget.id;
        let userInfos = rowIdsAndUserInfos[idOfLastClickedRow];

        // show inputs (reset)
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
    async function populateTableAsync(addPagingButtons = true) {
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/user/display/all" +
                `?language=${language}` +
                `&pageNumber=${pageNumber}` +
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
        //#region set variables
        let telNoList = [];
        let rowNoList = [];
        //#endregion

        //#region set telNoList and rowNoList
        await new Promise(resolve => {
            let checkBox;
            let row;
            let telNo;

            for (let rowNo = 1; rowNo <= entityCountOnTable; rowNo += 1) {
                //#region set variables
                checkBox = $(`#tr_row${rowNo} #td_checkBox input`);
                row = $(`#tr_row${rowNo}`);
                //#endregion 

                //#region populate telNoList and rowNoList if user checked
                if (checkBox.is(":checked")) {
                    //#region when update process continuing
                    if (row.children("td").children("input").length != 0)  // when any <input> exists
                        clicked_cancelButtonAsync(row);  // cancel update process
                    //#endregion

                    telNo = row.children("#td_telNo").text();

                    telNoList.push(telNo);
                    rowNoList.push(rowNo);
                }
                //#endregion
            }

            resolve();
        })
        //#endregion

        //#region when any user not select
        if (telNoList.length == 0)
            return;
        //#endregion

        $.ajax({
            method: "POST",
            url: `${baseApiUrl}/${routeForDelete}?language=${language}`,
            headers: {
                "Authorization": jwtToken
            },
            data: JSON.stringify({
                "TelNoList": telNoList
            }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                let currentPageNo = paginationInfosInJson.CurrentPageNo;

                //#region when all users on page deleted
                if (telNoList.length == entityCountOnTable) {
                    //#region when next page exists
                    if (paginationInfosInJson.HasNext)
                        alert(1);
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfosInJson.HasPrevious)
                        alert(2);
                    //#endregion

                    //#region when any machines not found
                    else {
                        table_body.empty();

                        updateResultLabel(
                            "#" + entityQuantity.id,
                            `<b>0/${pageSize}<b> ${langPack.entityQuantity[language]}`,
                            errorMessageColor);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some users on page deleted
                else
                    populateTable(
                        entityType,
                        routeForDisplay,
                        language,
                        currentPageNo,
                        pageSize,
                        table_body,
                        columnNamesToBeFill,
                        updateButtonName,
                        pagination.headerName,
                        lbl_entityQuantity,
                        ul_pagination,
                        errorMessageColor,
                        pagination.buttonCount,
                        langPack.entityQuantity[language],
                        true);  // refresh current page
                //#endregion

                //#region do unchecked 'box_all'
                box_all.prop("checked", false);
                //#endregion
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    "#" + entityQuantity.id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor
                );
                //#endregion
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

    async function clicked_saveButtonAsync(row) {
        //#region set variables
        let rowId = row.attr("id");
        let columnNamesByElementTypes = {
            "input": [
                "firstName",
                "lastName",
                "companyName",
                "telNo",
                "email",
            ],
            "select": [
                "roleNames"
            ]
        }
        let oldColumnValues = JSON.parse(
            sessionStorage.getItem(rowId));
        let newColumnValues = {};
        var data = {};

        //#region populate newColumnValues
        for (let elementType in columnNamesByElementTypes)
            for (let index in columnNamesByElementTypes[elementType]) {
                let columnName = columnNamesByElementTypes[elementType][index];
                let inputOrSelect = row
                    .children(`#td_${columnName}`)
                    .children(elementType);

                newColumnValues[columnName] = inputOrSelect.val();
            }
        //#endregion

        //#region populate data
        for (let columnName in newColumnValues) {
            data[columnName] =
                oldColumnValues[columnName] == newColumnValues[columnName] ? // is same old value with new value?
                    null  // if not changed
                    : newColumnValues[columnName]  // if changed
        }
        //#endregion


        //#endregion

        $.ajax({
            method: "POST",
            url: (`${baseApiUrl}/user/update` +
                `?language=${language}` +
                `&telNo=${r.telNo}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region update row infos in session 
                sessionStorage.setItem(
                    rowId,
                    JSON.stringify(newColumnValues));
                //#endregion

                resetErrorRowAsync(rowId);
                setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, false);
            },
            error: (response) => {
                //#region write error to error row
                updateErrorRow(
                    `#${rowId}_error`,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            }
        })
    }
    //#endregion

    populateHtmlAsync();
    populateTableAsync();
});