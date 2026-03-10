# Health Endpoint Contract (Phase 2.3)

## Purpose

Define the API contract for backend liveness and readiness endpoints used in local development and operations checks.

## Endpoints

### `GET /health/live`

Process-level liveness check.

- Success status: `200 OK`
- Expected body:

```json
{
  "status": "ok"
}
```

- Failure behavior:
  - Should only fail if request routing/controller execution fails.
  - Does not depend on database state.

### `GET /health/ready`

Dependency readiness check (database connectivity).

- Success status: `200 OK`
- Expected body shape (Terminus default):

```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

- Failure status: `503 Service Unavailable`
- Failure body shape (Terminus default):

```json
{
  "status": "error",
  "info": {},
  "error": {
    "database": {
      "status": "down"
    }
  },
  "details": {
    "database": {
      "status": "down"
    }
  }
}
```

## Notes

- Liveness and readiness are intentionally separated.
- Liveness confirms API process availability.
- Readiness confirms API process + required database dependency availability.
