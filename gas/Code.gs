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
    data.comment || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
