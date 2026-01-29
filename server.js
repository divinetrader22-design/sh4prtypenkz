import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

import getWalletHandler from './api/get-wallet.js';
import sendKeyHandler from './api/send-key.js';
import validateDiscountHandler from './api/validate-discount.js';
import validateKeyHandler from './api/validate-key.js';
import verifyPasswordHandler from './api/verify-password.js';
import verifyPaymentHandler from './api/verify-payment.js';

function createReqRes(req, res) {
  const mockReq = {
    method: req.method,
    body: req.body,
    query: req.query,
    headers: req.headers
  };
  
  const mockRes = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
      res.setHeader(key, value);
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      res.status(this.statusCode).json(data);
      return this;
    },
    end() {
      res.status(this.statusCode).end();
      return this;
    }
  };
  
  return { mockReq, mockRes };
}

app.all('/api/get-wallet', (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  getWalletHandler(mockReq, mockRes);
});

app.all('/api/send-key', (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  sendKeyHandler(mockReq, mockRes);
});

app.all('/api/validate-discount', (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  validateDiscountHandler(mockReq, mockRes);
});

app.all('/api/validate-key', (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  validateKeyHandler(mockReq, mockRes);
});

app.all('/api/verify-password', (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  verifyPasswordHandler(mockReq, mockRes);
});

app.all('/api/verify-payment', async (req, res) => {
  const { mockReq, mockRes } = createReqRes(req, res);
  await verifyPaymentHandler(mockReq, mockRes);
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
