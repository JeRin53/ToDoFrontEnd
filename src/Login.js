import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken }) {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    const response = await fetch(
      "https://todobackendd-ou32.onrender.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setAuthError(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black text-white">
      <div className="max-w-md w-full p-8 bg-black rounded-xl shadow-xl border border-red-600">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-red-500">
          Login
        </h2>
        {authError && (
          <div className="mb-3 text-center text-red-400 font-semibold">
            {authError}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
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
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-5 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-red-400 hover:underline font-semibold"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
