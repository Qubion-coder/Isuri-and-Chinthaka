// @ts-nocheck
/**
 * Isuri & Chinthaka — Wedding RSVP + Wishes backend (Google Apps Script)
 *
 * Paste this whole file into Extensions > Apps Script (Code.gs) of the sheet:
 * https://docs.google.com/spreadsheets/d/1fDiCg1tXBTmHxU04JG1UFO0tvb78RgRs8K3vYOHp2CA
 *
 * The "RSVP" and "Wishes" tabs are created automatically with headers on first use.
 * Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
 */

var SPREADSHEET_ID = '1fDiCg1tXBTmHxU04JG1UFO0tvb78RgRs8K3vYOHp2CA';

var SHEETS = {
  RSVP: {
    headers: ['Timestamp', 'Full Name', 'Guests', 'Attendance', 'Dietary Notes', 'Invited As'],
    toRow: function (p) {
      return [new Date(), p.name || '', p.guests || '', p.attendance || '', p.dietary || '', p.invitedAs || ''];
    },
  },
  Wishes: {
    headers: ['Timestamp', 'Guest Name', 'Message'],
    toRow: function (p) {
      return [new Date(), p.name || '', p.message || ''];
    },
  },
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var params = parseParams_(e);
    var config = SHEETS[params.sheet];
    if (!config) {
      return json_({ ok: false, error: 'Unknown sheet. Use "RSVP" or "Wishes".' });
    }

    var sheet = getOrCreateSheet_(params.sheet);
    sheet.appendRow(config.toRow(params));

    return json_({ ok: true, row: sheet.getLastRow() });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Health check: open the Web App URL in a browser to confirm it is running.
function doGet() {
  return json_({ ok: true, message: 'Isuri & Chinthaka wedding endpoint is running.' });
}

function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  // Add headers if the sheet is new or was emptied.
  if (sheet.getLastRow() === 0) {
    var headers = SHEETS[name].headers;
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#6b1d2a')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

function parseParams_(e) {
  var params = (e && e.parameter) || {};
  if (Object.keys(params).length > 0) return params;

  // Fallback for JSON bodies.
  var contents = e && e.postData && e.postData.contents;
  if (!contents) return {};
  try {
    return JSON.parse(contents);
  } catch (_err) {
    return {};
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// Optional: run once from the Apps Script editor to create both tabs right away.
function setupSheets() {
  Object.keys(SHEETS).forEach(getOrCreateSheet_);
}
