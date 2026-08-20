# Add Product to Wishlist

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Add product to wishlist` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/wishlist` |
| Normalized endpoint | `/wishlist` |
| Authentication category | Controlled protected mutation |
| Observed success status | `200` |
| Duplicate add status | `200` (Idempotent) |
| Not found status (invalid product) | `404` |
| Unauthorized status | `401` |
| Capture date | `2026-08-20` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, product identifiers, and status messages were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request parameters

```json
{
  "productId": "<product-id>"
}
```

Requires custom header `token: <token>` and `Content-Type: application/json`.

## Safe success response example

```json
{
  "status": "success",
  "message": "Product added successfully to your wishlist",
  "data": [
    "<product-id-1>",
    "<product-id-2>"
  ]
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Root response object |
| `$.status` | string | Observed `"success"` |
| `$.message` | string | Observed `"Product added successfully to your wishlist"` |
| `$.data` | array | Array of string product `_id`s in the user's updated wishlist |
| `$.data[]` | string | Product identifier string |

## Key contract findings

1. **Payload Structure**: `POST /wishlist` accepts a JSON body with a single property `{ "productId": "<product-id>" }`.
2. **Return Payload Shape**: The `data` property returns an array of string product `_id`s (not populated product objects).
3. **Duplicate Add Behavior (`WISH-002`)**: Adding a product that is already present in the wishlist returns HTTP `200` with message `"Product added successfully to your wishlist"` and `data` containing the deduplicated array of product IDs. The mutation is idempotent.
4. **Invalid / Unknown Product ID**: Sending a non-existent 24-character hex ID returns HTTP `404` with `{ "statusMsg": "fail", "message": "this product not found" }`.
5. **Authentication**: Omitting the `token` header returns HTTP `401`.

## Related decisions

- `WISH-002` — Confirmed duplicate adds succeed idempotently with `200` returning updated product ID list.
