import { getDateTimeInString, updateResultLabel } from "./miarTools.js";


$(function () {
    //#region variables
    const language = window.language;
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_machine tbody");
    const nameOfPaginationHeader = "Machine-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    const apiUrl = "https://localhost:7091/api/services/machine";
    let machineCountOnTable;
    let paginationInfosInJson;
    //#endregion

    //#region event
    $("#ul_pagination").click(() => {
        //#region do unchecked "box_all"
        if ($("#box_all").is(":checked"))
            $("#box_all").prop("checked", false);
        //#endregion

        //#region click control of pagination buttons
        var clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            case "a_paginationBack":
                //#region open previous page if previous page exists
                if (paginationInfosInJson.HasPrevious)
                    populateTable(paginationInfosInJson.CurrentPageNo - 1);

                break;
            //#endregion

            case "a_paginationNext":
                //#region open next page if next page exists
                if (paginationInfosInJson.HasNext)
                    populateTable(paginationInfosInJson.CurrentPageNo + 1);

                break;
            //#endregion

            default:
                //#region open page that matched with clicked button number
                let pageNo = clickedButton.prop("innerText");
                populateTable(pageNo);
                break;
            //#endregion
        }
        //#endregion 
    });
    $("#box_all").click(() => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        for (let rowNo = 1; rowNo <= machineCountOnTable; rowNo += 1) {
            //var checkBoxInRow = $(`#tr_row${rowNo} #td_checkBox input`);
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
    $("#btn_apply").click(async () => {
        let opt_selected = $("#slct_menubar option:selected");

        switch (opt_selected.val()) {
            //#region delete selected values
            case "1":
                await deleteSelectedMachinesAsync();
                break;
            //#endregion 
        }
    });
    $("#tbl_machine tbody").click(() => {
        //#region when update,save or delete button clicked
        let clickedElement = $(":focus");
        let row = clickedElement.closest("tr");

        switch (clickedElement.attr("id")) {
            case "btn_update":
                click_updateButton(row);
                break;

            case "btn_save":
                click_saveButton(row);
                break;

            case "btn_delete":
                break;
        }
        //#endregion
    })
    //#endregion events

    //#region functions
    function addPaginationButtons() {
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
				<a id="a_paginationNext" href="#">
					<i class="fa fa-chevron-right"></i>
				</a>
			</li>`);
        //#endregion
    }

    function hideOrShowPaginationBackAndNextButtons() {
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
    }

    function addMachinesToTable(response) {
        let rowNo = 1;

        response.forEach(machineView => {
            tableBody.append(
                `<tr id= tr_row${rowNo} class= ${machineView.id}>
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
					<td id="td_description">${machineView.description}</td>
					<td id="td_createdAt">${getDateTimeInString(machineView.createdAt)}</td>
					<td id="td_processes">
						<button id="btn_update" class="active" ui-toggle-class="">
							<i class="fa fa-pencil text-info"> 
								Güncelle
							</i>
						</button>
					</td>
					<td style="width:30px;"></td>
				</tr>
				<tr> 
					<td hidden></td>
				</tr>
				<tr id="tr_error${rowNo}">
					<td colspan="13" hidden></td>
				</tr>`
            );

            rowNo += 1;
        });
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

                    //#region when any machines not exists
                    else {
                        tableBody.empty();

                        // update entity quantity label
                        updateResultLabel(
                            lbl_entityQuantity,
                            `<b>0</b>/<b>${pageSize}</b> makine görüntüleniyor`);
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
                //#region write error to resultLabel
                updateResultLabel(
                    lbl_entityQuantity,
                    JSON.parse(response.ResponseText),
                    "rgb(255, 75, 75)"
                );
                //#endregion
            }
        });
    }

    function populateTable(pageNumber, refreshPaginationButtons) {
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

                //#region update "lbl_entityQuantity"
                if (response.length != 0) {  // if any machine exists
                    machineCountOnTable = paginationInfosInJson.CurrentPageCount;

                    lbl_entityQuantity.empty();
                    lbl_entityQuantity.append(
                        `<b>${machineCountOnTable}/${pageSize}</b> makine görüntüleniyor`);
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
                    convertErrorCodeToErrorMessage(response.responseText),
                    "rgb(255, 75, 75)"
                );
                //#endregion
            },
        });
    }

    function populateMainCategoryNameSelect(columnsForAddSelect, columnValues) {
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

    function populateSubCategoryNameSelect(columnsForAddSelect, columnValues) {
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
            $.ajax({
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

    function populateHandStatusSelect(columnsForAddSelect, columnValues) {
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

    function click_updateButton(row) {
        //#region set variables

        //#region set "columnsForAddInput"
        let columnsForAddInput = {}
        let columnsForAddInputGuide = {
            "brandName": "text",
            "model": "text",
            "stock": "number",
            "rented": "number",
            "sold": "number",
            "description": "text",
            "year": "number",
        }

        // populate "columnsForAddInput"
        for (let columnName in columnsForAddInputGuide) {
            columnsForAddInput[columnName] = row
                .children(`#td_${columnName}`);
        }
        //#endregion

        let columnsForAddSelect = {
            "mainCategoryName": row.children("#td_mainCategoryName"),
            "subCategoryName": row.children("#td_subCategoryName"),
            "handStatus": row.children("#td_handStatus"),
        };
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
            "description": columnsForAddInput.description.text()
        };
        //#endregion

        //#region add <input> to columns
        for (let columnName in columnsForAddInput) {
            // reset column
            let column = columnsForAddInput[columnName];
            column.empty()

            // add <input>
            let inputType = columnsForAddInputGuide[columnName];
            column.append(`<input type="${inputType}" id="inpt_${columnName}">`);

            // add default value to <inpt>
            column
                .children(`#inpt_${columnName}`)
                .val(columnValues[columnName]);
        }
        //#endregion

        //#region add <select> to columns
        // add <select> all columns
        for (let columnName in columnsForAddSelect) {
            let column = columnsForAddSelect[columnName];
            column.empty();
            column.append("<select> </select>")
        }

        // populate <select>'s
        populateMainCategoryNameSelect(columnsForAddSelect, columnValues);
        populateSubCategoryNameSelect(columnsForAddSelect, columnValues);
        populateHandStatusSelect(columnsForAddSelect, columnValues);
        //#endregion

        //#region add "save" and "cancel" buttons

        //#region remove 'update' button
        let td_processes = row.children("#td_processes");
        td_processes.empty();
        //#endregion

        //#region add buttons
        td_processes.append(
            `<button id="btn_save" class="active" ui-toggle-class="">
                <i class="fa fa-check text-success"> 
                    Kaydet
                </i>
            <button id="btn_cancel" class="active" ui-toggle-class="">
                <i class="fa fa-times text-danger"> 
                    Vazgeç
                </i>`
        );
        //#endregion

        //#endregion

        //#region save column values to session
        sessionStorage.setItem(
            row.attr("id"),
            JSON.stringify(columnValues)
        );
        //#endregion
    }

    function click_saveButton(row) {
        //#region set parameters
        var machineId = row.attr("class");
        var machineInfosInSession = JSON.parse(
            sessionStorage.getItem(row.attr("id")));
        var data = {
            "mainCategoryName": machineInfosInSession.mainCategoryName
                == $("#td_mainCategoryName option:selected").val() ?
                    null
                    : $("#td_mainCategoryName option:selected").val()
        }
        //#endregion

        
        $.ajax({
            method: "PUT",
            url: apiUrl + `/update?language=${language}&id=${machineId}`,
            data: sessionStorage.getItem(row.attr("id")),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                alert("successfull");
            },
            error: (response) => {
                alert(response.responseText);
            }
        })

    }
    //#endregion

    populateTable(pageNumber, true);
});
