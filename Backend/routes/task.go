package routes

import (
	"github.com/gorilla/mux"
	"task-manager/controllers"
)

func RegisterTaskRoutes(router *mux.Router) {
	router.HandleFunc("/tasks", controllers.CreateTask).Methods("POST")
	router.HandleFunc("/tasks", controllers.GetTasks).Methods("GET")
	router.HandleFunc("/tasks/{id}/complete", controllers.CompleteTask).Methods("PUT")
}