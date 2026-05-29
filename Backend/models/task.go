package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Subtask struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title     string             `bson:"title" json:"title"`
	Completed bool               `bson:"completed" json:"completed"`
}

type Task struct {
	ID        primitive.ObjectID     `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID     `bson:"user_id" json:"userId"`
	HeaderID  primitive.ObjectID     `bson:"header_id" json:"headerId"`
	Title     string                 `bson:"title" json:"title"`
	Completed bool                   `bson:"completed" json:"completed"`
	Data      map[string]interface{} `bson:"data" json:"data"`
}
