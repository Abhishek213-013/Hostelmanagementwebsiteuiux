import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SSLCOMMERZ_STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'your_store_id';
const SSLCOMMERZ_STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'your_store_password';
const SSLCOMMERZ_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://securepay.sslcommerz.com'
  : 'https://sandbox.sslcommerz.com';

app.post('/api/payment/initiate', async (req, res) => {
  try {
    const {
      total_amount,
      currency,
      tran_id,
      success_url,
      fail_url,
      cancel_url,
      cus_name,
      cus_email,
      cus_phone,
      cus_add1,
      cus_city,
      cus_country,
      shipping_method,
      product_name,
      product_category,
      product_profile,
      room_id,
      check_in,
      check_out,
      guests
    } = req.body;

    const data = new URLSearchParams();
    data.append('store_id', SSLCOMMERZ_STORE_ID);
    data.append('store_passwd', SSLCOMMERZ_STORE_PASSWORD);
    data.append('total_amount', total_amount.toString());
    data.append('currency', currency);
    data.append('tran_id', tran_id);
    data.append('success_url', success_url);
    data.append('fail_url', fail_url);
    data.append('cancel_url', cancel_url);
    data.append('emi_option', '0');
    data.append('cus_name', cus_name);
    data.append('cus_email', cus_email);
    data.append('cus_phone', cus_phone);
    data.append('cus_add1', cus_add1);
    data.append('cus_city', cus_city);
    data.append('cus_country', cus_country);
    data.append('shipping_method', shipping_method);
    data.append('product_name', product_name);
    data.append('product_category', product_category);
    data.append('product_profile', product_profile);
    data.append('value_a', room_id?.toString() || '');
    data.append('value_b', check_in || '');
    data.append('value_c', check_out || '');
    data.append('value_d', guests?.toString() || '');

    const response = await fetch(`${SSLCOMMERZ_BASE_URL}/gwprocess/v3/api.php`, {
      method: 'POST',
      body: data
    });

    const result = await response.json();

    if (result.status === 'SUCCESS') {
      res.json({ GatewayPageURL: result.GatewayPageURL });
    } else {
      res.status(400).json({ error: 'Payment initiation failed', details: result });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/payment/success', (req, res) => {
  const { tran_id, val_id } = req.body;
  console.log('Payment Success:', { tran_id, val_id });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking?status=success&tran_id=${tran_id}`);
});

app.post('/api/payment/fail', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking?status=failed`);
});

app.post('/api/payment/cancel', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking?status=canceled`);
});

app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
