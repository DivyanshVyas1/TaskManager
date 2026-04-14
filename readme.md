#  Task Manager (Full Stack)

A simple full-stack Task Manager application that allows users to create, view, and manage tasks. The project is built using **Go (backend)** and **React (frontend)** with a clean UI using Bootstrap.

---

##  Features

* Add a new task (title & description)
* View all tasks
* Separate tasks into:

  * Pending
  * Completed
* Mark tasks as completed
* Clean and responsive UI

---

##  Tech Stack

### Backend

* Go (Golang)
* Gorilla Mux (for routing)

### Frontend

* React (Vite)
* Bootstrap (for styling)

---

## Project Structure

```
TaskManager/
│
├── Backend/
│   ├── main.go
│   ├── controllers/
│   ├── models/
│   ├── routes/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │
│   ├── package.json
│
└── README.md
```

---

## How to Run the Project

### Backend Setup (Go)

```bash
cd Backend
go mod tidy
go run main.go
```

👉 Server runs at:
http://localhost:8000

---

### Frontend Setup (React)

```bash
cd Frontend
npm install
npm run dev
```

 App runs at:
http://localhost:5173

---

## API Endpoints

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | /tasks              | Create a new task      |
| GET    | /tasks              | Get all tasks          |
| PUT    | /tasks/:id/complete | Mark task as completed |

---

## Application Flow

1. User enters task details in frontend
2. React sends request to Go backend
3. Backend processes request and updates in-memory data
4. Updated data is sent back to frontend
5. UI updates dynamically

---

## Limitations

* Uses in-memory storage (data resets on server restart)
* No authentication system
* No persistent database

---

##  Future Improvements

* Add database (MongoDB/PostgreSQL)
* Add task editing & deletion
* Implement user authentication
* Improve UI/UX with animations
* Deploy application online

---

## Learning Outcomes

* Built REST APIs using Go
* Implemented MVC architecture
* Connected frontend with backend
* Managed state in React
* Handled CORS and API integration

---

##  Author

Divyansh Vyas

---

## 📌 Notes

This project was developed as part of a full-stack development assignment to demonstrate backend-frontend integration, clean architecture, and problem-solving skills.
