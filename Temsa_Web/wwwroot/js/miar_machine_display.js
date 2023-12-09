import {
    changeDescriptionButtonColor, clicked_descriptionDropdownButton,
    clicked_descriptionDropdownItem, description_currentColor,
    getDescriptionKeyForSession, updateResultLabel, updateErrorRow,
    setDisabledOfOtherUpdateButtonsAsync, populateElementByAjaxOrLocalAsync,
    resetErrorRow, setDescriptionLanguage, getDateTimeInString,
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync, displayImageByDataUrlAsync
} from "./miar_tools.js";

$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 7;
    const paginationButtonQuantity = 5;
    const nameOfPaginationHeader = "Machine-Pagination";
    const errorMessageColor = "rgb(255, 75, 75)";
    const description_baseKeyForSession = "Machine-Display-Description";
    const description_unsavedColor = "red";
    const description_savedColor = "lightgreen";
    const description_inputId = "#inpt_descriptions";
    const description_buttonId = "#btn_description";
    const table_body = $("#tbl_machine tbody");
    const table_head = $("#tbl_machine thead tr");
    const ul_pagination = $("#ul_pagination");
    const th_descriptions_id = "#th_descriptions";
    const updateButtonId = "#btn_update";
    const entityQuantity_id = "#small_entityQuantity";
    const entityQuantity_color = "#7A7A7A";
    const ul_description_id = "#ul_description";
    const path_pdfs = "pdfs";
    const path_machineImages = "images/machines";
    const machineImage_maxWidth = "200";
    const machineImage_maxHeight = "200";
    const description_textAreaStyle = `min-width: 500px; 
                                        max-width: 650px;
                                        min-height: ${machineImage_maxHeight - 100}px; 
                                        max-height: ${machineImage_maxHeight * 1.3}px`
    const columnNames = Object.keys(columnNamesByLanguages[language]);
    const btn_image_id = "btn_image";
    const btn_pdf_id = "btn_pdf";
    const img_imageButton_id = "img_imageButton";
    const img_pdfButton_id = "img_pdfButton";
    const spn_imageButton_guide_id = "spn_imageButton_guide";
    const spn_pdfButton_guide_id = "spn_pdfButton_guide";
    const spn_pdfButton_pdfName_id = "spn_pdfButton_pdfName";
    const inpt_chooseImage_id = "inpt_chooseimage";
    const inpt_choosePdf_id = "inpt_choosePdf";
    const style_fontSize_chooseFileButtons = "13px";
    const style_fontSize_pdfButton_pdfName = "12px";
    let paginationInfos = {};
    let machineCountOnTable;
    let selectedPdfInfos;
    //#endregion

    //#region events
    $("#box_all").click(async () => {
        //#region do checked/unchecked all checkbox
        let isBoxAllChecked = $("#box_all").is(":checked");

        await new Promise(resolve => {
            for (let rowNo = 1; rowNo <= machineCountOnTable; rowNo += 1) {
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

            resolve();
        })
        //#endregion
    })
    $("#btn_apply").click(async () => {
        let slct_tableMenubar = $("#slct_tableMenubar");

        switch (slct_tableMenubar.val()) {
            //#region delete selected values
            case "0":
                await deleteSelectedMachinesAsync();
                break;
            //#endregion 
        }
    });
    $("tbody").click(async () => {
        //#region when update, save or delete button clicked
        let clickedElement = $(":focus");
        let row = clickedElement.closest("tr");

        switch (clickedElement.attr("id")) {
            case "btn_update":
                //await clicked_updateButtonAsync(row);
                break;
            case "btn_save":
                await clicked_saveButtonAsync(row);
                break;
            case "btn_cancel":
                await clicked_cancelButtonAsync(row);
                break;
        }
        //#endregion
    })
    $("tbody").on("input", () => {  // control input changing states
        let inputtedElement = $(":focus");
        let descriptionInputIdWithoutDash = description_inputId.substring(1);

        //#region when description input changed
        if (inputtedElement.attr("id") == descriptionInputIdWithoutDash
            && description_currentColor == description_savedColor)
            changeDescriptionButtonColor(description_buttonId, description_unsavedColor);
        //#endregion
    })
    $(table_head).click(() => {
        //#region when clicked to description dropdown
        let clickedElement = $(":focus");

        if (clickedElement.attr("class") == "a_description")
            clicked_descriptionDropdownItem(
                $(":focus"),
                description_inputId,
                description_buttonId,
                description_baseButtonNameByLanguages[language],
                description_unsavedColor,
                description_baseKeyForSession);
        //#endregion

        //#region when clicked to description button
        else if (clickedElement.attr("id")
            == description_buttonId.substring(1))  // #btn_description => btn_description
            clicked_descriptionDropdownButton(
                description_inputId,
                description_buttonId,
                description_baseKeyForSession,
                description_savedColor);
        //#endregion
    });
    ul_pagination.click(async () => {
        //#region do unchecked "box_all"
        if ($("#box_all").is(":checked"))
            $("#box_all").prop("checked", false);
        //#endregion

        //#region click control of pagination buttons
        let clickedButton = $(":focus");

        switch (clickedButton.attr("id")) {
            //#region open previous page if previous page exists
            case "a_paginationBack":
                if (paginationInfos.HasPrevious)
                    await populateTableAsync(
                        paginationInfos.CurrentPageNo - 1,
                        pageSize,
                        true);

                break;
            //#endregion

            //#region open next page if next page exists
            case "a_paginationNext":
                if (paginationInfos.HasNext)
                    await populateTableAsync(
                        paginationInfos.CurrentPageNo + 1,
                        pageSize,
                        true);

                break;
            //#endregion

            //#region open page that matched with clicked button number
            default:
                //#region populate table
                let pageNo = clickedButton.prop("innerText");

                await populateTableAsync(
                    pageNo,
                    pageSize,
                    true);
                //#endregion

                break;
            //#endregion
        }
        //#endregion 
    });
    spn_eventManager.on("click_updateButton", async (event) => {
        //#region set variables
        let row = $(updateButtonId).closest("tr");
        let oldColumnValues = {};
        //#endregion

        //#region add <input>s, <select>s and <button>s to columns 
        for (let index in columnNames) {
            let columnName = columnNames[index];
            let td = row.children(`#td_${columnName}`);

            switch (columnName) {
                case "image":
                    //#region add machine image <button>
                    // save old value
                    oldColumnValues[columnName] = td
                        .children("img")
                        .attr("alt");

                    // add <button>
                    td.empty();
                    td.append(
                        `<button id="${btn_image_id}" type="button">
                            <img id="${img_imageButton_id}"  src="/${path_machineImages}/${oldColumnValues[columnName]}"  style="max-width: ${machineImage_maxWidth}px; max-height: ${machineImage_maxHeight - 70}px">
                            <span id="${spn_imageButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${machineImageButtonNameByLanguages[language]}</span>                           
                         </button>
                         <div hidden>
                            <input id="${inpt_chooseImage_id}"  type="file"  accept="image/*"/>
                         </div>`);
                    //#endregion

                    //#region add events
                    $("#" + btn_image_id).click(() =>
                        $("#" + inpt_chooseImage_id).trigger("click")
                    );
                    $("#" + inpt_chooseImage_id).change((event) => {
                        //#region trigger the "change_chooseFileInput_image" event
                        let selectedFileInfos = event.target.files[0];

                        spn_eventManager.trigger(
                            "change_chooseFileInput_image",
                            [selectedFileInfos]);
                        //#endregion
                    });
                    //#endregion

                    break;
                case "mainCategory":
                    //#region add main category <select>
                    // save old value
                    oldColumnValues[columnName] = td.text();

                    // add <select>
                    td.empty();
                    td.append(
                        `<select id="slct_${columnName}">
                        </select`);

                    // populate <select>
                    await populateElementByAjaxOrLocalAsync(
                        localKeys_allMainCategories,
                        `/machine/display/mainCategory?language=${language}`,
                        (mainCategoryNames) => {
                            //#region add main category names to <select>
                            for (let index in mainCategoryNames) {
                                let mainCategoryName = mainCategoryNames[index];

                                $(`#slct_${columnName}`).append(
                                    `<option>${mainCategoryName}</option>`
                                )
                            }
                            //#endregion
                        }
                    )
                    //#endregion
                    break;
                case "subCategory":
                    //#region add sub category <select>
                    // save old value
                    oldColumnValues[columnName] = td.text();

                    // add <select>
                    td.empty();
                    td.append(
                        `<select id="slct_${columnName}">
                        </select`);

                    // populate <select>
                    await populateElementByAjaxOrLocalAsync(
                        localKeys_allSubCategories,
                        `/machine/display/subCategory?language=${language}&mainCategoryName=${oldColumnValues["mainCategory"]}`,
                        (subCategoryNames) => {
                            //#region add sub category names to <select>
                            for (let index in subCategoryNames) {
                                let subCategoryName = subCategoryNames[index];

                                $(`#slct_${columnName}`).append(
                                    `<option>${subCategoryName}</option>`
                                )
                            }
                            //#endregion
                        }
                    )
                    //#endregion
                    break;
                case "model":
                    //#region add model <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type="text"
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "brand":
                    //#region add brand <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type="text" 
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "handStatus":
                    //#region add handStatus <select>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <select>
                    td.empty();
                    td.append(
                        `<select id="slct_${columnName}">
                         </select>`);

                    // populate <select>
                    await populateElementByAjaxOrLocalAsync(
                        localKeys_handStatuses,
                        `/machine/display/handStatus?language=${language}`,
                        (handStatuses) => {
                            //#region add hand statuses to <select>
                            for (let index in handStatuses) {
                                let handStatus = handStatuses[index];

                                $(`#slct_${columnName}`).append(
                                    `<option>${handStatus}</option>`
                                );
                            }
                            //#endregion
                        }
                    )
                    //#endregion
                    break;
                case "stock":
                    //#region add stock <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type= "number"
                                min= 1
                                max= 32000
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "rented":
                    //#region add rented <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type="number" 
                                min= 1
                                max= 32000
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "sold":
                    //#region add sold <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type= "number" 
                                min= 1
                                max= 32000
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "year":
                    //#region add year <input>
                    // save old value
                    oldColumnValues[columnName] = td.text()

                    // add <input>
                    td.empty();
                    td.append(
                        `<input id="inpt_${columnName}" 
                                type="number" 
                                min=1900
                                max=2099
                                value= ${oldColumnValues[columnName]}>`);
                    //#endregion
                    break;
                case "descriptions":
                    //#region save descriptions to different place in session
                    let rowInfosInSession = JSON.parse(sessionStorage
                        .getItem(row.attr("id")));

                    // add descriptions to object
                    let descriptionByLanguages = rowInfosInSession[columnName];

                    // save descriptions to session
                    sessionStorage.setItem(
                        sessionKeys_descriptionsOnDisplayPage,
                        JSON.stringify(descriptionByLanguages));
                    //#endregion

                    //#region add description <textarea>        
                    // save old value by language
                    oldColumnValues[columnName] = descriptionByLanguages;

                    // add <textarea>
                    td.empty();
                    td.append(
                        `<textarea id= "txt_${columnName}" 
                                   style= "${description_textAreaStyle}">${oldColumnValues[columnName][language]}</textarea>`);
                    //#endregion

                    //#region add description dropdown

                    //#region create dropdown
                    let th_descriptions = $(`#th_${columnName}`);

                    th_descriptions.empty();
                    th_descriptions.append(
                        `<div class="btn-group">
                            <button id= "btn_${columnName}" 
                                    type=" button" 
                                    style= "background-color: darkblue;  color: red"
                                    class= "btn btn-danger"> <b>${description_baseButtonNameByLanguages[language]} (${language})</b></button>

                            <button id="btn_${columnName}_dropdown"  
                                    type="button"  
                                    style="background-color: darkblue" 
                                    class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span> </button>

                            <div class="dropdown-menu">
                                <div class="col-xs-1" style="padding:0px">
                                    <ul id="ul_${columnName}" style="list-style-type:none">
                                    </ul>
                                </div>
                            </div>
                        </div>`
                    );
                    //#endregion

                    //#region add languages to description dropdown
                    await populateElementByAjaxOrLocalAsync(
                        localKeys_allLanguages,
                        "/machine/display/language",
                        (languages) => {
                            //#region populate dropdown
                            for (let index in languages) {
                                //#region add languages
                                let languageInDb = languages[index];

                                $(`#ul_${columnName}`).append(
                                    `<li class="dropdown-item">
                                        <a href="#" 
                                            style="padding: 3px 75px;  color: black">${languageInDb}</a>
                                    </li>`
                                );
                                //#endregion
                            }
                            //#endregion
                        }
                    )
                    //#endregion

                    //#endregion

                    break;
                case "pdf":
                    //#region add pdf <button>
                    // save old value
                    oldColumnValues[columnName] = td
                        .children("a")
                        .attr("title");

                    // add <button>
                    td.empty();
                    td.append(
                        `<button id="${btn_pdf_id}"  type="button">
                            <div>
                                <img id="${img_pdfButton_id}"  src="/images/pdf.png"  alt="PDF"  title="${pdfButtonNameByLanguages[language]}"  style="max-width=50px;  max-height:50px">
                                <span id="${spn_pdfButton_pdfName_id}" style="font-size:${style_fontSize_pdfButton_pdfName}"></span>
                            </div>
                            <span id="${spn_pdfButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${pdfButtonNameByLanguages[language]}</span>
                         </button>
                         <div hidden>
                            <input id="${inpt_choosePdf_id}"  type="file"  accept="application/pdf"/>
                         </div>`);
                    //#endregion

                    //#region add events
                    $("#" + btn_pdf_id).click(() =>
                        $("#" + inpt_choosePdf_id).trigger("click")
                    )
                    $("#" + inpt_choosePdf_id).change((event) => {
                        //#region trigger the "change_chooseFileInput_image" event
                        let selectedFileInfos = event.target.files[0];

                        spn_eventManager.trigger(
                            "change_chooseFileInput_pdf",
                            [selectedFileInfos]);
                        //#endregion
                    })
                    //#endregion

                    break;
                case "processes":
                    //#region add "save" and "cancel" buttons
                    // remove 'update' button
                    td.empty();

                    // add buttons
                    td.append(
                        `<button id="btn_save" class="active" ui-toggle-class="">
                            <i class="fa fa-check text-success" style="width:15px">
                            </i>
                        </button>
                        <button id="btn_cancel" class="active" ui-toggle-class="">
                            <i class="fa fa-times text-danger" style="width:15px">
                            </i>
                        </button>`
                    );
                    //#endregion
                    break;
            }
        }
        //#endregion
    })
    spn_eventManager.on("change_chooseFileInput_image", async (event, selectedFileInfos) => {
        //#region display image
        await displayImageByDataUrlAsync(
            selectedFileInfos,
            $("#" + img_imageButton_id),
            $("#" + spn_imageButton_guide_id));
        //#endregion
    })
    spn_eventManager.on("change_chooseFileInput_pdf", async (event, selectedFileInfos) => {
        // save selected file infos
        selectedPdfInfos = selectedFileInfos;

        // add selected file name to pdf <button>
        $("#" + spn_pdfButton_pdfName_id).empty();
        $("#" + spn_pdfButton_pdfName_id).append(
            "(" + selectedFileInfos.name + ")");
    })
    //#endregion

    //#region functions
    function removeInputsAndSelects(row, columnNamesAndValues) {
        //#region remove <input>'s and <select>'s
        for (let columnName in columnNamesAndValues) {
            var td = row.children(`#td_${columnName}`);
            td.empty();

            switch (columnName) {
                case "descriptions":
                    td.append(columnNamesAndValues[columnName][language]);
                    break;
                default:
                    td.append(columnNamesAndValues[columnName]);
                    break;
            }
        }
        //#endregion

        //#region add update button
        let td_processes = row.children("#td_processes")

        td_processes.empty()
        td_processes.append(
            `<button id="btn_update" class="active" ui-toggle-class="">
			    <i class="fa fa-pencil text-info">
                    ${updateButtonNameByLanguages[language]}
			    </i>
		    </button>`);
        //#endregion
    }

    function removeDescriptionButtonOnColumn() {
        $(th_descriptions_id).empty();

        $(th_descriptions_id).text(
            description_baseButtonNameByLanguages[language]);
    }

    async function populateMainCategoryNameSelectAsync(tableDatasForAddSelect, columnValues) {
        //#region get <select> of mainCategoryName
        var slct_mainCategoryName = tableDatasForAddSelect
            .mainCategoryName
            .children("select");
        //#endregion

        //#region add mainCategoryNames as <option>

        //#region set variables
        var mainCategoryNameKeyOnSession = `mainCategoryNamesIn${language}`
        var mainCategoryNamesInSession = sessionStorage
            .getItem(mainCategoryNameKeyOnSession);
        //#endregion

        //#region when mainCategoryNames not exists in sessionStorage
        if (mainCategoryNamesInSession == null)
            $.ajax({
                method: "GET",
                url: "https://localhost:7091/api/services/machine/display/mainCategory",
                headers: { "Authorization": jwtToken },
                data: {
                    language: language
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add mainCategories as <option>
                    for (let index in response) {
                        slct_mainCategoryName.append(
                            `<option> ${response[index]} </option>`);
                    };
                    //#endregion

                    //#region add mainCategoryNames to sessionStorage
                    sessionStorage.setItem(
                        mainCategoryNameKeyOnSession,
                        JSON.stringify(response));
                    //#endregion

                    //#region !!!!!!!!!!!!!!! disable mainCategoryNames !!!!!!!!!!!!!!! (TEMPORARY)
                    for (let index = 2; index <= response.length; index += 1) {
                        let option = $("#td_mainCategoryName select")
                            .children(`option:nth-child(${index})`)

                        option.attr("disabled", "")
                        option.attr("style", "color:darkgrey")
                    }
                    //#endregion
                }
            });
        //#endregion

        //#region when mainCategoryNames exists in sessionStorage
        else {
            //#region add mainCategoryNames as <option>
            var mainCategoryNames = JSON.parse(mainCategoryNamesInSession);

            for (let index in mainCategoryNames) {
                slct_mainCategoryName.append(
                    `<option>${mainCategoryNames[index]}</option>`);
            }
            //#endregion

            //#region !!!!!!!!!!!!!!! disable mainCategoryNames !!!!!!!!!!!!!!! (TEMPORARY)
            for (let index = 2; index <= mainCategoryNames.length; index += 1) {
                let option = $("#td_mainCategoryName select")
                    .children(`option:nth-child(${index})`)

                option.attr("disabled", "")
                option.attr("style", "color:darkgrey")
            }
            //#endregion
        }
        //#endregion

        //#region set default value of <select>
        slct_mainCategoryName.val(
            columnValues["mainCategoryName"]);
        //#endregion

        //#endregion
    }

    async function populateSubCategoryNameSelectAsync(tableDatasForAddSelect, columnValues) {
        //#region get subCategoryName <select>
        let slct_subCategoryName = tableDatasForAddSelect
            .subCategoryName
            .children("select");
        //#endregion

        //#region add subCategoryNames as <option>

        //#region set variables
        let subCategoryNameSessionKey = `subCategoryNamesIn${language}`;
        let subCategoryNameSessionValue = {}
        let mainCategoryName = columnValues.mainCategoryName;
        let sessionValue = JSON.parse(sessionStorage
            .getItem(subCategoryNameSessionKey));
        //#endregion

        //#region when subCategoryNames not exists in session (get from server
        if (sessionValue == null)
            await $.ajax({
                method: "GET",
                url: baseApiUrl + "/machine/display/subCategory",
                headers: { "Authorization": jwtToken },
                data: {
                    language: language,
                    mainCategoryName: columnValues["mainCategoryName"]
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add subCategoryNames to <select>
                    for (let index in response)
                        slct_subCategoryName.append(
                            `<option>${response[index]}</option>`);
                    //#endregion

                    //#region add subcategoryNames to session
                    subCategoryNameSessionValue[mainCategoryName] = response;

                    sessionStorage.setItem(
                        subCategoryNameSessionKey,
                        JSON.stringify(subCategoryNameSessionValue)
                    )
                    //#endregion
                }
            });
        //#endregion

        //#region when subCategoryNAmes exists in session (get from session)
        else {
            //#region add subCategoryName to <select>
            let subCategoryNames = sessionValue[mainCategoryName];

            for (let index in subCategoryNames) {
                let subCategoryName = subCategoryNames[index];

                slct_subCategoryName.append(
                    `<option>${subCategoryName}</option>`);
            }
            //#endregion
        }
        //#endregion

        //#region set default value of <select>
        slct_subCategoryName.val(columnValues.subCategoryName);
        //#endregion

        //#endregion
    }

    async function populateHandStatusSelectAsync(tableDatasForAddSelect, columnValues) {
        //#region get handStatus <select>
        let slct_handStatus = tableDatasForAddSelect
            .handStatus
            .children("select");
        //#endregion

        //#region populate handStatus <select>

        //#region set variables
        let handStatusSessionKey = `handStatusIn${language}`;
        let handStatusesOnSession = JSON.parse(sessionStorage
            .getItem(handStatusSessionKey));
        //#endregion

        //#region when handstatuses not exists in session (get from service)
        if (handStatusesOnSession == null)
            $.ajax({
                method: "GET",
                url: baseApiUrl + "/machine/display/handstatus",
                headers: { "Authorization": jwtToken },
                data: {
                    language: language
                },
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    //#region add handstatus as <option> to <select>
                    for (let index in response) {
                        slct_handStatus.append(
                            `<option>${response[index]}</option>`)
                    }
                    //#endregion

                    //#region add handStatuses to session
                    sessionStorage.setItem(
                        handStatusSessionKey,
                        JSON.stringify(response))
                    //#endregion
                }
            })
        //#endregion

        //#region when handstatuses exists in session (get from session)
        else {
            for (let index in handStatusesOnSession) {
                slct_handStatus.append(
                    `<option>${handStatusesOnSession[index]}</option>`)
            }
        }
        //#endregion

        //#region set default value of handStatus <select>
        slct_handStatus.val(columnValues.handStatus);
        //#endregion

        //#endregion
    }

    async function deleteSelectedMachinesAsync() {
        //#region set data
        let machineInfos = [];

        //#region populate "machineInfos" array
        for (let rowNo = 1; rowNo <= machineCountOnTable; rowNo += 1) {
            //#region set variables
            let checkBox = $(`#tr_row${rowNo} #td_checkBox input`);
            let row = $(`#tr_row${rowNo}`);
            //#endregion

            //#region add machine infos to "machineInfos" if checked
            if (checkBox.is(":checked")) {
                //#region when update process continuing
                if (row.children("td>input").length != 0)  // when any <input> exists
                    await clicked_cancelButtonAsync(rowNo);  // cancel update process
                //#endregion

                //#region get machine id, image name and pdf name
                let machineId = row.attr("class");

                let imageName = row.children("#td_image")
                    .children("img")
                    .attr("alt");

                let pdfName = row.children("#td_pdf")
                    .children("a")
                    .attr("title");
                //#endregion

                //#region populate "machineInfos"
                machineInfos.push({
                    "MachineId": machineId,
                    "ImageName": imageName,
                    "PdfName": pdfName,
                });
                //#endregion
            }
            //#endregion
        }
        //#endregion

        //#region when any machine not select
        if (machineInfos.length == 0)
            return;
        //#endregion

        //#endregion

        $.ajax({
            method: "DELETE",
            url: (baseApiUrl + "/machine/delete" +
                `?language=${language}` +
                `&imageFolderPathAfterWwwroot=${path_machineImages}` +
                `&pdfFolderPathAfterWwwroot=${path_pdfs}`),
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(machineInfos),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region when all machines on page deleted
                let currentPageNo = paginationInfos.CurrentPageNo;

                if (machineInfos.length == paginationInfos.CurrentPageCount) {
                    //#region when next page exists
                    if (paginationInfos.HasNext)
                        populateTableAsync(currentPageNo, pageSize, true);  // refresh current page
                    //#endregion

                    //#region when previous page exists
                    else if (paginationInfos.HasPrevious)
                        populateTableAsync(currentPageNo - 1, pageSize, true);
                    //#endregion

                    //#region when any machines not found
                    else {
                        table_body.empty();

                        updateResultLabel(
                            entityQuantity_id,
                            `<b>0/${pageSize}<b> ${entityQuantity_message}`,
                            errorMessageColor);
                    }
                    //#endregion
                }
                //#endregion

                //#region when some machines on page deleted
                else
                    populateTableAsync(currentPageNo, pageSize, true);  // refresh current page
                //#endregion

                //#region do unchecked "box_all"
                $("#box_all").prop("checked", false);
                //#endregion

                removeDescriptionButtonOnColumn();
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    entityQuantity_id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor
                );
                //#endregion
            }
        });
    }

    async function clicked_updateButtonAsync(row) {
        //#region set variables

        //#region set "tableDatasForAddInput"
        let tableDatasForAddInput = {}
        let tableDatasForAddInputGuide = {
            "brand": "text",
            "model": "text",
            "stock": "number",
            "rented": "number",
            "sold": "number",
            "year": "number",
            "description": "text"
        }

        // populate "tableDatasForAddInput"
        for (let columnName in tableDatasForAddInputGuide) {
            tableDatasForAddInput[columnName] = row
                .children(`#td_${columnName}`);
        }
        //#endregion

        //#region set "rowId", "rowInfosInSession", "tableDatasForAddSelect"
        let rowId = row.attr("id");
        let rowInfosInSession = JSON.parse(
            sessionStorage.getItem(rowId));
        let tableDatasForAddSelect = {
            "mainCategoryName": row.children("#td_mainCategory"),
            "subCategoryName": row.children("#td_subCategory"),
            "handStatus": row.children("#td_handStatus"),
        };
        //#endregion

        //#region set "columnValues"
        let columnValues = {}
        let tableDataTypes = [tableDatasForAddInput, tableDatasForAddSelect]

        for (let index in tableDataTypes) {
            let tableDatas = tableDataTypes[index];

            // add column values to columnValues
            for (let columnName in tableDatas) {
                let columnValue = tableDatas[columnName].text();
                columnValues[columnName] = columnValue;
            }

            // add descriptions in session to columnValues
            columnValues["descriptions"] = rowInfosInSession["descriptions"];
        }
        //#endregion

        //#endregion

        //#region update descriptions in session
        for (let languageOfDescription in rowInfosInSession["descriptions"]) {
            let description = rowInfosInSession["descriptions"][languageOfDescription];

            sessionStorage.setItem(
                description_baseKeyForSession + "-" + languageOfDescription,
                description);
        }
        //#endregion

        await setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, updateButtonId, true);

        //#region add <input> to columns
        for (let columnName in tableDatasForAddInput) {
            //#region reset column
            let column = tableDatasForAddInput[columnName];
            column.empty()
            //#endregion

            //#region add <input>
            let inputType = tableDatasForAddInputGuide[columnName];
            column.append(`<input type="${inputType}" id="inpt_${columnName}">`);
            //#endregion

            //#region add default value to <inpt>'s
            let inputOnColumn = column.children(`#inpt_${columnName}`)

            switch (columnName) {
                case "descriptions":
                    inputOnColumn.val(columnValues[columnName][language])
                    break;
                default:
                    inputOnColumn.val(columnValues[columnName]);
                    break;
            }
            //#endregion
        }
        //#endregion

        //#region add description dropdown

        //#region create dropdown
        let descriptionButtonIdWithoutDash = description_buttonId.substring(1); // #btn_description ~~> btn_description 

        $(th_descriptions_id).empty();
        $(th_descriptions_id).append(
            `<div class="btn-group">
                <button id="${descriptionButtonIdWithoutDash}"  type="button"  style="background-color: darkblue;  color: red" class="btn btn-danger">
                    <b>${description_baseButtonNameByLanguages[language]} (${language})</b>
                </button>

                <button id="btn_descriptionDropdown"  type="button"  style="background-color: darkblue" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="caret"></span>
                </button>

                <div class="dropdown-menu">
                    <div class="col-xs-1" style="padding:0px">
                        <ul id="${ul_description_id.substring(1)}" style="list-style-type:none">
                        </ul>
                    </div>
                </div>
            </div>`
        );
        //#endregion

        //#region populate languages to description dropdown
        $(ul_description_id).empty();

        await populateElementByAjaxOrLocalAsync(
            localKeys_allLanguages,
            "/machine/display/language",
            (data) => {
                //#region populate languages
                for (let index in data) {
                    let languageInDb = data[index];

                    //#region populate dropdown with languages
                    $(ul_description_id).append(
                        `<li class="dropdown-item">
                            <a class="a_description" href="#" style="padding: 3px 75px;  color:black">
                                ${languageInDb}
                            </a>
                        </li>`
                    );
                    //#endregion

                    //#region update descriptions in session
                    let descriptionByLanguage = columnValues["descriptions"][languageInDb];

                    sessionStorage.setItem(
                        getDescriptionKeyForSession(description_baseKeyForSession, languageInDb),
                        descriptionByLanguage);
                    //#endregion
                }
                //#endregion
            }
        )
        //#endregion

        //#endregion

        //#region add <select> to columns
        // add <select> all columns
        for (let columnName in tableDatasForAddSelect) {
            let column = tableDatasForAddSelect[columnName];
            column.empty();
            column.append("<select> </select>")
        }

        // populate <select>'s
        await populateMainCategoryNameSelectAsync(tableDatasForAddSelect, columnValues);
        await populateSubCategoryNameSelectAsync(tableDatasForAddSelect, columnValues);
        await populateHandStatusSelectAsync(tableDatasForAddSelect, columnValues);
        //#endregion

        //#region add "save" and "cancel" buttons

        //#region remove 'update' button
        let td_processes = row.children("#td_processes");
        td_processes.empty();
        //#endregion

        //#region add buttons
        td_processes.append(
            `<button id="btn_save" class="active" ui-toggle-class="">
                <i class="fa fa-check text-success" style="width:15px">
                </i>
            </button>
             <button id="btn_cancel" class="active" ui-toggle-class="">
                <i class="fa fa-times text-danger" style="width:15px">
                </i>
            </button>`

        );
        //#endregion

        //#endregion

        //#region add columnValues to session
        sessionStorage.setItem(
            rowId,
            JSON.stringify(columnValues)
        );
        //#endregion
    }

    async function clicked_saveButtonAsync(row) {
        //#region set variables
        let machineId = row.attr("class");
        let rowId = row.attr("id");
        let columnNamesByElementTypes = {
            "input": [
                "model",
                "brandName",
                "stock",
                "rented",
                "sold",
                "year",
            ],
            "select": [
                "mainCategoryName",
                "subCategoryName",
                "handStatus"
            ]
        }
        let oldColumnValues = JSON.parse(
            sessionStorage.getItem(rowId));
        let newColumnValues = {};

        //#region populate newColumnValues
        for (let elementType in columnNamesByElementTypes)
            for (let index in columnNamesByElementTypes[elementType]) {
                let columnName = columnNamesByElementTypes[elementType][index];
                let inputOrSelect = row
                    .children(`#td_${columnName}`)
                    .children(elementType);

                newColumnValues[columnName] = inputOrSelect.val();
            }
        //#endregion

        //#endregion

        //#region set data
        var data = {};

        //#region add new value of columns to data except description 
        for (let columnName in newColumnValues) {
            data[columnName] = oldColumnValues[columnName] == newColumnValues[columnName] ?
                null  // that means not changed
                : newColumnValues[columnName]  // that means changed
        }
        //#endregion

        //#region add descriptions to data
        for (var descriptionLanguage in oldColumnValues["descriptions"]) {
            //#region set variables
            let oldDescriptionByLanguage = oldColumnValues["descriptions"][descriptionLanguage];
            let newDescriptionByLanguage = sessionStorage.getItem(
                description_baseKeyForSession + '-' + descriptionLanguage);
            //#endregion

            //#region add description to data
            data[`DescriptionIn${descriptionLanguage}`] =
                oldDescriptionByLanguage == newDescriptionByLanguage ?  // is description changed ?
                    null
                    : newDescriptionByLanguage;
            //#endregion
        }
        //#endregion

        //#endregion

        //#region set url
        let url = baseApiUrl + "/machine/update?" +
            `language=${language}` +
            `&id=${machineId}` +
            `&oldMainCategoryName=${oldColumnValues.mainCategoryName}` +
            `&oldSubCategoryName=${oldColumnValues.subCategoryName}`
        //#endregion

        $.ajax({
            method: "PUT",
            url: url,
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region update row infos in session 

                //#region add descriptions to "newColumnValues"
                newColumnValues["descriptions"] = {};

                // get all languages
                let allLanguages = JSON.parse(
                    localStorage.getItem(localKeys_allLanguages))
                [language];

                // add descriptions
                for (var index in allLanguages) {
                    let languageInDb = allLanguages[index];
                    let newDescriptionByLanguage = sessionStorage.getItem(
                        description_baseKeyForSession + "-" + languageInDb);

                    newColumnValues["descriptions"][languageInDb] = newDescriptionByLanguage;
                }
                //#endregion

                //#region update session
                sessionStorage.setItem(
                    rowId,
                    JSON.stringify(newColumnValues));
                //#endregion

                //#endregion

                removeInputsAndSelects(row, newColumnValues);
                removeDescriptionButtonOnColumn();
                resetErrorRow(rowId);
                setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, updateButtonId, false);
            },
            error: (response) => {
                //#region write error to error row
                updateErrorRow(
                    `#${rowId}_error`,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            }
        })
    }

    async function clicked_cancelButtonAsync(row) {
        //#region get machine infos in session
        let rowId = row.attr("id");

        let machineInfosInSession = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        removeInputsAndSelects(row, machineInfosInSession);
        removeDescriptionButtonOnColumn();
        resetErrorRow(rowId);
        setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, updateButtonId, false);
        setDescriptionLanguage(language);
    }

    async function addMachinesToTableAsync(response) {
        //#region add machines to table
        let rowNo = 1;

        for (let index in response) {
            //#region add machine infos to table
            let machineView = response[index];
            let rowId = `tr_row${rowNo}`

            table_body.append(
                `<tr id= "${rowId}" class= ${machineView.id} style="text-align:center">
                    <td id="td_checkbox}">
				        <label class="i-checks m-b-none">
					        <input type="checkbox"><i></i>
				        </label>
			        </td>
                    <td id="td_${columnNames[0]}">
                        <img src="/${path_machineImages}/${machineView.imageName}" 
                             alt="${machineView.imageName}" 
                             style="max-width:${machineImage_maxWidth}px; max-height:${machineImage_maxHeight}px">
                    </td>
                    <td id="td_${columnNames[1]}">${machineView.mainCategoryName}</td>
                    <td id="td_${columnNames[2]}">${machineView.subCategoryName}</td>
                    <td id="td_${columnNames[3]}">${machineView.brandName}</td>
                    <td id="td_${columnNames[4]}">${machineView.model}</td>
                    <td id="td_${columnNames[5]}">${machineView.handStatus}</td>
                    <td id="td_${columnNames[6]}">${machineView.stock}</td>
                    <td id="td_${columnNames[7]}">${machineView.rented}</td>
                    <td id="td_${columnNames[8]}">${machineView.sold}</td>
                    <td id="td_${columnNames[9]}">${machineView.year}</td>
                    <td id="td_${columnNames[10]}">${getDateTimeInString(machineView.createdAt)}</td >
                    <td id="td_${columnNames[11]}">
                        <textarea style="${description_textAreaStyle}" disabled>${machineView.descriptions[language]}</textarea>
                    </td>
                    <td id="td_${columnNames[12]}">
                        <a href="/${path_pdfs}/${machineView.pdfName}"
                           title="${machineView.pdfName}" 
                           target="_blank">PDF</a>
                    </td>
                    <td id="td_${columnNames[13]}">
                        <button id="btn_update" ui-toggle-class="">
					        <i class="fa fa-pencil text-info">${updateButtonNameByLanguages[language]}</i>
				        </button>
                    </td>
                    <td style="width:30px"></td>
                </tr>
                <tr hidden></tr>
			    <tr id="${rowId}_error">
		            <td id="td_error" colspan=16 hidden>
                    </td>
			    </tr>`
            );

            rowNo += 1;
            //#endregion

            //#region add events
            $(updateButtonId).click((event) =>
                spn_eventManager.trigger("click_updateButton"));
            //#endregion

            //#region save descriptions to session
            sessionStorage.setItem(
                rowId,
                JSON.stringify({
                    "descriptions": machineView.descriptions
                }));
            //#endregion
        }
        //#endregion
    }

    async function populateTableAsync(pageNumber, pageSize, refreshPaginationButtons) {
        $.ajax({
            method: "GET",
            url: (baseApiUrl + "/machine/display/all" +
                `?language=${language}` +
                `&pageNumber=${pageNumber}` +
                `&pageSize=${pageSize}`),
            headers: { "Authorization": jwtToken },
            contentType: "application/json",
            dataType: "json",
            beforeSend: () => {
                //#region reset table if not empty
                if (table_body.children("tr").length != 0)
                    table_body.empty();
                //#endregion
            },
            success: (response, status, xhr) => {
                //#region populate table
                addMachinesToTableAsync(response)
                    .then(async () => {
                        //#region get pagination infos from headers
                        paginationInfos = JSON.parse(
                            xhr.getResponseHeader(nameOfPaginationHeader));
                        //#endregion

                        //#region update entity count label
                        if (response.length != 0) {  // if any machine exists
                            machineCountOnTable = paginationInfos.CurrentPageCount;

                            updateResultLabel(
                                entityQuantity_id,
                                `<b>${machineCountOnTable}/${pageSize}</b> ${entityQuantity_messageByLanguages[language]}`,
                                entityQuantity_color
                            )
                        }
                        //#endregion

                        //#region add pagination buttons
                        if (refreshPaginationButtons)
                            addPaginationButtonsAsync(
                                paginationInfos,
                                paginationButtonQuantity,
                                ul_pagination);
                        //#endregion

                        await controlPaginationBackAndNextButtonsAsync(paginationInfos);
                    });
                //#endregion
            },
            error: (response) => {
                //#region write error to entity quantity label
                updateResultLabel(
                    entityQuantity_id,
                    JSON.parse(response.responseText).errorMessage,
                    errorMessageColor);
                //#endregion
            },
        });
    }

    async function populateHtmlAsync() {
        //#region add table title
        $(".panel-heading").append(
            tableTitleByLanguages[language]);
        //#endregion

        //#region add table menubars
        let tableMenubarOptions = tableMenubar_optionsByLanguages[language];

        for (let index = 0; index < tableMenubarOptions.length; index += 1) {
            let tableMenubarOption = tableMenubarOptions[index];

            $("#slct_tableMenubar").append(
                `<option value="${index}">
                    ${tableMenubarOption}
                    </option>`
            )
        }
        //#endregion

        //#region add apply button name
        $("#btn_apply").append(
            tableMenubar_applyButtonName[language])
        //#endregion

        //#region add column heads
        // add column heads
        for (let column in columnNamesByLanguages[language]) {
            let columnNameByLanguage = columnNamesByLanguages[language][column];

            table_head.append(
                `<th id="th_${column}" style="text-align:center">${columnNameByLanguage}</th>`
            );
        }

        // add blank column to end
        table_head.append(
            `<th style="width:30px"></th>`
        );
        //#endregion

        //#region add entity quantity message
        $(entityQuantity_id).append(
            `<b>0</b> ${entityQuantity_messageByLanguages[language]}`
        );
        //#endregion
    }
    //#endregion

    populateHtmlAsync()
        .then(async () =>
            await populateTableAsync(pageNumber, pageSize, true));
})