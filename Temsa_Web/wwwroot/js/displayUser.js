import { getDateTimeAsModified, getHeaderInJson } from "./tools.js";

$(function () {
    const pageNumber = 1;
    const pageSize = 10;
    const paginationButtonQuantity = 5;

    FillTable(pageNumber);
    AddPaginationButtons();

    //#region events
    $("#a_pagination1").click(() => FillTable(1));

    $("#a_pagination2").click(() => FillTable(2));

    $("#a_pagination3").click(() => FillTable(3));

    $("#a_pagination4").click(() => FillTable(4));

    $("#a_pagination5").click(() => FillTable(5));

    $("#a_paginationBack").click(() => {
        //#region open previous page if previous page exists
        var userPagination = getHeaderInJson("User-Pagination");

        if (userPagination.HasPrevious)
            FillTable(userPagination.CurrentPageNo - 1);
        //#endregion
    });

    $("#a_paginationNext").click(() => {
        //#region open next page if next page exists
        let userPagination = getHeaderInJson("User-Pagination");

        if (userPagination.HasNext)
            FillTable(userPagination.CurrentPageNo + 1);
        //#endregion
    });
    //#endregion

    //#region other functions
    function FillTable(pageNumber) {
        //#region reset table if not empty
        let tableBody = $("#tbl_user tbody")

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
                //#region save user-pagination header
                var userPagination = xhr.getResponseHeader("User-Pagination");
                localStorage.setItem("User-Pagination", userPagination);
                //#endregion

                //#region set CurrentPageNoCount
                userPagination = JSON.parse(userPagination);

                let currentPageCount =
                    userPagination.CurrentPageNo == userPagination.TotalPage ?
                        userPagination.LastPageCount  // when current page is last page
                        : userPagination.PageSize  // when not last page
                //#endregion

                //#region add displayingQuantity to table
                let displayingQuantity = $("#lbl_displayingQuantity");
                displayingQuantity.empty();
                displayingQuantity.append(
                    `<b>${currentPageCount}</b> kullanıcı görüntüleniyor`);
                //#endregion

                //#region add users to table
                response.forEach(user => {
                    tableBody.append(
                        `<tr>
                            <td>
                                <label class="i-checks m-b-none">
                                    <input type="checkbox"><i></i>
                                </label>
                            </td>
						    <td>${user.firstName}</td>
						    <td>${user.lastName}</td>
						    <td>${user.companyName}</td>
						    <td>${user.telNo}</td>
						    <td>${user.email}</td>
						    <td>${user.roleNames.toString()}</td>
						    <td>${getDateTimeAsModified(user.createdAt)}</td>
						    <td>
							    <a href="#" class="active" ui-toggle-class="">
								    <i class="fa fa-check text-info"> Güncelle</i>
							    </a>
						    </td>
					    </tr>`
                    );
                });
                //#endregion

                //#region hide/show pagination back and next buttons
                if (userPagination.TotalPage > 1) {
                    //#region hide/show paginationBack button
                    // hide
                    if (userPagination.CurrentPageNo == 1)
                        $("#a_paginationBack").attr("hidden", "");

                    // show
                    else
                        $("#a_paginationBack").removeAttr("hidden");
                    //#endregion

                    //#region hide/show paginationNext button
                    // hide
                    if (userPagination.CurrentPageNo == userPagination.TotalPage)
                        $("#a_paginationNext").attr("hidden", "");

                    // show
                    else
                        $("#a_paginationNext").removeAttr("hidden");
                    //#endregion
                }
                //#endregion
            },
            error: (response) => {
                alert(response.responseText);
                //writeErrorMessage(response.reponseText, )
            }
        });
    }

    function AddPaginationButtons() {
    //#region set buttonQauntity for pagination
    let userPagination = getHeaderInJson("User-Pagination");

    let buttonQuantity =
        userPagination.TotalPage < paginationButtonQuantity ?
            userPagination.TotalPage
            : paginationButtonQuantity
    //#endregion

    //#region add pagination buttons to table
    let paginationList = $("#ul_pagination");

    for (let no = 2; no <= buttonQuantity; no += 1)
        paginationList.append(
            `<li>
                    <a id="a_pagination${no}" href="#"> 
                        ${no}
                    </a>
                </li> `);
    //#endregion

    //#region add paginationNext button
    if (buttonQuantity > 1)
        paginationList.append(
            `<li>
                <a id="a_paginationNext" href="#">
                    <i class="fa fa-chevron-right"></i>
                </a>
            </li>`);
    //#endregion
    }
    //#endregion
});