//#region export variables
export let description_currentColor;
export let description_infoInSession;
export let description_language = language;
export let paginationInfosInJson;
export let entityCountOnTable;
//#endregion

//#region export functions
export function setDescriptionLanguage(newLanguage) {
    description_language = newLanguage;
}

export function getDescriptionKeyForSession(descriptionBaseKeyForSession) {
    return descriptionBaseKeyForSession + '-' + description_language;
}

export function getDateTimeInString(dateTime) {
    //#region set year
    let date = new Date(dateTime);
    let year = date.getFullYear();
    //#endregion

    //#region set month
    let month = date.getMonth() + 1;

    // add '0' to head
    let monthInString = month < 10 ?
        `0${month}`  // add 0
        : month.toString();  // don't add
    //#endregion

    //#region set day
    let day = date.getDate();

    // add '0' to head
    let dayInString = day < 10 ?
        `0${day}`  // add 0
        : day.toString(); // don't add
    //#endregion

    //#region set hours
    let hours = date.getHours() + 3;

    // add '0' to head
    let hoursInString = hours < 10 ?
        `0${hours}`  // add 0
        : hours.toString();  // don't add
    //#endregion

    //#region set minutes
    let minutes = date.getMinutes();

    // add '0' to head
    let minutesInString = minutes < 10 ?
        `0${minutes}`  // add 0
        : minutes.toString();  // don't add
    //#endregion

    return `${dayInString}.${monthInString}.${year} - ${hoursInString}:${minutesInString}`;
}

export function getHeaderFromLocalInJson(headerName) {
    return JSON.parse(
        localStorage.getItem(headerName));
}

export function getTokenInSession() {
    return sessionStorage.getItem("token");
}

export function changeDescriptionButtonColor(descriptionButtonId, color) {
    $(descriptionButtonId).css("color", color);
    description_currentColor = color;
}

export function updateResultLabel(
    resultLabelId,
    message,
    color,
    marginT = "30px") {
    //#region reset resultLabel
    let resultLabel = $(resultLabelId);
    resultLabel.empty();
    //#endregion

    //#region change style
    resultLabel.attr("style",
        `color:	${color}; 
		margin-top: ${marginT};
		text-align: center`);
    //#endregion

    //#region write error to resultLabel
    resultLabel.removeAttr("hidden");  // show resultLabel
    resultLabel.append(message);
    //#endregion
}

export function updateErrorRow(
    errorRowId,
    message,
    color,
    marginT = "30px") {
    //#region show <td> of <tr> of error
    let tr_row_error = $(errorRowId);
    let td_error = tr_row_error.children("td");

    td_error.removeAttr("hidden");
    //#endregion

    //#region change style
    td_error.attr("style",
        `color:	${color}; 
		margin-top: ${marginT};
		text-align: center`);
    //#endregion

    //#region write error to <td> of error row
    td_error.empty();
    td_error.append(message);
    //#endregion
}

export function clicked_descriptionDropdownItem(
    clickedElement,
    decriptionInputId,
    descriptionButtonId,
    baseDescriptionButtonName,
    descriptionUnsavedColor,
    descriptionBaseKeyForSession) {
    //#region set variables
    let inpt_descriptions = $(decriptionInputId);
    let btn_description = $(descriptionButtonId)
    description_language = clickedElement.prop("innerText");
    //#endregion

    //#region reset
    // <input>
    inpt_descriptions.val("");

    // button color
    btn_description.css("color", descriptionUnsavedColor);
    description_currentColor = descriptionUnsavedColor;
    //#endregion

    //#region change description button name
    btn_description.empty();
    btn_description.append(
        `<b>
            ${baseDescriptionButtonName} (${description_language})
        </b>`);
    //#endregion

    //#region populate description <input> with in session value
    description_infoInSession = sessionStorage.getItem(
        getDescriptionKeyForSession(descriptionBaseKeyForSession));

    // when any info is exists on session
    if (description_infoInSession != null)
        inpt_descriptions.val(description_infoInSession);
    //#endregion
}

export function clicked_descriptionDropdownButton(
    descriptionInputId,
    descriptionButtonId,
    descriptionBaseKeyForSession,
    descriptionSavedColor) {
    //#region add description informations to session
    sessionStorage.setItem(
        getDescriptionKeyForSession(descriptionBaseKeyForSession),
        $(descriptionInputId).val());
    //#endregion

    //#region change description button color to "saved color"
    changeDescriptionButtonColor(descriptionButtonId, descriptionSavedColor);
    //#endregion
}

