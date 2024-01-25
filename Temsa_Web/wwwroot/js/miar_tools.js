//#region variables
export let paginationInfosInJson;
export let entityCountOnTable;
//#endregion

//#region functions

//#region file processes
export async function displayImageByNormalUrlAsync(
    folderPathAfterWwwroot,
    fileName,
    imgForAddUrl,
    inputForAddFileName,
    fileStatusLabel) {
    //#region before start
    await resetBeforeAddUrlAsync(
        imgForAddUrl,
        "#" + fileStatusLabel.attr("id"),
        inputForAddFileName);
    //#endregion

    //#region display image
    // add src to <img>
    imgForAddUrl.attr(
        "src",
        "/" + folderPathAfterWwwroot + "/" + fileName
    );

    // write file name to <input>
    inputForAddFileName.val(fileName);

    // reset file status label
    fileStatusLabel.empty();
    //#endregion
}

export async function displayFileByDataUrlAsync(
    selectedFileInfos,
    elementForAddDataUrl,
    fileStatusLabel,
    inputForAddFileName = null,
    afterLoad = null,
    beforeLoad = null,
    attributeName = "src") {
    //#region before start
    let fileStatusLabel_oldMessage = fileStatusLabel.text();
    let fileStatusLabel_oldStyle = fileStatusLabel.attr("style");

    await resetBeforeAddUrlAsync(
        elementForAddDataUrl,
        "#" + fileStatusLabel.attr("id"),
        inputForAddFileName);
    //#endregion

    //#region read file as dataUrl
    let fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFileInfos);
    //#endregion

    //#region when reading completed
    fileReader.onloadend = function (event) {
        //#region when successfull
        if (fileReader.readyState == fileReader.DONE) {
            //#region call function before load
            if (beforeLoad != null)
                beforeLoad();
            //#endregion

            //#region add dataUrl to attribute of element
            let dataUrl = event.target.result
            elementForAddDataUrl.attr(attributeName, dataUrl);
            //#endregion

            //#region write file name to <input>
            if (inputForAddFileName != null)
                inputForAddFileName.val(selectedFileInfos.name);
            //#endregion

            //#region call function after load
            if (afterLoad != null)
                afterLoad();
            //#endregion
        }
        //#endregion

        //#region reset "file loading..." message  
        fileStatusLabel.empty();

        // add previous messages and styles to file status label
        fileStatusLabel.attr("style", fileStatusLabel_oldStyle);
        fileStatusLabel.append(fileStatusLabel_oldMessage);
        //#endregion
    }
    //#endregion
}

export async function getBase64StrOfFileAsync(selectedFileInfos) {
    //#region read file
    let fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFileInfos);
    //#endregion

    //#region when reading process finished
    return new Promise((resolve) => {
        fileReader.onloadend = () => {
            //#region when reading process is successful
            if (fileReader.readyState == fileReader.DONE) {
                let dataUrl = fileReader.result;
                let base64Str = dataUrl.substring(dataUrl.indexOf(",") + 1);

                resolve(base64Str);
            }
            //#endregion
        }
    });
    //#endregion
}

export async function displayFileByObjectUrlAsync(
    selectedFileInfos,
    elementForAddUrl,
    attributeName,
    fileStatusLabel,
    beforeDisplay = null,
    afterDisplay = null
) {
    await removeObjectUrlFromElementAsync(elementForAddUrl, attributeName);

    //#region write "file loading..." message
    updateResultLabel(
        '#' + fileStatusLabel.attr("id"),
        partnerInformationMessagesByLanguages[language]["fileLoading"],
        fileStatusLabel_color);
    //#endregion

    //#region add new url to attribute
    // when any process to be do exists before display
    if (beforeDisplay != null)
        beforeDisplay();

    // add object url
    let newObjectUrl = URL.createObjectURL(selectedFileInfos);
    elementForAddUrl.attr(attributeName, newObjectUrl);

    // reset file status label
    fileStatusLabel.empty();

    // when any process to be do exists after display
    if (afterDisplay != null)
        afterDisplay();
    //#endregion
}

