// components/BalanceForm.js
import React from 'react';

const BalanceForm = ({ editableBalance, setEditableBalance, handleBalanceSubmit }) => {
    return (
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
    );
};

export default BalanceForm;
