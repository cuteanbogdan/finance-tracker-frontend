// components/Summary.js
import React from 'react';

const Summary = ({ summary, selectedCurrency, formatCurrency, filterDate, handleFilterDateChange }) => {
    return (
        <>
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
        </>
    );
};

export default Summary;
