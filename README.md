# StudyFlow Survey (static)

This folder contains `studyflow-survey.html` — a self-contained static survey page that stores responses in the browser's localStorage and includes a small admin panel (`?admin=1`) to download responses as CSV.

What I prepared for you

- `studyflow-survey.html` — complete, single-file static survey page.
- `.gitignore` — ignores common OS, editor, and deployment artifacts.

Quick local test

1. Open the file directly in your browser (quick):
   - Double-click `studyflow-survey.html` or run in PowerShell:
     ```powershell
     cd 'C:\Users\siz\Downloads\survey'
     start .\studyflow-survey.html
     ```
   - To open the admin panel: add `?admin=1` to the URL (e.g., `file:///C:/.../studyflow-survey.html?admin=1`).

2. Recommended: serve with a local static server (behaves more like deployed):
   ```powershell
   cd 'C:\Users\siz\Downloads\survey'
   python -m http.server 8000
   # then open http://localhost:8000/studyflow-survey.html
   ```

How to push this folder to GitHub (example)

1. Create a repo on GitHub (e.g., `studyflow-survey`).
2. In PowerShell from this folder, run:
   ```powershell
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```

Deploy to Vercel

- Option A (dashboard): Import the GitHub repo in Vercel and deploy (static site — no build step required).
- Option B (CLI): From this folder:
  ```powershell
  npm i -g vercel
  vercel --prod
  ```

Notes

- Responses are saved per visitor in `localStorage` under key `studyflowResponses_v1`.
- Admin panel visible when visiting the page with `?admin=1` (useful to download CSVs from the browser that previously submitted responses).
- If you want centralized server-side collection, I can add a Vercel Serverless Function (or connect Google Sheets/Airtable) in a follow-up.
