import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("income");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const groupTransactionsByDate = (transactions) => {
    if (filterDate) {
      transactions = transactions.filter(
        (transaction) => formatDate(transaction.date) === filterDate
      );
    }

    return transactions.reduce((groupedTransactions, transaction) => {
      const date = formatDate(transaction.date);

      if (!groupedTransactions[date]) {
        groupedTransactions[date] = [];
      }

      groupedTransactions[date].push(transaction);

      return groupedTransactions;
    }, {});
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/transactions/all-transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleDelete = async (transactionId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/transactions/delete-transaction/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove the deleted transaction from the state
      setTransactions(
        transactions.filter((transaction) => transaction._id !== transactionId)
      );
    } catch (error) {
      console.error("Error while deleting transaction:", error);
    }
  };

  const handleEdit = (transaction) => {
    // Populate the form fields with the transaction data
    setTransactionType(transaction.type);
    setDate(formatDate(transaction.date));
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setNotes(transaction.notes);

    // Store the transaction ID for updating
    setCurrentTransactionId(transaction._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      type: transactionType,
      date,
      amount: parseFloat(amount),
      category,
      notes,
    };

    try {
      if (currentTransactionId === null) {
        // Add mode
        await axios.post(
          "http://localhost:5000/api/transactions/add-transaction",
          newTransaction,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Edit mode
        await axios.put(
          `http://localhost:5000/api/transactions/update-transaction/${currentTransactionId}`,
          newTransaction,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Reset the currentTransactionId to null (add mode)
        setCurrentTransactionId(null);
      }

      // Fetch the updated transactions
      fetchTransactions();

      // Clear the form inputs
      setDate("");
      setAmount("");
      setCategory("");
      setNotes("");
    } catch (error) {
      console.error("Error while submitting transaction:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Income & Expense Tracker
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Add Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Transaction
            </button>
          </form>
        </div>
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
          <div className="overflow-x-auto">
            {Object.entries(groupTransactionsByDate(transactions)).map(
              ([date, transactionsByDate]) => (
                <div key={date}>
                  <h3 className="text-xl font-semibold mb-4">{date}</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactionsByDate.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(transaction._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
