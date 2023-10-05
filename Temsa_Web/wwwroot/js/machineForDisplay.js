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
					<td>${machineView.mainCategoryName}</td>
					<td>${machineView.subCategoryName}</td>
					<td>${machineView.brandName}</td>
					<td>${machineView.model}</td>
					<td>${machineView.handStatus}</td>
					<td>${machineView.stock}</td>
					<td>${machineView.rented}</td>
					<td>${machineView.sold}</td>
					<td>${machineView.year}</td>
					<td>${machineView.description}</td>
					<td>${getDateTimeInString(machineView.createdAt)}</td>
					<td id="td_processes">
						<button onclick="window.click_updateButton(${rowNo})" class="active" ui-toggle-class="">
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
                $("#box_all").prop("checked",false);
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
    //#endregion

    populateTable(pageNumber, true);
});
