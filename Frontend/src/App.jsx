import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";

const API = "http://localhost:8000";

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
  <div className="card shadow p-4">
    <h2 className="text-center mb-4"> Task Manager</h2>

    <TaskForm fetchTasks={fetchTasks} />
    <hr />
    <TaskList tasks={tasks} fetchTasks={fetchTasks} />
  </div>
</div>
  );
}

export default App;