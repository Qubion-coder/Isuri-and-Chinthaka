function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    // Get the sheet name from the request, default to 'Submissions'
    var sheetName = e.parameter.sheet;
    if (!sheetName) {
      sheetName = "Submissions";
    }

    var sheet = doc.getSheetByName(sheetName);

    // Auto-generate the sheet with proper headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      
      if (sheetName === "RSVP") {
        sheet.appendRow(["Timestamp", "Full Name", "Guests", "Dietary Notes", "Attendance"]);
        sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#f3f3f3");
      } else if (sheetName === "Wishes") {
        sheet.appendRow(["Timestamp", "Guest Name", "Message"]);
        sheet.getRange("A1:C1").setFontWeight("bold").setBackground("#f3f3f3");
      } else {
        sheet.appendRow(["Timestamp", "Data"]);
      }
      
      // Freeze the header row
      sheet.setFrozenRows(1);
    }

    // Prepare the row data based on the sheet destination
    var row = [new Date()]; // First column is always Timestamp

    if (sheetName === "RSVP") {
      row.push(e.parameter.name || "");
      row.push(e.parameter.guests || "");
      row.push(e.parameter.dietary || "");
      row.push(e.parameter.attendance || "");
    } else if (sheetName === "Wishes") {
      row.push(e.parameter.name || "");
      row.push(e.parameter.message || "");
    } else {
      row.push(JSON.stringify(e.parameter));
    }

    // Append the row to the chosen sheet
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
