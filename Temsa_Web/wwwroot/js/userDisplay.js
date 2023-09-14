$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_user tbody");
    const nameOfPaginationHeader = "User-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    let entityCountOfPage;
    let userPaginationInJson;
    //#endregion

    //#region initializer
    fillTable(pageNumber);
    addPaginationButtons();
    //#endregion

    //#region events
    //$("#a_pagination1").click(() => fillTable(1));
    //$("#a_pagination2").click(() => fillTable(2));
    //$("#a_pagination3").click(() => fillTable(3));
    //$("#a_pagination4").click(() => fillTable(4));
    $("#a_paginationBack").click(() => {
        //#region open previous page if previous page exists
        if (userPaginationInJson.HasPrevious)
            fillTable(userPaginationInJson.CurrentPageNo - 1);
        //#endregion
    });
    $("#a_paginationNext").click(() => {
        //#region open next page if next page exists
        if (userPaginationInJson.HasNext)
            fillTable(userPaginationInJson.CurrentPageNo + 1);
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
    $("#btn_apply").click(() => {
        let selectedOption = $("#slct_menubar option:selected");

        switch (selectedOption.val()) {
            case "1":  // delete selected values
                deleteSelectedEntities();
                break;
        }
    });

    $(".paginationButtons").click(() => {
        var clickedPaginationButton = $(":focus");
        alert(clickedPaginationButton.id)

    });
    //#endregion events

    //#region functions
    function fillTable(pageNumber) {
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
                //#region save userPagination to sessionStorage
                let userPaginationHeader = xhr.getResponseHeader(nameOfPaginationHeader);

                sessionStorage.setItem(nameOfPaginationHeader, userPaginationHeader);
                //#endregion

                //#region set "entityCountOfPage"
                userPaginationInJson = JSON.parse(userPaginationHeader);

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

                addEntitiesToTable(response);
                hideOrShowPaginationBackAndNextButtons();
            },
            error: (response) => {
                //#region write error
                var errorMessage = window.getErrorMessage(response.responseText);

                lbl_entityQuantity.text(errorMessage);
                lbl_entityQuantity.attr("style", "color:red");
                //#endregion
            }
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
                    <a id="a_pagination${pageNo}" class="paginationButtons"  href="#"> 
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

    function addEntitiesToTable(response) {
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

    function deleteSelectedEntities() {
        //#region set telNoList and rowNoList
        let telNoList = [];
        let rowNoList = [];

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
        //#endregion

        $.ajax({
            method: "DELETE",
            url: "https://localhost:7091/api/services/user/delete",
            data: JSON.stringify({ "TelNos": telNoList }),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                alert("success");

                //#region when all users on page deleted
                if (telNoList.length == pageSize) {
                    let previousPageNo = userPaginationInJson.CurrentPageNo - 1;

                    // when previous page not exists
                    if (previousPageNo == 0)
                        tableBody.empty();
                        
                    // fill table with previous page
                    else
                        fillTable(previousPageNo);
                }
                //#endregion

                //#region when some users on page deleted
                else
                    fillTable(userPaginationInJson.CurrentPageNo);  // refresh current page
                //#endregion
            },
            error: (response) => {
                alert("error");
                window.writeErrorMessage(responseText, lbl_entityQuantity);
            }
        })
    }
    //#endregion
});
