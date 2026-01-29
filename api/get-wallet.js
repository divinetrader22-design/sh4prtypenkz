export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const walletsString = process.env.SOLANA_WALLETS || '';
  const wallets = walletsString.split(',').filter(w => w.trim());

  if (wallets.length === 0) {
    return res.status(500).json({ 
      error: 'No wallets configured' 
    });
  }

  const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];

  return res.status(200).json({ 
    wallet: randomWallet.trim()
  });
}