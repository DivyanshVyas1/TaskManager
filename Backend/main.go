package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"task-manager/routes"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	router := mux.NewRouter()
	router.Use(enableCORS)

	routes.RegisterTaskRoutes(router)

	fmt.Println("Server running on port 8000")
	http.ListenAndServe(":8000", enableCORS(router))
}