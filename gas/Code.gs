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
    .openById("スプレッドシートID")
    .getSheetByName("data");

  const folder = DriveApp.getFolderById("フォルダID");

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
  if (mode && mode !== "list") {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "invalid mode" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp
    .openById("スプレッドシートID")
    .getSheetByName("data");

  const values = sheet.getDataRange().getValues();
  const rows = values.length > 1 ? values.slice(1) : [];
  const photos = rows.map(row => ({
    lat: Number(row[1]),
    lng: Number(row[2]),
    tag: row[3],
    imageUrl: row[4],
    comment: row[5],
    fileId: row[6] || ""
  })).filter(photo => !Number.isNaN(photo.lat) && !Number.isNaN(photo.lng));

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", photos }))
    .setMimeType(ContentService.MimeType.JSON);
}
