$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;
    const tableBody = $("#tbl_user tbody");
    const nameOfPaginationHeader = "User-Pagination";
    const lbl_entityQuantity = $("#lbl_entityQuantity");
    const ul_pagination = $("#ul_pagination");
    //#endregion

    //#region initializer
    FillTable(pageNumber);
    let paginationData = localStorage.getItem(nameOfPaginationHeader);

    AddPaginationButtons();
    //#endregion

    //#region events
    $("#a_paginationBack").click(() => {
        //#region open previous page if previous page exists
        if (paginationData.HasPrevious)
            fillTable(paginationData.CurrentPageNo - 1);
        //#endregion
    });

    $("#a_pagination1").click(() => fillTable(1));
    $("#a_pagination2").click(() => fillTable(2));
    $("#a_pagination3").click(() => fillTable(3));
    $("#a_pagination4").click(() => fillTable(4));
    $("#a_pagination5").click(() => fillTable(5));

    $("#a_paginationNext").click(() => {
        //#region open next page if next page exists
        if (paginationData.HasNext)
            fillTable(paginationData.CurrentPageNo + 1);
        //#endregion
    });
    //#endregion events

    //#region functions
    function FillTable(pageNumber) {
        //#region reset table if not empty
        if (tableBody.children("tr").length != 0)
            tableBody.empty();
        //#endregion

        //#region set data
        let data = {
            pageNumber: pageNumber,
            pageSize: pageSize
        };
        //#endregion

        $.ajax({
            method: "GET",
            url: "https://localhost:7091/api/services/user/display",
            contentType: "application/json",
            data: data,  // for [FromQuery]
            dataType: "json",
            success: (response, status, xhr) => {
                //#region save paginationData to sessionStorage
                paginationData = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));

                sessionStorage.setItem(nameOfPaginationHeader, paginationData);
                //#endregion

                //#region set entityCountOfPage
                let entityCountOfPage =
                    paginationData.CurrentPageNo == paginationData.TotalPage ?
                        paginationData.LastPageCount  // when current page is last page
                        : paginationData.PageSize  // when not last page
                //#endregion

                //#region add entity quantity to lbl_entityQuantity
                lbl_entityQuantity.empty();
                lbl_entityQuantity.append(
                    `<b>${entityCountOfPage}/${pageSize}</b> görüntüleniyor`);
                //#endregion

                AddEntitiesToTable(response);
                HideOrShowPaginationBackAndNextButtons();
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

    function AddPaginationButtons() {
        //#region set buttonQauntity for pagination
        let buttonQuantity =
            paginationData.TotalPage < paginationButtonQuantity ?
                paginationData.TotalPage
                : paginationButtonQuantity
        //#endregion

        //#region add pagination buttons to table
        for (let no = 2; no <= buttonQuantity; no += 1)
            ul_pagination.append(
                `<li>
                    <a id="a_pagination${no}" onclick="fillTable(${no})" href="#"> 
                        ${no}
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

    function HideOrShowPaginationBackAndNextButtons() {
        if (paginationData.TotalPage > 1) {
            //#region for paginationBack button
            // hide
            if (paginationData.CurrentPageNo == 1)
                $("#a_paginationBack").attr("hidden", "");

            // show
            else
                $("#a_paginationBack").removeAttr("hidden");
            //#endregion

            //#region for paginationNext button
            // hide
            if (paginationData.CurrentPageNo == paginationData.TotalPage)
                $("#a_paginationNext").attr("hidden", "");

            // show
            else
                $("#a_paginationNext").removeAttr("hidden");
            //#endregion
        }
    }

    function AddEntitiesToTable(response) {
        let no = 1;

        response.forEach(user => {
            tableBody.append(
                `<tr id="tr_row${no}">
                    <td>
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
						<button onclick="window.Click_UpdateButton(${no})" class="active" ui-toggle-class="">
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
    //#endregion
});
