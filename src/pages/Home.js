import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ADD THIS

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // ADD THIS

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary mb-4">Welcome to CareerSide</h1>
      <p className="lead text-secondary mb-4">
        Your one-stop platform for managing career development and professional growth.
      </p>
      
      {/* ADD THIS DEBUG INFO */}
      {currentUser && (
        <div className="alert alert-warning mb-3">
          ⚠️ You're logged in as: {currentUser.email}
          <button onClick={handleLogout} className="btn btn-sm btn-danger ms-3">
            Logout
          </button>
        </div>
      )}
      
      <button
        className="btn btn-success px-4 py-2"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </button>
    </div>
  );
};

export default Home;