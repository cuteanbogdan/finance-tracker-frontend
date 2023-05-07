import React, { useState, useEffect } from "react";
import axios from "axios";
import BalanceForm from "../utils/BalanceForm";
import CurrencySelector from "../utils/CurrencySelector";
import TransactionForm from "../utils/TransactionForm";
import Summary from "../utils/Summary";
import TransactionsTable from "../utils/TransactionsTable";
import Navbar from "../utils/NavBar";

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
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "RON"];

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
      fetchTransactions();
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
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Income & Expense Tracker
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Update Balance</h2>
            <BalanceForm
              editableBalance={editableBalance}
              setEditableBalance={setEditableBalance}
              handleBalanceSubmit={handleBalanceSubmit}
            />
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              handleCurrencyChange={handleCurrencyChange}
              currencies={currencies}
            />
            <br />
            <h2 className="text-2xl font-semibold mb-6">Add Transaction</h2>
            <TransactionForm
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              date={date}
              setDate={setDate}
              amount={amount}
              setAmount={setAmount}
              category={category}
              setCategory={setCategory}
              notes={notes}
              setNotes={setNotes}
              handleSubmit={handleSubmit}
              categories={categories}
            />
          </div>
          <div className="bg-white shadow-md rounded-md p-6">
            <Summary
              summary={summary}
              selectedCurrency={selectedCurrency}
              formatCurrency={formatCurrency}
              filterDate={filterDate}
              handleFilterDateChange={handleFilterDateChange}
            />
            <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
              <TransactionsTable
                transactions={transactions}
                selectedCurrency={selectedCurrency}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                groupTransactionsByDate={groupTransactionsByDate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
