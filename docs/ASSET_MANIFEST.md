# Production Asset Manifest

## 1. Status and authority

This is the D04 asset audit for the approved Stitch screen set. Screenshots remain the primary visual source; exported HTML/CSS supplies art direction and placement evidence only. An exported URL is not a production source or proof of reuse rights.

Filesystem validation on 2026-07-31 found:

- 27 PNG screenshots and 27 HTML exports;
- 27 matching base filenames and no unmatched files;
- 69 remote image occurrences across 20 exports;
- 69 unique Stitch-hosted URLs and 69 unique SHA-256 fingerprints.

No production source, license, or provenance record exists for the four required static raster roles. Therefore this audit creates no production asset files, and D04 remains incomplete. The 69-reference ledger in section 7 audits exported references; it is not a claim that all 69 placements are approved functionality or visible in the selected screenshot state.

## 2. Classification and readiness

| Class | Ownership | D04 disposition |
|---|---|---|
| A — Static local | Marketing or decorative art that is independent of API data | Localize only after an approved original and production-reuse record are supplied |
| B — API-driven | Product, gallery, category, brand, cart, wishlist, checkout, or order media | Keep as validated runtime response data; never copy from Stitch into `public/` |
| C — Code-native vector/CSS | Interface icons, simple empty-state symbols, wordmark text, gradients, and geometric decoration | Implement later as inline SVG React components, text, or CSS; D04 creates no files |
| D — Deferred or unsupported | Avatars, maps, provider marks, and unsupported feature art | Omit or use the documented non-image fallback until the relevant product/data gate passes |

Readiness values are `Blocked`, `API-owned`, `Code-owned`, and `Deferred`. `Ready` is reserved for a checked-in, validated file with approved provenance; there are no `Ready` entries in this audit.

## 3. Static local candidates

Paths below are reserved destinations, not existing files. `<approved-ext>` is unresolved until an original file is supplied and its encoding is inspected; do not rename a file to a format it does not contain.

| ID and role | Screenshot/export evidence | Intended path | Dimensions and format | Render and responsive behavior | Semantics, fallback, and reuse | Source, license, readiness |
|---|---|---|---|---|---|---|
| `STATIC-001` Desktop home hero | `home-desktop`; export line 175; screenshot bitmap 392×1600 (**Observed**, rescaled) | `public/images/marketing/home-hero-desktop.<approved-ext>` | Original pixels/format unknown (**Uncertain**); export frame height 750 CSS px (**Code-derived**) | Full-bleed cover, centered focal area, dark overlay, left copy-safe zone; desktop-only artwork | Decorative background because adjacent heading/copy conveys the message; no raster substitute; do not reuse as mobile hero | Stitch URL is art direction only; origin and license absent; **Blocked** |
| `STATIC-002` Mobile home hero | `home-mobile`; export line 161; screenshot bitmap 207×1600 (**Observed**, rescaled) | `public/images/marketing/home-hero-mobile.<approved-ext>` | Original pixels/format unknown (**Uncertain**); export frame height 480 CSS px (**Code-derived**) | Portrait cover, centered model/focal area, bottom gradient and copy-safe zone; distinct mobile art direction, not a blind crop of desktop | Decorative background; no raster substitute; reuse only for the mobile hero | Stitch URL is art direction only; origin and license absent; **Blocked** |
| `STATIC-003` Desktop home promotion background | `home-desktop`; export line 305 | `public/images/marketing/home-promotion-summer-refresh.<approved-ext>` | Original pixels/format unknown (**Uncertain**); export frame height 450 CSS px (**Code-derived**) | Very wide cover aligned right with a left blue copy-safe gradient; desktop use only because mobile promotion is CSS-only | Decorative background with empty alternative; no fallback image. The asset does not approve a coupon, discount, sale route, or CTA behavior excluded by `PRD.md` | Stitch URL is art direction only; origin and license absent; **Blocked** |
| `STATIC-004` Fulfillment-center banner | `saved-addresses-desktop`; export line 262; screenshot bitmap 1600×1535 (**Observed**, rescaled) | `public/images/decorative/fulfillment-center-banner.<approved-ext>` | Original pixels/format unknown (**Uncertain**); export frame height 256 CSS px and very-wide crop (**Code-derived**) | Cover with center focal area and left-to-right surface gradient preserving the left copy zone; mobile behavior is unpaired and **Uncertain** | Decorative with empty alt because adjacent copy owns meaning; use a tonal surface if absent; do not reuse as category/order media | Stitch URL is art direction only; origin and license absent; **Blocked** |

