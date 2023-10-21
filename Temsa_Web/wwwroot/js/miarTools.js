//#region variables
export let description_currentColor;
export let description_infoInSession;
export let description_language;
export let paginationInfosInJson;
export let entityCountOnTable;
//#endregion

//#region function
export function setDescriptionLanguage(language) {
    description_language = language;
}

export function changeDescriptionButtonColor(descriptionButtonId, color) {
    $(descriptionButtonId).css("color", color);
    description_currentColor = color;
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

export function updateResultLabel(resultLabelId, message, color,
    marginT = "0px", marginR = "0px", marginB = "0px", marginL = "0px") {
    //#region reset resultLabel
    let resultLabel = $(resultLabelId);
    resultLabel.empty();
    //#endregion

    //#region change style
    resultLabel.attr("style",
        `color:	${color}; 
		margin-top: ${marginT}; 
		margin-right: ${marginR};
		margin-bottom: ${marginB};
		margin-left: ${marginL};
		text-align: center`);
    //#endregion

    //#region write error to resultLabel
    resultLabel.removeAttr("hidden");  // show resultLabel
    resultLabel.append(message);
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
    pageLanguage,
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
    //#region set description current color if empty 
    if (description_currentColor == undefined)
        description_currentColor = descriptionUnsavedColor;
    //#endregion

    //#region change description color to "unsaved color"
    if (description_currentColor == descriptionSavedColor)
        changeDescriptionButtonColor(descriptionButtonId, descriptionUnsavedColor);
    //#endregion
}

export function getDescriptionKeyForSession(descriptionBaseKeyForSession, descriptionLanguage = null) {
    return descriptionLanguage == null ?
        descriptionBaseKeyForSession + '-' + description_language  // set language as auto
        : descriptionBaseKeyForSession + '-' + descriptionLanguage  // set language as manuel
}

export async function populateTable(
    entityType,
    specialUrl,
    language,
    pageNumber,
    pageSize,
    tableBody,
    propertyNamesOfView,
    updateButtonName,
    nameOfPaginationHeader,
    lbl_entityQuantity,
    ul_pagination,
    errorMessageColor,
    paginationButtonQuantity,
    refreshPaginationButtons) {

    //#region set url
    let url = `${baseApiUrl}/${specialUrl}` +
        `?language=${language}` +
        `&pageNumber=${pageNumber}` +
        `&pageSize=${pageSize}`
    //#endregion

    $.ajax({
        method: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        beforeSend: () => {
            //#region reset table if not empty
            if (tableBody.children("tr").length != 0)
                tableBody.empty();
            //#endregion
        },
        success: (response, status, xhr) => {
            addEntitiesToTableAsync(response, language, tableBody, entityType, propertyNamesOfView, updateButtonName);

            //#region get pagination infos from headers
            paginationInfosInJson = JSON.parse(
                xhr.getResponseHeader(nameOfPaginationHeader));
            //#endregion

            //#region update entity count label
            if (response.length != 0) {  // if any machine exists
                entityCountOnTable = paginationInfosInJson.CurrentPageCount;

                lbl_entityQuantity.empty();
                lbl_entityQuantity.append(
                    `<b>${entityCountOnTable}/${pageSize}</b> ${entityCountMessage}`);
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

async function addEntitiesToTableAsync(
    response,
    language,
    tableBody,
    entityType,
    propertyNamesOfView,
    updateButtonName) {
    await new Promise(resolve => {
        //#region set variables
        let rowNo = 1;
        let rowId;
        let row;
        //#endregion

        //#region add entities to table
        response.forEach(entityView => {
            //#region add checkbox to row
            rowId = `tr_row${rowNo}`

            tableBody.append(
                `<tr id= "${rowId}" class= ${entityView.id}>
                    <td id="td_checkBox">
					    <label class="i-checks m-b-none">
						    <input type="checkbox"><i></i>
					    </label>
				    </td>
                </tr>`);

            row = $("#" + rowId);
            //#endregion

            //#region add column values of entity as dynamic
            for (let index in propertyNamesOfView) {
                let columnName = propertyNamesOfView[index];

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
            row.append(
                `<tr hidden></tr>
			<tr id="tr_row${rowNo}_error">
		        <td id="td_error" colspan="13" hidden></td>
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
//#endregio