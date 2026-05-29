package controllers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"task-manager/config"
	"task-manager/middleware"
	"task-manager/models"
)

func CreateHeader(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)

	var header models.Header
	if err := json.NewDecoder(r.Body).Decode(&header); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	header.ID = primitive.NewObjectID()
	header.UserID = userID

	if header.Fields == nil {
		header.Fields = []models.CustomField{}
	}

	collection := config.GetCollection("headers")
	_, err := collection.InsertOne(context.TODO(), header)
	if err != nil {
		http.Error(w, "Error creating header", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(header)
}

func GetHeaders(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)

	collection := config.GetCollection("headers")
	cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, "Error fetching headers", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var headers []models.Header = []models.Header{}
	if err = cursor.All(context.TODO(), &headers); err != nil {
		http.Error(w, "Error decoding headers", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(headers)
}

func DeleteHeader(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)
	params := mux.Vars(r)
	headerID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid header ID", http.StatusBadRequest)
		return
	}

	collection := config.GetCollection("headers")
	result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": headerID, "user_id": userID})
	if err != nil || result.DeletedCount == 0 {
		http.Error(w, "Header not found", http.StatusNotFound)
		return
	}

	// Also delete tasks associated with this header
	taskCollection := config.GetCollection("tasks")
	taskCollection.DeleteMany(context.TODO(), bson.M{"header_id": headerID, "user_id": userID})

	json.NewEncoder(w).Encode(map[string]string{"message": "Header deleted"})
}