Before any row becomes `Ready`, record the supplier/original, license or permission, checksum, actual MIME type, pixel dimensions, file size, and tested crop. Do not upscale, recompress, or download the Stitch reference as a substitute.

## 4. API-driven media responsibilities

API media stays outside `public/`. The server adapter accepts only verified fields, validates an absolute HTTPS URL and the later-approved host allowlist, and returns a domain media value or `null`. A neutral tonal surface or omitted slot is the default fallback; no generic product raster is required.

| Role | Screens | Required source | Crop and responsive behavior | Alt and missing-field behavior | Readiness |
|---|---|---|---|---|---|
| Category cards/rails | Home desktop/mobile and category views | Verified category image field | Desktop bento cover; mobile circular cover; keep category identity tied to the returned record | Alt from verified category name when semantic; otherwise empty. Omit or use tonal surface if absent | `category.image` evidence exists; **API-owned** |
| Brand media | Home brand treatment and brand views | Verified brand image field | Contain logo-like art without distortion; never force a cover crop | Alt from verified brand name; render name as text when no image exists | `brand.image` evidence exists; **API-owned** |
| Product cards and rails | Home trending, listings, related products, account previews | Verified product list/detail image field | Use the screenshot-specific square, 4:5, or 3:4 cover frame without changing source ownership | Alt from verified product title; tonal surface if invalid/missing | `imageCover` evidence exists; **API-owned** |
| Product gallery and feature media | Product detail desktop/mobile | Verified product-detail `imageCover`/`images` values only | Main 4:5 cover, thumbnails, and mobile snap gallery; a descriptive feature image may reuse returned gallery media only when the mapping is explicit | Product-derived alt for semantic gallery media; omit unsupported feature slots | Product gallery evidence exists; **API-owned** |
| Cart lines | Cart desktop/mobile | Media field verified during F10, or product media already present in the verified cart contract | Compact square/portrait cover matching the cart layout | Product-derived alt; tonal surface/omit until verified; no per-item fan-out merely to match Stitch | Response field pending F10; **API-owned** |
| Wishlist items | Wishlist and account preview | Media field verified during F09, or product media already present in the verified wishlist contract | Square card cover and compact preview crops | Product-derived alt; tonal surface/omit until verified | Response field pending F09; **API-owned** |
| Checkout summary | Checkout | Media supplied by the verified cart/checkout flow | Compact square crop; retain server cart identity | Product-derived alt; tonal surface/omit until verified | Response field pending F10/F12; **API-owned** |
| Order history/items | Conditional order history and reference-only order detail design | Media field verified during F12/O00 | Compact square thumbnail only when the own-account order contract supplies it | Product-derived alt; omit when absent | Contract pending F12/O00; **API-owned** |

## 5. Code-native presentation inventory

These roles require no downloaded asset in D04:

- **Wordmark:** screenshots render “Nexa Store” as text. Keep the text treatment unless a separately approved logo is supplied.
- **Auth atmosphere:** the visible auth backgrounds are CSS radial/tonal gradients, not raster files.
- **Mobile promotion decoration:** circles, surfaces, gradients, and typography are CSS. This visual does not approve promotional functionality.
- **Empty states:** use a tonal container and a semantic inline SVG icon with heading/copy. Do not invent a catalog, cart, wishlist, or order illustration.
- **Interface icons:** implement the smallest semantic inline SVG components under `components/icons` during the matching UI milestone. Use `currentColor`, a consistent 24×24 view box, and `aria-hidden="true"` when the labeled parent supplies the accessible name. Do not copy Material Symbols runtime loading or generated JavaScript.

The exports contain the following glyph vocabulary. It is an audit inventory, not automatic approval of the associated control:

