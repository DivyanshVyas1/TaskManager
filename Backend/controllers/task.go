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

func CreateTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)

	var task models.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	task.ID = primitive.NewObjectID()
	task.UserID = userID
	task.Completed = false

	if task.Data == nil {
		task.Data = make(map[string]interface{})
	}

	collection := config.GetCollection("tasks")
	_, err := collection.InsertOne(context.TODO(), task)
	if err != nil {
		http.Error(w, "Error creating task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)

	filter := bson.M{"user_id": userID}

	collection := config.GetCollection("tasks")
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Error fetching tasks", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var tasks []models.Task = []models.Task{}
	if err = cursor.All(context.TODO(), &tasks); err != nil {
		http.Error(w, "Error decoding tasks", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func CompleteTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)
	params := mux.Vars(r)
	taskID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	collection := config.GetCollection("tasks")
	filter := bson.M{"_id": taskID, "user_id": userID}
	
	// Fetch to toggle completion or simply mark true? Let's just set it to true for now as before.
	update := bson.M{"$set": bson.M{"completed": true}}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil || result.MatchedCount == 0 {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Task completed"})
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middleware.UserIDKey).(primitive.ObjectID)
	params := mux.Vars(r)
	taskID, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	collection := config.GetCollection("tasks")
	filter := bson.M{"_id": taskID, "user_id": userID}
	
	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil || result.DeletedCount == 0 {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Task deleted successfully"})
}
