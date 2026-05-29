package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CustomField struct {
	Name string `bson:"name" json:"name"`
	Type string `bson:"type" json:"type"` // e.g., "text", "number", "textarea"
}

type Header struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID primitive.ObjectID `bson:"user_id" json:"userId"`
	Name   string             `bson:"name" json:"name"`
	Fields []CustomField      `bson:"fields" json:"fields"`
}
