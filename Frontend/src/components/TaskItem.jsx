import React from "react";

const API = "http://localhost:8000";

function TaskItem({ task, fetchTasks }) {
  const markComplete = async () => {
    await fetch(`http://localhost:8000/tasks/${task.id}/complete`, {
      method: "PUT",
    });
    fetchTasks();
  };

  return (
    <div className={`card mb-2 ${task.completed ? "bg-light" : ""}`}>
      <div className="card-body">
        <h6 className={`card-title ${task.completed ? "text-decoration-line-through" : ""}`}>
          {task.title}
        </h6>

        <p className="card-text">{task.description}</p>

        {!task.completed && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={markComplete}
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;