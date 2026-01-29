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

  const { email, key } = req.body;

  if (!email || !key) {
    return res.status(400).json({ 
      error: 'Email and key required',
      sent: false 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format',
      sent: false 
    });
  }

  try {
    console.log(`Key ${key} would be sent to ${email}`);

    return res.status(200).json({ 
      sent: true,
      message: 'Key sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Send error:', error);
    return res.status(500).json({ 
      error: 'Failed to send key',
      sent: false 
    });
  }
}