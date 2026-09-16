/**
 * 1. 在 Google Sheet 内：扩展功能 > Apps Script。
 * 2. 贴上此代码，并把 SHEET_ID 换成该 Sheet 网址中 /d/ 和 /edit 之间的文字。
 * 3. 部署 > 新部署 > 网页应用程式；存取权限选「所有人」。
 * 4. 把部署网址贴入 quiz-flow.js 的 GOOGLE_SHEET_WEB_APP_URL。
 */
const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const TAB_NAME = '答题记录';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME)
    || SpreadsheetApp.openById(SHEET_ID).insertSheet(TAB_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['提交时间', '年级', '学生姓名', '就读学校', '手机号码', '答对题数', '总题数', '学费回扣 (RM)']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([data.submittedAt, data.grade, data.name, data.school, data.phone, data.score, data.totalQuestions, data.rebate]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