`account_balance`, `account_balance_wallet`, `account_circle`, `add`, `add_location_alt`, `alternate_email`, `apple`, `arrow_back`, `arrow_forward`, `bolt`, `box`, `call`, `check`, `check_circle`, `chevron_left`, `chevron_right`, `close`, `credit_card`, `currency_exchange`, `dashboard`, `delete`, `distance`, `eco`, `edit`, `error`, `expand_more`, `favorite`, `file_download`, `filter_list`, `google`, `history`, `home`, `home_pin`, `info`, `inventory_2`, `language`, `local_shipping`, `location_on`, `lock`, `lock_reset`, `logout`, `mail`, `menu`, `my_location`, `notifications`, `notifications_active`, `package`, `package_2`, `payments`, `person`, `photo_camera`, `progress_activity`, `public`, `published_with_changes`, `rebase_edit`, `receipt`, `remove`, `report`, `search`, `search_off`, `security`, `share`, `shield_person`, `shopping_bag`, `shopping_basket`, `shopping_cart`, `shopping_cart_checkout`, `shopping_cart_off`, `sort`, `star`, `star_half`, `storefront`, `support_agent`, `sync`, `verified`, `verified_user`, `video_library`, `visibility`, `work`.

Unsupported or deferred glyphs—such as social providers, avatar upload, rewards, tracking, address editing, unsupported payment methods, and direct payment-success controls—remain absent regardless of their appearance in this list.

## 6. Deferred and unsupported image roles

| Role | Evidence | Disposition | Fallback/gate |
|---|---|---|---|
| Customer/profile avatars | Nine remote references across account, profile, security, addresses, wishlist, and order designs | Do not localize, upload, or infer | Generic account icon or verified-name initials; reopen only after a verified avatar field/update API exists |
| Delivery-zone map | `shipping-selected-desktop` | Do not localize and do not add a map dependency | Omit the preview or use a non-map address summary; reopen only with an approved map/data source |
| Payment-provider logo grid | Hidden demo state in `payment-desktop` | Export-only and deferred | No logo asset; payment return remains neutral until the checkout contract supports provider/status behavior |
| Google/Apple/social marks | `signup-desktop` export defect and social controls in auth designs | Social authentication is outside current API scope | Omit social controls; if later approved, use official provider assets with their own licenses |

## 7. Stitch remote-reference ledger

Each reference is identified by export basename and one-based source line plus the first 12 hexadecimal characters of the URL’s SHA-256 digest. Full temporary URLs are intentionally not duplicated here; the exact source remains in the reference export. All fingerprints were unique on 2026-07-31.