export function changed_descriptionInput(
    descriptionButtonId,
    descriptionUnsavedColor,
    descriptionSavedColor) {
    //#region initialize description current color if empty 
    if (description_currentColor == undefined)
        description_currentColor = descriptionUnsavedColor;
    //#endregion

    //#region change description color to "unsaved color"
    if (description_currentColor == descriptionSavedColor)
        changeDescriptionButtonColor(descriptionButtonId, descriptionUnsavedColor);
    //#endregion
}

export function resetErrorRow(rowId) {
    //#region hide and reset <td> of error
    var td_error = $(`#${rowId}_error`)
        .children("td")

    td_error.attr("hidden", "");
    td_error.empty();
    //#endregion
}

export async function populateTable(
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
    refreshPaginationButtons) {

    //#region set variables
    description_language = language; // set page language as default 

    let url = `${baseApiUrl}/${specialUrl}` +
        `?language=${language}` +
        `&pageNumber=${pageNumber}` +
        `&pageSize=${pageSize}`
    //#endregion

    $.ajax({
        method: "GET",
        url: url,
        headers: { "Authorization": jwtToken },
        contentType: "application/json",
        dataType: "json",
        beforeSend: () => {
            //#region reset table if not empty
            if (tableBody.children("tr").length != 0)
                tableBody.empty();
            //#endregion
        },
        success: (response, status, xhr) => {
            addEntitiesToTableAsync(response, language, tableBody, entityType, columnNamesToBeFill, updateButtonName);

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

            hideOrShowPaginationBackAndNextButtonsAsync(paginationInfosInJson);


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

export async function setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, updateButtonId, doDisabled) {
    await new Promise(resolve => {
        let btn_update = $(updateButtonId);

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

        resolve();
    })
}

export async function populateElementByAjaxOrLocalAsync(
    dataNameInLocal,
    apiUrl,
    func_populate,
    func_afterPopulated = null) {
    //#region get data from local
    let dataInLocal = JSON.parse(
        localStorage.getItem(dataNameInLocal));
    //#endregion

    //#region get data by ajax if not exists in local (ajax)
    if (dataInLocal == null  // data of any language not exists in local
        || dataInLocal[language] == null)  // data belong to language not exists in local
        $.ajax({
            method: "GET",
            url: baseApiUrl + apiUrl,
            headers: {
                "Authorization": jwtToken
            },
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                func_populate(response);

                //#region add data to local

                //#region initialize "dataInLocal"
                if (dataInLocal == null)  // when any data not exists
                    dataInLocal = {};

                dataInLocal[language] = response;
                //#endregion

                //#region add to local
                localStorage.setItem(
                    dataNameInLocal,
                    JSON.stringify(dataInLocal));
                //#endregion

                //#endregion

                //#region call function after populate process
                if (func_afterPopulated != null)
                    func_afterPopulated();
                //#endregion
            }
        });
    //#endregion

    //#region when data already in local
    else {
        func_populate(dataInLocal[language]);

        //#region call function after populate process
        if (func_afterPopulated != null)
            func_afterPopulated();
        //#endregion
    }
    //#endregion
}

export async function populateSelectAsync(select, options, optionToBeDisplay = null) {
    //#region add <option>'s to <select>
    for (let index in options) {
        let option = options[index];

        select.append(
            `<option>${option}</option>`
        )
    }
    //#endregion

    //#region set option to be display on <select>
    if (optionToBeDisplay != null)
        select.val(optionToBeDisplay);
    //#endregion
}

async function addEntitiesToTableAsync(
    response,
    language,
    tableBody,
    entityType,
    columnNamesToBeFill,
    updateButtonName) {
    await new Promise(resolve => {
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
		            <td id="td_error"
                        colspan=${columnQuantityOnTable} 
                        hidden></td>
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

        resolve();
    })
}

async function addPaginationButtonsAsync(
    paginationInfosInJson,
    paginationButtonQuantity,
    ul_pagination) {
    await new Promise(resolve => {
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
			</li> `
            );
        //#endregion

        //#region add paginationNext button
        ul_pagination.append(
            `<li>
			<a id="a_paginationNext" href="#" hidden>
				<i class="fa fa-chevron-right"></i>
			</a>
		</li>`);
        //#endregion

        resolve();
    })
}

async function hideOrShowPaginationBackAndNextButtonsAsync(paginationInfosInJson) {
    await new Promise(resolve => {
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
//#endregion