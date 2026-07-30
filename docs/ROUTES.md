# Next.js Route Map

## Conventions

- Routes are proposed App Router URL paths, not application code.
- Multiple API operations may belong to one page; mutations are UI actions and do not require separate frontend pages.
- Dynamic segment names express the inferred resource meaning. The raw collection itself uses hardcoded IDs and does not formally name path variables.
- `(auth)`, `(shop)`, `(account)`, and `(admin)` may be implemented as route groups because they do not alter public URLs.
- Assumption R1: protected account/shop pages require a valid customer session.
- Assumption R2: admin pages do not ship or remain inaccessible until role and backend permissions are verified.

## Customer route structure

```text
/
/categories
/categories/[categoryId]
/subcategories
/subcategories/[subcategoryId]
/brands
/brands/[brandId]
/products
/products/[productId]
/sign-up
/sign-in
/forgot-password
/verify-reset-code
/reset-password
/account/profile
/account/security
/account/addresses
/account/addresses/new
/account/addresses/[addressId]
/wishlist
/cart
/checkout
/checkout/online/return
/account/orders
/admin/users            (conditional)
/admin/orders           (conditional)
```

## Complete API-to-route mapping

| Feature / request | API | Next.js route(s) | Frontend role |
|---|---|---|---|
| Categories — Get All Categories | `GET /categories` | `/`, `/categories` | Storefront navigation and category directory |
| Categories — Get specific category | `GET /categories/{id}` | `/categories/[categoryId]` | Category heading/detail |
| Subcategories — Get All SubCategories | `GET /subcategories` | `/subcategories` | Subcategory directory |
| Subcategories — Get specific SubCategory | `GET /subcategories/{id}` | `/subcategories/[subcategoryId]` | Subcategory detail |
| Subcategories — Get All SubCategories On Category | `GET /categories/{id}/subcategories` | `/categories/[categoryId]` | Category-scoped subcategory list |
| Brands — Get All Brands | `GET /brands` | `/`, `/brands`, `/products` | Brand directory and candidate product filter data |
| Brands — Get specific brand | `GET /brands/{id}` | `/brands/[brandId]` | Brand detail |
| Products — Get All Products | `GET /products` | `/`, `/products`, `/categories/[categoryId]`, `/brands/[brandId]` | Product listing/search/filter; category and brand pages can pass supported filters |
| Products — Get specific Product | `GET /products/{id}` | `/products/[productId]` | Product detail |
| Authentication — Signup | `POST /auth/signup` | `/sign-up` | Registration form submission |
| Authentication — signin | `POST /auth/signin` | `/sign-in` | Sign-in form submission |
| Authentication — Forgot Password | `POST /auth/forgotPasswords` | `/forgot-password` | Start password recovery |
| Authentication — Verify Reset Code | `POST /auth/verifyResetCode` | `/verify-reset-code` | Verify recovery code |
| Authentication — Reset Password | `PUT /auth/resetPassword` | `/reset-password` | Set replacement password |
| Authentication — Update Logged user password | `PUT /users/changeMyPassword` | `/account/security` | Authenticated password-change form |
| Authentication — Update Logged user data | `PUT /users/updateMe` | `/account/profile` | Authenticated profile form |
| Authentication — Get All Users | `GET /users` | `/admin/users` (conditional) | Not customer-facing; possible admin directory |
| Wishlist — Get logged user wishlist | `GET /wishlist` | `/wishlist` | Authenticated wishlist page |
| Wishlist — Add product to wishlist | `POST /wishlist` | `/products`, `/products/[productId]`, `/wishlist` | Mutation from product controls |
| Wishlist — Remove product from wishlist | `DELETE /wishlist/{id}` | `/wishlist`, `/products/[productId]` | Mutation from wishlist/product controls |
| User Addresses — Get logged user addresses | `GET /addresses` | `/account/addresses`, `/checkout` | Address directory and checkout selection candidate |
| User Addresses — Add address | `POST /addresses` | `/account/addresses/new`, `/checkout` | New-address form; checkout use is a mapping assumption |
| User Addresses — Get specific address | `GET /addresses/{id}` | `/account/addresses/[addressId]` | Read-only address detail because no update API exists |
| User Addresses — Remove address | `DELETE /addresses/{id}` | `/account/addresses`, `/account/addresses/[addressId]` | Confirmed delete action |
| Cart — Get Logged user cart | `GET /cart` | `/cart`, `/checkout` | Cart page and checkout summary |
| Cart — Add Product To Cart | `POST /cart` | `/products`, `/products/[productId]`, `/cart` | Add-to-cart mutation |
| Cart — Update cart product quantity | `PUT /cart/{id}` | `/cart` | Quantity mutation |
| Cart — Remove specific cart Item | `DELETE /cart/{id}` | `/cart` | Remove-line mutation |
| Cart — Clear user cart | `DELETE /cart` | `/cart` | Confirmed clear-cart action |
| Orders — Create Cash Order | `POST /orders/{id}` | `/checkout` | Cash-order submission; success remains on checkout or navigates to order history based on verified response |
| Orders — Checkout session | `POST /orders/checkout-session/{id}` | `/checkout` | Online checkout-session creation and provider redirect |
| Orders — getUserOrders | `GET /orders/user/{id}` | `/account/orders` | Conditional customer order history after ownership/auth verification |
| Orders — getAllOrders | `GET /orders` | `/admin/orders` (conditional) | Not customer-facing; possible admin order directory |

## Routes without a direct API request

- `/checkout/online/return` is a frontend landing route passed through the checkout `url` query parameter. The collection contains no callback/status API, so this route may refresh supported cart/order data but must not independently declare payment success.
- No `/account/addresses/[addressId]/edit` route is planned because no update-address request exists.
- No product-management or order-management mutation routes are planned because the collection supplies no supporting requests.
