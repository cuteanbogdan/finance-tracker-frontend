import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold">
                    <Link to="/home">Income & Expense Tracker</Link>
                </div>
                <div className="flex">
                    <Link
                        to="/profile"
                        className="bg-blue-700 text-white px-4 py-2 rounded mr-4 hover:bg-blue-800"
                    >
                        My Profile
                    </Link>
                    <Link
                        to="/login"
                        className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-200"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
