package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"task-manager/config"
	"task-manager/routes"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	config.ConnectDB()

	router := mux.NewRouter()
	router.Use(enableCORS)

	routes.RegisterTaskRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	fmt.Printf("Server running on port %s\n", port)
	http.ListenAndServe(":"+port, enableCORS(router))
}