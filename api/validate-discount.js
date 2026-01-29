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

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ 
      error: 'Discount code is required', 
      valid: false 
    });
  }

  const codeUpper = code.trim().toUpperCase();
  
  // Get 25% discount codes (support multiple codes separated by comma)
  const discount25Codes = process.env.DISCOUNT_CODE_25 ? 
    process.env.DISCOUNT_CODE_25.split(',').map(c => c.trim().toUpperCase()) : 
    ['JAN2026'];
  
  if (discount25Codes.includes(codeUpper)) {
    return res.status(200).json({ 
      valid: true,
      discount: 0.25,
      originalPrice: 400,
      discountedPrice: 300,
      savings: 100,
      message: 'Discount code applied! 25% OFF'
    });
  }
  
  // Get $225 discount codes (support multiple codes separated by comma)
  const discount225Codes = process.env.DISCOUNT_CODE_225 ? 
    process.env.DISCOUNT_CODE_225.split(',').map(c => c.trim().toUpperCase()) : 
    ['SPECIAL225'];
  
  if (discount225Codes.includes(codeUpper)) {
    return res.status(200).json({ 
      valid: true,
      discount: 0.4375,
      originalPrice: 400,
      discountedPrice: 225,
      savings: 175,
      message: 'Special discount applied! Save $175'
    });
  }

  return res.status(200).json({ 
    valid: false,
    message: 'Invalid discount code'
  });
}