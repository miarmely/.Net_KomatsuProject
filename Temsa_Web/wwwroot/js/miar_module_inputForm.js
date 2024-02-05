//#region variables
export let div_form;
const div_form_id = "div_form";
const div_form_css = {
    "padding-top": 20
}
const div_row_class = "form-group";
//#endregion

//#region functions
export async function createInputFormAsync(form, rowCount) {
    //#region add form div
    form.append(`
        <div id="${div_form_id}" class="form-horizontal bucket-form">
        </div>`);

    // add css
    div_form = form.find("#" + div_form_id);
    div_form.css(div_form_css);
    //#endregion

    //#region add rows to main div
    for (let repeat = 0; repeat < rowCount; repeat++)
        div_form.append(`
            <div class="${div_row_class}">
                <label class="col-sm-3 control-label"></label>
                <div class="col-sm-6"></div>
            </div>`);
    //#endregion
}
export async function populateInputFormAsync(rowNo, html_label, html_input) {
    //#region add label
    let div_row = div_form.children("." + div_row_class + `:nth-child(${rowNo})`);

    div_row
        .children("label")
        .append(html_label);
    //#endregion

    //#region add input
    div_row
        .children("div")
        .append(html_input);
    //#endregion
}
export async function addValueToInputAsync(rowNo, inputType, value) {
    //#region add value to by input type
    let div_row = div_form.children("." + div_row_class + `:nth-child(${rowNo})`);

    switch (inputType) {
        case "input":
            div_row
                .children("div>input")
                .value(value);
            break;
        case "select":
            div_row
                .children("div>select")
                .value(value);
            break;
    }
    //#endregion
}
export async function checkValueOfNumberInputAsync(inpt, minValue, maxValue) {
    //#region when current value smaller than min value
    let inpt_val = inpt.val();

    if (inpt_val < minValue)
        inpt.val(minValue);
    //#endregion

    //#region when current value bigger than max value
    else if (inpt_val > maxValue)
        inpt.val(maxValue);
    //#endregion
}
export async function writeErrorToBelowOfInputAsync(input, error) {
    // add "red" border to input
    input.css({
        "border-color": "red",
        "border-width": "1.4px"
    });

    // write error to "span_help"
    let spn_help = input.siblings("span");
    spn_help.empty();
    spn_help.append(error);
}
//#endregion