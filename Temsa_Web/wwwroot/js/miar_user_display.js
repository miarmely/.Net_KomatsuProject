import {
    paginationInfosInJson,
    updateResultLabel, entityCountOnTable,
    getDateTimeInString, addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync
} from "./miar_tools.js"


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const routeForDisplay = "user/display/all";
    const routeForUpdate = "user/update";
    const routeForDelete = "user/delete";
    const entityType = "user"
    const errorMessageColor = "red";
    const table_body = $("#tbl_user tbody");
    const table_head = $("#tbl_user thead tr");
    const ul_pagination = $("#ul_pagination");
    const box_all = $("#box_all");
    const slct_menubar = $("#slct_menubar");
    const css_roleNamesSelect_disabled = {
        "background-color": "darkGrey",
        "color": "white"
    };
    const editorRoleNamesByLanguages = ["editor", "editör"];
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
    const langPack = {
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
        "panelTitle": {
            "TR": "KAYITLI KULLANICILAR",
            "EN": "REGISTERED USERS"
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
        }
    }
    //#endregion

    //#region events
    $("#btn_apply").click(async () => {
        switch (slct_menubar.val()) {
            //#region delete selected values
            case "0":
                await deleteSelectedUsersAsync();
                break;
            //#endregion 
        }
    });
    $("tbody").click(async () => {
        //#region when update, save or delete button clicked
        let clickedElement = $(":focus");
        let row = clickedElement.closest("tr");
        //#endregion
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
    });
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
    //#endregion

    //#region functions
    async function populateHtmlAsync() {
        //#region panel title
        $(".panel-heading").append(
            langPack.panelTitle[language]);
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
        $("#btn_apply").append(
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
    async function addColumnNamesToTableAsync() {
        let columnNames = langPack.columnNames[language];

        for (let index in columnNames)
            table_head
                .children(`th:nth-child(${+index + 1})`)
                .append(columnNames[index]);    
    }
    async function addUsersToTableAsync(response) {
        for (let index in response) {
            let rowId = `tr_row${index}`;
            let userInfos = response[index];

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
    async function restrictEditorFeaturesAsync(feature, data) {
        //#region when user isn't editor
        // check whether user role is editor
        let isUserEditor = false;
        for (let role in editorRoleNamesByLanguages) {
            if (userRole == role) {
                isUserEditor = true;
                break;
            }
        }

        // when user isn't editor
        if (!isUserEditor)
            return;
        //#endregion

        //#region restrict editor features
        switch (feature) {
            case "roleNameSelect": // required data: row, roles
                //#region disable forbidden roles in select

                //#region get index in select of admin role
                // when page is "TR"
                let indexOfAdminRole = null;
                if (userRole == "Editör")
                    indexOfAdminRole = data.roles.indexOf("Yönetici");

                // when page is is "EN"
                else if (language == "EN" && userRole == "Editor")
                    indexOfAdminRole = data.roles.indexOf("Admin");
                //#endregion

                //#region disable the admin role if user role is editor
                if (indexOfAdminRole != null) {
                    let option_admin = data.row.find(`option:nth-child(${indexOfAdminRole + 1})`);

                    option_admin.attr("disabled", "");
                    option_admin.css(css_roleNamesSelect_disabled);
                }
                //#endregion

                //#endregion 

                break;
        }
        //#endregion
    }
    async function addEntityQuantityMessageAsync(entityCount) {
        updateResultLabel(
            "#" + entityQuantity.id,
            `<b>${entityCount}/${pageSize}</b> ${langPack.entityQuantity[language]}`,
            entityQuantity.color);
    }

    //async function clicked_saveButtonAsync(row) {
    //    //#region set variables
    //    let rowId = row.attr("id");
    //    let columnNamesByElementTypes = {
    //        "input": [
    //            "firstName",
    //            "lastName",
    //            "companyName",
    //            "telNo",
    //            "email",
    //        ],
    //        "select": [
    //            "roleNames"
    //        ]
    //    }
    //    let oldColumnValues = JSON.parse(
    //        sessionStorage.getItem(rowId));
    //    let newColumnValues = {};
    //    var data = {};
    //    let url;

    //    //#region populate newColumnValues
    //    for (let elementType in columnNamesByElementTypes)
    //        for (let index in columnNamesByElementTypes[elementType]) {
    //            let columnName = columnNamesByElementTypes[elementType][index];
    //            let inputOrSelect = row
    //                .children(`#td_${columnName}`)
    //                .children(elementType);

    //            newColumnValues[columnName] = inputOrSelect.val();
    //        }
    //    //#endregion

    //    //#region populate data
    //    for (let columnName in newColumnValues) {
    //        data[columnName] =
    //            oldColumnValues[columnName] == newColumnValues[columnName] ? // is same old value with new value?
    //                null  // if not changed
    //                : newColumnValues[columnName]  // if changed
    //    }
    //    //#endregion

    //    //#region set url
    //    url = `${baseApiUrl}/${routeForUpdate}` +
    //        `?language=${language}` +
    //        `&telNo=${oldColumnValues.telNo}`
    //    //#endregion

    //    //#endregion

    //    $.ajax({
    //        method: "POST",
    //        url: url,
    //        headers: { "Authorization": jwtToken },
    //        data: JSON.stringify(data),
    //        contentType: "application/json",
    //        dataType: "json",
    //        success: () => {
    //            //#region update row infos in session 
    //            sessionStorage.setItem(
    //                rowId,
    //                JSON.stringify(newColumnValues));
    //            //#endregion

    //            resetErrorRowAsync(rowId);
    //            setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, false);
    //        },
    //        error: (response) => {
    //            //#region write error to error row
    //            updateErrorRow(
    //                `#${rowId}_error`,
    //                JSON.parse(response.responseText).errorMessage,
    //                errorMessageColor);
    //            //#endregion
    //        }
    //    })
    //}
    //#endregion

    populateHtmlAsync();
    populateTableAsync();
});