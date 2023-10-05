export function getDateTimeInString(dateTime){
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
    let minutes = date.getMinutes() + 3;

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
    marginT = "0px", marginR = "0px", marginB = "0px", marginL = "0px")
{
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

    //#region show resultLabel and update
    $(resultLabelId).removeAttr("hidden");
    resultLabel.text(message);
    //#endregion
}

// errorMessage color: "rgb(255, 75, 75)"