export async function removeObjectUrlFromElementAsync(
    element,
    attributeName,
    afterRemove = null
) {
    // revoke url
    let oldObjectUrl = element.attr(attributeName);
    URL.revokeObjectURL(oldObjectUrl);

    // remove url from attribute
    element.removeAttr(attributeName);

    // when any process to be do is exists after remove
    if (afterRemove != null)
        afterRemove();
}

export async function resetBeforeAddUrlAsync(
    elementForAddUrl,
    fileStatusLabelId,
    inputForAddFileName = null,
    attributeName = "src") {
    // remove old url
    elementForAddUrl.removeAttr(attributeName);

    // reset file name <input>
    if (inputForAddFileName != null)
        inputForAddFileName.val("");

    // write "file loading..." message
    updateResultLabel(
        fileStatusLabelId,
        partnerInformationMessagesByLanguages[language]["fileLoading"],
        fileStatusLabel_color);
}

export async function isFileTypeValidAsync(
    selectedFileInfos,
    fileType
) {
    //#region when file type invalid
    if (!selectedFileInfos.type.startsWith(fileType))
        return false;
    //#endregion

    return true;
}

export async function isFileSizeValidAsync(fileSizeInByte, limitInMb) {
    //#region when file size is invalid
    let fileSizeInMb = (fileSizeInByte / 1024) / 1024;  // first division for KB; second division for MB

    if (fileSizeInMb > limitInMb)
        return false;
    //#endregion

    return true;
}

export function getFileTypeFromFileName(fileName) {
    return fileName.substring(
        fileName.lastIndexOf(".") + 1);
}
//#endregion

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

