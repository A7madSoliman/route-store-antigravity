# Get All Products

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get All Products` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/products` |
| Normalized endpoint | `/products` |
| Authentication category | Safe public read |
| Authentication observed | Anonymous success; no token, credentials, or cookies sent |
| Observed status code | `200` |
| Capture date | `2026-07-31T16:42:52Z` |
| Response time | `883.75 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The response was parsed in process memory only. The full catalog was not emitted or written. The example retains one product, one image, and one subcategory while replacing every identifier, text value, media URL, and timestamp. |

## Safe request parameters

None. No path or query parameters, body, authentication, cookies, redirect following, or trailing slash were used. The request sent only `Accept: application/json`.

## Safe response example

```json
{
  "results": 56,
  "metadata": {
    "currentPage": 1,
    "numberOfPages": 2,
    "limit": 40,
    "nextPage": 2
  },
  "data": [
    {
      "sold": 1900,
      "images": ["<product-image-url>"],
      "subcategory": [
        {
          "_id": "<subcategory-id>",
          "name": "<subcategory-name>",
          "slug": "<subcategory-slug>",
          "category": "<category-id>"
        }
      ],
      "ratingsQuantity": 34,
      "_id": "<product-id>",
      "title": "<product-title>",
      "slug": "<product-slug>",
      "description": "<product-description>",
      "quantity": 220,
      "price": 149,
      "imageCover": "<product-cover-url>",
      "category": {
        "_id": "<category-id>",
        "name": "<category-name>",
        "slug": "<category-slug>",
        "image": "<category-image-url>"
      },
      "brand": {
        "_id": "<brand-id>",
        "name": "<brand-name>",
        "slug": "<brand-slug>",
        "image": "<brand-image-url>"
      },
      "ratingsAverage": 3.9,
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>",
      "id": "<product-id-alias>"
    }
  ]
}
```

The response contained `40` products. The representative product's `images` array contained `4` strings and its `subcategory` array contained one object; only the first member of each array is retained.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful response root |
| `$.results` | number | Observed value `56`; semantics not generalized |
| `$.metadata` | object | Pagination-like metadata container |
| `$.metadata.currentPage` | number | Observed value `1` without a query |
| `$.metadata.numberOfPages` | number | Observed value `2` |
| `$.metadata.limit` | number | Observed value `40`; default and bounds unverified |
| `$.metadata.nextPage` | number | Observed value `2` |
| `$.data` | array | Observed `40` products; one structure retained |
| `$.data[0]` | object | Representative product object |
| `$.data[0].sold` | number | Observed value `1900`; semantics unverified |
| `$.data[0].images` | array | Observed `4` members |
| `$.data[0].images[0]` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data[0].subcategory` | array | Observed one member |
| `$.data[0].subcategory[0]` | object | Nested subcategory object |
| `$.data[0].subcategory[0]._id` | string | Value replaced with `<subcategory-id>` |
| `$.data[0].subcategory[0].name` | string | Value replaced |
| `$.data[0].subcategory[0].slug` | string | Value replaced |
| `$.data[0].subcategory[0].category` | string | Value replaced with `<category-id>`; semantics not independently tested |
| `$.data[0].ratingsQuantity` | number | Observed value `34`; semantics unverified |
| `$.data[0]._id` | string | Selected for the detail request; value retained only in memory |
| `$.data[0].title` | string | Value replaced |
| `$.data[0].slug` | string | Value replaced |
| `$.data[0].description` | string | Value replaced |
| `$.data[0].quantity` | number | Observed value `220`; stock/availability semantics unverified |
| `$.data[0].price` | number | Observed value `149`; currency and pricing semantics unverified |
| `$.data[0].imageCover` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data[0].category` | object | Nested category object |
| `$.data[0].category._id` | string | Value replaced with `<category-id>` |
| `$.data[0].category.name` | string | Value replaced |
| `$.data[0].category.slug` | string | Value replaced |
| `$.data[0].category.image` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data[0].brand` | object | Nested brand object |
| `$.data[0].brand._id` | string | Value replaced with `<brand-id>` |
| `$.data[0].brand.name` | string | Value replaced |
| `$.data[0].brand.slug` | string | Value replaced |
| `$.data[0].brand.image` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data[0].ratingsAverage` | number | Observed value `3.9`; range and semantics unverified |
| `$.data[0].createdAt` | string | Value replaced; format not generalized |
| `$.data[0].updatedAt` | string | Value replaced; format not generalized |
| `$.data[0].id` | string | Value replaced; relationship to `_id` unverified |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Pagination, search, sorting, field selection, price, brand, and category queries remain untested for F05.
- Error and not-found statuses and envelopes remain unverified.
- Field optionality, nullability, ordering, stability, and numeric semantics remain unverified.
- Currency, discount behavior, stock guarantees, rating range, and identifier alias semantics remain unverified.
- Media host/path stability and availability remain unverified.

## Related decisions

- `API-001` — the confirmed base served this endpoint.
- `API-002` — this product list request succeeded anonymously.
- `API-003` — the first returned product `_id` was used for detail.
- `API-004` — this successful product-list envelope and its fields/types are evidenced.
- `API-005` — no-query metadata was observed; pagination behavior remains open.
- `API-007` — the normalized bodyless GET succeeded without a trailing slash.
- `DESIGN-002` — product, category, and brand media fields were observed as API-provided absolute HTTPS URL strings.
