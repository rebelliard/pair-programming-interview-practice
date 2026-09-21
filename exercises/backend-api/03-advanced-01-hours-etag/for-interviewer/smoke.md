# Build and HTTP smoke test

Run these commands from this package after applying the reference patch:

```bash
next build
next start --port 3107
```

In a second terminal:

```bash
curl -i http://localhost:3107/api/hours
curl -i -H 'If-None-Match: "<ETAG_FROM_FIRST_RESPONSE>"' \
  http://localhost:3107/api/hours
curl -i -X PUT http://localhost:3107/api/hours \
  -H 'Content-Type: application/json' \
  -H 'If-Match: "<ETAG_FROM_FIRST_RESPONSE>"' \
  --data '{"hours":{"monday":{"opensAt":"08:00","closesAt":"17:00"}}}'
```

The conditional GET must show `304` with no response content. Substitute the
quoted ETag value exactly, including its quotes.
