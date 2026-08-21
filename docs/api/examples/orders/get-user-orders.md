# User Order History

## Observation

| Field | Recorded value |
|---|---|
| Request name | `getUserOrders` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/orders/user/{userId}` |
| Normalized endpoint | `/orders/user/{userId}` |
| Authentication category | Unauthenticated; no token required for access |
| Observed success status | `200` |
| Capture completed | `2026-08-21T08:22:56Z` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | User emails, phone numbers, addresses, and identifiers were redacted before this record was written. |

## Path parameter

| Parameter | Meaning | Evidence |
|---|---|---|
| `{userId}` | The user's `_id` from JWT decoded claims or sign-in response | Verified using the `id` claim from the synthetic test account's JWT |

## Authentication and ownership analysis

| Test condition | Status | Orders returned |
|---|---|---|
| With `token` header (own user ID) | `200` | 1 order |
| Without `token` header (own user ID) | `200` | 1 order |

**Critical finding**: The endpoint returns orders for any requested user ID **without authentication**. This means:
1. There is **no ownership enforcement** — any client with a user ID can retrieve that user's order history.
2. The token header is accepted but not required.
3. Cross-user testing was not performed (per project rules), but the lack of auth requirement is concerning.

## Response envelope

Unlike other endpoints that use `{ status, data }`, this endpoint returns a **bare JSON array** at the top level:

```json
[
  { /* order object */ },
  ...
]
```

## Safe success response example (200)

```json
[
  {
    "shippingAddress": {
      "details": "<details>",
      "phone": "<phone>",
      "city": "<city>"
    },
    "taxPrice": 0,
    "shippingPrice": 0,
    "totalOrderPrice": 149,
    "paymentMethodType": "cash",
    "isPaid": false,
    "isDelivered": false,
    "_id": "<order-id>",
    "user": {
      "_id": "<user-id>",
      "name": "<name>",
      "email": "<email>",
      "phone": "<phone>"
    },
    "cartItems": [
      {
        "count": 1,
        "_id": "<item-id>",
        "product": {
          "subcategory": [
            {
              "_id": "<subcategory-id>",
              "name": "Women's Clothing",
              "slug": "women's-clothing",
              "category": "<category-id>"
            }
          ],
          "ratingsQuantity": 37,
          "_id": "<product-id>",
          "title": "Woman Shawl",
          "imageCover": "<image-url>",
          "category": {
            "_id": "<category-id>",
            "name": "Women's Fashion",
            "slug": "women's-fashion",
            "image": "<image-url>"
          },
          "brand": {
            "_id": "<brand-id>",
            "name": "DeFacto",
            "slug": "defacto",
            "image": "<image-url>"
          },
          "ratingsAverage": 4.1,
          "id": "<product-id>"
        },
        "price": 149
      }
    ],
    "createdAt": "2026-08-21T08:22:54.732Z",
    "updatedAt": "2026-08-21T08:22:54.732Z",
    "id": "<order-id-numeric>",
    "__v": 0
  }
]
```

## Observed fields and data types

### Order object

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | array | Top-level array of order objects (no wrapper envelope) |
| `$[].shippingAddress` | object | Contains `details`, `phone`, `city` |
| `$[].shippingAddress.details` | string | |
| `$[].shippingAddress.phone` | string | |
| `$[].shippingAddress.city` | string | |
| `$[].taxPrice` | number | Observed `0` |
| `$[].shippingPrice` | number | Observed `0` |
| `$[].totalOrderPrice` | number | Total order amount |
| `$[].paymentMethodType` | string | `"cash"` for cash orders |
| `$[].isPaid` | boolean | Payment status |
| `$[].isDelivered` | boolean | Delivery status |
| `$[]._id` | string | MongoDB ObjectId-format order identifier |
| `$[].user` | object | **Populated** user object (unlike cash order creation which returns string ID) |
| `$[].user._id` | string | User ID |
| `$[].user.name` | string | User name |
| `$[].user.email` | string | User email |
| `$[].user.phone` | string | User phone |
| `$[].cartItems` | array | Ordered items with **populated** product objects |
| `$[].cartItems[].count` | number | Quantity |
| `$[].cartItems[].product` | object | **Populated** product (unlike cash order creation which returns string ID) |
| `$[].cartItems[].price` | number | Unit price |
| `$[].cartItems[]._id` | string | Cart-item ID |
| `$[].createdAt` | string | ISO 8601 timestamp |
| `$[].updatedAt` | string | ISO 8601 timestamp |
| `$[].id` | number | Numeric order ID alias (observed `6900`) |
| `$[].paidAt` | undefined | Not present when unpaid |
| `$[].deliveredAt` | undefined | Not present when undelivered |
| `$[].__v` | number | Mongoose version key |

### Populated product object in cartItems

| JSON path | Observed type | Notes |
|---|---|---|
| `product.subcategory` | array | Array of subcategory objects |
| `product.ratingsQuantity` | number | |
| `product._id` | string | Product ID |
| `product.title` | string | Product name |
| `product.imageCover` | string | Product cover image URL |
| `product.category` | object | Populated category with `_id`, `name`, `slug`, `image` |
| `product.brand` | object | Populated brand with `_id`, `name`, `slug`, `image` |
| `product.ratingsAverage` | number | |
| `product.id` | string | Product ID alias |

## Key differences from cash order creation response

| Aspect | Cash order creation | User order history |
|---|---|---|
| Envelope | `{ status, data }` | Bare array `[]` |
| Status code | `201` | `200` |
| `user` field | String (user ID) | Populated object |
| `cartItems[].product` | String (product ID) | Populated object with full details |
| `paidAt` / `deliveredAt` | Present as undefined keys | Absent when not applicable |

## Unknown behavior

- Pagination, sorting, and filtering of orders are not documented and were not tested.
- Empty order history response shape (empty array `[]` vs other envelope) was not tested.
- Whether online payment orders include additional fields was not observed (only cash order was created).
- Order status transitions, paid/delivered state changes, and timestamp population are unverified.
- Cross-user access was not tested (per project safety rules).
- Rate limits and maximum orders returned are unknown.

## Related decisions

- `ORDER-001` — The endpoint does **not** enforce authentication or ownership. It returns `200` with orders for any user ID regardless of whether a token is provided. Because cross-user testing is prohibited, this lack of enforcement cannot be independently verified as safe. The endpoint should be used cautiously: request only the authenticated user's own ID, and never expose the endpoint path or user IDs to the client.
- `API-004` — The order history response uses a **bare top-level array** rather than the `{ status, data }` envelope used by other endpoints. Schema/adapter code must handle this difference.
