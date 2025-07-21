const axios = require("axios");
exports.fetchTransactions = async () => {
  const res = await axios.get("https://api.razorpay.com/v1/payments", {
    auth: {
      username: process.env.RAZORPAY_KEY_ID,
      password: process.env.RAZORPAY_KEY_SECRET,
    },
  });
  return res.data.items;
};
