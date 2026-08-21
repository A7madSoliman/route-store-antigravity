# Cash Order Creation

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Create Cash Order` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/orders/{cartId}` |
| Normalized endpoint | `/orders/{cartId}` |
| Authentication category | Protected; custom `token` header required |
| Observed success status | `201` |
| Capture completed | `2026-08-21T08:22:54Z` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Sanitization note | All identifiers, addresses, phone numbers, and tokens were redacted before this record was written. |

## Path parameter

| Parameter | Meaning | Evidence |
|---|---|---|
| `{cartId}` | The `_id` of the user's current cart, obtained from `GET /cart` | Verified: used the `_id` field from the cart response |

## Safe request body

```json
{
  "shippingAddress": {
    "details": "<details>",
    "phone": "<phone>",
    "city": "<city>"
  }
}
```

All three shipping address fields are string type. The request uses `Content-Type: application/json`.

## Safe success response example (201)

```json
{
  "status": "success",
  "data": {
    "taxPrice": 0,
    "shippingPrice": 0,
    "totalOrderPrice": 149,
    "paymentMethodType": "cash",
    "isPaid": false,
    "isDelivered": false,
    "_id": "<order-id>",
    "user": "<user-id>",
    "cartItems": [
      {
        "count": 1,
        "_id": "<item-id>",
        "product": "<product-id>",
        "price": 149
      }
    ],
    "shippingAddress": {
      "details": "<details>",
      "phone": "<phone>",
      "city": "<city>"
    },
    "createdAt": "2026-08-21T08:22:54.732Z",
    "updatedAt": "2026-08-21T08:22:54.732Z",
    "id": "<order-id>",
    "__v": 0
  }
}
```

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `$` | object | Response root |
| `$.status` | string | Value `"success"` |
| `$.data` | object | The created order |
| `$.data._id` | string | MongoDB ObjectId-format order identifier |
| `$.data.user` | string | The authenticated user's ID (string in creation response) |
| `$.data.cartItems` | array | Array of cart line items at time of order |
| `$.data.cartItems[].count` | number | Quantity for this line |
| `$.data.cartItems[].product` | string | Product `_id` (string in creation response, not populated) |
| `$.data.cartItems[].price` | number | Unit price for this line |
| `$.data.cartItems[]._id` | string | Cart-item ID |
| `$.data.taxPrice` | number | Observed `0` |
| `$.data.shippingPrice` | number | Observed `0` |
| `$.data.totalOrderPrice` | number | Total including all items |
| `$.data.paymentMethodType` | string | `"cash"` for cash orders |
| `$.data.isPaid` | boolean | `false` at creation |
| `$.data.isDelivered` | boolean | `false` at creation |
| `$.data.paidAt` | undefined | Not present at creation |
| `$.data.deliveredAt` | undefined | Not present at creation |
| `$.data.shippingAddress` | object | Echo of submitted shipping address |
| `$.data.shippingAddress.details` | string | |
| `$.data.shippingAddress.phone` | string | |
| `$.data.shippingAddress.city` | string | |
| `$.data.createdAt` | string | ISO 8601 timestamp |
| `$.data.updatedAt` | string | ISO 8601 timestamp |
| `$.data.id` | number | Numeric order ID alias (observed `6900`) |
| `$.data.__v` | number | Mongoose version key |

## Cart lifecycle after cash order

After the successful `POST /orders/{cartId}`, a subsequent `GET /cart` returned:

```json
{
  "status": "success",
  "numOfCartItems": 0,
  "data": {
    "products": [],
    "totalCartPrice": 0
  }
}
```

The cart was **automatically cleared** by the server after the cash order was created. The cart object still exists (status `200` with `data` present), but its products array is empty and totals are zero. The original `cartId` is no longer usable for another order.

## Unknown behavior

- Stock validation, out-of-stock, and price-change errors were not tested.
- Duplicate submission with the same cart ID (after it was cleared) was not tested.
- Missing or malformed shipping address validation was not tested.
- Currency, tax, and shipping calculation rules are unknown.
- Whether `paidAt` and `deliveredAt` populate on status change is unverified.
- Idempotency and retry behavior are unknown.
- Maximum cart size and order limits are unknown.

## Related decisions

- `CHECKOUT-002` — The path parameter `{id}` is confirmed to be the cart `_id`. Cart is automatically cleared after cash order creation. Status `201` is the success code.
- `CHECKOUT-004` — Shipping address body uses `details`, `phone`, and `city` (no `name` field), consistent with the saved-address mapping decision.
- `API-004` — Cash order success envelope is `{ status: "success", data: Order }` with status `201`.
