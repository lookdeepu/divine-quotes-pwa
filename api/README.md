# Web Push backend

This endpoint is the server-side foundation for reliable background notifications.

## Required environment variables

- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_SUBJECT

Generate VAPID keys with the `web-push` CLI, then store them as deployment secrets.

## API

- GET /api/server — health check
- POST /api/server with `{"action":"subscribe","subscription":{...}}` — stores a subscription
- POST /api/server with `{"action":"send","payload":{"title":"Divine Quotes","body":"..."}}` — sends to stored subscriptions

## Production follow-up

The in-memory subscription store is intentionally a development scaffold. Production deployment needs durable storage and authentication for administrative sends. A scheduler should invoke the send operation at the desired local time.
