# Get specific category

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get specific category` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/categories/<category-id>` |
| Normalized endpoint | `/categories/{categoryId}` |
| Authentication category | Safe public read |
| Authentication observed | Anonymous success; no token, credentials, or cookies sent |
| Observed status code | `200` |
| Capture date | `2026-07-31T16:27:24Z` |
| Response time | `82.80 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The category ID came from the first item returned by this run's `GET /categories` response and remained in memory only. The raw response was not emitted or written; all strings are role-based placeholders. |

## Safe request parameters

Path parameter `{categoryId}` used the unmodified first `_id` returned by `GET /categories`. No query, body, authentication, cookies, or trailing slash were sent.

## Safe response example

```json
{
  "data": {
    "_id": "<category-id>",
    "name": "<category-name>",
    "slug": "<category-slug>",
    "image": "<category-image-url>",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>",
    "__v": 0
  }
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful response root |
| `$.data` | object | Category resource wrapper |
| `$.data._id` | string | Matched the category ID selected from the list response; value replaced |
| `$.data.name` | string | Value replaced |
| `$.data.slug` | string | Value replaced |
| `$.data.image` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data.createdAt` | string | Value replaced; format not generalized |
| `$.data.updatedAt` | string | Value replaced; format not generalized |
| `$.data.__v` | number | Observed value `0`; semantics unverified |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Invalid-ID and not-found statuses and envelopes remain unverified.
- Field optionality, nullability, stability, and version-field semantics remain unverified.
- Cache and rate-limit behavior remain unverified.

## Related decisions

- `API-001` — the confirmed base URL served this endpoint.
- `API-002` — this detail request succeeded anonymously.
- `API-003` — a category list ID successfully addressed the category detail resource.
- `API-004` — this successful detail envelope and its observed fields/types are evidenced.
- `API-007` — the normalized bodyless GET succeeded without a trailing slash.
