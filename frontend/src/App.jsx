import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(""); 

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/transactions");
    setTxns(res.data);
    setLoading(false);
  };

  const importTransactions = async () => {
    setLoading(true);
    await axios.get("http://localhost:5000/api/transactions/import");
    await fetchData();
  };

  const simulatePayment = async () => {
    const storeName = prompt("Enter store name:", "Test Store");
    const description = prompt(
      "Enter transaction description:",
      "Test Transaction"
    );
    const name = prompt("Enter your name:", "Om Thakur");
    const email = prompt("Enter your email:", "om@example.com");
    const contact = prompt("Enter your contact number:", "9999999999");
    const amountInput = prompt("Enter amount in ₹ (e.g. 50):", "50");

    const amount = Math.round(Number(amountInput) * 100);
    if (
      !storeName ||
      !description ||
      !name ||
      !email ||
      !contact ||
      isNaN(amount) ||
      amount <= 0
    ) {
      alert("Please enter valid details and amount.");
      return;
    }

    const { data: order } = await axios.post(
      "http://localhost:5000/api/orders",
      {
        amount, 
      }
    );

    const options = {
      key: "rzp_test_o9hq2KicqU6ufF",
      amount: order.amount,
      currency: order.currency,
      name: storeName,
      description: description,
      order_id: order.id,
      handler: function (response) {
        alert("Payment simulated successfully!");
      },
      prefill: {
        name,
        email,
        contact,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTxns = categoryFilter
    ? txns.filter((t) =>
        t.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    : txns;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transaction Dashboard</h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={simulatePayment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Simulate Payment
        </button>
        <button
          onClick={importTransactions}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Import Transactions
        </button>
        <input
          type="text"
          placeholder="Search by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-2 py-1 rounded ml-4"
        />
      </div>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Merchant</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : (
            filteredTxns.map((t) => (
              <tr key={t._id}>
                <td className="border px-4 py-2">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{t.merchant_name}</td>
                <td className="border px-4 py-2">{t.category}</td>
                <td className="border px-4 py-2">₹{t.amount / 100}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default App;