// components/CurrencySelector.js
import React from 'react';

const CurrencySelector = ({ selectedCurrency, handleCurrencyChange, currencies }) => {
    return (
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
    );
};

export default CurrencySelector;
