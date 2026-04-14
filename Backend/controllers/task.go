package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"task-manager/models"
)

var tasks = []models.Task{}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	json.NewDecoder(r.Body).Decode(&task)

	task.ID = uuid.New().String()
	task.Completed = false

	tasks = append(tasks, task)

	json.NewEncoder(w).Encode(task)
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")

	// ✅ FIX: initialize as empty slice (NOT nil)
	result := []models.Task{}

	for _, task := range tasks {
		if status == "completed" && task.Completed {
			result = append(result, task)
		} else if status == "pending" && !task.Completed {
			result = append(result, task)
		} else if status == "" {
			result = append(result, task)
		}
	}

	json.NewEncoder(w).Encode(result)
}

func CompleteTask(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Completed = true
			json.NewEncoder(w).Encode(tasks[i])
			return
		}
	}

	http.Error(w, "Task not found", http.StatusNotFound)
}