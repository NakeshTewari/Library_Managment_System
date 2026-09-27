package main

import (
	"circulation_service/queue"
	"sync"
	"testing"
)

func TestFIFOQueueOrdering(t *testing.T) {
	q := queue.NewMemoryQueue()
	bookID := 101

	// Enqueue User 1 and User 2
	pos1, ok1 := q.Enqueue(bookID, 1)
	if !ok1 || pos1 != 1 {
		t.Fatalf("Expected pos 1, got %d", pos1)
	}

	pos2, ok2 := q.Enqueue(bookID, 2)
	if !ok2 || pos2 != 2 {
		t.Fatalf("Expected pos 2, got %d", pos2)
	}

	// Dequeue first
	next1, ok := q.Dequeue(bookID)
	if !ok || next1.UserID != 1 {
		t.Fatalf("Expected User 1 to be dequeued first, got %v", next1)
	}

	// Dequeue second
	next2, ok := q.Dequeue(bookID)
	if !ok || next2.UserID != 2 {
		t.Fatalf("Expected User 2 to be dequeued second, got %v", next2)
	}

	// Queue should now be empty
	_, okEmpty := q.Dequeue(bookID)
	if okEmpty {
		t.Fatalf("Expected queue to be empty")
	}
}

func TestConcurrentQueuePlacement(t *testing.T) {
	q := queue.NewMemoryQueue()
	bookID := 202
	concurrency := 20

	var wg sync.WaitGroup
	wg.Add(concurrency)

	for i := 1; i <= concurrency; i++ {
		go func(userID int) {
			defer wg.Done()
			q.Enqueue(bookID, userID)
		}(i)
	}

	wg.Wait()

	status := q.GetStatus(bookID)
	if status.QueueLength != concurrency {
		t.Fatalf("Expected queue length %d, got %d", concurrency, status.QueueLength)
	}
}
