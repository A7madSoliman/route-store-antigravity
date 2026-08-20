# Remove Product from Wishlist

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Remove product from wishlist` |
| HTTP method | `DELETE` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/wishlist/{id}` |
| Normalized endpoint | `/wishlist/{id}` |
| Authentication category | Controlled protected mutation |
| Observed success status | `200` |
| Non-existent item status | `200` (Idempotent) |
| Unauthorized status | `401` |
| Capture date | `2026-08-20` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, product identifiers, and status messages were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request parameters

Path parameter `{id}` is the target product's `_id`.

```http
DELETE /api/v1/wishlist/<product-id> HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Accept: application/json
```

No request body or query parameters.

## Safe success response example

```json
{
  "status": "success",
  "message": "Product removed successfully to your wishlist",
  "data": [
    "<remaining-product-id>"
  ]
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Root response object |
| `$.status` | string | Observed `"success"` |
| `$.message` | string | Observed `"Product removed successfully to your wishlist"` |
| `$.data` | array | Array of string product `_id`s remaining in the user's wishlist |
| `$.data[]` | string | Remaining product identifier string |

## Key contract findings

1. **Identifier Semantics (`WISH-001`)**: The path parameter `{id}` is the **product `_id`** (matching `product._id` from `GET /products` and `GET /wishlist`). Wishlist items do not have separate entry IDs.
2. **Return Payload Shape**: The `data` property returns an array of the remaining product `_id` strings after removal. When the last item is removed, `data` is `[]`.
3. **Idempotency**: Deleting a product that is not currently in the user's wishlist (or already removed) returns HTTP `200` with message `"Product removed successfully to your wishlist"` and `data` containing current remaining product IDs.
4. **Authentication**: Omitting the `token` header returns HTTP `401`.

## Related decisions

- `WISH-001` — Resolved: `DELETE /wishlist/{id}` takes the product `_id`.
- `WISH-002` — Confirmed deletion response envelope and idempotency.
