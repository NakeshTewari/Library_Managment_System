# FrontierCode - Proposal

**Your name:** Nakesh Tewari

---

### 1. Repo
- **Link:** https://github.com/NakeshTewari/Library_Managment_System
- **Licence:** MIT / Unlicensed
- **Public or private:** Public (a private repository `NakeshTewari/Library_Managment_System-task` holding only the base commit will be created upon proposal approval, with read access granted to `@xicovarisco`).
- **Your history with it:** Owner/Creator (direct commits to main; no PRs). Built the initial Node/Express/MySQL architecture, database schema, and frontend catalog interface; ongoing maintenance including the MongoDB→MySQL migration and session-handling fixes. Added the standalone Go `circulation_service` microservice for in-memory queue management.

---

### 2. Base commit
`8a4dd18009aa22326683ef90a241516657a83900`

---

### 3. The change
Introduce an atomic Book Reservation & Hold Queue system with priority checkout and automated hold expiration. 

When a book's available inventory reaches zero, users can place a reservation that joins a FIFO queue. The repository includes an existing standalone Go microservice (`circulation_service`) with thread-safe in-memory queue management and strict JSON schema contracts (`models/reservation.go`). The Node.js Express backend must be updated to integrate with this service during borrow, reserve, and return lifecycles, and coordinate MySQL database transactions. Upon book return, if pending reservations exist, the system transitions the book to a 48-hour `HELD` status exclusively for the top queued user rather than returning it to the public catalog. If the user fails to claim the hold within 48 hours, a background sweep expires the hold and cascades the book to the next queued user.

- **Where it comes from:** Planned core feature enhancement for circulation workflows. The Go microservice is pre-built in the repo; wiring the Node.js backend to integrate with it and managing transactional database state is the new work.
- **Merged upstream?** No. This change has not yet been implemented or committed to `main`. It is entirely new feature work starting from the base commit.

---

### 4. Why do you believe Gemini 3.8 Flash will get it wrong
Gemini 3.8 Flash will encounter multiple structural cross-language and concurrency traps:

1. **Concurrency & Over-Allocation Trap:** Under concurrent borrow and reservation requests, naive agents perform sequential `SELECT` then `UPDATE` queries without database-level transactional locking (`FOR UPDATE` / atomic conditional decrements), resulting in negative inventory or queue jumping.
2. **State Machine Double-Allocation Trap:** On book return (`/api/books/return/:id`), the agent instinctively executes `UPDATE books SET available = available + 1` while simultaneously assigning the reservation hold, causing the reserved copy to also be publicly claimable in the catalog.
3. **Cross-Service Contract Adaptation:** The existing Go microservice defines strict JSON contracts (`json:"book_id"`, `json:"user_id"` in `circulation_service/models/reservation.go`). Agents frequently send raw JavaScript camelCase payloads (`bookId`, `userId`) without adapting to the existing service's schema, leading to unmarshaled zero-values (`0` / `""`) and silent queue failure.
4. **Hold Expiry & Timezone Invariant:** Calculating hold expirations using client/server JavaScript timestamp math rather than database server timestamp intervals (`DATE_ADD(NOW(), INTERVAL 48 HOUR)`), causing timezone offset errors in multi-region environments.

---

### 5. Blockers (2 to 4)

| Blocker | How you'll test it |
| :--- | :--- |
| **1. FIFO Hold Reservation on Return** | Integration test (`npm test -- tests/reservation.test.js`): Borrow last copy of a book, place 2 reservations for User A and User B. When returned, verify status transitions to `HELD` exclusively for User A, `available` remains `0`, and a borrow attempt by User C is rejected with HTTP 409. |
| **2. Concurrency & Anti-Overselling Lock** | Stress test (`npm test -- tests/concurrency.test.js`): Fire 10 simultaneous checkout requests for a book with `available: 1`. Assert exactly 1 request succeeds (HTTP 200), 9 return 400/409, and `available` is exactly `0` without negative inventory. |
| **3. Automated Hold Expiration & Cascade** | Expiry test (`npm test -- tests/hold_expiry.test.js`): Deterministically backdate an active hold in MariaDB (`UPDATE reservations SET hold_placed_at = DATE_SUB(NOW(), INTERVAL 49 HOUR)`), trigger the sweep/status endpoint, and assert that the database interval check (`DATE_ADD(hold_placed_at, INTERVAL 48 HOUR) <= NOW()`) marks User A's hold expired and automatically cascades the `HELD` status to User B. |
| **4. Transactional Rollback on IPC Failure** | Integration test (`npm test -- tests/transaction.test.js`): Mock a network/service failure during circulation queue allocation; assert that Node.js rolls back the MySQL transaction (`conn.rollback()`), stock is unchanged, and no orphaned records remain. |

---

### 6. Offline build
Can the repo build and run its tests at the base commit with no network access? What's the risk, and how will you handle it?

- **Feasibility:** Yes. All Node.js dependencies (`npm ci`) and the Go microservice (`go build`) are pre-installed and compiled into a standalone static binary during the multi-stage Docker build.
- **Risk & Mitigation:** Tests execute against an embedded local MariaDB instance inside the container started at runtime. External third-party calls are stubbed with deterministic offline fixtures, guaranteeing 100% offline test execution with `--network none`.
