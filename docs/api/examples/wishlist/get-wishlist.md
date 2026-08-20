# Get Logged User Wishlist

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get logged user wishlist` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/wishlist` |
| Normalized endpoint | `/wishlist` |
| Authentication category | Controlled protected read |
| Observed success status | `200` |
| Unauthorized status | `401` |
| Capture date | `2026-08-20` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, identifiers, product titles, image URLs, and timestamps were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request parameters

No query parameters or request body. Requires custom header `token: <token>`.

```http
GET /api/v1/wishlist HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Accept: application/json
```

## Safe success response example (Empty)

```json
{
  "status": "success",
  "count": 0,
  "data": []
}
```

## Safe success response example (Populated)

```json
{
  "status": "success",
  "count": 1,
  "data": [
    {
      "sold": 2099,
      "images": [
        "<product-image-1>",
        "<product-image-2>"
      ],
      "subcategory": [
        {
          "_id": "<subcategory-id>",
          "name": "<subcategory-name>",
          "slug": "<subcategory-slug>",
          "category": "<category-id>"
        }
      ],
      "ratingsQuantity": 37,
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
      "ratingsAverage": 4.1,
      "createdAt": "2023-04-02T02:43:18.400Z",
      "updatedAt": "2026-08-20T12:58:43.266Z",
      "__v": 0,
      "id": "<product-id>"
    }
  ]
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Root response object |
| `$.status` | string | Observed `"success"` |
| `$.count` | number | Total count of items in the wishlist |
| `$.data` | array | Array of populated product objects |
| `$.data[]._id` | string | Product identifier |
| `$.data[].id` | string | Product identifier alias |
| `$.data[].title` | string | Product title |
| `$.data[].slug` | string | URL-friendly product slug |
| `$.data[].description` | string | Product description text |
| `$.data[].quantity` | number | Available stock quantity |
| `$.data[].price` | number | Product unit price |
| `$.data[].imageCover` | string | URL to cover image |
| `$.data[].images` | array | Array of image filenames/URLs |
| `$.data[].category` | object | Nested category details |
| `$.data[].brand` | object | Nested brand details |
| `$.data[].ratingsAverage` | number | Average rating score |
| `$.data[].ratingsQuantity` | number | Number of reviews/ratings |

## Key contract findings

1. **Populated Product Data**: The response `data` array contains full product objects matching the public catalog product shape (title, price, imageCover, category, brand, ratings, etc.). No secondary catalog reads are required to render the wishlist grid.
2. **Empty Wishlist Representation**: When empty, `count` is `0` and `data` is `[]`.
3. **Authentication**: Omitting the `token` header returns HTTP `401` (`{ "statusMsg": "fail", "message": "You are not logged in. Please login to get access" }`).

## Related decisions

- `WISH-001` — Verified that wishlist items in `GET /wishlist` correspond directly to products using product `_id`.
- `WISH-002` — Confirmed `count` and `data` schema structure.
