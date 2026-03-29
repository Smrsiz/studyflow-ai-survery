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
 - Responses are saved per visitor in `localStorage` under key `studyflowResponses_v1`.
 - Admin panel visible when visiting the page with `?admin=1` (useful to download CSVs from the browser that previously submitted responses).

Server-side submissions (optional)

I added two Vercel Serverless Functions in the `api/` folder to enable centralized submissions and an admin list:

- `api/submit` (POST): accepts a submission JSON and appends it to `submissions.json` in the repository using the GitHub Contents API.
- `api/list` (GET): returns the list of submissions from `submissions.json` (protected by an admin secret).

How it works & required environment variables

1. Set these environment variables in your Vercel project (Project Settings -> Environment Variables):

   - `GITHUB_TOKEN` — a GitHub Personal Access Token with `repo` (contents) scope.
   - `GITHUB_REPO` — the repo where submissions will be stored, e.g. `Smrsiz/studyflow-ai-survery`.
   - `ADMIN_SECRET` — a random secret string used to protect the admin `api/list` endpoint.

2. The serverless function will create or update `submissions.json` in the repository root. The client will attempt to POST to `/api/submit` automatically; if it fails the response is still kept in localStorage.

3. To view centralized responses after deploying, browse:

   `https://<your-vercel-domain>/studyflow-survey.html?admin=1`

   The admin panel will try to use the `/api/list` endpoint (it will request the secret). For security you should configure the admin UI to call `/api/list?secret=<ADMIN_SECRET>` or set the secret via an admin-only UI (the current simple approach expects manual fetch with the secret stored by you in a secure place).

Security notes

- The `api/submit` endpoint requires `GITHUB_TOKEN` and will write to the repo specified by `GITHUB_REPO`. Keep the token secret and scoped minimally.
- `api/list` requires `ADMIN_SECRET`. Do not expose it publicly.

Next steps to deploy (summary)

1. Set environment variables on Vercel for the project.
2. Deploy via Vercel dashboard or `vercel --prod` from this folder.
3. Open the survey with `?admin=1` and use the admin secret to fetch centralized submissions.

If you'd like, I can push these changes and then help you deploy — you'll need to add the two environment variables and the admin secret in your Vercel project before testing remote submissions.
