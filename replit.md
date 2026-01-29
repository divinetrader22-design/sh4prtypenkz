# Dasha Trading - Elite Trading Hub

## Overview
A web application for accessing exclusive trading signals, premium tools, and elite community resources. Built with Node.js/Express backend and vanilla JavaScript frontend with Tailwind CSS.

## Project Structure
```
├── server.js           # Express server that serves static files and API routes
├── index.html          # Main frontend (single-page application)
├── api/                # API handlers (Vercel-style serverless functions)
│   ├── get-wallet.js       # Returns random Solana wallet from configured list
│   ├── send-key.js         # Handles key delivery to email
│   ├── validate-discount.js # Validates discount codes
│   ├── validate-key.js     # Validates access keys
│   ├── verify-password.js  # Verifies purchase passwords
│   └── verify-payment.js   # Verifies Solana USDC payments
├── package.json        # Node.js dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── postcss.config.js   # PostCSS configuration
```

## Technology Stack
- **Backend**: Node.js 20, Express 5
- **Frontend**: Vanilla JavaScript, Tailwind CSS (CDN)
- **Blockchain**: @solana/web3.js for payment verification

## Environment Variables Required
- `PURCHASE_PASSWORDS` - Comma-separated list of valid purchase passwords
- `SOLANA_WALLETS` - Comma-separated list of Solana wallet addresses for payments
- `VALID_KEYS` - Comma-separated list of valid access keys
- `DISCOUNT_CODE_25` - Comma-separated 25% discount codes (default: DECEMBER2525)
- `DISCOUNT_CODE_225` - Comma-separated $225 discount codes (default: SPECIAL225)
- `SOLANA_RPC_URL` - Solana RPC endpoint (default: mainnet-beta)
- `KEY_PREFIX` - Prefix for generated keys (default: adminonly0997)

## Running the Application
- **Development**: `npm run dev` - Runs Express server on port 5000
- **Production**: `npm start` - Same as dev

## Architecture Notes
- Originally designed for Vercel serverless deployment
- Adapted to Express server for Replit compatibility
- API handlers use Vercel-style `handler(req, res)` signature
- Static files served from project root
