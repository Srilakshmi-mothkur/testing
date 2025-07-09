// ✅ utils/sendNotification.js
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
  } catch (err) {
    console.error('❌ SMS Error:', err.message);
  }
};

const sendWhatsApp = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
    });
  } catch (err) {
    console.error('❌ WhatsApp Error:', err.message);
  }
};

module.exports = { sendSMS, sendWhatsApp };
