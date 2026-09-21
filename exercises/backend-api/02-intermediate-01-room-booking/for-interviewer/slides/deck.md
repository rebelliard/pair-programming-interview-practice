---
marp: true
paginate: true
---

# Room booking

## Intermediate API pairing practice

- 50 minutes
- Feature-only exercise
- You drive; I navigate

---

# Working agreement

- Quiet reading time is welcome.
- Explain useful decisions and expected checks.
- Ask questions when a requirement changes the design.
- Use AI deliberately and verify what you keep.

---

# Walkthrough

Trace one request through:

1. the Next route;
2. the handler factory; and
3. the in-memory repository.

Then run the starter checks.

---

# Core release

Add `POST /api/bookings`.

A booking reserves a room for a start and end time.

- A room cannot have overlapping reservations.
- Consecutive reservations are allowed.
- Return the right successful HTTP response.

---

# Extension release

Make these cases distinguishable:

1. malformed request data; and
2. a valid request that cannot be accepted because the room is booked.

Use JSON responses. Do not add a validation library.

---

# Stretch release

Support deleting a booking by ID.

After deletion, the same room interval should be available again.

---

# Handoff

Summarize:

1. what works;
2. what you tested;
3. assumptions; and
4. the next risk you would address.

---

# Debrief

- What was your smallest safe slice?
- What did the checks prove?
- What would you improve with ten more minutes?
