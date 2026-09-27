# FrontierCode - Proposal

**Your name:** Nakesh Tewari

---

### 1. Repo
- **Link:** https://github.com/NakeshTewari/Library_Managment_System
- **Licence:** MIT
- **Public or private:** Public (a private repository `NakeshTewari/Library_Managment_System-task` holding only the base commit will be created upon proposal approval, with read access granted to `@xicovarisco`).
- **Your history with it:** Author and primary maintainer. Designed the full-stack architecture, Express session authentication, MySQL schema, and React frontend catalog interface.

---

### 2. Base commit
`a6b6270f2a934afa3764a4cd8966650b854652a9`

---

### 3. The change
Introduce an atomic, queue-based **Book Reservation & Hold System** with priority checkout and automated hold expiration in the Node.js/Express backend and MySQL database.

When a book's available stock reaches zero, users can place a reservation that joins a FIFO queue for that book. Upon the return of a loaned copy, if active reservations exist in the queue, the system must transition the book to a 48-hour `HELD` status exclusively for the top-queued user rather than returning it to the public catalog (`available` count remains 0). Only the designated user may check out the held book during this window. If the user fails to claim the hold within 48 hours, a sweep mechanism expires the hold and cascades the book to the next queued user.

- **Where it comes from:** Planned core feature enhancement for circulation workflows.
- **Merged upstream?** N/A (Author's personal repository; no upstream fork exists). This change has not yet been implemented or committed to `main`. It is entirely new feature work starting from base commit `a6b6270f2a934afa3764a4cd8966650b854652a9`.

---

### 4. Why do you believe Gemini 3.8 Flash will get it wrong
Gemini 3.8 Flash will encounter several subtle concurrency, state-machine, and database consistency traps:

1. **Concurrency & Over-Allocation Trap (Read-Modify-Write Flaw):** Under simultaneous checkout requests, naive agents write sequential JavaScript `SELECT` then `UPDATE` queries without database-level transactional locking (`FOR UPDATE`) or atomic conditional decrements (`UPDATE books SET available = available - 1 WHERE id = ? AND available > 0`), leading to negative stock and oversold inventory under load.
2. **State Machine Double-Allocation Trap:** On book return (`/api/books/return/:id`), the agent instinctively executes the existing `UPDATE books SET available = available + 1` while simultaneously assigning the reservation hold, causing the reserved copy to also be publicly claimable by other users in the general catalog.
3. **Transactional Isolation & Rollback Trap:** Multi-table mutations across `books`, `borrowing`, and `reservations` require dedicated connection transactions (`conn.beginTransaction()`, `conn.commit()`, `conn.rollback()`). LLMs frequently execute standalone queries against the pool, leaving orphaned records and inconsistent stock states when any intermediate constraint fails.
4. **Hold Expiry & Timezone Invariant:** Calculating hold expirations using client/server JavaScript `Date` math rather than database server timestamp intervals (`DATE_ADD(NOW(), INTERVAL 48 HOUR)`), causing timezone offset errors and clock drift issues across environments.

---

### 5. Blockers (2 to 4)

| Blocker | How you'll test it |
| :--- | :--- |
| **1. FIFO Hold Reservation on Return** | Integration test (`npm test -- tests/reservation.test.js`): Borrow the last copy of a book, place 2 reservations for User A and User B. When returned, verify status transitions to `HELD` exclusively for User A, `available` remains `0`, and an immediate borrow attempt by an unreserved User C is rejected with HTTP 409. |
| **2. Concurrency & Anti-Overselling Lock** | Stress test (`npm test -- tests/concurrency.test.js`): Fire 10 simultaneous checkout requests for a book with `available: 1`. Assert exactly 1 request succeeds (HTTP 200), 9 return HTTP 400/409, and `available` is exactly `0` without negative inventory. |
| **3. Automated Hold Expiration & Cascade** | Expiry test (`npm test -- tests/hold_expiry.test.js`): Deterministically backdate an active hold in MariaDB (`UPDATE reservations SET hold_placed_at = DATE_SUB(NOW(), INTERVAL 49 HOUR)`), trigger the sweep/status endpoint, and assert that the database interval check (`DATE_ADD(hold_placed_at, INTERVAL 48 HOUR) <= NOW()`) marks User A's hold expired and automatically cascades the `HELD` status to User B. |

---

### 6. Offline build
Can the repo build and run its tests at the base commit with no network access? What's the risk, and how will you handle it?

- **Feasibility:** Yes. All Node.js dependencies (`express`, `mysql2`, `bcrypt`, `express-session`, `cors`, `dotenv`) are pre-installed during the Docker build stage via `npm ci` / `npm install`.
- **Risk & Mitigation:** Tests execute against an embedded local MariaDB instance inside the container started at runtime. External third-party calls are stubbed with deterministic offline fixtures, guaranteeing 100% offline test execution with `--network none`.
