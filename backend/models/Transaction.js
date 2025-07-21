const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  razorpay_id: String,
  amount: Number,
  currency: String,
  method: String,
  status: String,
  description: String,
  created_at: Date,
  merchant_name: String,
  category: String,
  location: Object,
});
module.exports = mongoose.model("Transaction", transactionSchema);
