export function convertErrorCodeToErrorMessage(errorCode)
{
    switch (errorCode) {
        //#region format error codes
        // with one code
        case "FE-F": return "ad geçerli değil";
        case "FE-L": return "soyad geçerli değil";
        case "FE-C": return "şirket adı geçerli değil";
        case "FE-T": return "telefon numarası geçerli değil";
        case "FE-E": return "email geçerli değil";
        case "FE-P": return "şifre geçerli değil";

        // with two code
        case "FE-FL": return "ad ve soyad geçerli değil";
        case "FE-FC": return "ad ve şirket adı geçerli değil";
        case "FE-FT": return "ad ve telefon numarası geçerli değil";
        case "FE-FE": return "ad ve email geçerli değil";
        case "FE-FP": return "ad ve şifre geçerli değil";
        case "FE-LC": return "soyad ve şirket adı geçerli değil";
        case "FE-LT": return "soyad ve telefon geçerli değil";
        case "FE-LE": return "soyad ve email geçerli değil";
        case "FE-LP": return "soyad ve şifre geçerli değil";
        case "FE-CT": return "şirket adı ve telefon geçerli değil";
        case "FE-CE": return "şirket adı ve email geçerli değil";
        case "FE-CP": return "şirket adı ve şifre geçerli değil";
        case "FE-TE": return "telefon numarası ve email geçerli değil";
        case "FE-TP": return "telefon numarası ve şifre geçerli değil";
        case "FE-EP": return "email ve şifre geçerli değil";

        // with three code
        case "FE-FLC": return "ad, soyad ve şirket adı geçerli değil";
        case "FE-FLT": return "ad, soyad ve telefon numarası geçerli değil";
        case "FE-FLE": return "ad, soyad ve email geçerli değil";
        case "FE-FLP": return "ad, soyad ve şifre geçerli değil";
        case "FE-FCT": return "ad, şirket adı ve telefon numarası geçerli değil";
        case "FE-FCE": return "ad, şirket adı ve email geçerli değil";
        case "FE-FCP": return "ad, şirket adı ve şifre geçerli değil";
        case "FE-FTE": return "ad, telefon numarası ve email geçerli değil";
        case "FE-FTP": return "ad, telefon numarası ve şifre geçerli değil";
        case "FE-FEP": return "ad, email ve şifre geçerli değil";
        case "FE-LCT": return "soyad, şirket adı ve telefon numarası geçerli değil";
        case "FE-LCE": return "soyad, şirket adı ve email geçerli değil";
        case "FE-LCP": return "soyad, şirket adı ve şifre geçerli değil";
        case "FE-LTE": return "soyad, telefon numarası ve email geçerli değil";
        case "FE-LTP": return "soyad, telefon numarası ve şifre geçerli değil";
        case "FE-LEP": return "soyad, email ve şifre geçerli değil";
        case "FE-CTE": return "şirket adı, telefon numarası ve email geçerli değil";
        case "FE-CTP": return "şirket adı, telefon numarası ve şifre geçerli değil";
        case "FE-CEP": return "şirket adı, email ve şifre geçerli değil";
        case "FE-TEP": return "telefon numarası, email ve şifre geçerli değil";

        // with four code
        case "FE-FLCT": return "ad, soyad, şirket adı ve telefon numarası geçerli değil";
        case "FE-FLCE": return "ad, soyad, şirket adı ve email geçerli değil";
        case "FE-FLCP": return "ad, soyad, şirket adı ve şifre geçerli değil";
        case "FE-FLTE": return "ad, soyad, telefon numarası ve email geçerli değil";
        case "FE-FLTP": return "ad, soyad, telefon numarası ve şifre geçerli değil";
        case "FE-FLEP": return "ad, soyad, email ve şifre geçerli değil";
        case "FE-FCTE": return "ad, şirket adı, telefon numarası ve email geçerli değil";
        case "FE-FCTP": return "ad, şirket adı, telefon numarası ve şifre geçerli değil";
        case "FE-FCEP": return "ad, şirket adı, email ve şifre geçerli değil";
        case "FE-FTEP": return "ad, telefon numarası, email ve şifre geçerli değil";
        case "FE-LCTE": return "soyad, şirket adı, telefon numarası ve email geçerli değil";
        case "FE-LCTP": return "soyad, şirket adı, telefon numarası ve şifre geçerli değil";
        case "FE-LCEP": return "soyad, şirket adı, email ve şifre geçerli değil";
        case "FE-LTEP": return "soyad, telefon numarası, email ve şifre geçerli değil";
        case "FE-CTEP": return "şirket adı, telefon numarası, email ve şifre geçerli değil";

        // with five code
        case "FE-FLCTE": return "ad, soyad, şirket adı, telefon numarası ve email geçerli değil";
        case "FE-FLCTP": return "ad, soyad, şirket adı, telefon numarası ve şifre geçerli değil";
        case "FE-FLCEP": return "ad, soyad, şirket adı, email ve şifre geçerli değil";
        case "FE-FLTEP": return "ad, soyad, telefon numarası, email ve şifre geçerli değil";
        case "FE-FCTEP": return "ad, şirket adı, telefon numarası, email ve şifre geçerli değil";
        case "FE-LCTEP": return "soyad, şirket adı, telefon numarası, email ve şifre geçerli değil";

        // with six code
        case "FE-FLCTEP": return "ad, soyad, şirket adı, telefon numarası, email ve şifre geçerli değil";
        //#endregion

        //#region verification error codes
        case "VE-T": return "telefon numarası Yanlış";
        case "VE-P": return "şifre yanlış";
        //#endregion

        //#region conflict error codes
        case "CE-T": return "girilen telefon numarası daha önceden kullanılmış";
        case "CE-E": return "girilen email daha önceden kullanılmış";
        case "CE-TE": return "girilen telefon numarası ve email daha önceden kullanılmış";
        //#endregion
    };
}

export function writeErrorMessage(responseText, resultLabelId)
{
    var errorMsg = JSON.parse(responseText);
    var convertedErrorMsg = convertErrorCodeToErrorMessage(errorMsg["errorCode"]);
    updateResultLabel(convertedErrorMsg, "rgb(255, 75, 75)", resultLabelId);
}

export function updateResultLabel(message, color, resultLabelId)
{
    //#region reset resultLabel
    let resultLabel = $(resultLabelId);
    resultLabel.empty();
    //#endregion

    //#region change color
    resultLabel.attr("style",
        `color:${color}; 
        margin-top:30px; 
        margin-bottom: 30px;`);
    //#endregion

    // update
    resultLabel.text(message);
}

export function getDateTimeAsModified(dateTime) {
    //#region set year, hours and minutes
    let date = new Date(dateTime);

    let year = date.getFullYear();
    let hours = date.getHours() + 3;
    let minutes = date.getMinutes();
    //#endregion

    //#region set day
    let day = date.getDate();

    // add '0' to head
    let dayInString = day < 10 ?
        `0${day}`  // add 0
        : day.toString(); // don't add
    //#endregion

    //#region set month
    let month = date.getMonth() + 1;

    // add '0' to head
    let monthInString = month < 10 ?
        `0${month}`  // add 0
        : month.toString();  // don't add
    //#endregion

    return `${dayInString}.${monthInString}.${year} - ${hours}:${minutes}`;
}

export function getHeaderInJson(headerName) {
    return JSON.parse(
        localStorage.getItem(headerName));
}