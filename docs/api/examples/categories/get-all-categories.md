# Get All Categories

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get All Categories` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/categories` |
| Normalized endpoint | `/categories` |
| Authentication category | Safe public read |
| Observed status code | `200` |
| Capture date | `2026-07-31T15:50:14Z` |
| Response time | `589.65 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The response was parsed in process memory only. The full catalog was not emitted or written. The example retains one item and replaces its identifier, text, media URL, and timestamps with role-based placeholders. No credentials, cookies, or personal data were sent or observed. |

## Safe request parameters

None. The request used no path parameters, query parameters, body, authentication, cookies, or redirect-following behavior. It sent only `Accept: application/json`.

## Safe response example

```json
{
  "results": 10,
  "metadata": {
    "currentPage": 1,
    "numberOfPages": 1,
    "limit": 40
  },
  "data": [
    {
      "_id": "<category-id>",
      "name": "<category-name>",
      "slug": "<category-slug>",
      "image": "<category-image-url>",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ]
}
```

The live response contained more than one category. This record intentionally retains only one placeholder item and the observed numeric envelope values.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful response root for this observation |
| `$.results` | number | Observed value `10`; meaning and stability are not guaranteed by one response |
| `$.metadata` | object | Pagination-like metadata container |
| `$.metadata.currentPage` | number | Observed value `1` without a page query |
| `$.metadata.numberOfPages` | number | Observed value `1` |
| `$.metadata.limit` | number | Observed value `40`; default and maximum are unverified |
| `$.data` | array | Contained category objects; only the first item's structure was retained |
| `$.data[0]` | object | Representative category object |
| `$.data[0]._id` | string | Value replaced with `<category-id>` |
| `$.data[0].name` | string | Value replaced with `<category-name>` |
| `$.data[0].slug` | string | Value replaced with `<category-slug>` |
| `$.data[0].image` | string | Value replaced with `<category-image-url>` |
| `$.data[0].createdAt` | string | Value replaced with `<timestamp>`; exact format is not generalized |
| `$.data[0].updatedAt` | string | Value replaced with `<timestamp>`; exact format is not generalized |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Anonymous access for the other eight catalog GET candidates remains unverified.
- Error and not-found status codes and response envelopes remain unverified.
- Field optionality, nullability, stability, and semantics across other category records remain unverified.
- Pagination defaults, accepted query values, bounds, and behavior beyond this no-query response remain unverified.
- Rate-limit behavior and cache behavior remain unverified; no related safe header was recorded.
- The media URL value and its host were deliberately not retained.

## Related decisions

- `API-001` — the provisional base URL served this endpoint successfully at the capture time.
- `API-002` — this categories list request succeeded without authentication; the broader catalog-public assumption remains provisional.
- `API-004` — one successful categories response shape is observed; other success and error contracts remain open.
