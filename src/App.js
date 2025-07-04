import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  const BASE_URL = "https://todobackendd-ou32.onrender.com";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const fetchTasks = async (token) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  useEffect(() => {
    if (token) fetchTasks(token);
  }, [token]);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setTasks([]);
  };

  const addTask = async (text) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, status: "pending", priority: "medium" }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id) => {
    await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    const response = await fetch(`${BASE_URL}/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const updateTaskPriority = async (id, newPriority) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}/priority`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priority: newPriority }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const editTaskText = async (id, newText) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newText }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
  };

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const filteredTasks = tasks
    .filter(
      (task) =>
        (filterStatus === "all" || task.status === filterStatus) &&
        (filterPriority === "all" || task.priority === filterPriority)
    )
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const MainApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white flex flex-col">
      <nav className="bg-red-700 px-6 py-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="px-4 py-2 rounded-full font-semibold bg-red-100 text-red-700 shadow hover:bg-red-200 transition"
            >
              Home
            </a>
          </li>
        </ul>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-800 text-white font-bold rounded-full shadow transition"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white drop-shadow">
          MERN To-Do App
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask(e.target[0].value);
            e.target[0].value = "";
          }}
          className="mb-6 flex gap-2 justify-center"
        >
          <input
            type="text"
            className="p-3 border-2 border-red-400 rounded-lg w-2/3 bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Add a task"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            Add
          </button>
        </form>
        <div className="mb-6 flex gap-4 justify-center">
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border-2 border-red-400 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterStatus}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border-2 border-red-400 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filterPriority}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <ul className="space-y-4">
          {filteredTasks.map((task) => {
            const isEditing = task._editing;
            return (
              <li
                key={task._id}
                className="p-4 bg-gradient-to-br from-red-950 to-black rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-red-900 transition"
              >
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={task.text}
                      onBlur={(e) => {
                        const newText = e.target.value.trim();
                        if (newText && newText !== task.text) {
                          editTaskText(task._id, newText);
                        }
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id ? { ...t, _editing: false } : t
                          )
                        );
                      }}
                      autoFocus
                      className="bg-black text-white p-2 rounded border border-red-500 w-full"
                    />
                  ) : (
                    <span className="text-lg text-white">{task.text}</span>
                  )}
                  <span className="ml-2 text-sm text-red-300">
                    ({task.status}, {task.priority})
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, _editing: !t._editing }
                            : t
                        )
                      )
                    }
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task._id, task.status)}
                    className={`px-3 py-1 rounded-full font-semibold transition ${
                      task.status === "pending"
                        ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                        : "bg-green-400 text-green-900 hover:bg-green-500"
                    }`}
                  >
                    {task.status === "pending"
                      ? "Mark Complete"
                      : "Mark Pending"}
                  </button>
                  <select
                    value={task.priority}
                    onChange={(e) =>
                      updateTaskPriority(task._id, e.target.value)
                    }
                    className="p-2 border-2 border-red-300 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-full transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
      <footer className="bg-red-700 text-white p-4 mt-auto text-center shadow-inner">
        © 2025 Your To-Do App
      </footer>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={token ? <MainApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
