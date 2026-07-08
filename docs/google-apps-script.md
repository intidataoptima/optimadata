# Google Apps Script sample: save registration and upload image to Drive + Sheets

This script receives a POST request with JSON payload:
{
  fields: { nama:..., wa:..., ... },
  image: "data:image/png;base64,iVBORw..."  // optional dataURL
}

It saves the image to Google Drive (if provided) and appends a row to a Google Sheet. It returns JSON { success: true, fileUrl: 'https://...' }

Instructions:
- Create a new Google Apps Script project.
- Replace `YOUR_SHEET_ID` with your Google Sheet ID.
- Deploy as Web App (Execute as: Me; Who has access: Anyone, even anonymous) — note: opening to anonymous is required for public form submission or use OAuth.

Code (Apps Script):

```javascript
const SHEET_ID = 'YOUR_SHEET_ID';
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const fields = body.fields || {};
    const imageData = body.image || null; // data URL

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];

    let fileUrl = '';
    if (imageData) {
      // imageData like "data:image/png;base64,XXXXX"
      const parts = imageData.split(',');
      const meta = parts[0];
      const data = parts[1];
      const contentType = meta.match(/data:(.*);base64/)[1];
      const blob = Utilities.newBlob(Utilities.base64Decode(data), contentType, 'ktp-' + Date.now());
      const file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    // append row to sheet (adjust columns as you like)
    const row = [ new Date(), fields.nama || '', fields.wa || '', fields.email || '', fields.jl || '', fields.kecamatan || '', fields.wilayah || '', fields.paket || '', fileUrl || '' ];
    sheet.appendRow(row);

    return ContentService
+      .createTextOutput(JSON.stringify({ success: true, fileUrl: fileUrl }))
+      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Notes:
- Allowing anonymous access reduces security — consider restricting access and using a server with authentication for production.
- This simple flow stores uploaded KTP images in Drive and the sheet row contains the file URL.
- Make sure your Google account has Drive API enabled if necessary.

After deploying, copy the Web App URL and paste it into `assets/js/registrasi.js` as `backendEndpoint`.
