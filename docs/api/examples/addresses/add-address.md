# Add Address to Logged User Addresses

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Add address` |
| HTTP method | `POST` |
| Request URL | `https://ecommerce.routemisr.com/api/v1/addresses` |
| Normalized endpoint | `/addresses` |
| Authentication category | Controlled protected mutation |
| Observed success status | `200` |
| Validation error status | `400` |
| Unauthorized status | `401` |
| Capture date | `2026-08-21` |
| Safe response headers | `Content-Type: application/json; charset=utf-8` |
| Authentication observed | Custom header `token: <token>` required |
| Sanitization note | Synthetic test account tokens, addresses, street details, and phone numbers were inspected in memory and replaced with safe sanitized placeholders. |

## Safe request payload

Requires JSON body containing string fields `name`, `details`, `phone`, and `city`.

```http
POST /api/v1/addresses HTTP/1.1
Host: ecommerce.routemisr.com
token: <token>
Content-Type: application/json
Accept: application/json

{
  "name": "Home",
  "details": "123 Nile Street, Building 4, Apt 12",
  "phone": "01012345678",
  "city": "Cairo"
}
```

## Safe success response example

```json
{
  "status": "success",
  "message": "Address added successfully to your addresses",
  "data": [
    {
      "_id": "<address-id-1>",
      "name": "Home",
      "details": "123 Nile Street, Building 4, Apt 12",
      "phone": "01012345678",
      "city": "Cairo"
    }
  ]
}
```

## Safe error response example (Validation Error - 400)

```json
{
  "statusMsg": "fail",
  "message": "fail",
  "errors": {
    "value": "",
    "msg": "details is required",
    "param": "details",
    "location": "body"
  }
}
```

## Safe error response example (Unauthorized - 401)

```json
{
  "statusMsg": "fail",
  "message": "You are not logged in. Please login to get access"
}
```
