// Vercel Serverless Function: accept survey submissions and store them in the repository
// Requires these environment variables to be set on Vercel:
// GITHUB_TOKEN - a personal access token with repo contents scope
// GITHUB_REPO - repository in form owner/repo (example: Smrsiz/studyflow-ai-survery)

const API_BASE = 'https://api.github.com';

async function getFile(ownerRepo, path, token){
  const url = `${API_BASE}/repos/${ownerRepo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
  if(res.status === 200){
    return await res.json();
  }
  if(res.status === 404) return null;
  const txt = await res.text();
  throw new Error(`GitHub getFile failed: ${res.status} ${txt}`);
}

async function putFile(ownerRepo, path, token, contentBuffer, message, sha){
  const url = `${API_BASE}/repos/${ownerRepo}/contents/${encodeURIComponent(path)}`;
  const body = { message, content: contentBuffer.toString('base64') };
  if(sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error(`GitHub putFile failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.GITHUB_TOKEN;
  const ownerRepo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_SUBMISSIONS_PATH || 'submissions.json';
  if(!token || !ownerRepo) return res.status(500).json({ error: 'Server not configured (missing env vars)' });

  let payload = req.body;
  if(!payload || Object.keys(payload).length === 0){
    // Try to parse JSON body (when raw body arrives)
    try{ payload = JSON.parse(req.rawBody || '{}'); }catch(e){ payload = {} }
  }

  const entry = Object.assign({ ts: new Date().toISOString() }, payload);

  try{
    const file = await getFile(ownerRepo, path, token);
    let arr = [];
    let sha = null;
    if(file && file.content){
      const decoded = Buffer.from(file.content, 'base64').toString('utf8');
      try{ arr = JSON.parse(decoded) }catch(e){ arr = [] }
      sha = file.sha;
    }
    arr.push(entry);
    const newContent = Buffer.from(JSON.stringify(arr, null, 2), 'utf8');
    await putFile(ownerRepo, path, token, newContent, `Add submission ${entry.ts}`, sha);
    return res.status(200).json({ ok: true });
  }catch(err){
    console.error('submit error', err);
    return res.status(500).json({ error: String(err) });
  }
}
