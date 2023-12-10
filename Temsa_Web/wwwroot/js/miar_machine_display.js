import {
    click_descriptionsButtonAsync, click_descriptionDropdownItemAsync, updateResultLabel,
    updateErrorRow, setDisabledOfOtherUpdateButtonsAsync, resetErrorRow,
    populateElementByAjaxOrLocalAsync, setDescriptionsLanguageAsync, getDateTimeInString,
    addPaginationButtonsAsync, controlPaginationBackAndNextButtonsAsync,
    displayImageByDataUrlAsync, change_descriptionsTextareaAsync, isFileTypeInvalidAsync
} from "./miar_tools.js";

$(function () {
    //#region variables
    const pageNumber = 1;
    const pageSize = 7;
    const paginationButtonQuantity = 5;
    const nameOfPaginationHeader = "Machine-Pagination";
    const errorMessageColor = "rgb(255, 75, 75)";
    const machineImage_maxWidth = "200";
    const machineImage_maxHeight = "200";
    const a_descriptionsDropdown_class = "a_descriptionsDropdown";
    const th_descriptions_id = "th_descriptions";
    const ul_descriptions_id = "ul_descriptions";
    const style_descriptionsTextarea = `min-width: 500px; 
                                        max-width: 650px;
                                        min-height: ${machineImage_maxHeight - 100}px; 
                                        max-height: ${machineImage_maxHeight * 1.3}px`;
    const btn_descriptions_id = "btn_descriptions";
    const txt_descriptions_id = "txt_descriptions";
    const table_body = $("#tbl_machine tbody");
    const table_head = $("#tbl_machine thead tr");
    const ul_pagination = $("#ul_pagination");
    const entityQuantity_id = "#small_entityQuantity";
    const entityQuantity_color = "#7A7A7A";
    const path_pdfs = "pdfs";
    const path_machineImages = "images/machines";
    const columnNames = Object.keys(columnNamesByLanguages[language]);
    const btn_image_id = "btn_image";
    const btn_pdf_id = "btn_pdf";
    const btn_update_id = "btn_update";
    const btn_save_id = "btn_save";
    const btn_cancel_id = "btn_cancel";
    const img_imageButton_id = "img_imageButton";
    const img_pdfButton_id = "img_pdfButton";
    const spn_imageButton_guide_id = "spn_imageButton_guide";
    const spn_pdfButton_guide_id = "spn_pdfButton_guide";
    const spn_pdfButton_pdfName_id = "spn_pdfButton_pdfName";
    const inpt_chooseImage_id = "inpt_chooseimage";
    const inpt_choosePdf_id = "inpt_choosePdf";
    const style_fontSize_chooseFileButtons = "13px";
    const style_fontSize_pdfButton_pdfName = "12.5px";
    const slct_mainCategory_id = "slct_mainCategory";
    const slct_subCategory_id = "slct_subCategory";
    const slct_handStatus_id = "slct_handStatus";
    let paginationInfos = {};
    let machineCountOnTable;
    let selectedPdfInfos;
    let selectedImageInfos;
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
    })
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
    })
    spn_eventManager.on("click_updateButton", async () => {
        //#region set variables
        let row = $("#" + btn_update_id).closest("tr");
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
                            <img id="${img_imageButton_id}"  src="/${path_machineImages}/${oldColumnValues[columnName]}"  alt="${oldColumnValues[columnName]}"  style="max-width: ${machineImage_maxWidth}px; max-height: ${machineImage_maxHeight - 70}px">
                            <span id="${spn_imageButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${machineImageButtonNameByLanguages[language]}</span>                           
                         </button>
                         <div hidden>
                            <input id="${inpt_chooseImage_id}"  type="file"  accept="image/*"/>
                         </div>`);
                    //#endregion

                    //#region add events
                    $("#" + btn_image_id).click(() =>
                        spn_eventManager.trigger("click_imageButton", [row])
                    );
                    $("#" + inpt_chooseImage_id).change((event) => {
                        //#region trigger the "change_chooseFileInput_image" event
                        let selectedFileInfos = event.target.files[0];

                        spn_eventManager.trigger(
                            "change_chooseFileInput_image",
                            [row.attr("id"), selectedFileInfos]);
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
                            let slct_mainCategory = $("#" + slct_mainCategory_id);

                            for (let index in mainCategoryNames) {
                                let mainCategoryName = mainCategoryNames[index];

                                slct_mainCategory.append(
                                    `<option>${mainCategoryName}</option>`
                                )
                            }
                            //#endregion

                            //#region display default main category
                            slct_mainCategory.val(
                                oldColumnValues[columnName]);
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
                            let slct_subCategory = $("#" + slct_subCategory_id);

                            for (let index in subCategoryNames) {
                                let subCategoryName = subCategoryNames[index];

                                slct_subCategory.append(
                                    `<option>${subCategoryName}</option>`
                                )
                            }
                            //#endregion

                            //#region display default subcategory
                            slct_subCategory.val(
                                oldColumnValues[columnName]);
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
                            let slct_handStatus = $("#" + slct_handStatus_id);

                            for (let index in handStatuses) {
                                let handStatus = handStatuses[index];

                                slct_handStatus.append(
                                    `<option>${handStatus}</option>`
                                );
                            }
                            //#endregion

                            //#region display default hand status
                            slct_handStatus.val(
                                oldColumnValues[columnName]);
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
                        `<textarea id="${txt_descriptions_id}"  style="${style_descriptionsTextarea}">${oldColumnValues[columnName][language]}</textarea>`);
                    //#endregion

                    //#region add description dropdown

                    //#region create dropdown
                    let th_descriptions = $("#" + th_descriptions_id);

                    th_descriptions.empty();
                    th_descriptions.append(
                        `<div class="btn-group">
                            <button id= "${btn_descriptions_id}"  type="button"  style= "background-color: darkblue;  color: red"  class= "btn btn-danger"> <b>${description_baseButtonNameByLanguages[language]} (${language})</b></button>
                            <button value="${language}"  type="button"  style="background-color: darkblue"  class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="caret"></span> </button>
                            <div class="dropdown-menu">
                                <div class="col-xs-1" style="padding:0px">
                                    <ul id="${ul_descriptions_id}" style="list-style-type:none">
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

                                $("#" + ul_descriptions_id).append(
                                    `<li class="dropdown-item">
                                        <a href="#"  class="${a_descriptionsDropdown_class}"  style="padding: 3px 75px;  color: black">${languageInDb}</a>
                                    </li>`
                                );
                                //#endregion
                            }
                            //#endregion
                        }
                    )
                    //#endregion

                    //#endregion

                    //#region declare events
                    $("#" + btn_descriptions_id).click(() =>
                        spn_eventManager.trigger("click_descriptionsButton")
                    );
                    $("." + a_descriptionsDropdown_class).click(() =>
                        spn_eventManager.trigger("click_descriptionsDropdownElement")
                    );
                    $("#" + txt_descriptions_id).on("input", () =>
                        spn_eventManager.trigger("change_descriptionsTextarea")
                    );
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
                        `<button id="${btn_pdf_id}"  type="button"  title="${pdfButtonNameByLanguages[language]}">
                            <div>
                                <img id="${img_pdfButton_id}"  src="/images/pdf.png"  alt="pdf.png"  style="max-width=50px;  max-height:50px">
                                <i>(<span id="${spn_pdfButton_pdfName_id}" style="font-size:${style_fontSize_pdfButton_pdfName}">${oldColumnValues[columnName]}</span>)</i>
                            </div>
                            <span id="${spn_pdfButton_guide_id}"  style="color:black;  font-size:${style_fontSize_chooseFileButtons}">${pdfButtonNameByLanguages[language]}</span>
                         </button>
                         <div hidden>
                            <input id="${inpt_choosePdf_id}"  type="file"  accept="application/pdf"/>
                         </div>`);
                    //#endregion

                    //#region declare events
                    $("#" + btn_pdf_id).click(() =>
                        spn_eventManager.trigger("click_pdfButton", [row])
                    )
                    $("#" + inpt_choosePdf_id).change((event) => {
                        //#region trigger the "change_chooseFileInput_image" event
                        let selectedFileInfos = event.target.files[0];

                        spn_eventManager.trigger(
                            "change_chooseFileInput_pdf",
                            [row.attr("id"), selectedFileInfos]);
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
                        `<button id="${btn_save_id}" class="active" ui-toggle-class="">
                            <i class="fa fa-check text-success" style="width:15px"></i>
                        </button>
                        <button id="${btn_cancel_id}" class="active" ui-toggle-class="">
                            <i class="fa fa-times text-danger" style="width:15px"></i>
                        </button>`
                    );
                    //#endregion

                    //#region declare events
                    $("#" + btn_save_id).click(() =>
                        spn_eventManager.trigger("click_saveButton")
                    )
                    $("#" + btn_cancel_id).click(() =>
                        spn_eventManager.trigger("click_cancelButton")
                    )
                    //#endregion
                    break;
            }
        }
        //#endregion

        //#region save old column values to session
        // add registration data as extra (for cancel button)
        oldColumnValues["createdAt"] = row
            .children("#td_createdAt")
            .text();

        // save to session
        sessionStorage.setItem(
            row.attr("id"),
            JSON.stringify(oldColumnValues));
        //#endregion
    })
    spn_eventManager.on("click_descriptionsButton", async () => {
        await click_descriptionsButtonAsync(
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id));
    })
    spn_eventManager.on("click_descriptionsDropdownElement", async () => {
        await click_descriptionDropdownItemAsync(
            $(":focus"),
            $("#" + txt_descriptions_id),
            $("#" + btn_descriptions_id)
        );
    })
    spn_eventManager.on("click_saveButton", async () => {
        //#region set variables
        let row = $(":focus").closest("tr");
        let rowId = row.attr("id");
        let machineId = row.attr("class");
        let oldColumnValues = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        //#region set url
        let url = baseApiUrl + "/machine/update?" +
            `language=${language}` +
            `&id=${machineId}` +
            `&oldMainCategoryName=${oldColumnValues.mainCategory}` +
            `&oldSubCategoryName=${oldColumnValues.subCategory}`
        //#endregion

        //#region set data
        let data = {
            "imageName": null,
            "mainCategoryName": null,
            "subCategoryName": null,
            "model": null,
            "brandName": null,
            "stock": null,
            "rented": null,
            "sold": null,
            "year": null,
            "handStatus": null,
            "descriptionInTR": null,
            "descriptionInEN": null,
            "pdfName": null,
            "imageContentInBase64Str": null,
            "pdfContentInBase64Str": null
        }

        //#region add values on column to data
        for (let index in columnNames) {
            //#region check columns whether changed
            let columnName = columnNames[index];
            let td = row.children(`#td_${columnName}`);

            switch (columnName) {
                case "image":
                    //#region add image name to data if changed
                    let imageNameOnButton = $("#" + img_imageButton_id)
                        .attr("alt");

                    // if image name changed
                    if (imageNameOnButton != oldColumnValues[columnName]) {
                        // save image name
                        data["imageName"] = imageNameOnButton;

                        // save image content in base64 string
                        data["imageContentInBase64Str"] = row
                            .children("#td_image")
                            .find("img")
                            .attr("src")
                            .replace(`data:${selectedImageInfos.type};base64,`, "");
                    }
                        
                    //#endregion
                    break;
                case "mainCategory":
                    //#region add main category to data if changed
                    let mainCategory = td
                        .children("select")
                        .val();

                    // if main category changed
                    if (mainCategory != oldColumnValues[columnName])
                        data["mainCategoryName"] = mainCategory;
                    //#endregion
                    break;
                case "subCategory":
                    //#region add subcategory to data if changed
                    let subCategory = td
                        .children("select")
                        .val();

                    // if subcategory changed
                    if (subCategory != oldColumnValues[columnName])
                        data["subCategoryName"] = subCategory;
                    //#endregion
                    break;
                case "model":
                    //#region add model to data if changed
                    let model = td
                        .children("input")
                        .val();

                    // if model changed
                    if (model != oldColumnValues[columnName])
                        data["model"] = model;
                    //#endregion
                    break;
                case "brand":
                    //#region add brand to data if changed
                    let brand = td
                        .children("input")
                        .val();

                    // if brand changed
                    if (brand != oldColumnValues[columnName])
                        data["brandName"] = brand;
                    //#endregion
                    break;
                case "handStatus":
                    //#region add hand Status to data if changed
                    let handStatus = td
                        .children("select")
                        .val();

                    // if hand status changed
                    if (handStatus != oldColumnValues[columnName])
                        data["handStatus"] = handStatus;
                    //#endregion
                    break;
                case "stock":
                    //#region add stock to data if changed
                    let stock = td
                        .children("input")
                        .val();

                    // if model changed
                    if (stock != oldColumnValues[columnName])
                        data["stock"] = stock;
                    //#endregion
                    break;
                case "rented":
                    //#region add rented to data if changed
                    let rented = td
                        .children("input")
                        .val();

                    // if rented changed
                    if (rented != oldColumnValues[columnName])
                        data["rented"] = rented;
                    //#endregion
                    break;
                case "sold":
                    //#region add sold to data if changed
                    let sold = td
                        .children("input")
                        .val();

                    // if sold changed
                    if (sold != oldColumnValues[columnName])
                        data["sold"] = sold;
                    //#endregion
                    break;
                case "year":
                    //#region add year to data if changed
                    let year = td
                        .children("input")
                        .val();

                    // if year changed
                    if (year != oldColumnValues[columnName])
                        data["year"] = year;
                    //#endregion
                    break;
                case "descriptions":
                    //#region get new descriptions in session
                    let newDescriptionsInSession = JSON.parse(sessionStorage
                        .getItem(sessionKeys_descriptionsOnDisplayPage));
                    //#endregion

                    //#region when description in any language changed
                    if (newDescriptionsInSession != null) {
                        //#region add TR description to data
                        if (newDescriptionsInSession["TR"] != undefined  // when "TR" desciption exists
                            && newDescriptionsInSession["TR"] != oldColumnValues[columnName]["TR"])  // when changed
                            data["descriptionInTR"] = newDescriptionsInSession["TR"];
                        //#endregion

                        //#region add EN description to data
                        if (newDescriptionsInSession["EN"] != undefined  // when "EN" desciption exists
                            && newDescriptionsInSession["EN"] != oldColumnValues[columnName]["EN"])  // when changed 
                            data["descriptionInEN"] = newDescriptionsInSession["EN"];
                        //#endregion
                    }
                    //#endregion

                    break;
                case "pdf":
                    //#region add pdf name to data if changed
                    let pdfNameOnButton = $("#" + spn_pdfButton_pdfName_id)
                        .text();

                    // if pdf name changed
                    if (pdfNameOnButton != "(" + oldColumnValues[columnName] + ")")
                        data["pdfName"] = pdfNameOnButton;
                    //#endregion
                    break;
            }
            //#endregion
        }
        //#endregion

        //#region when pdf changed
        if (data["pdfName"] != null) {
            let fileReader = new FileReader();

            fileReader.readAsDataURL(selectedPdfInfos)
            fileReader.onloadend = async function (event) {
                //#region when reading successfuly
                if (fileReader.readyState == fileReader.DONE) {
                    //#region save pdf content in base64 string to data
                    let dataUrl = event.target.result;

                    data["pdfContentInBase64Str"] = dataUrl
                        .replace(`data:${selectedPdfInfos.type};base64,`, "");
                    //#endregion

                    await updateMachineInfosAsync(url, data, rowId, oldColumnValues);
                }
                //#endregion
            }
        }
        //#endregion

        //#region when pdf not changed
        else
            await updateMachineInfosAsync(url, data, rowId, oldColumnValues);
        //#endregion
        
        //#endregion
    })
    spn_eventManager.on("click_cancelButton", async () => {
        //#region get machine infos in session
        let row = $(":focus").closest("tr");
        let rowId = row.attr("id");

        let machineInfosInSession = JSON.parse(sessionStorage
            .getItem(rowId));
        //#endregion

        //#region populate row again
        row.empty();
        row.append(
            `<td id="td_checkbox">
				<label class="i-checks m-b-none">
					<input type="checkbox"><i></i>
				</label>
			</td>
            <td id="td_${columnNames[0]}">
                <img src="/${path_machineImages}/${machineInfosInSession[columnNames[0]]}" 
                        alt="${machineInfosInSession[columnNames[0]]}" 
                        style="max-width:${machineImage_maxWidth}px; max-height:${machineImage_maxHeight}px">
            </td>
            <td id="td_${columnNames[1]}">${machineInfosInSession[columnNames[1]]}</td>
            <td id="td_${columnNames[2]}">${machineInfosInSession[columnNames[2]]}</td>
            <td id="td_${columnNames[3]}">${machineInfosInSession[columnNames[3]]}</td>
            <td id="td_${columnNames[4]}">${machineInfosInSession[columnNames[4]]}</td>
            <td id="td_${columnNames[5]}">${machineInfosInSession[columnNames[5]]}</td>
            <td id="td_${columnNames[6]}">${machineInfosInSession[columnNames[6]]}</td>
            <td id="td_${columnNames[7]}">${machineInfosInSession[columnNames[7]]}</td>
            <td id="td_${columnNames[8]}">${machineInfosInSession[columnNames[8]]}</td>
            <td id="td_${columnNames[9]}">${machineInfosInSession[columnNames[9]]}</td>
            <td id="td_${columnNames[10]}">${machineInfosInSession[columnNames[10]]}</td >
            <td id="td_${columnNames[11]}">
                <textarea style="${style_descriptionsTextarea}" disabled>${machineInfosInSession[columnNames[11]][language]}</textarea>
            </td>
            <td id="td_${columnNames[12]}">
                <a href="/${path_pdfs}/${machineInfosInSession[columnNames[12]]}"
                    title="${machineInfosInSession[columnNames[12]]}" 
                    target="_blank">PDF</a>
            </td>
            <td id="td_${columnNames[13]}">
                <button id="btn_update" ui-toggle-class="">
					<i class="fa fa-pencil text-info">${updateButtonNameByLanguages[language]}</i>
				</button>
            </td>
            <td style="width:30px"></td>`
        );
        //#endregion

        //#region declare events again
        $("#" + btn_update_id).click(() =>
            spn_eventManager.trigger("click_updateButton"));
        //#endregion

        await removeDescriptionButtonOnColumnAsync();
        await setDisabledOfOtherUpdateButtonsAsync(rowId, pageSize, false);
        await setDescriptionsLanguageAsync(language);
    })
    spn_eventManager.on("click_imageButton", async (event, row) => {
        //#region reset error <td>
        let rowId = row.attr("id");
        resetErrorRow(rowId);
        //#endregion

        $("#" + inpt_chooseImage_id).trigger("click");
    })
    spn_eventManager.on("click_pdfButton", async (event, row) => {
        //#region reset error <td>
        let rowId = row.attr("id");
        resetErrorRow(rowId);
        //#endregion

        $("#" + inpt_choosePdf_id).trigger("click");
    })
    spn_eventManager.on("change_chooseFileInput_image", async (event, rowId, selectedFileInfos) => {
        //#region when any file not selected
        if ($("#" + inpt_chooseImage_id).val() == null)
            return;
        //#endregion

        //#region when file types isn't pdf
        let inpt_chooseImage = $("#" + inpt_chooseImage_id)
        
        if (await isFileTypeInvalidAsync(
            selectedFileInfos,
            "image/",
            inpt_chooseImage)) {
            //#region write error to error row
            updateErrorRow(
                `#${rowId}_error`,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor);

            // reset choose image <input>
            inpt_chooseImage.val("");
            //#endregion

            return;
        }
        //#endregion

        //#region display image
        selectedImageInfos = selectedFileInfos;

        await displayImageByDataUrlAsync(
            selectedFileInfos,
            $("#" + img_imageButton_id),
            $("#" + spn_imageButton_guide_id));
        //#endregion

        //#region add image name to "alt" of <img>
        $("#" + img_imageButton_id).attr(
            "alt",
            selectedFileInfos.name);
        //#endregion
    })
    spn_eventManager.on("change_chooseFileInput_pdf", async (event, rowId, selectedFileInfos) => {
        //#region when any pdf not selected
        if ($("#" + inpt_choosePdf_id).val() == null)
            return;
        //#endregion

        //#region when file types isn't pdf
        let inpt_choosePdf = $("#" + inpt_choosePdf_id)
        
        if (await isFileTypeInvalidAsync(
            selectedFileInfos,
            "application/pdf",
            inpt_choosePdf)) {
            //#region write error to error row
            updateErrorRow(
                `#${rowId}_error`,
                partnerErrorMessagesByLanguages[language]["invalidFileType"],
                resultLabel_errorColor);

            // reset choose pdf <input>
            inpt_choosePdf.val("");
            //#endregion

            return;
        }
        //#endregion

        // save selected file infos
        selectedPdfInfos = selectedFileInfos;

        // add selected file name to pdf <button>
        let spn_pdfButton_pdfName = $("#" + spn_pdfButton_pdfName_id);
        spn_pdfButton_pdfName.empty();
        spn_pdfButton_pdfName.append(selectedFileInfos.name);
    })
    spn_eventManager.on("change_descriptionsTextarea", async () => {
        await change_descriptionsTextareaAsync(
            $("#" + btn_descriptions_id));
    })
    //#endregion

    //#region functions
    async function updateMachineInfosAsync(url, data, rowId, oldColumnValues) {
        $.ajax({
            method: "PUT",
            url: url,
            headers: { "Authorization": jwtToken },
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: () => {
                //#region update "oldColumnValues" with new column values
                for (let columnName in data) {
                    let newColumnValue = data[columnName];

                    // when column changed
                    if (newColumnValue != null)
                        oldColumnValues[columnName] = newColumnValue;
                }
                //#endregion

                //#region save updated "oldColumnValues" to session
                sessionStorage.setItem(
                    rowId,
                    JSON.stringify(oldColumnValues));
                //#endregion

                spn_eventManager.trigger("click_cancelButton");
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

    async function removeDescriptionButtonOnColumnAsync() {
        //#region remove descriptions button
        let th_descriptions = $("#" + th_descriptions_id);

        th_descriptions.empty();
        th_descriptions.append(
            description_baseButtonNameByLanguages[language]);
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

                removeDescriptionButtonOnColumnAsync();
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

    async function addMachinesToTableAsync(response) {
        //#region add machines to table
        let rowNo = 1;

        for (let index in response) {
            //#region add machine infos to table
            let machineView = response[index];
            let rowId = `tr_row${rowNo}`

            table_body.append(
                `<tr id= "${rowId}" class= ${machineView.id} style="text-align:center">
                    <td id="td_checkbox">
				        <label class="i-checks m-b-none">
					        <input type="checkbox"><i></i>
				        </label>
			        </td>
                    <td id="td_${columnNames[0]}">
                        <img src="/${path_machineImages}/${machineView.imageName}"  title="${machineView.imageName}"  alt="${machineView.imageName}"  style="max-width:${machineImage_maxWidth}px; max-height:${machineImage_maxHeight}px">
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
                        <textarea style="${style_descriptionsTextarea}" disabled>${machineView.descriptions[language]}</textarea>
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

            //#region declare events
            $("#" + btn_update_id).click(() =>
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