# Get Specific Address

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get specific address` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/addresses/{id}` |
| Normalized endpoint | `/addresses/{id}` |
| Authentication category | Controlled protected read |
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
GET /api/v1/addresses/<address-id-1> HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Accept: application/json
```

## Safe success response example

```json
{
  "status": "success",
  "data": {
    "_id": "<address-id-1>",
    "name": "Home",
    "details": "123 Nile Street, Building 4, Apt 12",
    "phone": "01012345678",
    "city": "Cairo"
  }
}
```

## Safe error response example (Not Found - 404)

```json
{
  "statusMsg": "fail",
  "message": "No address found with this id <address-id>"
}
```

## Safe error response example (Unauthorized - 401)

```json
{
  "statusMsg": "fail",
  "message": "You are not logged in. Please login to get access"
}
```
