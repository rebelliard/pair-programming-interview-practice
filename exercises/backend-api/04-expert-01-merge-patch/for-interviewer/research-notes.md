# 🔬 Merge-patch exercise design notes

## 🎯 Goal

This expert API drill focuses on a common maintenance trap: a shallow object
update appears correct until a client changes one nested member. The candidate
must establish current behavior, then implement a limited RFC 7396-style
object merge without turning the exercise into a framework or persistence
design task.

## ✅ Decision

The starter uses `Object.assign` at the profile root. It deliberately has two
observable failures:

- a nested object patch replaces the whole nested object and loses siblings;
- a `null` member remains in storage instead of acting as a delete marker.

The core acceptance covers recursive object merge, deletion, array/scalar
replacement, and no-op behavior. The extension introduces the registered
merge-patch media type and atomic validation. The stretch advertises the
capability through OPTIONS and `Accept-Patch`.

## 🔁 Intentional overlap with full-stack exercise 4

This package deliberately overlaps with full-stack exercise 4 in one teaching
method: both require a candidate to characterize existing behavior before
repairing it. That overlap is intentional. It lets the curriculum revisit the
same engineering discipline while changing the technical domain from a UI and
state-transition bug to an HTTP document-update contract.

The exercises do not test the same implementation skill. Exercise 4 is about
reconstructing lifecycle legality across client and server. This package is
API-only and evaluates JSON value semantics, request media types, and update
atomicity. A candidate who solved exercise 4 should still need to reason from
the profile data and request/response evidence here.

## 🧪 Atomic validation distinction

Merge-patch is not a sequence of independently stored property writes. The
service must:

1. read the current document;
2. create a candidate by applying the whole patch;
3. validate that candidate as a complete profile;
4. replace storage only when validation succeeds.

A per-member validator can incorrectly reject a valid intermediate shape or,
worse, persist an early member before a later member makes the whole profile
invalid. The extension uses one request that changes `displayName` and makes
email invalid to prove no partial persistence occurs.

## ✂️ Scope cuts

- no database, ORM, transactions, authentication, or ETags;
- no JSON Patch operation array;
- no generic validation library;
- no schema-generation task;
- no browser UI beyond Next's required minimal layout;
- no root-document scalar replacement for the profile endpoint;
- no merge-by-index behavior for arrays.

## 🧩 Runtime boundary

The package uses Next.js only as the HTTP host. `app/api/.../route.ts` exports
method handlers delegated from a factory in `src/`. Tests invoke that factory
with plain Web `Request` and `Response`, so the candidate can focus on HTTP
contracts without framework helpers or a running server.
