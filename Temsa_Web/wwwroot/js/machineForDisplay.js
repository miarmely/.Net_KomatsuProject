$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_user tbody");
    const nameOfPaginationHeader = "Machine-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    let entityCountOfPage;
    let machinePaginationInJson;
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
            //#region click paginationBack
            case "a_paginationBack":
                click_paginationBack();
                break;
            //#endregion

            //#region click paginationBack
            case "a_paginationNext":
                click_paginationNext();
                break;
            //#endregion

            //#region click pagination button with number
            default:
                let pageNo = clickedButton.prop("innerText");
                fillTable(pageNo);
                break;
            //#endregion
        }
        //#endregion 
    });
    $("#box_all").click(() => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        for (let rowNo = 1; rowNo <= entityCountOfPage; rowNo++) {
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
                await deleteSelectedEntitiesAsync();
                break;
            //#endregion 
        }
    });
    //#endregion events

    //#region functions
    function addPaginationButtons() {
        //#region set buttonQauntity for pagination
        let buttonQuantity =
            machinePaginationInJson.TotalPage < paginationButtonQuantity ?
                machinePaginationInJson.TotalPage
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
        if (buttonQuantity > 1)
            ul_pagination.append(
                `<li>
                <a id="a_paginationNext" href="#">
                    <i class="fa fa-chevron-right"></i>
                </a>
            </li>`);
        //#endregion
    }

    function hideOrShowPaginationBackAndNextButtons() {
        if (machinePaginationInJson.TotalPage > 1) {
            //#region for paginationBack button
            // hide
            if (machinePaginationInJson.CurrentPageNo == 1)
                $("#a_paginationBack").attr("hidden", "");

            // show
            else
                $("#a_paginationBack").removeAttr("hidden");
            //#endregion

            //#region for paginationNext button
            // hide
            if (machinePaginationInJson.CurrentPageNo == machinePaginationInJson.TotalPage)
                $("#a_paginationNext").attr("hidden", "");

            // show
            else
                $("#a_paginationNext").removeAttr("hidden");
            //#endregion
        }
    }

    function addMachinesToTable(response) {
        let no = 1;

        response.forEach(machine => {
            //#region set usageStatus
            var usageStatus = machine.zerothHandOrSecondHand == 0 ?
                "Sıfır"
                : "İkinci El";
            //#endregion

            tableBody.append(
                `<tr id="tr_row${no}">
                    <td id="td_checkBox">
                        <label class="i-checks m-b-none">
                            <input type="checkbox"><i></i>
                        </label>
                    </td>
					<td id="td_brandName">${machine.brandName}</td>
					<td id="td_mainCategoryName">${machine.mainCategoryName}</td>
					<td id="td_subCategoryName">${machine.subCategoryName}</td>
					<td id="td_model">${machine.model}</td>
					<td id="td_usageStatus">${usageStatus}</td>
					<td id="td_stock">${machine.stock}</td>
					<td id="td_rented">${machine.rented}</td>
					<td id="td_sold">${machine.sold}</td>
					<td id="td_year">${machine.year}</td>
					<td id="td_createdAt">${getDateTimeAsModified(machine.createdAt)}</td>
					<td id="td_processes">
						<button onclick="window.click_updateButton(${no})" class="active" ui-toggle-class="">
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
                <tr id="tr_error${no}">
                    <td colspan="13" hidden>
                    </td>
                </tr>`
            );
            no += 1;
        });
    }

    async function deleteSelectedEntitiesAsync() {
        //#region set "subCategoryNameAndModelList" and "rowNoList"
        let subCategoryNameAndModelList = [];
        let rowNoList = [];

        await new Promise(resolve => {
            for (let rowNo = 1; rowNo <= entityCountOfPage; rowNo += 1) {
                //#region set variables
                let checkBox = $(`#tr_row${rowNo} #td_checkBox input`);
                let row = $(`#tr_row${rowNo}`);
                //#endregion 

                //#region add subCategoryName and model if checked
                if (checkBox.is(":checked")) {
                    //#region when update process continuing
                    if (row.children("td").children("input").length != 0)
                        click_cancelButton(rowNo);  // cancel update process
                    //#endregion

                    //#region get subCategoryName and model
                    let subCategoryName = row.children("#td_subCategoryName").text();
                    let model = row.children("#td_model").text();
                    //#endregion

                    //#region fill "rowNoList" and "subCategoryNameAndModelList"
                    rowNoList.push(rowNo);
                    subCategoryNameAndModelList.push({
                        "SubCategoryName": subCategoryName,
                        "Model": model
                    });
                    //#endregion
                }
                //#endregion
            }

            resolve();
        })
        //#endregion

        //#region when any user not select
        if (subCategoryNameAndModelList.length == 0)
            return;
        //#endregion

        $.ajax({
            method: "DELETE",
            url: "https://localhost:7091/api/services/machine/delete",
            data: JSON.stringify({
                "MachineInfos": subCategoryNameAndModelList
            }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region when all machines on page deleted
                if (subCategoryNameAndModelList.length == pageSize) {
                    let currentPageNo = machinePaginationInJson.CurrentPageNo;

                    //#region when next page exists
                    if (machinePaginationInJson.HasNext)
                        fillTable(currentPageNo, true);
                     //#endregion

                    //#region when previous page exists
                    else if (machinePaginationInJson.HasPrevious)
                        fillTable(currentPageNo - 1, true);
                    //#endregion

                    //#region when any machines not exists
                    else
                        tableBody.empty();
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    fillTable(machinePaginationInJson.CurrentPageNo);  // refresh current page
                //#endregion

                //#region do unchecked 'box_all'
                $("#box_all").prop("checked", false);
                //#endregion

                //#region reset "lbl_entityQuantity"
                lbl_entityQuantity.empty()
                lbl_entityQuantity.append(`0/${pageSize} Görüntüleniyor`);
                //#endregion
            },
            error: (response) => {
                window.writeErrorMessage(response.ResponseText, lbl_entityQuantity);
            }
        });
    }

    function click_paginationBack() {
        //#region open previous page if previous page exists
        if (machinePaginationInJson.HasPrevious)
            fillTable(machinePaginationInJson.CurrentPageNo - 1);
        //#endregion
    }

    function click_paginationNext() {
        //#region open next page if next page exists
        if (machinePaginationInJson.HasNext)
            fillTable(machinePaginationInJson.CurrentPageNo + 1);
        //#endregion
    }

    function fillTable(pageNumber, refreshPaginationButtons = false) {
        $.ajax({
            method: "GET",
            url: "https://localhost:7091/api/services/machine/display/all",
            contentType: "application/json",
            data: {  // for [FromQuery]
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
                //#region get machinePaginationInJson
                machinePaginationInJson = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));
                //#endregion

                //#region set "entityCountOfPage"
                entityCountOfPage =
                    machinePaginationInJson.CurrentPageNo == machinePaginationInJson.TotalPage ?
                        machinePaginationInJson.LastPageCount  // when current page is last page
                        : machinePaginationInJson.PageSize  // when not last page
                //#endregion

                //#region add entity quantity to lbl_entityQuantity
                lbl_entityQuantity.empty();
                lbl_entityQuantity.append(
                    `<b>${entityCountOfPage}/${pageSize}</b> görüntüleniyor`);
                //#endregion

                addMachinesToTable(response);
                hideOrShowPaginationBackAndNextButtons();

                //#region add pagination buttons
                if (refreshPaginationButtons)
                    addPaginationButtons();
                //#endregion
            },
            error: (response) => {
                //#region write error
                window.writeErrorMessage(response.responseText, lbl_entityQuantity);
                //#endregion
            },
        });
    }
    //#endregion

    fillTable(pageNumber, true);
});
