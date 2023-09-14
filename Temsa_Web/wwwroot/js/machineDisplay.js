$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 5;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_user tbody");
    const nameOfPaginationHeader = "User-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    let entityCountOfPage;
    let userPaginationInJson;
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
    function fillTable(pageNumber, refreshPaginationButtons = false) {
        $.ajax({
            method: "GET",
            url: "https://localhost:7091/api/services/user/display",
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
                //#region get userPaginationInJson
                userPaginationInJson = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));
                //#endregion

                //#region set "entityCountOfPage"
                entityCountOfPage =
                    userPaginationInJson.CurrentPageNo == userPaginationInJson.TotalPage ?
                        userPaginationInJson.LastPageCount  // when current page is last page
                        : userPaginationInJson.PageSize  // when not last page
                //#endregion

                //#region add entity quantity to lbl_entityQuantity
                lbl_entityQuantity.empty();
                lbl_entityQuantity.append(
                    `<b>${entityCountOfPage}/${pageSize}</b> görüntüleniyor`);
                //#endregion

                addUsersToTable(response);
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

    function addPaginationButtons() {
        //#region set buttonQauntity for pagination
        let buttonQuantity =
            userPaginationInJson.TotalPage < paginationButtonQuantity ?
                userPaginationInJson.TotalPage
                : paginationButtonQuantity
        //#endregion

        //#region reset paginationButtons if exists
        if (ul_pagination.children("li").length != 0)
            ul_pagination.empty()
        //#endregion

        //#region add paginationBack button
        if (userPaginationInJson.CurrentPageNo != 1)
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
                    <a id="a_pagination${pageNo}" href="#"> 
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
        if (userPaginationInJson.TotalPage > 1) {
            //#region for paginationBack button
            // hide
            if (userPaginationInJson.CurrentPageNo == 1)
                $("#a_paginationBack").attr("hidden", "");

            // show
            else
                $("#a_paginationBack").removeAttr("hidden");
            //#endregion

            //#region for paginationNext button
            // hide
            if (userPaginationInJson.CurrentPageNo == userPaginationInJson.TotalPage)
                $("#a_paginationNext").attr("hidden", "");

            // show
            else
                $("#a_paginationNext").removeAttr("hidden");
            //#endregion
        }
    }

    function addUsersToTable(response) {
        let no = 1;

        response.forEach(user => {
            tableBody.append(
                `<tr id="tr_row${no}">
                    <td id="td_checkBox">
                        <label class="i-checks m-b-none">
                            <input type="checkbox"><i></i>
                        </label>
                    </td>
					<td id="td_firstName">${user.firstName}</td>
					<td id="td_lastName">${user.lastName}</td>
					<td id="td_companyName">${user.companyName}</td>
					<td id="td_telNo">${user.telNo}</td>
					<td id="td_email">${user.email}</td>
					<td id="td_roleNames">${user.roleNames.toString()}</td>
					<td id="td_createdAt">${getDateTimeAsModified(user.createdAt)}</td>
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
                    <td colspan="10" hidden>
                    </td>
                </tr>`
            );
            no += 1;
        });
    }

    async function deleteSelectedEntitiesAsync() {
        //#region set telNoList and rowNoList
        let telNoList = [];
        let rowNoList = [];

        await new Promise(resolve => {
            for (let rowNo = 1; rowNo <= entityCountOfPage; rowNo += 1) {
                let checkBox = $(`#tr_row${rowNo} #td_checkBox input`);

                //#region add telNo to telNoList if user checked
                if (checkBox.is(":checked")) {
                    let telNo = $(`#tr_row${rowNo} #td_telNo`).text();

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
            url: "https://localhost:7091/api/services/user/delete",
            data: JSON.stringify({ "TelNos": telNoList }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region when all users on page deleted
                if (telNoList.length == pageSize) {
                    let previousPageNo = userPaginationInJson.CurrentPageNo - 1;

                    // when previous page not exists
                    if (previousPageNo == 0)
                        tableBody.empty();

                    // fill table with previous page
                    else {
                        fillTable(previousPageNo, true);
                    }
                }
                //#endregion

                //#region when some users on page deleted
                else
                    fillTable(userPaginationInJson.CurrentPageNo);  // refresh current page
                //#endregion

                //#region do unchecked 'box_all'
                $("#box_all").prop("checked", false);
                //#endregion

                //#region reset "lbl_entityQuantity"
                lbl_entityQuantity.empty()
                lbl_entityQuantity.append(`0/${pageSize} Kullanıcı Görüntüleniyor`);
                //#endregion
            },
            error: (response) => {
                window.writeErrorMessage(responseText, lbl_entityQuantity);
            }
        });
    }

    function click_paginationBack() {
        //#region open previous page if previous page exists
        if (userPaginationInJson.HasPrevious)
            fillTable(userPaginationInJson.CurrentPageNo - 1);
        //#endregion
    }

    function click_paginationNext() {
        //#region open next page if next page exists
        if (userPaginationInJson.HasNext)
            fillTable(userPaginationInJson.CurrentPageNo + 1);
        //#endregion
    }
    //#endregion

    fillTable(pageNumber, true);
});
