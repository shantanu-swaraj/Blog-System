import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
 // Ensure you import your CSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">Blog System</Link>
            <div>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
