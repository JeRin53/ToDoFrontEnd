import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    setSuccess(false);
    const response = await fetch(
      "https://todobackendd-ou32.onrender.com/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);
    if (data.message === "User registered") {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setAuthError(data.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-white">
      <div className="max-w-md w-full p-8 bg-black rounded-xl shadow-xl border border-red-600">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-red-500">
          Sign Up
        </h2>
        {authError && (
          <div className="mb-3 text-center text-red-400 font-semibold">
            {authError}
          </div>
        )}
        {success && (
          <div className="mb-3 text-center text-green-400 font-semibold">
            Registration successful! Redirecting to login...
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup(username, password);
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border-2 border-red-400 bg-black text-white rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border-2 border-red-400 bg-black text-white rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Password"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded w-full transition-colors duration-200"
            disabled={authLoading}
          >
            {authLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-5 text-center">
          <span className="text-gray-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-red-400 hover:underline font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
