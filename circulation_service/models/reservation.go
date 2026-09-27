package models

import "time"

// ReservationRequest defines the expected JSON payload for queue placement
type ReservationRequest struct {
	BookID int `json:"book_id"`
	UserID int `json:"user_id"`
}

// DequeueRequest defines the payload when releasing or claiming a hold
type DequeueRequest struct {
	BookID int `json:"book_id"`
}

// QueueEntry represents a queued user with reservation timestamp
type QueueEntry struct {
	UserID     int       `json:"user_id"`
	BookID     int       `json:"book_id"`
	ReservedAt time.Time `json:"reserved_at"`
}

// HoldStatusResponse represents the active hold details for a book
type HoldStatusResponse struct {
	BookID      int        `json:"book_id"`
	QueueLength int        `json:"queue_length"`
	NextUserID  *int       `json:"next_user_id,omitempty"`
	HoldUser    *int       `json:"hold_user,omitempty"`
	ExpiresAt   *time.Time `json:"expires_at,omitempty"`
}
