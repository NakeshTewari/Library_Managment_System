package queue

import (
	"circulation_service/models"
	"sync"
	"time"
)

// ActiveHold tracks a 48-hour hold for a specific user
type ActiveHold struct {
	UserID    int
	ExpiresAt time.Time
}

// MemoryQueue provides thread-safe FIFO reservation queues and hold tracking
type MemoryQueue struct {
	mu     sync.RWMutex
	queues map[int][]models.QueueEntry
	holds  map[int]*ActiveHold
}

// NewMemoryQueue initializes a new queue manager
func NewMemoryQueue() *MemoryQueue {
	return &MemoryQueue{
		queues: make(map[int][]models.QueueEntry),
		holds:  make(map[int]*ActiveHold),
	}
}

// Enqueue adds a user to the FIFO reservation queue for a book
func (q *MemoryQueue) Enqueue(bookID, userID int) (int, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()

	entries := q.queues[bookID]
	// Prevent duplicate reservation in queue
	for _, entry := range entries {
		if entry.UserID == userID {
			return len(entries), false
		}
	}

	newEntry := models.QueueEntry{
		BookID:     bookID,
		UserID:     userID,
		ReservedAt: time.Now(),
	}
	q.queues[bookID] = append(entries, newEntry)
	return len(q.queues[bookID]), true
}

// Dequeue pops the next queued user and assigns a 48-hour hold
func (q *MemoryQueue) Dequeue(bookID int) (*models.QueueEntry, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()

	entries := q.queues[bookID]
	if len(entries) == 0 {
		return nil, false
	}

	nextUser := entries[0]
	q.queues[bookID] = entries[1:]

	// Place on 48-hour hold
	q.holds[bookID] = &ActiveHold{
		UserID:    nextUser.UserID,
		ExpiresAt: time.Now().Add(48 * time.Hour),
	}

	return &nextUser, true
}

// Peek returns the next user in queue without removing them
func (q *MemoryQueue) Peek(bookID int) (*models.QueueEntry, bool) {
	q.mu.RLock()
	defer q.mu.RUnlock()

	entries := q.queues[bookID]
	if len(entries) == 0 {
		return nil, false
	}
	return &entries[0], true
}

// GetStatus returns the queue length, active hold, and next user
func (q *MemoryQueue) GetStatus(bookID int) models.HoldStatusResponse {
	q.mu.RLock()
	defer q.mu.RUnlock()

	entries := q.queues[bookID]
	resp := models.HoldStatusResponse{
		BookID:      bookID,
		QueueLength: len(entries),
	}

	if len(entries) > 0 {
		uid := entries[0].UserID
		resp.NextUserID = &uid
	}

	if hold, ok := q.holds[bookID]; ok {
		resp.HoldUser = &hold.UserID
		resp.ExpiresAt = &hold.ExpiresAt
	}

	return resp
}

// ReleaseHold clears any active hold on a book
func (q *MemoryQueue) ReleaseHold(bookID int) {
	q.mu.Lock()
	defer q.mu.Unlock()
	delete(q.holds, bookID)
}
