import { getDateTimeInString } from "./miar_tools.js";

//#region variables
export const langPack_sendererInfosTable = {
    "TR": {
        "title": "Gönderen",
        "firstName": "Ad",
        "lastName": "Soyad",
        "email": "Email",
        "phone": "Telefon",
        "company": "Şirket",
        "cityName": "Şehir",
        "county": "İlçe",
        "createdAt": "Oluşturulma Tarihi"
    },
    "EN": {
        "title": "Senderer",
        "firstName": "Firstname",
        "lastName": "Lastname",
        "email": "Email",
        "phone": "Phone",
        "company": "Company",
        "cityName": "City",
        "county": "County",
        "createdAt": "Created Date"
    }
};
export const langPack_answererInfosTable = {
    "TR": {
        "title": "Cevaplayan",
        "firstName": "Ad",
        "lastName": "Soyad",
        "email": "Email",
        "answeredDate": "Cevaplanma Tarihi"
    },
    "EN": {
        "title": "Answerer",
        "firstName": "Firstname",
        "lastName": "Lastname",
        "email": "Email",
        "answeredDate": "Answered Date"
    }
};
//#endregion

//#region functions
export async function addSendererInfosToFormAsync(
    tbl_sendererInfos,
    langPack_sendererInfosTable,
    sendererInfos,
) {
    //#region add senderer table title
    tbl_sendererInfos.children("thead")
        .append(`
            <tr>
                <th colspan=3;  style="text-align:center">${langPack_sendererInfosTable.title}</th>
            </tr>`
        );
    //#endregion

    //#region populate senderer table
    tbl_sendererInfos.children("tbody")
        .append(`
                <tr>
                    <td>${langPack_sendererInfosTable.firstName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.firstName}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.lastName}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.lastName}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.phone}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.phone}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.email}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.email}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.company}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.company}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.cityName}</td>
                    <td class="langPack_sendererInfosTable"></td>
                    <td>${sendererInfos.cityName}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.county}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${sendererInfos.county}</td>
                </tr>
                <tr>
                    <td>${langPack_sendererInfosTable.createdAt}</td>
                    <td class="td_spaceAfterKey"></td>
                    <td>${getDateTimeInString(sendererInfos.createdAt)}</td >
                </tr>`
        );
    //#endregion
}

export async function addAnswererInfosToFormAsync(
    tbl_answererInfos,
    langPack_answererInfosTable,
    answererInfos = null
) {
    //#region add answerer table title
    tbl_answererInfos.children("thead")
        .append(`
            <tr>
                <th colspan=3  style="text-align:center">${langPack_answererInfosTable.title}</th>
            </tr>`
        );
    //#endregion

    //#region populate answerer table
    tbl_answererInfos.children("tbody")
        .append(`
            <tr>
                <td>${langPack_answererInfosTable.firstName}</td>
                <td class="td_spaceAfterKey"></td>
                <td>${answererInfos.answererFirstName}</td>
            </tr>
            <tr>
                <td>${langPack_answererInfosTable.lastName}</td>
                <td class="td_spaceAfterKey"></td>
                <td>${answererInfos.answererLastName}</td>
            </tr>
            <tr>
                <td>${langPack_answererInfosTable.email}</td>
                <td class="td_spaceAfterKey"></td>
                <td>${answererInfos.answererEmail}</td>
            </tr>
            <tr>
                <td>${langPack_answererInfosTable.answeredDate}</td>
                <td class="td_spaceAfterKey"></td>
                <td>${getDateTimeInString(answererInfos.answeredDate)}</td >
            </tr>`
        );
    //#endregion
}

export async function resetFormDetailsPageAsync(
    div_sendererInfos,
    div_answererInfos
) {
    // remove sender infos
    div_sendererInfos.find("thead").empty();
    div_sendererInfos.find("tbody").empty();

    // remove answerer infos
    div_answererInfos.find("thead").empty();
    div_answererInfos.find("tbody").empty();

    // remove form titles and contents
    $(".td_content_title").empty();
    $(".td_content_message").empty();

    // show form buttons
    $("#div_buttons button").removeAttr("disabled");
}
//#endregion