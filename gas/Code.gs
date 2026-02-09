const SPREADSHEET_ID = "スプレッドシートID";
const FOLDER_ID = "フォルダID";

function doPost(e) {
  let data = {};
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      data = {};
    }
  }

  if (!data || Object.keys(data).length === 0) {
    data = {
      lat: e.parameter.lat,
      lng: e.parameter.lng,
      tag: e.parameter.tag,
      comment: e.parameter.comment,
      image: e.parameter.image
    };
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("data");

  const folder = DriveApp.getFolderById(FOLDER_ID);

  const bytes = Utilities.base64Decode(data.image);
  const blob = Utilities.newBlob(
    bytes,
    "image/jpeg",
    `photo_${Date.now()}.jpg`
  );

  const file = folder.createFile(blob);
  file.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );

  sheet.appendRow([
    new Date(),
    data.lat,
    data.lng,
    data.tag,
    file.getUrl(),
    data.comment || "",
    file.getId()
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const mode = e && e.parameter ? e.parameter.mode : null;
  const callback = e && e.parameter ? e.parameter.callback : null;
  if (mode && mode !== "list" && mode !== "tags") {
    return createJsonpResponse(
      { status: "error", message: "invalid mode" },
      callback
    );
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName("data");

  const values = sheet.getDataRange().getValues();
  const rows = values.length > 1 ? values.slice(1) : [];
  if (mode === "tags") {
    const tags = Array.from(new Set(
      rows
        .map(row => String(row[3] || "").trim())
        .filter(tag => tag)
    ));
    return createJsonpResponse({ status: "ok", tags }, callback);
  }

  const photos = rows.map(row => ({
    lat: Number(row[1]),
    lng: Number(row[2]),
    tag: row[3],
    imageUrl: row[4],
    comment: row[5],
    fileId: row[6] || ""
  })).filter(photo => !Number.isNaN(photo.lat) && !Number.isNaN(photo.lng));

  return createJsonpResponse({ status: "ok", photos }, callback);
}

function createJsonpResponse(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
