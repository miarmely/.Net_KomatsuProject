export function convertErrorCodeToErrorMessage(errorCode) {
    switch (errorCode) {
        //#region format error codes
        // with one code
        case "FE-F": return "Ad geçerli değil";
        case "FE-L": return "Soyad geçerli değil";
        case "FE-C": return "Şirket adı geçerli değil";
        case "FE-T": return "Telefon numarası geçerli değil";
        case "FE-E": return "Email geçerli değil";
        case "FE-P": return "Şifre geçerli değil";

        // with two code
        case "FE-FL": return "Ad ve Soyad geçerli değil";
        case "FE-FC": return "Ad ve Şirket Adı geçerli değil";
        case "FE-FT": return "Ad ve Telefon Numarası geçerli değil";
        case "FE-FE": return "Ad ve Email geçerli değil";
        case "FE-FP": return "Ad ve Şifre geçerli değil";
        case "FE-LC": return "Soyad ve Şirket Adı geçerli değil";
        case "FE-LT": return "Soyad ve Telefon geçerli değil";
        case "FE-LE": return "Soyad ve Email geçerli değil";
        case "FE-LP": return "Soyad ve Şifre geçerli değil";
        case "FE-CT": return "Şirket Adı ve Telefon geçerli değil";
        case "FE-CE": return "Şirket Adı ve Email geçerli değil";
        case "FE-CP": return "Şirket Adı ve Şifre geçerli değil";
        case "FE-TE": return "Telefon Numarası ve Email geçerli değil";
        case "FE-TP": return "Telefon Numarası ve Şifre geçerli değil";
        case "FE-EP": return "Email ve Şifre geçerli değil";

        // with three code
        case "FE-FLC": return "Ad, Soyad ve Şirket Adı geçerli değil";
        case "FE-FLT": return "Ad, Soyad ve Telefon Numarası geçerli değil";
        case "FE-FLE": return "Ad, Soyad ve Email geçerli değil";
        case "FE-FLP": return "Ad, Soyad ve Şifre geçerli değil";
        case "FE-FCT": return "Ad, Şirket Adı ve Telefon Numarası geçerli değil";
        case "FE-FCE": return "Ad, Şirket Adı ve Email geçerli değil";
        case "FE-FCP": return "Ad, Şirket Adı ve Şifre geçerli değil";
        case "FE-FTE": return "Ad, Telefon Numarası ve Email geçerli değil";
        case "FE-FTP": return "Ad, Telefon Numarası ve Şifre geçerli değil";
        case "FE-FEP": return "Ad, Email ve Şifre geçerli değil";
        case "FE-LCT": return "Soyad, Şirket Adı ve Telefon Numarası geçerli değil";
        case "FE-LCE": return "Soyad, Şirket Adı ve Email geçerli değil";
        case "FE-LCP": return "Soyad, Şirket Adı ve Şifre geçerli değil";
        case "FE-LTE": return "Soyad, Telefon Numarası ve Email geçerli değil";
        case "FE-LTP": return "Soyad, Telefon Numarası ve Şifre geçerli değil";
        case "FE-LEP": return "Soyad, Email ve Şifre geçerli değil";
        case "FE-CTE": return "Şirket Adı, Telefon Numarası ve Email geçerli değil";
        case "FE-CTP": return "Şirket Adı, Telefon Numarası ve Şifre geçerli değil";
        case "FE-CEP": return "Şirket Adı, Email ve Şifre geçerli değil";
        case "FE-TEP": return "Telefon Numarası, Email ve Şifre geçerli değil";

        // with four code
        case "FE-FLCT": return "Ad, Soyad, Şirket Adı ve Telefon Numarası geçerli değil";
        case "FE-FLCE": return "Ad, Soyad, Şirket Adı ve Email geçerli değil";
        case "FE-FLCP": return "Ad, Soyad, Şirket Adı ve Şifre geçerli değil";
        case "FE-FLTE": return "Ad, Soyad, Telefon Numarası ve Email geçerli değil";
        case "FE-FLTP": return "Ad, Soyad, Telefon Numarası ve Şifre geçerli değil";
        case "FE-FLEP": return "Ad, Soyad, Email ve Şifre geçerli değil";
        case "FE-FCTE": return "Ad, Şirket Adı, Telefon Numarası ve Email geçerli değil";
        case "FE-FCTP": return "Ad, Şirket Adı, Telefon Numarası ve Şifre geçerli değil";
        case "FE-FCEP": return "Ad, Şirket Adı, Email ve Şifre geçerli değil";
        case "FE-FTEP": return "Ad, Telefon Numarası, Email ve Şifre geçerli değil";
        case "FE-LCTE": return "Soyad, Şirket Adı, Telefon Numarası ve Email geçerli değil";
        case "FE-LCTP": return "Soyad, Şirket Adı, Telefon Numarası ve Şifre geçerli değil";
        case "FE-LCEP": return "Soyad, Şirket Adı, Email ve Şifre geçerli değil";
        case "FE-LTEP": return "Soyad, Telefon Numarası, Email ve Şifre geçerli değil";
        case "FE-CTEP": return "Şirket Adı, Telefon Numarası, Email ve Şifre geçerli değil";

        // with five code
        case "FE-FLCTE": return "Ad, Soyad, Şirket Adı, Telefon Numarası ve Email geçerli değil";
        case "FE-FLCTP": return "Ad, Soyad, Şirket Adı, Telefon Numarası ve Şifre geçerli değil";
        case "FE-FLCEP": return "Ad, Soyad, Şirket Adı, Email ve Şifre geçerli değil";
        case "FE-FLTEP": return "Ad, Soyad, Telefon Numarası, Email ve Şifre geçerli değil";
        case "FE-FCTEP": return "Ad, Şirket Adı, Telefon Numarası, Email ve Şifre geçerli değil";
        case "FE-LCTEP": return "Soyad, Şirket Adı, Telefon Numarası, Email ve Şifre geçerli değil";

        // with six code
        case "FE-FLCTEP": return "Ad, Soyad, Şirket Adı, Telefon Numarası, Email ve Şifre geçerli değil";
        //#endregion

        //#region verification error codes
        case "VE-T": return "Telefon numarası Yanlış";
        case "VE-P": return "Şifre yanlış";
        //#endregion

        //#region conflict error codes
        case "CE-T": return "Girilen Telefon Numarası daha önceden kullanılmış";
        case "CE-E": return "Girilen Email daha önceden kullanılmış";
        case "CE-TE": return "Girilen Telefon Numarası ve Email daha önceden kullanılmış";
        //#endregion
    };
}

export function writeErrorMessage(responseText, resultLabelId) {
    var errorMsg = JSON.parse(responseText);
    var convertedErrorMsg = convertErrorCodeToErrorMessage(errorMsg["errorCode"]);
    updateResultLabel(convertedErrorMsg, "rgb(255, 75, 75)", resultLabelId);
}

export function updateResultLabel(message, color, resultLabelId) {
    let resultLabel = $(resultLabelId);

    //#region change color
    resultLabel.attr("style",
        `color:${color}; 
        margin-top:30px; 
        margin-bottom: 30px;`);
    //#endregion

    //#region update
    resultLabel.empty();  // reset
    resultLabel.text(message);  // add
    //#endregion
}