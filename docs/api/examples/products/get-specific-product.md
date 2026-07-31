# Get specific Product

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get specific Product` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/products/<product-id>` |
| Normalized endpoint | `/products/{productId}` |
| Authentication category | Safe public read |
| Authentication observed | Anonymous success; no token, credentials, or cookies sent |
| Observed status code | `200` |
| Capture date | `2026-07-31T16:42:53Z` |
| Response time | `101.85 ms` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | The product ID came from the first item returned by this run's `GET /products` response and remained in memory only. The raw detail was not emitted or written. All identifiers, text, media, timestamps, review content, and user values are placeholders; nested arrays retain one member at most. |

## Safe request parameters

Path parameter `{productId}` used the unmodified first `_id` returned by `GET /products`. No query, body, authentication, cookies, redirect following, or trailing slash were used.

## Safe response example

```json
{
  "data": {
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
    "__v": 0,
    "reviews": [
      {
        "_id": "<review-id>",
        "review": "<review-text>",
        "rating": 3,
        "product": "<product-id>",
        "user": {
          "_id": "<user-id>",
          "name": "<user-name>"
        },
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>",
        "__v": 0
      }
    ],
    "id": "<product-id-alias>"
  }
}
```

The observed `images` array contained `4` strings, `subcategory` contained one object, and `reviews` contained `34` objects. Only the first member of each array is retained.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Successful response root |
| `$.data` | object | Product resource wrapper |
| `$.data.sold` | number | Observed value `1900`; semantics unverified |
| `$.data.images` | array | Observed `4` members |
| `$.data.images[0]` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data.subcategory` | array | Observed one member |
| `$.data.subcategory[0]` | object | Nested subcategory object |
| `$.data.subcategory[0]._id` | string | Value replaced with `<subcategory-id>` |
| `$.data.subcategory[0].name` | string | Value replaced |
| `$.data.subcategory[0].slug` | string | Value replaced |
| `$.data.subcategory[0].category` | string | Value replaced with `<category-id>`; semantics not independently tested |
| `$.data.ratingsQuantity` | number | Observed value `34`; semantics unverified |
| `$.data._id` | string | Matched the product ID selected from the list response; value replaced |
| `$.data.title` | string | Value replaced |
| `$.data.slug` | string | Value replaced |
| `$.data.description` | string | Value replaced |
| `$.data.quantity` | number | Observed value `220`; stock/availability semantics unverified |
| `$.data.price` | number | Observed value `149`; currency and pricing semantics unverified |
| `$.data.imageCover` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data.category` | object | Nested category object |
| `$.data.category._id` | string | Value replaced with `<category-id>` |
| `$.data.category.name` | string | Value replaced |
| `$.data.category.slug` | string | Value replaced |
| `$.data.category.image` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data.brand` | object | Nested brand object |
| `$.data.brand._id` | string | Value replaced with `<brand-id>` |
| `$.data.brand.name` | string | Value replaced |
| `$.data.brand.slug` | string | Value replaced |
| `$.data.brand.image` | string | Observed as an absolute HTTPS URL; value replaced |
| `$.data.ratingsAverage` | number | Observed value `3.9`; range and semantics unverified |
| `$.data.createdAt` | string | Value replaced; format not generalized |
| `$.data.updatedAt` | string | Value replaced; format not generalized |
| `$.data.__v` | number | Observed value `0`; semantics unverified |
| `$.data.reviews` | array | Observed `34` members; one structure retained |
| `$.data.reviews[0]` | object | Review structure observed in detail only; no review capability is inferred |
| `$.data.reviews[0]._id` | string | Value replaced with `<review-id>` |
| `$.data.reviews[0].review` | string | Content replaced with `<review-text>` |
| `$.data.reviews[0].rating` | number | Observed value `3`; range and semantics unverified |
| `$.data.reviews[0].product` | string | Value replaced with `<product-id>`; equality not independently tested |
| `$.data.reviews[0].user` | object | Nested user reference; no account fields beyond those observed are inferred |
| `$.data.reviews[0].user._id` | string | Value replaced with `<user-id>` |
| `$.data.reviews[0].user.name` | string | Value replaced with `<user-name>` |
| `$.data.reviews[0].createdAt` | string | Value replaced; format not generalized |
| `$.data.reviews[0].updatedAt` | string | Value replaced; format not generalized |
| `$.data.reviews[0].__v` | number | Observed value `0`; semantics unverified |
| `$.data.id` | string | Value replaced; relationship to `_id` unverified |

## Before state, cleanup, and after state

Not applicable — Safe public read. The request made no state change.

## Unknown behavior

- Invalid-ID and not-found statuses and envelopes remain unverified.
- Field optionality, nullability, stability, and numeric semantics remain unverified.
- Currency, discount behavior, stock guarantees, rating ranges, review ordering/privacy, and identifier alias semantics remain unverified.
- Observed review data does not authorize review submission or require review UI outside approved product scope.
- Media host/path stability and availability remain unverified.

## Related decisions

- `API-001` — the confirmed base served this endpoint.
- `API-002` — this product detail request succeeded anonymously.
- `API-003` — a product list `_id` addressed detail and matched detail `data._id`.
- `API-004` — this successful product-detail envelope and its fields/types are evidenced.
- `API-007` — the normalized bodyless GET succeeded without a trailing slash.
- `DESIGN-002` — product gallery and cover media fields were observed as API-provided absolute HTTPS URL strings.