export function updateResultLabel(
    resultLabelId,
    message,
    color,
    marginT = "0px",
    img_loading = null) {
    //#region resets
    // reset result label
    let resultLabel = $(resultLabelId);
    resultLabel.empty();

    // hide loading gif
    if (img_loading != null)
        img_loading.attr("hidden", "");
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

export function updateElementText(element, text) {
    element.empty();
    element.text(text);
}

export async function resetErrorRowAsync(rowId) {
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
    refreshPaginationButtons
) {
    //#region set variables
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

            controlPaginationBackAndNextButtonsAsync(paginationInfosInJson);
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

export async function setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, doDisabled) {
    //#region disable/enable other update buttons
    for (var rowNo = 1; rowNo <= pageSize; rowNo += 1) {
        let rowIdInLoop = `#tr_row${rowNo}`;

        //#region disable/enable update button
        if (rowIdInLoop != rowId) {
            // get update button
            let btn_update = $(rowIdInLoop)
                .children("#td_processes")
                .children("button")  // update button

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

                //#region save data to local

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

export async function setDisabledOfButtonAsync(doDisabled, button, bgColor) {
    //#region disable the button
    if (doDisabled) {
        button.attr("disabled", "");
        button.css("background-color", bgColor);
    }
    //#endregion

    //#region active the button
    else {
        button.removeAttr("disabled");
        button.css("background-color", bgColor);
    }
    //#endregion
}

export async function setDisabledOfButtonsAsync(doDisabled, buttonIds, bgColor) {
    //#region disable/enable multiple button
    for (let index in buttonIds) {
        //#region disable the button
        let button = $(buttonIds[index]);

        if (doDisabled) {
            button.attr("disabled", "");
            button.css("background-color", bgColor);
        }
        //#endregion

        //#region active the button
        else {
            button.removeAttr("disabled");
            button.css("background-color", bgColor);
        }
        //#endregion
    }
    //#endregion
}

export async function addPaginationButtonsAsync(
    paginationInfosInJson,
    paginationButtonQuantity,
    ul_pagination) {
    //#region set buttonQauntity for pagination
    let buttonQuantity = paginationInfosInJson.TotalPage < paginationButtonQuantity ?
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
}

export async function controlPaginationBackAndNextButtonsAsync(paginationInfosInJson) {
    // when total page count more than 1
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

export async function isAllObjectValuesNullAsync(object) {
    //#region compute total null value quantity
    let nullCounter = 0

    for (let key in object) {
        let value = object[key];

        // when data is null
        if (value == null)
            nullCounter += 1;
    }
    //#endregion

    //#region when all object values is null
    if (nullCounter == Object.keys(object).length)
        return true;
    //#endregion

    return false;
}

export async function autoObjectMapperAsync(targetObject, sourceObject, dontAddNullValues = false) {
    //#region update target object values with source object values
    for (let sourceKey in sourceObject) {
        //#region when source key exists in target object
        if (targetObject[sourceKey] != undefined) {
            //#region when source object value is null (check null)
            if (dontAddNullValues && sourceObject[sourceKey] == null)
                continue;
            //#endregion

            targetObject[sourceKey] = sourceObject[sourceKey];
        }
        //#endregion
    }
    //#endregion
}

export async function getPassedTimeInStringAsync(utcDateTimeInStr) {
    //#region convert old date in utc to local date
    let oldDateInUtc = new Date(utcDateTimeInStr);
    let oldYear = oldDateInUtc.getFullYear();
    let oldMonth = oldDateInUtc.getMonth();
    let oldDay = oldDateInUtc.getDate();
    let oldHours = oldDateInUtc.getHours();
    let oldMinutes = oldDateInUtc.getMinutes();
    let oldSeconds = oldDateInUtc.getSeconds();

    let oldDateInLocal = new Date(
        oldYear,
        oldMonth,
        oldDay,
        oldHours + 3,
        oldMinutes,
        oldSeconds);
    //#endregion

    //#region get dates in unix
    let nowDate = new Date();
    let nowDateInMs = nowDate.getTime();
    let oldDateInMs = oldDateInLocal.getTime();
    //#endregion

    //#region return passed time  

    //#region set variables
    let totalSecondAtOneHour = 3600;
    let totalSecondAtOneDay = totalSecondAtOneHour * 24;
    let totalSecondAtOneMonth = totalSecondAtOneDay * 30;
    let totalSecondAtOneYear = (totalSecondAtOneDay * 365) + (totalSecondAtOneHour * 6)  // one year == 365 day 6 hours
    let dateDifferenceInSn = (nowDateInMs - oldDateInMs) / 10 ** 3;
    //#endregion

    //#region write passed time as year
    var languagePackage_message = {
        "TR": {
            "year": " yıl önce",
            "month": " ay önce",
            "day": " gün önce",
            "hours": " saat önce",
            "minutes": " dakika önce",
            "seconds": " saniye önce"
        },
        "EN": {
            "year": " year ago",
            "month": " month ago",
            "day": " day ago",
            "hours": " hours ago",
            "minutes": " minutes ago",
            "seconds": " seconds ago"
        }
    };
    let yearDifference = Math.floor(dateDifferenceInSn / totalSecondAtOneYear);

    if (yearDifference > 0)
        return yearDifference + languagePackage_message[language]["year"];
    //#endregion

    //#region write passed time as month
    let monthDifference = Math.floor(dateDifferenceInSn / totalSecondAtOneMonth);

    if (monthDifference > 0)
        return monthDifference + languagePackage_message[language]["month"];
    //#endregion

    //#region write passed time as day
    let dayDifference = Math.floor(dateDifferenceInSn / totalSecondAtOneDay);

    if (dayDifference > 0)
        return dayDifference + languagePackage_message[language]["day"];
    //#endregion

    //#region write passed time as hours
    let hoursDifference = Math.floor(dateDifferenceInSn / totalSecondAtOneHour);

    if (hoursDifference > 0)
        return hoursDifference + languagePackage_message[language]["hours"];
    //#endregion

    //#region write passed time as minutes
    let minutesDifference = Math.floor(dateDifferenceInSn / 60);

    if (minutesDifference > 0)
        return minutesDifference + languagePackage_message[language]["minutes"];
    //#endregion

    //#region write passed time as second
    let secondDifference = Math.floor(dateDifferenceInSn);

    return secondDifference + languagePackage_message[language]["seconds"];
    //#endregion

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
		            <td id="td_error" colspan=${columnQuantityOnTable} hidden>
                    </td>
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
//#endregion