| Ref | Export location | URL fingerprint | Visual role | Class and disposition |
|---|---|---|---|---|
| `REMOTE-001` | `account-desktop:165` | `94fa6576ceb9` | Account-overview avatar | D — unsupported avatar; reference-only screen |
| `REMOTE-002` | `account-desktop:261` | `0afa0372f2a1` | Account wishlist-preview product 1 | B — wishlist/product API media; reference-only screen |
| `REMOTE-003` | `account-desktop:267` | `d361f9f377e9` | Account wishlist-preview product 2 | B — wishlist/product API media; reference-only screen |
| `REMOTE-004` | `account-mobile:153` | `e8c9b47290e0` | Mobile account-overview avatar | D — unsupported avatar; reference-only screen |
| `REMOTE-005` | `cart-desktop:156` | `2b72d1279fd2` | Desktop cart line 1 | B — cart API media |
| `REMOTE-006` | `cart-desktop:182` | `4824642736f9` | Desktop cart line 2 | B — cart API media |
| `REMOTE-007` | `cart-mobile:146` | `ee8e5607592f` | Mobile cart line 1 | B — cart API media |
| `REMOTE-008` | `cart-mobile:171` | `932b95946148` | Mobile cart line 2 | B — cart API media |
| `REMOTE-009` | `change-password-desktop:148` | `9d078ddd6c97` | Account/security avatar | D — unsupported avatar |
| `REMOTE-010` | `checkout-desktop:241` | `4c33e6d310e9` | Checkout summary item 1 | B — cart/checkout API media |
| `REMOTE-011` | `checkout-desktop:255` | `8b41d3b2478d` | Checkout summary item 2 | B — cart/checkout API media |
| `REMOTE-012` | `edit-profile-desktop:155` | `9a3066d79e6d` | Account-shell avatar | D — unsupported avatar |
| `REMOTE-013` | `edit-profile-desktop:204` | `d9fc013e8c67` | Profile-edit preview/avatar upload | D — unsupported avatar/upload |
| `REMOTE-014` | `home-desktop:175` | `50e77ddff239` | Desktop home hero | A — `STATIC-001`; blocked on source/license |
| `REMOTE-015` | `home-desktop:199` | `749f3d653434` | Designer Fashion category bento | B — category API media |
| `REMOTE-016` | `home-desktop:208` | `84350af36b4a` | Electronics category bento | B — category API media |
| `REMOTE-017` | `home-desktop:215` | `a3f42132bfb6` | Home & Living category bento | B — category API media |
| `REMOTE-018` | `home-desktop:223` | `920d8b59dde4` | Beauty & Grooming category bento | B — category API media |
| `REMOTE-019` | `home-desktop:305` | `7348374a11e7` | Desktop promotion background | A — `STATIC-003`; blocked and functionally non-authoritative |
| `REMOTE-020` | `home-mobile:161` | `60177063f956` | Mobile home hero | A — `STATIC-002`; blocked on source/license |
| `REMOTE-021` | `home-mobile:182` | `81aeb34fbacf` | Accessories category rail | B — category API media |
| `REMOTE-022` | `home-mobile:188` | `365b3156881b` | Men’s Wear category rail | B — category API media |
| `REMOTE-023` | `home-mobile:194` | `cc9e89803db1` | Women’s category rail | B — category API media |
| `REMOTE-024` | `home-mobile:200` | `d1ee91c3d477` | Footwear category rail | B — category API media |
| `REMOTE-025` | `home-mobile:235` | `d804c568be30` | Trending product card 1 | B — product API media |
| `REMOTE-026` | `home-mobile:257` | `b7008b2c4515` | Trending product card 2 | B — product API media |
| `REMOTE-027` | `order-details-desktop:152` | `00eae8ad016c` | Order-detail avatar | D — unsupported avatar; reference-only screen |
| `REMOTE-028` | `order-details-desktop:324` | `ac10a6164787` | Order-detail line 1 | B — order API media; reference-only screen |
| `REMOTE-029` | `order-details-desktop:341` | `66835928b475` | Order-detail line 2 | B — order API media; reference-only screen |
| `REMOTE-030` | `order-details-desktop:358` | `9c40b83e74a1` | Order-detail line 3 | B — order API media; reference-only screen |
| `REMOTE-031` | `order-history-desktop:151` | `ae29db42e6fc` | Order-history avatar | D — unsupported avatar; conditional screen |
| `REMOTE-032` | `order-history-desktop:198` | `c126a8290c78` | Order-history item 1 | B — order API media; conditional screen |
| `REMOTE-033` | `order-history-desktop:223` | `7b35e71e4cb8` | Order-history item 2 | B — order API media; conditional screen |
| `REMOTE-034` | `order-history-desktop:248` | `b3fdc431d90f` | Order-history item 3 | B — order API media; conditional screen |
| `REMOTE-035` | `payment-desktop:204` | `45eef0a0097f` | Secure-payment provider logo grid | D — hidden export demo state; deferred |
| `REMOTE-036` | `product-details-desktop:173` | `1fb4da69ac76` | Product gallery thumbnail 1 | B — product API media |
| `REMOTE-037` | `product-details-desktop:176` | `06d042aaf416` | Product gallery thumbnail 2 | B — product API media |
| `REMOTE-038` | `product-details-desktop:179` | `890debe471a9` | Product gallery thumbnail 3 | B — product API media |
| `REMOTE-039` | `product-details-desktop:182` | `deb8abcab57a` | Product gallery thumbnail 4 | B — product API media |
| `REMOTE-040` | `product-details-desktop:187` | `e2931b5ab3b1` | Product gallery main image | B — product API media |
| `REMOTE-041` | `product-details-desktop:304` | `e5b2ef89af9b` | Product-description feature media | B — returned product gallery media only, otherwise omit |
| `REMOTE-042` | `product-details-desktop:330` | `3cdc606d2414` | Related product 1 | B — product API media |
| `REMOTE-043` | `product-details-desktop:341` | `f2bc10844d35` | Related product 2 | B — product API media |
| `REMOTE-044` | `product-details-desktop:352` | `3f7a88ccdd48` | Related product 3 | B — product API media |
| `REMOTE-045` | `product-details-desktop:363` | `e494e3584c61` | Related product 4 | B — product API media |
| `REMOTE-046` | `product-details-mobile:144` | `1f79e5e9b1cf` | Mobile product gallery slide 1 | B — product API media |
| `REMOTE-047` | `product-details-mobile:147` | `2cc0323ec22d` | Mobile product gallery slide 2 | B — product API media |
| `REMOTE-048` | `product-details-mobile:238` | `6932e4e5aea3` | Mobile related product 1 | B — product API media |
| `REMOTE-049` | `product-details-mobile:246` | `7b3ca4ff5ee8` | Mobile related product 2 | B — product API media |
| `REMOTE-050` | `product-details-mobile:254` | `92942990110b` | Mobile related product 3 | B — product API media |
| `REMOTE-051` | `product-details-mobile:262` | `1ed612d8b75d` | Mobile related product 4 | B — product API media |
| `REMOTE-052` | `products-desktop:280` | `f103d0a44a08` | Desktop product card 1 | B — product API media |
| `REMOTE-053` | `products-desktop:313` | `5892e02a2a89` | Desktop product card 2 | B — product API media |
| `REMOTE-054` | `products-desktop:353` | `133f437b9183` | Desktop product card 3 | B — product API media |
| `REMOTE-055` | `products-mobile:158` | `4193817a85d8` | Mobile product card 1 | B — product API media |
| `REMOTE-056` | `products-mobile:168` | `51282ba34ff5` | Mobile product card 2 | B — product API media |
| `REMOTE-057` | `products-mobile:181` | `940fb5c56425` | Mobile product card 3 | B — product API media |
| `REMOTE-058` | `products-mobile:190` | `1a688ea095fe` | Mobile product card 4 | B — product API media |
| `REMOTE-059` | `saved-addresses-desktop:143` | `a59079742027` | Saved-addresses account avatar | D — unsupported avatar |
| `REMOTE-060` | `saved-addresses-desktop:262` | `8a2f5cbb0c21` | Fulfillment-center banner | A — `STATIC-004`; blocked on source/license |
| `REMOTE-061` | `shipping-selected-desktop:266` | `da90acf98398` | Delivery-zone map preview | D — deferred; not a static asset |
| `REMOTE-062` | `signup-desktop:232` | `e40cfa8deba6` | Google social-auth mark | D — visible export defect; social auth deferred |
| `REMOTE-063` | `wishlist-desktop:154` | `f10a255016f2` | Wishlist account avatar | D — unsupported avatar |
| `REMOTE-064` | `wishlist-desktop:202` | `7f5d435cd7e1` | Wishlist product card 1 | B — wishlist/product API media |
| `REMOTE-065` | `wishlist-desktop:224` | `9eefbfe9b16d` | Wishlist product card 2 | B — wishlist/product API media |
| `REMOTE-066` | `wishlist-desktop:249` | `78432722366f` | Wishlist product card 3 | B — wishlist/product API media |
| `REMOTE-067` | `wishlist-desktop:268` | `47e946cec9d1` | Wishlist product card 4 | B — wishlist/product API media |
| `REMOTE-068` | `wishlist-desktop:287` | `892c49d1c17c` | Wishlist product card 5 | B — wishlist/product API media |
| `REMOTE-069` | `wishlist-desktop:309` | `bb42ced445ae` | Wishlist product card 6 | B — wishlist/product API media |

Ledger totals: 4 class-A static candidates, 53 class-B API-driven references, no remote class-C references, and 12 class-D deferred/unsupported references.

## 8. Completion gate

D04 remains `Planned` because `STATIC-001` through `STATIC-004` have no approved production source or reuse record. To complete D04 later:

1. Supply licensed originals or explicit production-reuse approval for each still-required static role.
2. Reconfirm whether the promotion and fulfillment roles remain in product scope before localizing them.
3. Add only approved files to the reserved architecture paths, recording checksum, MIME type, dimensions, size, crop, and license.
4. Validate raster decoding and responsive crops; validate any approved standalone SVG for a `viewBox`, accessible behavior, and absence of scripts or external references.
5. Confirm every `Ready` path exists and that no Stitch-hosted URL or API-driven media was copied locally.

No empty asset directory, placeholder raster, logo file, avatar, map, provider mark, or interface-icon component is required while this gate is open.
