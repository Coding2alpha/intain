// routes/orders.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { amount, currency = "INR", receipt = "receipt#1" } = req.body;

  try {
    const orderRes = await axios.post(
      "https://api.razorpay.com/v1/orders",
      {
        amount, // in paise, so 5000 = ₹50
        currency,
        receipt,
        payment_capture: 1,
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );
    res.json(orderRes.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
