# Google Sheets setup (RSVP + Wishes)

1. Open the sheet: https://docs.google.com/spreadsheets/d/1fDiCg1tXBTmHxU04JG1UFO0tvb78RgRs8K3vYOHp2CA
2. Extensions > Apps Script. Replace the contents of `Code.gs` with `code.ts` from the project root.
3. (Optional) Select `setupSheets` and click Run to create the `RSVP` and `Wishes` tabs now.
   Otherwise they are created automatically, with headers, on the first submission.
4. Deploy > New deployment > type **Web app**. Execute as: **Me**. Who has access: **Anyone**.
5. Copy the Web App URL (ends in `/exec`).
6. Paste the URL into `SCRIPT_URL` in `src/weddingConfig.ts` (currently hard-coded).

If you edit the script later, use Deploy > Manage deployments > Edit > New version (keeps the same URL).
