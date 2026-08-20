# Remove Address from Logged User Addresses

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Remove address` |
| HTTP method | `DELETE` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/addresses/{id}` |
| Normalized endpoint | `/addresses/{id}` |
| Authentication category | Controlled protected mutation |
| Observed success status | `200` |
| Not found status | `404` |
| Unauthorized status | `401` |
| Capture date | `2026-08-21` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, addresses, street details, and phone numbers were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request parameters

Path parameter `id` corresponds to the address `_id`. Requires custom header `token: <token>`.

```http
DELETE /api/v1/addresses/<address-id-1> HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Accept: application/json
```

## Safe success response example

```json
{
  "status": "success",
  "message": "Address removed successfully to your addresses",
  "data": [
    {
      "_id": "<address-id-2>",
      "name": "Work",
      "details": "45 Smart Village, Building B3, 2nd Floor",
      "phone": "01098765432",
      "city": "Giza"
    }
  ]
}
```

## Safe error response example (Unauthorized - 401)

```json
{
  "statusMsg": "fail",
  "message": "You are not logged in. Please login to get access"
}
```
