package main

import (
	"circulation_service/models"
	"circulation_service/queue"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var q = queue.NewMemoryQueue()

func handleReserve(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req models.ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body. Expected snake_case JSON with book_id and user_id"})
		return
	}

	if req.BookID <= 0 || req.UserID <= 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "book_id and user_id must be positive integers"})
		return
	}

	pos, added := q.Enqueue(req.BookID, req.UserID)
	w.Header().Set("Content-Type", "application/json")
	if !added {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message":  "User already in reservation queue for this book",
			"position": pos,
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Reservation queued successfully",
		"book_id":  req.BookID,
		"user_id":  req.UserID,
		"position": pos,
	})
}

func handleDequeue(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req models.DequeueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body. Expected book_id"})
		return
	}

	nextUser, ok := q.Dequeue(req.BookID)
	w.Header().Set("Content-Type", "application/json")
	if !ok {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message":  "No queued reservations for this book",
			"has_hold": false,
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Held for next queued user",
		"has_hold":  true,
		"book_id":   req.BookID,
		"user_id":   nextUser.UserID,
		"hold_user": nextUser.UserID,
	})
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 2 {
		http.Error(w, `{"error":"Missing bookId in path"}`, http.StatusBadRequest)
		return
	}

	bookID, err := strconv.Atoi(parts[len(parts)-1])
	if err != nil {
		http.Error(w, `{"error":"Invalid bookId"}`, http.StatusBadRequest)
		return
	}

	status := q.GetStatus(bookID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "circulation_service",
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/queue/reserve", handleReserve)
	mux.HandleFunc("/api/queue/dequeue", handleDequeue)
	mux.HandleFunc("/api/queue/status/", handleStatus)
	mux.HandleFunc("/health", handleHealth)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Circulation queue service running on port %s", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
