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

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required', valid: false });
  }

  // Get valid purchase passwords from environment variable
  const validPasswords = process.env.PURCHASE_PASSWORDS ? 
    process.env.PURCHASE_PASSWORDS.split(',').map(p => p.trim()) : 
    ['adminonly0997'];
  
  const isValid = validPasswords.includes(password.trim());

  return res.status(200).json({ 
    valid: isValid,
    message: isValid ? 'Access granted' : 'Invalid password'
  });
}