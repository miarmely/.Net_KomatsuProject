$(function () {
    const pageNumber = 1;
    const paginationButtonQuantity = 5;
    
    FillTable(pageNumber);
    let paginationData = localStorage.getItem(nameOfPaginationHeader);

    AddPaginationButtons();

    
    //#region events
    $("#a_paginationBack").click(() => {
        //#region open previous page if previous page exists
        if (paginationData.HasPrevious)
            FillTable(paginationData.CurrentPageNo - 1);
        //#endregion
    });

    $("#a_pagination1").click(() => FillTable(1));

    $("#a_pagination2").click(() => FillTable(2));

    $("#a_pagination3").click(() => FillTable(3));

    $("#a_pagination4").click(() => FillTable(4));

    $("#a_pagination5").click(() => FillTable(5));

    $("#a_paginationNext").click(() => {
        //#region open next page if next page exists
        if (paginationData.HasNext)
            FillTable(paginationData.CurrentPageNo + 1);
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
                //#region add paginationData to localStorage
                paginationData = JSON.parse(
                    xhr.getResponseHeader(nameOfPaginationHeader));

                localStorage.setItem(nameOfPaginationHeader, paginationData);
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
                    `<b>${entityCountOfPage}</b> kullanıcı görüntüleniyor`);
                //#endregion

                AddEntitiesToTable(response);                

                //#region hide/show pagination back and next buttons
                if (paginationData.TotalPage > 1) {
                    //#region hide/show paginationBack button
                    // hide
                    if (paginationData.CurrentPageNo == 1)
                        $("#a_paginationBack").attr("hidden", "");

                    // show
                    else
                        $("#a_paginationBack").removeAttr("hidden");
                    //#endregion

                    //#region hide/show paginationNext button
                    // hide
                    if (paginationData.CurrentPageNo == paginationData.TotalPage)
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
                    <a id="a_pagination${no}" href="#"> 
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
    //#endregion
});