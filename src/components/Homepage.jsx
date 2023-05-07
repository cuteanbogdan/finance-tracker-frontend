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
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [editableBalance, setEditableBalance] = useState(summary.balance);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];

  const categories = [
    "Groceries",
    "Rent",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Healthcare",
    "Others",
  ];
  const updateBalanceAndSummary = (transactionsData) => {
    setTransactions(transactionsData.transactions);
    setSummary(transactionsData.summary);
    setEditableBalance(transactionsData.summary.balance);
  };
  const handleCurrencyChange = (e) => {
    updateCurrency(e.target.value);
    setSelectedCurrency(e.target.value);
    fetchTransactions();
  };

  const updateCurrency = async (newCurrency) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/transactions/update-currency",
        {
          newCurrency,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Currency updated successfully");
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error updating currency:", error);
      // Handle the error, such as displaying an error message to the user
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };
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
      updateBalanceAndSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedCurrency]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/transactions/update-balance",
        { balance: parseFloat(editableBalance) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Fetch the updated transactions and summary data
      fetchTransactions();
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  // Update editableBalance when summary is updated
  useEffect(() => {
    setEditableBalance(summary.balance);
  }, [summary]);

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
  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
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
          <h2 className="text-2xl font-semibold mb-6">Update Balance</h2>
          <form onSubmit={handleBalanceSubmit}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editableBalance}
              onChange={(e) => setEditableBalance(e.target.value)}
              placeholder="Edit Balance"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mt-4"
              required
            />
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Balance
            </button>
          </form>
          <form>
            <div className="mt-4">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <br />
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Category</option>
                {categories.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
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
          <div className="mb-4">
            <label
              htmlFor="filterDate"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Date
            </label>
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={handleFilterDateChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Total Income</h3>
                <p>{formatCurrency(summary.income, selectedCurrency)}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                <p>{formatCurrency(summary.expenses, selectedCurrency)}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Balance</h3>
                <p>{formatCurrency(summary.balance, selectedCurrency)}</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
          <div className="overflow-x-auto">
            {Object.entries(groupTransactionsByDate(transactions)).length >
            0 ? (
              Object.entries(groupTransactionsByDate(transactions)).map(
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
                              {formatCurrency(
                                transaction.amount,
                                selectedCurrency
                              )}
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
              )
            ) : (
              // Display a message if there are no transactions
              <p className="text-gray-600">No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
