import React, { useState, useEffect } from "react";
import Navbar from "../utils/NavBar";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    balance: 0,
    transactions: [],
  });

  useEffect(() => {
    // Fetch user details and transactions here
    // Replace with the actual API call to fetch user details
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Replace with the actual key you use to store the token

      const response = await fetch(
        "http://localhost:5000/api/transactions/user-details",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUserDetails(data);
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  // Prepare data for the transactions chart
  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [
          userDetails.transactions.filter((t) => t.type === "income").length,
          userDetails.transactions.filter((t) => t.type === "expense").length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            return `${label}: ${value}`;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p className="mb-2">
              <strong className="font-semibold">Name:</strong>{" "}
              {userDetails.name}
            </p>
            <p className="mb-2">
              <strong className="font-semibold">Email:</strong>{" "}
              {userDetails.email}
            </p>
            <p>
              <strong className="font-semibold">Balance:</strong> $
              {userDetails.balance.toFixed(2)}
            </p>
          </div>
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Transactions Chart</h2>
            {!isLoading && <Doughnut data={chartData} options={chartOptions} />}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Transaction Summary</h2>
          {/* Add transaction summary details here */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
