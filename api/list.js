// Vercel Serverless Function: return stored submissions (reads submissions.json in the repo)
// Protected by ADMIN_SECRET environment variable (set same value on client requests)

const API_BASE = 'https://api.github.com';

async function getFile(ownerRepo, path, token){
  const url = `${API_BASE}/repos/${ownerRepo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } });
  if(res.status === 200) return await res.json();
  if(res.status === 404) return null;
  const txt = await res.text();
  throw new Error(`GitHub getFile failed: ${res.status} ${txt}`);
}

export default async function handler(req, res){
  if(req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const secret = req.headers['x-admin-secret'] || req.query.secret;
  if(!secret || secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const token = process.env.GITHUB_TOKEN;
  const ownerRepo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_SUBMISSIONS_PATH || 'submissions.json';
  if(!token || !ownerRepo) return res.status(500).json({ error: 'Server not configured (missing env vars)' });

  try{
    const file = await getFile(ownerRepo, path, token);
    if(!file || !file.content) return res.status(200).json([]);
    const decoded = Buffer.from(file.content, 'base64').toString('utf8');
    const arr = JSON.parse(decoded);
    return res.status(200).json(arr);
  }catch(err){
    console.error('list error', err);
    return res.status(500).json({ error: String(err) });
  }
}
