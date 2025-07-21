const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { fetchTransactions } = require("../services/razorpayService");
const { enrichMerchant } = require("../services/googlePlacesService");
const { categorize } = require("../services/categorizeService");

router.get("/import", async (req, res) => {
  const txns = await fetchTransactions();
  const enriched = [];
  for (let txn of txns) {
    console.log("Processing transaction:", txn);
    const place = await enrichMerchant(
      txn.description || txn.notes?.merchant_name || ""
    );
    const category = categorize(place?.types);
    const saved = await Transaction.create({
      razorpay_id: txn.id,
      amount: txn.amount,
      currency: txn.currency,
      method: txn.method,
      status: txn.status,
      description: txn.description,
      created_at: new Date(txn.created_at * 1000),
      merchant_name: place?.name,
      category,
      location: place?.geometry?.location,
    });
    enriched.push(saved);
  }
  res.json({ count: enriched.length });
});

router.get("/", async (req, res) => {
  const txns = await Transaction.find().sort({ created_at: -1 });
  res.json(txns);
});

module.exports = router;
