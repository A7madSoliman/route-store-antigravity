# Get Logged User Addresses

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Get logged user addresses` |
| HTTP method | `GET` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/addresses` |
| Normalized endpoint | `/addresses` |
| Authentication category | Controlled protected read |
| Observed success status | `200` |
| Unauthorized status | `401` |
| Capture date | `2026-08-21` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, addresses, street details, and phone numbers were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request parameters

No query parameters or request body. Requires custom header `token: <token>`.

```http
GET /api/v1/addresses HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Accept: application/json
```

## Safe success response example (Empty)

```json
{
  "status": "success",
  "results": 0,
  "data": []
}
```

## Safe success response example (Populated)

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "_id": "<address-id-1>",
      "name": "Home",
      "details": "123 Nile Street, Building 4, Apt 12",
      "phone": "01012345678",
      "city": "Cairo"
    },
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
