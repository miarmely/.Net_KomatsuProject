import { changeDescriptionButtonColor, clicked_descriptionDropdownButton, clicked_descriptionDropdownItem, description_currentColor, getDateTimeInString, getDescriptionKeyForSession, setDescriptionLanguage, updateResultLabel } from "./miarTools.js";


$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 7;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_machine tbody");
    const nameOfPaginationHeader = "Machine-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    const apiUrl = "https://localhost:7091/api/services/machine";
    const errorMessageColor = "rgb(255, 75, 75)";
    const description_inputId = "#inpt_descriptions";
    const description_buttonId = "#btn_description";
    const description_baseKeyForSession = "Machine-Display-Description";
    const description_unsavedColor = "red";
    const description_savedColor = "lightgreen";
    let machineCountOnTable;
    let paginationInfosInJson;
    //#endregion

    //#region events
    $("#ul_pagination").click(() => {
        //#region do unchecked "box_all"
        if ($("#box_all").is(":checked"))
            $("#box_all").prop("checked", false);
        //#endregion

        //#region click control of pagination buttons
        var clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (paginationInfosInJson.HasPrevious)
                    populateTable(paginationInfosInJson.CurrentPageNo - 1);

                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfosInJson.HasNext)
                    populateTable(paginationInfosInJson.CurrentPageNo + 1);

                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                let pageNo = clickedButton.prop("innerText");
                populateTable(pageNo);
                break;
            //#endregion
        }
        //#endregion 
    });
    $("#box_all").click(async () => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        await new Promise(resolve => {
            for (let rowNo = 1; rowNo <= machineCountOnTable; rowNo += 1) {
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

            resolve();
        })
        //#endregion
    })
    $("#btn_apply").click(async () => {
        let opt_selected = $("#slct_menubar option:selected");

        switch (opt_selected.val()) {
            //#region delete selected values
            case "0":
                await deleteSelectedMachinesAsync();
                break;
            //#endregion 
        }
    });
    $("#tbl_machine tbody").click(async () => {
        //#region when update,save or delete button clicked
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
    $("th").click(() => {  // control description column
        let selectedElement = $(":focus");

        switch (selectedElement.attr("id")) {
            //#region when click to description dropdown items
            case "a_descriptionDropdownItem":
                clicked_descriptionDropdownItem(
                    selectedElement,
                    description_inputId,
                    description_buttonId,
                    description_baseButtonName,
                    description_unsavedColor,
                    description_baseKeyForSession);

                break;
            //#endregion

            //#region when click to description button on <th>
            case "btn_description":
                clicked_descriptionDropdownButton(
                    language,
                    description_inputId,
                    description_buttonId,
                    description_baseKeyForSession,
                    description_savedColor);

                break;
            //#endregion
        }
    });
    $("tbody").on("input", () => {  // control input changing states
        let inputtedElement = $(":focus");
        let descriptionInputIdWithoutDash = description_inputId.substring(1);

        //#region when description input changed
        if (inputtedElement.attr("id") == descriptionInputIdWithoutDash
            && description_currentColor == description_savedColor)
            changeDescriptionButtonColor(description_buttonId, description_unsavedColor);
        //#endregion
    })
    //#endregion events

    //#region functions
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

    function removeDescriptionButtonOnColumn() {
        let th_description = $("#th_description");
        th_description.empty();
        th_description.text(description_baseButtonName);
    }

    function addMachinesToTable(response) {
        let rowNo = 1;

        response.forEach(machineView => {
            let rowId = `tr_row${rowNo}`;

            // add machines to table
            tableBody.append(
                `<tr id= "${rowId}" class= ${machineView.id}>
                    <td id="td_checkBox">
					    <label class="i-checks m-b-none">
						    <input type="checkbox"><i></i>
					    </label>
				    </td>
				    <td id="td_mainCategoryName">${machineView.mainCategoryName}</td>
				    <td id="td_subCategoryName">${machineView.subCategoryName}</td>
				    <td id="td_brandName">${machineView.brandName}</td>
				    <td id="td_model">${machineView.model}</td>
				    <td id="td_handStatus">${machineView.handStatus}</td>
				    <td id="td_stock">${machineView.stock}</td>
				    <td id="td_rented">${machineView.rented}</td>
				    <td id="td_sold">${machineView.sold}</td>
				    <td id="td_year">${machineView.year}</td>
				    <td id="td_descriptions">${machineView.descriptions[language]}</td>
				    <td id="td_createdAt">${getDateTimeInString(machineView.createdAt)}</td>
				    <td id="td_processes">
					    <button id="btn_update" ui-toggle-class="">
						    <i class="fa fa-pencil text-info">
							    ${updateButtonName}
						    </i>
					    </button>
				    </td>
				    <td style="width:30px;"></td>
			    </tr>
			    <tr hidden></tr>
			    <tr id="tr_row${rowNo}_error">
				    <td id="td_error" colspan="13" hidden></td>
			    </tr>`);

            // add descriptions of machine to session
            sessionStorage.setItem(
                rowId,
                JSON.stringify({
                    "descriptions": machineView.descriptions
                }));

            rowNo += 1;
        });
    }

    function getIdOfErrorRow(row) {
        let rowId = row.attr("id");

        return `#${rowId}_error #td_error`;
    }

    function resetErrorRow(row) {
        var tr_row_error = $(getIdOfErrorRow(row));

        tr_row_error.empty();  // reset
        tr_row_error.attr("hidden", "");  // hide
    }

    function getErrorMessageFromResponse(response) {
        return JSON.parse(response.responseText).errorMessage;
    }

    async function addPaginationButtons() {
        //#region set buttonQauntity for pagination
        let buttonQuantity =
            paginationInfosInJson.TotalPage < paginationButtonQuantity ?
                paginationInfosInJson.TotalPage
                : paginationButtonQuantity
        //#endregion

        //#region reset paginationButtons if exists
        if (ul_pagination.children("li").length != 0)
            ul_pagination.empty()
        //#endregion

        //#region add paginationBack button
        ul_pagination.append(
            `<li>
				<a id="a_paginationBack" href="#" hidden>
					<i class="fa fa-chevron-left"></i>
				</a>
			</li>`);
        //#endregion

        //#region add pagination buttons
        for (let pageNo = 1; pageNo <= buttonQuantity; pageNo += 1)
            ul_pagination.append(
                `<li>
					<a href="#"> 
						${pageNo}
					</a>
				</li> `);
        //#endregion

        //#region add paginationNext button
        ul_pagination.append(
            `<li>
				<a id="a_paginationNext" href="#" hidden>
					<i class="fa fa-chevron-right"></i>
				</a>
			</li>`);
        //#endregion
    }

    async function hideOrShowPaginationBackAndNextButtons() {
        new Promise(resolve => {
            if (paginationInfosInJson.TotalPage > 1) {
                //#region for paginationBack button
                // hide
                if (paginationInfosInJson.CurrentPageNo == 1)
                    $("#a_paginationBack").attr("hidden", "");

                // show
                else
                    $("#a_paginationBack").removeAttr("hidden");
                //#endregion

                //#region for paginationNext button
                // hide
                if (paginationInfosInJson.CurrentPageNo == paginationInfosInJson.TotalPage)
                    $("#a_paginationNext").attr("hidden", "");

                // show
                else
                    $("#a_paginationNext").removeAttr("hidden");
                //#endregion
            }

            resolve();
        })
    }

    async function populateMainCategoryNameSelectAsync(columnsForAddSelect, columnValues) {
        //#region get <select> of mainCategoryName
        var slct_mainCategoryName = columnsForAddSelect
            .mainCategoryName
            .children("select");
        //#endregion

        //#region add mainCategoryNames as <option>

        //#region set variables
        var mainCategoryNameKeyOnSession = `mainCategoryNamesIn${language}`
        var mainCategoryNamesInSession = sessionStorage
            .getItem(mainCategoryNameKeyOnSession);
        //#endregion

        //#region when mainCategoryNames not exists in sessionStorage
        if (mainCategoryNamesInSession == null)
            $.ajax({
                method: "GET",
                url: "https://localhost:7091/api/services/machine/display/mainCategory",
                data: {
                    language: language
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add mainCategories as <option>
                    for (let index in response) {
                        slct_mainCategoryName.append(
                            `<option> ${response[index]} </option>`);
                    };
                    //#endregion

                    //#region add mainCategoryNames to sessionStorage
                    sessionStorage.setItem(
                        mainCategoryNameKeyOnSession,
                        JSON.stringify(response));
                    //#endregion
                }
            });
        //#endregion

        //#region when mainCategoryNames exists in sessionStorage
        else {
            //#region add mainCategoryNames as <option>
            var mainCategoryNames = JSON.parse(mainCategoryNamesInSession);

            for (let index in mainCategoryNames) {
                slct_mainCategoryName.append(
                    `<option> ${mainCategoryNames[index]} </option>`);
            }
            //#endregion
        }
        //#endregion

        //#region set default value of <select>
        slct_mainCategoryName.val(
            columnValues["mainCategoryName"]);
        //#endregion

        //#endregion
    }

    async function populateSubCategoryNameSelectAsync(columnsForAddSelect, columnValues) {
        //#region get subCategoryName <select>
        let slct_subCategoryName = columnsForAddSelect
            .subCategoryName
            .children("select");
        //#endregion

        //#region add subCategoryNames as <option>

        //#region set variables
        let subCategoryNameSessionKey = `subCategoryNamesIn${language}`;
        let subCategoryNameSessionValue = {}
        let mainCategoryName = columnValues.mainCategoryName;
        let sessionValue = JSON.parse(sessionStorage
            .getItem(subCategoryNameSessionKey));
        //#endregion

        //#region when subCategoryNames not exists in session (get from server
        if (sessionValue == null)
            await $.ajax({
                method: "GET",
                url: apiUrl + "/display/subCategory",
                data: {
                    language: language,
                    mainCategoryName: columnValues["mainCategoryName"]
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add subCategoryName as <option>
                    //add subCategoryName to <select>
                    for (let index in response) {
                        slct_subCategoryName.append(
                            `<option>${response[index]}</option>`);
                    }

                    // add subCategoryNames to "subCategoryNameSessionValue"
                    subCategoryNameSessionValue[mainCategoryName] = response;
                    //#endregion

                    //#region add subcategoryNames to session
                    sessionStorage.setItem(
                        subCategoryNameSessionKey,
                        JSON.stringify(subCategoryNameSessionValue)
                    )
                    //#endregion
                }
            });
        //#endregion

        //#region when subCategoryNAmes exists in session (get from session)
        else {
            //#region add subCategoryName to <select>
            let subCategoryNames = sessionValue[mainCategoryName];

            for (let index in subCategoryNames) {
                let subCategoryName = subCategoryNames[index];

                slct_subCategoryName.append(
                    `<option>${subCategoryName}</option>`);
            }
            //#endregion
        }
        //#endregion

        //#region set default value of <select>
        slct_subCategoryName.val(columnValues.subCategoryName);
        //#endregion

        //#endregion
    }

    async function populateHandStatusSelectAsync(columnsForAddSelect, columnValues) {
        //#region get handStatus <select>
        let slct_handStatus = columnsForAddSelect
            .handStatus
            .children("select");
        //#endregion

        //#region populate handStatus <select>

        //#region set variables
        let handStatusSessionKey = `handStatusIn${language}`;
        let handStatusesOnSession = JSON.parse(sessionStorage
            .getItem(handStatusSessionKey));
        //#endregion

        //#region when handstatuses not exists in session (get from service)
        if (handStatusesOnSession == null)
            $.ajax({
                method: "GET",
                url: apiUrl + "/display/handstatus",
                data: {
                    language: language
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add handstatus as <option> to <select>
                    for (let index in response) {
                        slct_handStatus.append(
                            `<option>${response[index]}</option>`)
                    }
                    //#endregion

                    //#region add handStatuses to session
                    sessionStorage.setItem(
                        handStatusSessionKey,
                        JSON.stringify(response))
                    //#endregion
                }
            })
        //#endregion

        //#region when handstatuses exists in session (get from session)
        else {
            for (let index in handStatusesOnSession) {
                slct_handStatus.append(
                    `<option>${handStatusesOnSession[index]}</option>`)
            }
        }
        //#endregion

        //#region set default value of handStatus <select>
        slct_handStatus.val(columnValues.handStatus);
        //#endregion

        //#endregion
    }

    async function deleteSelectedMachinesAsync() {
        //#region set machineIdList
        let machineIdList = await new Promise(resolve => {
            let machineIdList = [];

            //#region set machineIdList
            for (let rowNo = 1; rowNo <= machineCountOnTable; rowNo += 1) {
                //#region set variables
                let checkBox = $(`#tr_row${rowNo} #td_checkBox input`);
                let row = $(`#tr_row${rowNo}`);
                //#endregion 

                //#region add machineId to machineIdList if checked
                if (checkBox.is(":checked")) {
                    //#region when update process continuing
                    if (row.children("td>input").length != 0)  // when any <input> exists
                        click_cancelButton(rowNo);  // cancel update process
                    //#endregion

                    //#region add machineId
                    let machineId = row.attr("class");
                    machineIdList.push(machineId);
                    //#endregion
                }
                //#endregion
            }
            //#endregion

            //#region when any machine not select
            if (machineIdList.length == 0)
                return;
            //#endregion

            //#region save machineIdList to session
            window.sessionStorage.setItem(
                "DeletedMachineIdList",
                JSON.stringify(machineIdList));
            //#endregion

            resolve(machineIdList);
        })
        //#endregion

        $.ajax({
            method: "DELETE",
            url: `https://localhost:7091/api/services/machine/delete?language=${language}`,
            data: JSON.stringify({
                "MachineIdList": machineIdList
            }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region when all machines on page deleted
                if (machineIdList.length == paginationInfosInJson.CurrentPageCount) {
                    let currentPageNo = paginationInfosInJson.CurrentPageNo;

                    //#region when next page exists
                    if (paginationInfosInJson.HasNext)
                        populateTable(currentPageNo, true);  // refresh current page
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfosInJson.HasPrevious)
                        populateTable(currentPageNo - 1, true);
                    //#endregion

                    //#region when any machines not found
                    else {
                        tableBody.empty();

                        updateResultLabel(
                            lbl_entityQuantity,
                            `<b>0</b>/<b>${pageSize}</b> ${entityCountMessage}`,
                            errorMessageColor);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    populateTable(paginationInfosInJson.CurrentPageNo, true);  // refresh current page
                //#endregion

                //#region do unchecked "box_all"
                $("#box_all").prop("checked", false);
                //#endregion
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    lbl_entityQuantity,
                    getErrorMessageFromResponse(response),
                    errorMessageColor
                );
                //#endregion
            }
        });
    }

    async function clicked_updateButtonAsync(row) {
        //#region set variables

        //#region set "columnsForAddInput"
        let columnsForAddInput = {}
        let columnsForAddInputGuide = {
            "brandName": "text",
            "model": "text",
            "stock": "number",
            "rented": "number",
            "sold": "number",
            "year": "number",
            "descriptions": "text"
        }

        // populate "columnsForAddInput"
        for (let columnName in columnsForAddInputGuide) {
            columnsForAddInput[columnName] = row
                .children(`#td_${columnName}`);
        }
        //#endregion

        let rowId = row.attr("id");
        let rowInfosInSession = JSON.parse(
            sessionStorage.getItem(rowId));
        let columnsForAddSelect = {
            "mainCategoryName": row.children("#td_mainCategoryName"),
            "subCategoryName": row.children("#td_subCategoryName"),
            "handStatus": row.children("#td_handStatus"),
        };

        //#region set "columnValues"
        let columnValues = {
            "mainCategoryName": columnsForAddSelect.mainCategoryName.text(),
            "subCategoryName": columnsForAddSelect.subCategoryName.text(),
            "brandName": columnsForAddInput.brandName.text(),
            "model": columnsForAddInput.model.text(),
            "handStatus": columnsForAddSelect.handStatus.text(),
            "stock": columnsForAddInput.stock.text(),
            "rented": columnsForAddInput.rented.text(),
            "sold": columnsForAddInput.sold.text(),
            "year": columnsForAddInput.year.text(),
        };

        // add descriptions in session
        columnValues["descriptions"] = rowInfosInSession["descriptions"];
        //#endregion

        //#endregion

        await setDisabledOfOtherUpdateButtonsAsync(rowId, true);

        //#region add <input> to columns
        for (let columnName in columnsForAddInput) {
            //#region reset column
            let column = columnsForAddInput[columnName];
            column.empty()
            //#endregion

            //#region add <input>
            let inputType = columnsForAddInputGuide[columnName];
            column.append(`<input type="${inputType}" id="inpt_${columnName}">`);
            //#endregion

            //#region add default value to <inpt>'s
            let inputOnColumn = column.children(`#inpt_${columnName}`)

            switch (columnName) {
                case "descriptions":
                    inputOnColumn.val(columnValues[columnName][language])
                    break;
                default:
                    inputOnColumn.val(columnValues[columnName]);
                    break;
            }
            //#endregion
        }
        //#endregion

        //#region add dropdown to description column

        //#region create dropdown
        let th_description = $("#th_description");
        let descriptionButtonIdWithoutDash = description_buttonId.substring(1); // #btn_description ~~> btn_description 

        th_description.empty();
        th_description.append(
            `<div class="btn-group">
                <button id="${descriptionButtonIdWithoutDash}"  type="button"  style="background-color: darkblue;  color: red" class="btn btn-danger">
                    <b>${description_baseButtonName} (${language})</b>
                </button>

                <button id="btn_descriptionDropdown"  type="button"  style="background-color: darkblue" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="caret"></span>
                </button>

                <div class="dropdown-menu">
                    <div class="col-xs-1" style="padding:0px">
                        <ul id="ul_dropdownMenu" style="list-style-type:none">
                        </ul>
                    </div>
                </div>
            </div>`);
        //#endregion

        //#region populate languages to "th_description" dropdown
        let ul_dropdownMenu = $("#ul_dropdownMenu");
        ul_dropdownMenu.empty();

        for (var index in allLanguagesInDb) {
            let languageInDb = allLanguagesInDb[index];

            //#region populate dropdown with languages
            ul_dropdownMenu.append(
                `<li class="dropdown-item">
                    <a  id="a_descriptionDropdownItem"
                        href="#"  
                        style="padding: 3px 75px;  color:black">
                        ${languageInDb}
                    </a>
                </li>`
            )
            //#endregion

            //#region update descriptions in session
            let descriptionByLanguage = columnValues["descriptions"][languageInDb];

            sessionStorage.setItem(
                getDescriptionKeyForSession(description_baseKeyForSession, languageInDb),
                descriptionByLanguage);
            //#endregion
        }
        //#endregion

        //#endregion

        //#region add <select> to columns
        // add <select> all columns
        for (let columnName in columnsForAddSelect) {
            let column = columnsForAddSelect[columnName];
            column.empty();
            column.append("<select> </select>")
        }

        // populate <select>'s
        await populateMainCategoryNameSelectAsync(columnsForAddSelect, columnValues);
        await populateSubCategoryNameSelectAsync(columnsForAddSelect, columnValues);
        await populateHandStatusSelectAsync(columnsForAddSelect, columnValues);
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
        let machineId = row.attr("class");
        let rowId = row.attr("id");
        let oldColumnValues = JSON.parse(
            sessionStorage.getItem(rowId));
        let newColumnValues = {
            "mainCategoryName": row
                .children("#td_mainCategoryName")
                .children("select")
                .val(),
            "subCategoryName": row
                .children("#td_subCategoryName")
                .children("select")
                .val(),
            "model": row
                .children("#td_model")
                .children("input")
                .val(),
            "brandName": row
                .children("#td_brandName")
                .children("input")
                .val(),
            "handStatus": row
                .children("#td_handStatus")
                .children("select")
                .val(),
            "stock": row
                .children("#td_stock")
                .children("input")
                .val(),
            "rented": row
                .children("#td_rented")
                .children("input")
                .val(),
            "sold": row
                .children("#td_sold")
                .children("input")
                .val(),
            "year": row
                .children("#td_year")
                .children("input")
                .val()
        }
        //#endregion

        //#region set data

        var data = {};

        //#region add columns value to data except description 
        for (let columnName in newColumnValues) {
            data[columnName] = oldColumnValues[columnName]
                == newColumnValues[columnName] ? // is same old value with new value?
                null  // that means not changed
                : newColumnValues[columnName]  // that means changed
        }
        //#endregion

        //#region add descriptions to data
        for (var descriptionLanguage in oldColumnValues["descriptions"]) {
            //#region set variables
            let oldDescriptionByLanguage = oldColumnValues["descriptions"][descriptionLanguage];
            let newDescriptionByLanguage = sessionStorage.getItem(
                getDescriptionKeyForSession(
                    description_baseKeyForSession,
                    descriptionLanguage));
            //#endregion

            //#region add description to data
            data[`DescriptionIn${descriptionLanguage}`] = oldDescriptionByLanguage
                == newDescriptionByLanguage ?  // is description changed ?
                null
                : newDescriptionByLanguage;
            //#endregion
        }
        //#endregion

        //#endregion

        //#region set url
        let url = apiUrl + "/update?" +
            `language=${language}` +
            `&id=${machineId}` +
            `&oldMainCategoryName=${oldColumnValues.mainCategoryName}` +
            `&oldSubCategoryName=${oldColumnValues.subCategoryName}`
        //#endregion

        $.ajax({
            method: "PUT",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region update row infos in session 

                //#region add descriptions to newColumnValues
                newColumnValues["descriptions"] = {};

                for (var index in allLanguagesInDb) {
                    let languageInDb = allLanguagesInDb[index];
                    let newDescriptionByLanguage = sessionStorage.getItem(
                        getDescriptionKeyForSession(
                            description_baseKeyForSession,
                            languageInDb));

                    newColumnValues["descriptions"][languageInDb] = newDescriptionByLanguage;
                }
                //#endregion

                //#region update session
                sessionStorage.setItem(
                    rowId,
                    JSON.stringify(newColumnValues));
                //#endregion

                //#endregion

                removeInputsAndSelects(row, newColumnValues);
                removeDescriptionButtonOnColumn();
                resetErrorRow(row);
            },
            error: (response) => {
                //#region write error to error row
                updateResultLabel(
                    getIdOfErrorRow(row),
                    getErrorMessageFromResponse(response),
                    errorMessageColor);
                //#endregion
            }
        })

        await setDisabledOfOtherUpdateButtonsAsync(rowId, false);
    }

    async function clicked_cancelButtonAsync(row) {
        //#region get machine infos in session
        let rowId = row.attr("id");

        let machineInfosInSession = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        removeInputsAndSelects(row, machineInfosInSession);
        removeDescriptionButtonOnColumn();
        resetErrorRow(row);
        await setDisabledOfOtherUpdateButtonsAsync(rowId, false);
    }

    async function setDisabledOfOtherUpdateButtonsAsync(rowId, doDisabled) {
        //#region disable/enable other update buttons
        for (var rowNo = 1; rowNo <= pageSize; rowNo += 1) {
            let rowIdInLoop = `#tr_row${rowNo}`;

            //#region disable/enable update button
            if (rowIdInLoop != rowId) {
                // get update button
                let btn_update = $(rowIdInLoop)
                    .children("#td_processes")
                    .children("button")  //#update button

                // when disabled wanted
                if (doDisabled)
                    btn_update.attr("disabled", "");

                // when enabled wanted
                else
                    btn_update.removeAttr("disabled");
            }
            //#endregion
        }
        //#endregion
    }

    async function populateTable(pageNumber, refreshPaginationButtons) {
        $.ajax({
            method: "GET",
            url: "https://localhost:7091/api/services/machine/display/all",
            contentType: "application/json",
            data: {
                language: language,
                pageNumber: pageNumber,
                pageSize: pageSize
            },
            dataType: "json",
            beforeSend: () => {
                //#region reset table if not empty
                if (tableBody.children("tr").length != 0)
                    tableBody.empty();
                //#endregion
            },
            success: (response, status, xhr) => {
                addMachinesToTable(response);

                //#region get pagination infos from headers
                paginationInfosInJson = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));
                //#endregion

                //#region update entity count label
                if (response.length != 0) {  // if any machine exists
                    machineCountOnTable = paginationInfosInJson.CurrentPageCount;

                    lbl_entityQuantity.empty();
                    lbl_entityQuantity.append(
                        `<b>${machineCountOnTable}/${pageSize}</b> ${entityCountMessage}`);
                }
                //#endregion

                //#region add pagination buttons
                if (refreshPaginationButtons)
                    addPaginationButtons();
                //#endregion

                hideOrShowPaginationBackAndNextButtons();
            },
            error: (response) => {
                //#region write error to resultLabel
                updateResultLabel(
                    lbl_entityQuantity,
                    getErrorMessageFromResponse(response),
                    errorMessageColor);
                //#endregion
            },
        });
    }
    //#endregion

    populateTable(pageNumber, true);
    setDescriptionLanguage(language);
});
