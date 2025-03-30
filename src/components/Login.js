import React, { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        if (username.trim()) {
            localStorage.setItem("username", username);
            setIsAuthenticated(true);
        }
    };

    return (
        <div className="p-5">
            {isAuthenticated ? (
                <h2>Welcome, {localStorage.getItem("username")}!</h2>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="border p-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 mx-2">
                        Login
                    </button>
                </>
            )}
        </div>
    );
};

export default Login;
