import React from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks = [], fetchTasks }) {
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <>
      <h5 className="mt-3"> Pending Tasks</h5>

      {pending.length === 0 ? (
        <p className="text-muted">No pending tasks</p>
      ) : (
        pending.map(task => (
          <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
        ))
      )}

      <h5 className="mt-4">Completed Tasks</h5>

      {completed.length === 0 ? (
        <p className="text-muted">No completed tasks</p>
      ) : (
        completed.map(task => (
          <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
        ))
      )}
    </>
  );
}

export default TaskList;