---
marp: true
theme: default
paginate: true
---

# Scan feed pagination

Advanced API pairing exercise

50 minutes

---

## Scenario

Customers read a newest-first stream of completed scans.

The current endpoint uses `offset`.

New scans can arrive while a customer reads the next page.

---

## Your task

Make page continuation stable when new scans arrive.

Preserve the existing order:

1. timestamp, newest first
2. id, descending on a tied timestamp

---

## Working agreement

- Drive the editor.
- Explain decisions and assumptions.
- Ask questions when requirements affect behavior.
- Prefer a small checked step over a large untested change.

---

## Time plan

| Time  | Focus                |
| ----- | -------------------- |
| 0–10  | Read and trace       |
| 10–32 | Stable page boundary |
| 32–42 | Input boundaries     |
| 42–46 | Optional extension   |
| 46–50 | Debrief              |
