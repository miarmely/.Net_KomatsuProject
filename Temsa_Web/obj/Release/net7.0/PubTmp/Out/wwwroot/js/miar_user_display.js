import {
    populateTable, paginationInfosInJson, setDisabledOfOtherUpdateButtonsAsync,
    resetErrorRowAsync, updateResultLabel, entityCountOnTable, updateErrorRow,
    populateElementByAjaxOrLocalAsync, populateSelectAsync
} from "./miar_tools.js"


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const routeForDisplay = "user/display/all";
    const routeForUpdate = "user/update";
    const routeForDelete = "user/delete";
    const entityType = "user"
    const nameOfPaginationHeader = "User-Pagination";
    const errorMessageColor = "red";
    const table_body = $("#tbl_user tbody");
    const table_head = $("#tbl_user thead tr");
    const entityQuantity_id = "#lbl_entityQuantity";
    const entityQuantity_message = entityQuantityMessageByLanguages[language];
    const lbl_entityQuantity = $(entityQuantity_id);
    const ul_pagination = $("#ul_pagination");
    const box_all = $("#box_all");
    const updateButtonName = updateButtonNameByLanguages[language];
    const slct_menubar = $("#slct_menubar");
    const css_roleNamesSelect_disabled = {
        "background-color": "darkGrey",
        "color": "white"
    };
    const css_updateButton_disabled = {
        "background-color": "darkGrey",
        "color": "white"
    };
    const editorRoleNamesByLanguages = ["editor", "editör"];
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

        switch (clickedElement.attr("id")) {
            case "btn_update":
                await clicked_updateButtonAsync(row);
                break;
            case "btn_save":
                await clicked_saveButtonAsync(row);
                break;
            case "btn_cancel":
                await clicked_cancelButtonAsync(row);
                break;
        }
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
                    populateTable(
                        entityType,
                        routeForDisplay,
                        language,
                        paginationInfosInJson.CurrentPageNo - 1,
                        pageSize,
                        table_body,
                        columnNamesToBeFill,
                        updateButtonName,
                        nameOfPaginationHeader,
                        lbl_entityQuantity,
                        ul_pagination,
                        errorMessageColor,
                        paginationButtonQuantity,
                        entityQuantity_message,
                        true)
                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfosInJson.HasNext)
                    populateTable(
                        entityType,
                        routeForDisplay,
                        language,
                        paginationInfosInJson.CurrentPageNo + 1,
                        pageSize,
                        table_body,
                        columnNamesToBeFill,
                        updateButtonName,
                        nameOfPaginationHeader,
                        lbl_entityQuantity,
                        ul_pagination,
                        errorMessageColor,
                        paginationButtonQuantity,
                        entityQuantity_message,
                        true)
                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                let pageNo = clickedButton.prop("innerText");

                populateTable(
                    entityType,
                    routeForDisplay,
                    language,
                    pageNo,
                    pageSize,
                    table_body,
                    columnNamesToBeFill,
                    updateButtonName,
                    nameOfPaginationHeader,
                    lbl_entityQuantity,
                    ul_pagination,
                    errorMessageColor,
                    paginationButtonQuantity,
                    entityQuantity_message,
                    true)
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
            method: "DELETE",
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
                        populateTable(
                            entityType,
                            routeForDisplay,
                            language,
                            currentPageNo,
                            pageSize,
                            table_body,
                            columnNamesToBeFill,
                            updateButtonName,
                            nameOfPaginationHeader,
                            lbl_entityQuantity,
                            ul_pagination,
                            errorMessageColor,
                            paginationButtonQuantity,
                            entityQuantity_message,
                            true);  // refresh current page
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfosInJson.HasPrevious)
                        populateTable(
                            entityType,
                            routeForDisplay,
                            language,
                            currentPageNo - 1,
                            pageSize,
                            table_body,
                            columnNamesToBeFill,
                            updateButtonName,
                            nameOfPaginationHeader,
                            lbl_entityQuantity,
                            ul_pagination,
                            errorMessageColor,
                            paginationButtonQuantity,
                            entityQuantity_message,
                            true);
                    //#endregion

                    //#region when any machines not found
                    else {
                        table_body.empty();

                        updateResultLabel(
                            entityQuantity_id,
                            `<b>0/${pageSize}<b> ${entityQuantity_message}`,
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
                        nameOfPaginationHeader,
                        lbl_entityQuantity,
                        ul_pagination,
                        errorMessageColor,
                        paginationButtonQuantity,
                        entityQuantity_message,
                        true);  // refresh current page
                //#endregion

                //#region do unchecked 'box_all'
                box_all.prop("checked", false);
                //#endregion
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    entityQuantity_id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor
                );
                //#endregion
            }
        });
    }
    async function clicked_updateButtonAsync(row) {
        //#region set variables

        //#region set "tableDatasForAddInput"
        let tableDatasForAddInput = {}
        let tableDatasForAddInputGuide = {
            "firstName": "text",
            "lastName": "text",
            "companyName": "text",
            "telNo": "number",
            "email": "email",
        }

        // populate "tableDatasForAddInput"
        for (let columnName in tableDatasForAddInputGuide) {
            tableDatasForAddInput[columnName] = row
                .children(`#td_${columnName}`);
        }
        //#endregion

        //#region set "rowId" and "tableDatasForAddSelect"
        let rowId = row.attr("id");
        let tableDatasForAddSelect = {
            "roleNames": row.children("#td_roleNames"),
        };
        //#endregion

        //#region set "columnValues"
        let columnValues = {}
        let tableDataTypes = [tableDatasForAddInput, tableDatasForAddSelect]

        //#region populate columnValues
        for (let index in tableDataTypes) {
            let tableDatas = tableDataTypes[index];

            // add column values to columnValues
            for (let columnName in tableDatas) {
                let columnValue = tableDatas[columnName].text();
                columnValues[columnName] = columnValue;
            }
        }
        //#endregion

        //#endregion

        //#endregion

        await setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, true);

        //#region add <input> to columns
        for (let columnName in tableDatasForAddInput) {
            //#region reset column
            let td = tableDatasForAddInput[columnName];
            td.empty()
            //#endregion

            //#region add <input>
            let inputType = tableDatasForAddInputGuide[columnName];
            td.append(`<input type="${inputType}" id="inpt_${columnName}">`);
            //#endregion

            //#region add default value to <inpt>'s
            let inputOnColumn = td.children(`#inpt_${columnName}`)
            inputOnColumn.val(columnValues[columnName]);
            //#endregion
        }
        //#endregion

        //#region add role <select> to column
        // add role <select>
        for (let columnName in tableDatasForAddSelect) {
            let td = tableDatasForAddSelect[columnName];
            td.empty();
            td.append(`<select class="slct_roleNames"> </select>`)
        }

        // populate role <select>
        await populateElementByAjaxOrLocalAsync(
            localKeys_allRoles,
            `/user/display/role?language=${language}`,
            async (roles) => {
                await populateSelectAsync(
                    tableDatasForAddSelect.roleNames.children("select"),
                    roles,
                    columnValues.roleNames);
                await restrictEditorFeaturesAsync("roleNameSelect", {
                    "row": row,
                    "roles": roles
                });
            }
        );
        //#endregion

        //#region add "save" and "cancel" buttons

        //#region remove 'update' button
        let td_processes = row.children("#td_processes");
        td_processes.empty();
        //#endregion

        //#region add buttons
        td_processes.append(
            `<button id="btn_save" class="active" ui-toggle-class="">
                <i class="fa fa-check text-success" style="width:15px">
                    
                </i>
            <button id="btn_cancel" class="active" ui-toggle-class="">
                <i class="fa fa-times text-danger" style="width:15px">
                </i>`
        );
        //#endregion

        //#endregion

        //#region add columnValues to session
        sessionStorage.setItem(
            rowId,
            JSON.stringify(columnValues)
        );
        //#endregion
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
        let url;

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

        //#region set url
        url = `${baseApiUrl}/${routeForUpdate}` +
            `?language=${language}` +
            `&telNo=${oldColumnValues.telNo}`
        //#endregion

        //#endregion

        $.ajax({
            method: "PUT",
            url: url,
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

                removeInputsAndSelects(row, newColumnValues);
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
    async function clicked_cancelButtonAsync(row) {
        //#region get machine infos in session
        let rowId = row.attr("id");

        let userInfosInSession = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        removeInputsAndSelects(row, userInfosInSession);
        await resetErrorRowAsync(rowId);
        await setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, false);
    }
    async function populateHtmlAsync() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add table menubars
        let tableMenubarOptions = tableMenubar_optionsByLanguages[language];

        for (let index = 0; index < tableMenubarOptions.length; index += 1) {
            let tableMenubarOption = tableMenubarOptions[index];

           slct_menubar.append(
                `<option value="${index}">
                ${tableMenubarOption}
                </option>`
            )
        }
        //#endregion

        //#region add apply button name
        $("#btn_apply").append(
            tableMenubar_applyButtonName[language])
        //#endregion

        //#region add column names
        // add column names
        for (let column in columnNamesByLanguages[language]) {
            let columnName = columnNamesByLanguages[language][column];

            table_head.append(
                `<th>${columnName}</th>`
            );
        }

        // add blank column to end
        table_head.append(
            `<th style="width:30px"></th>`
        );
        //#endregion

        //#region add entity quantity message
        $("#lbl_entityQuantity").append(
            `<b>0</b> ${entityQuantity_message}`
        );
    //#endregion
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
            case "updateButton": // required data: row
                //#region disable update button
                data.row
                    .children("#btn_update")
                    .css("disabled", "");
                //#endregion

                break;
        }
        //#endregion
    }
      async function populateTableAsy(nc
        entityType,
        specialUrl,
        language,
        pageNumber,
        pageSize,
        tableBody,
        columnNamesToBeFill,
        updateButtonName,
        nameOfPaginationHeader,
        lbl_entityQuantity,
        ul_pagination,
        errorMessageColor,
        paginationButtonQuantity,
        entityQuantity_message,
        refreshPaginationButtons
    )
        //#region set variables
        let url = 
        //#endregion
 {
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/user/display/all" +
                `?language=${language}` +
                `&pageNumber=${pageNumber}` +
                `&pageSize=${pageSize}`),
            headers: { "Authorization": jwtToken },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                //#region reset table if not empty
                if (table_body.children("tr").length != 0)
                    table_body.empty();
                //#endregion
            },
            success: (response, status, xhr) => {
                addEntitiesToTableAsync(response, language, table_body, entityType, columnNamesToBeFill, updateButtonName);

                //#region get pagination infos from headers
                paginationInfosInJson = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));
                //#endregion

                //#region update entity count label
                if (response.length != 0) {  // if any machine exists
                    entityCountOnTable = paginationInfosInJson.CurrentPageCount;

                    updateResultLabel(
                        "#" + lbl_entityQuantity.attr("id"),
                        `<b>${entityCountOnTable}/${pageSize}</b> ${entityQuantity_message}`,
                        "#7A7A7A"
                    )
                }
                //#endregion

                //#region add pagination buttons
                if (refreshPaginationButtons)
                    addPaginationButtonsAsync(
                        paginationInfosInJson,
                        paginationButtonQuantity,
                        ul_pagination);
                //#endregion

                controlPaginationBackAndNextButtonsAsync(paginationInfosInJson);
            },
            error: (response) => {
                //#region write error to resultLabel
                updateResultLabel(
                    lbl_entityQuantity,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            },
        });
    }
    async function addEntitiesToTableAsync(
        response,
        language,
        tableBody,
        entityType,
        columnNamesToBeFill,
        updateButtonName
    ) {
            //#region set variables
            let columnQuantityOnTable = columnNamesToBeFill.length + 3;  // 3: 1-> checkBox column, 2-> processes column, 3-> blank column
            let rowNo = 1;
            let rowId;
            let row;
            //#endregion

            //#region add entities to table
            response.forEach(entityView => {
                //#region add checkbox to row
                rowId = `tr_row${rowNo}`

                //#region when entity type is machine
                if (entityType == "machine")
                    tableBody.append(
                        `<tr id= "${rowId}" class= ${entityView.id}>
                        <td id="td_checkBox">
					        <label class="i-checks m-b-none">
						        <input type="checkbox"><i></i>
					        </label>
				        </td>
                    </tr>`);
                //#endregion

                //#region when entity type is user
                else
                    tableBody.append(
                        `<tr id= "${rowId}">
                        <td id="td_checkBox">
					        <label class="i-checks m-b-none">
						        <input type="checkbox"><i></i>
					        </label>
				        </td>
                    </tr>`);

                row = $("#" + rowId);
                //#endregion

                //#endregion

                //#region add column values of entity as dynamic
                for (let index in columnNamesToBeFill) {
                    let columnName = columnNamesToBeFill[index];

                    //#region set columnValue
                    let columnValue = columnName != "descriptions" ?
                        entityView[columnName]
                        : entityView[columnName][language]
                    //#endregion

                    //#region when column name is not "createdAt"
                    if (columnName != "createdAt")
                        row.append(
                            `<td id="td_${columnName}">${columnValue}</td>`
                        );
                    //#endregion

                    //#region when column name is "createdAt"
                    else
                        row.append(
                            `<td id="td_${columnName}">${getDateTimeInString(columnValue)}</td>`
                        );
                    //#endregion
                }
                //#endregion

                //#region add update button to row
                row.append(
                    `<td id="td_processes">
				    <button id="btn_update" ui-toggle-class="">
					    <i class="fa fa-pencil text-info">
						    ${updateButtonName}
					    </i>
				    </button>
			    </td>
                <td style="width:30px;"></td>`
                );
                //#endregion

                //#region add error row to row
                tableBody.append(
                    `<tr hidden></tr>
			    <tr id="tr_row${rowNo}_error">
		            <td id="td_error" colspan=${columnQuantityOnTable} hidden>
                    </td>
			    </tr>`
                );
                //#endregion

                //#region add descriptions of machines to session if entity is machine
                if (entityType == "machine")
                    sessionStorage.setItem(
                        rowId,
                        JSON.stringify({
                            "descriptions": entityView.descriptions
                        }));
                //#endregion

                rowNo += 1;
            });
            //#endregion
    }
    function removeInputsAndSelects(row, columnNamesAndValues) {
        //#region remove <input>'s and <select>'s
        for (let columnName in columnNamesAndValues) {
            var td = row.children(`#td_${columnName}`);
            td.empty();

            switch (columnName) {
                case "descriptions":
                    td.append(columnNamesAndValues[columnName][language]);
                    break;
                default:
                    td.append(columnNamesAndValues[columnName]);
                    break;
            }
        }
        //#endregion

        //#region add update button
        let td_processes = row.children("#td_processes")

        td_processes.empty()
        td_processes.append(
            `<button id="btn_update" class="active" ui-toggle-class="">
			    <i class="fa fa-pencil text-info">
                    ${updateButtonName}
			    </i>
		    </button>`);
        //#endregion
    }
    //#endregion

    populateHtmlAsync();
    populateTableAsync(
        entityType,
        routeForDisplay,
        language,
        pageNumber,
        pageSize,
        table_body,
        columnNamesToBeFill,
        updateButtonName,
        nameOfPaginationHeader,
        lbl_entityQuantity,
        ul_pagination,
        errorMessageColor,
        paginationButtonQuantity,
        entityQuantity_message,
        true);
});