package routes

import (
	"github.com/gorilla/mux"
	"task-manager/controllers"
	"task-manager/middleware"
)

func RegisterTaskRoutes(router *mux.Router) {
	// Public routes
	router.HandleFunc("/api/register", controllers.Register).Methods("POST")
	router.HandleFunc("/api/login", controllers.Login).Methods("POST")

	// Protected routes
	api := router.PathPrefix("/api").Subrouter()
	api.Use(middleware.AuthMiddleware)

	// Headers
	api.HandleFunc("/headers", controllers.CreateHeader).Methods("POST")
	api.HandleFunc("/headers", controllers.GetHeaders).Methods("GET")
	api.HandleFunc("/headers/{id}", controllers.DeleteHeader).Methods("DELETE")

	// Tasks / Items
	api.HandleFunc("/tasks", controllers.CreateTask).Methods("POST")
	api.HandleFunc("/tasks", controllers.GetTasks).Methods("GET")
	api.HandleFunc("/tasks/{id}/complete", controllers.CompleteTask).Methods("PUT")
	api.HandleFunc("/tasks/{id}", controllers.DeleteTask).Methods("DELETE")
}
