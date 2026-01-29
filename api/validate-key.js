export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'Key is required', valid: false });
  }

  const validKeys = process.env.VALID_KEYS ? process.env.VALID_KEYS.split(',') : [];
  const isValid = validKeys.includes(key.trim());

  return res.status(200).json({ 
    valid: isValid,
    message: isValid ? 'Key verified' : 'Invalid key'
  });
}