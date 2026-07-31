# Get All SubCategories On Category

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get All SubCategories On Category` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/categories/<category-id>/subcategories` |
| Normalized endpoint | `/categories/{categoryId}/subcategories` |
| Authentication category | Safe public read |
| Authentication observed | Anonymous success; no token, credentials, or cookies sent |
| Observed status code | `200` |
| Capture date | `2026-07-31T16:27:24Z` |
| Response time | `81.93 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The category ID came from the first item returned by this run's `GET /categories` response and remained in memory only. The full list was not emitted or written; one item is retained with all strings replaced. |

## Safe request parameters

Path parameter `{categoryId}` used the unmodified first `_id` returned by `GET /categories`. No query, body, authentication, cookies, or trailing slash were sent.

## Safe response example

```json
{
  "results": 60,
  "metadata": {
    "currentPage": 1,
    "numberOfPages": 2,
    "limit": 40,
    "nextPage": 2
  },
  "data": [
    {
      "_id": "<subcategory-id>",
      "name": "<subcategory-name>",
      "slug": "<subcategory-slug>",
      "category": "<category-id>",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ]
}
```

The observed response was populated with `40` items; only the first item's structure is retained.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful response root |
| `$.results` | number | Observed value `60`; semantics not generalized |
| `$.metadata` | object | Pagination-like metadata container |
| `$.metadata.currentPage` | number | Observed value `1` without a query |
| `$.metadata.numberOfPages` | number | Observed value `2` |
| `$.metadata.limit` | number | Observed value `40`; default and bounds unverified |
| `$.metadata.nextPage` | number | Observed value `2` |
| `$.data` | array | Observed `40` items; one structure retained |
| `$.data[0]` | object | Representative subcategory object |
| `$.data[0]._id` | string | Value replaced |
| `$.data[0].name` | string | Value replaced |
| `$.data[0].slug` | string | Value replaced |
| `$.data[0].category` | string | Value replaced with `<category-id>`; equality semantics were not separately tested |
| `$.data[0].createdAt` | string | Value replaced; format not generalized |
| `$.data[0].updatedAt` | string | Value replaced; format not generalized |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Empty results for other valid categories remain possible; this observation was populated.
- Pagination inputs, defaults, bounds, and later-page behavior remain unverified.
- Invalid-ID, not-found, error, optionality, and rate-limit behavior remain unverified.

## Related decisions

- `API-001` — the confirmed base URL served this endpoint.
- `API-002` — this category-scoped request succeeded anonymously.
- `API-003` — a category list ID successfully addressed the scoped subcategory endpoint.
- `API-004` — this successful list envelope and its observed fields/types are evidenced.
- `API-005` — no-query metadata was observed; pagination behavior remains open.
- `API-007` — the normalized bodyless GET succeeded without a trailing slash.
