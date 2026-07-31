# Get specific SubCategory

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get specific SubCategory` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/subcategories/<subcategory-id>` |
| Normalized endpoint | `/subcategories/{subcategoryId}` |
| Authentication category | Safe public read |
| Authentication observed | Anonymous success; no token, credentials, or cookies sent |
| Observed status code | `200` |
| Capture date | `2026-07-31T16:27:24Z` |
| Response time | `83.83 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The subcategory ID came from the first item returned by this run's `GET /subcategories` response and remained in memory only. The raw response was not emitted or written; all strings are role-based placeholders. |

## Safe request parameters

Path parameter `{subcategoryId}` used the unmodified first `_id` returned by `GET /subcategories`. No query, body, authentication, cookies, or trailing slash were sent.

## Safe response example

```json
{
  "data": {
    "_id": "<subcategory-id>",
    "name": "<subcategory-name>",
    "slug": "<subcategory-slug>",
    "category": "<category-id>",
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
| `$.data` | object | Subcategory resource wrapper |
| `$.data._id` | string | Matched the subcategory ID selected from the list response; value replaced |
| `$.data.name` | string | Value replaced |
| `$.data.slug` | string | Value replaced |
| `$.data.category` | string | Value replaced with `<category-id>` |
| `$.data.createdAt` | string | Value replaced; format not generalized |
| `$.data.updatedAt` | string | Value replaced; format not generalized |
| `$.data.__v` | number | Observed value `0`; semantics unverified |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Invalid-ID and not-found statuses and envelopes remain unverified.
- Field optionality, nullability, stability, category semantics, and version-field semantics remain unverified.
- Cache and rate-limit behavior remain unverified.

## Related decisions

- `API-001` — the confirmed base URL served this endpoint.
- `API-002` — this detail request succeeded anonymously.
- `API-003` — a subcategory list ID successfully addressed the subcategory detail resource.
- `API-004` — this successful detail envelope and its observed fields/types are evidenced.
- `API-007` — the normalized bodyless GET succeeded without a trailing slash.
