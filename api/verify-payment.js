import { Connection, PublicKey } from '@solana/web3.js';

const USDC_MINT = process.env.USDC_MINT_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDC_DECIMALS = parseInt(process.env.USDC_DECIMALS || '6');

export default async function handler(req, res) {
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

  const { txId, walletAddress } = req.body;

  if (!txId || !walletAddress) {
    return res.status(400).json({ 
      error: 'Transaction ID and wallet address required',
      verified: false 
    });
  }

  try {
    // Validate transaction ID format
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;
    
    if (!base58Regex.test(txId)) {
      return res.status(400).json({ 
        error: 'Invalid transaction format',
        verified: false 
      });
    }

    // Connect to Solana mainnet
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    // Fetch the transaction
    const transaction = await connection.getTransaction(txId, {
      maxSupportedTransactionVersion: 0
    });

    if (!transaction) {
      return res.status(400).json({ 
        error: 'Transaction not found or not confirmed yet',
        verified: false 
      });
    }

    // Check if transaction was successful
    if (transaction.meta?.err) {
      return res.status(400).json({ 
        error: 'Transaction failed on blockchain',
        verified: false 
      });
    }

    // Validate the recipient wallet address
    const recipientPubkey = new PublicKey(walletAddress);
    
    // Parse transaction to find USDC transfers
    let usdcTransferred = 0;
    let correctRecipient = false;

    // Check pre and post token balances
    const preBalances = transaction.meta?.preTokenBalances || [];
    const postBalances = transaction.meta?.postTokenBalances || [];

    // Find USDC token transfers to our wallet
    for (const postBalance of postBalances) {
      if (postBalance.mint === USDC_MINT && postBalance.owner === walletAddress) {
        // Find corresponding pre-balance
        const preBalance = preBalances.find(
          pre => pre.accountIndex === postBalance.accountIndex
        );

        const preAmount = preBalance?.uiTokenAmount?.amount || '0';
        const postAmount = postBalance?.uiTokenAmount?.amount || '0';

        const difference = BigInt(postAmount) - BigInt(preAmount);
        
        if (difference > 0) {
          correctRecipient = true;
          usdcTransferred += Number(difference) / Math.pow(10, USDC_DECIMALS);
        }
      }
    }

    // Verify the amount and recipient
    if (!correctRecipient) {
      return res.status(400).json({ 
        error: 'Payment was not sent to the correct wallet address',
        verified: false 
      });
    }

    const minAmountString = process.env.MIN_AMOUNT_USDC || '399';
    const minAmount = parseFloat(minAmountString);

    if (usdcTransferred < minAmount) {
      return res.status(400).json({ 
        error: `Insufficient payment amount. Required: ${minAmount} USDC, Received: ${usdcTransferred.toFixed(2)} USDC`,
        verified: false,
        amountReceived: usdcTransferred.toFixed(2)
      });
    }

    // Generate a unique key with default prefix
    const generatedKey = generateKey();

    return res.status(200).json({ 
      verified: true,
      key: generatedKey,
      message: 'Payment verified successfully',
      amountReceived: usdcTransferred.toFixed(2)
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    // Handle specific errors
    if (error.message.includes('Invalid public key')) {
      return res.status(400).json({ 
        error: 'Invalid wallet address format',
        verified: false 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to verify transaction',
      verified: false,
      details: error.message
    });
  }
}

function generateKey() {
  // Default prefix from environment variable or use 'adminonly0997'
  const prefix = process.env.KEY_PREFIX || 'adminonly0997';
  const chars = '0123456789';
  let suffix = '';
  
  // Generate random suffix based on remaining length needed
  const suffixLength = 11 - prefix.length;
  for (let i = 0; i < suffixLength; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return prefix + suffix;
}