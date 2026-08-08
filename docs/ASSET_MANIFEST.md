# Production Asset Manifest

## 1. Status and authority

This is the D04 asset audit for the approved Stitch screen set. Screenshots remain the primary visual source; exported HTML/CSS supplies art direction and placement evidence only. An exported URL is not a production source or proof of reuse rights.

Filesystem validation on 2026-07-31 found:

- 27 PNG screenshots and 27 HTML exports;
- 27 matching base filenames and no unmatched files;
- 69 remote image occurrences across 20 exports;
- 69 unique Stitch-hosted URLs and 69 unique SHA-256 fingerprints.

On 2026-08-08, four project-generated PNG originals were supplied in the authorized external D04 source set with permission for production use in this project. They were generated through ChatGPT/OpenAI image generation on 2026-08-08; the model/version is unavailable and unverified. The supplied provenance states that no third-party image or Stitch binary was uploaded or used as source material. This records the supplied project-use approval without asserting broader ownership or license terms.

The repository-local WebPs were encoded with Sharp 0.35.3 at quality 85 without upscaling or retained metadata. They are not downloads or derivatives of the Stitch-hosted references. The corrected `STATIC-002-home-hero-mobile-source.png` supersedes every earlier mobile-hero candidate; files named `REJECTED-*` and the previous `STATIC-002` source are not authorized production sources.

All four final files decode successfully and passed the responsive browser crops recorded in section 3. D04 is complete. The 69-reference ledger in section 7 audits exported references; it is not a claim that all 69 placements are approved functionality or visible in the selected screenshot state.

## 2. Classification and readiness

| Class | Ownership | D04 disposition |
|---|---|---|
| A — Static local | Marketing or decorative art that is independent of API data | Localize only after an approved original and production-reuse record are supplied |
| B — API-driven | Product, gallery, category, brand, cart, wishlist, checkout, or order media | Keep as validated runtime response data; never copy from Stitch into `public/` |
| C — Code-native vector/CSS | Interface icons, simple empty-state symbols, wordmark text, gradients, and geometric decoration | Implement later as inline SVG React components, text, or CSS; D04 creates no files |
| D — Deferred or unsupported | Avatars, maps, provider marks, and unsupported feature art | Omit or use the documented non-image fallback until the relevant product/data gate passes |

Readiness values are `Ready`, `Blocked`, `API-owned`, `Code-owned`, and `Deferred`. `Ready` is reserved for a repository-local, validated file with approved provenance.

## 3. Static local candidates

The source checksum identifies the authorized project-generated PNG; the final checksum identifies the repository WebP. All four final files are sRGB, three-channel, non-alpha WebPs with no embedded profile. Browser checks used the approved CSS `cover` alignment and gradient behavior rather than changing layout or object position to rescue a crop.

Preferred dimensions are quality targets rather than automatic acceptance floors. A below-preferred source is accepted only when it contains the minimum native crop, needs no localization-time enlargement, passes the required browser crops, and records its responsive tradeoff:

| ID | Preferred source | Minimum native acceptance | Accepted evidence and tradeoff |
|---|---|---|---|
| `STATIC-001` | 2560×1500, approximately 128:75 | Long edge at least 1600 px; ratio within about 2% of 128:75; enough native pixels for 1600×750 | 1635×962 source accepted without resize. It passed through 1920×750; browser scaling above the 1635 px native width was reviewed and its softness remained acceptable. |
| `STATIC-002` | 1080×1440, 3:4 | Approximately 640×853 with a viable portrait crop for the documented phone frame | Corrected 1085×1449 source meets the preferred target and passed the full mobile range without resize. |
| `STATIC-003` | 2464×900, approximately 2.74:1 | Native crop at least 1232×450 | The below-preferred 1672×941 source supplied an approved native 1672×611 crop, exceeding the minimum without enlargement; both desktop crops passed. |
| `STATIC-004` | 1920×512, approximately 3.75:1 | Native crop at least 944×256 | The below-preferred 1763×892 source supplied an approved native 1763×470 crop, exceeding the minimum without enlargement; compact and narrow responsive crops passed. |

All four roles are decorative because adjacent text owns their meaning. Prefer CSS backgrounds; if a semantic image element is required by the implementation, use an empty alternative and keep it out of the accessibility tree.

| ID and role | Screenshot/export evidence | Intended path | Dimensions and format | Render and responsive behavior | Semantics, fallback, and reuse | Source, license, readiness |
|---|---|---|---|---|---|---|
| `STATIC-001` Desktop home hero | `home-desktop`; export line 175; screenshot bitmap 392×1600 (**Observed**, rescaled) | `public/images/marketing/home-hero-desktop.webp` | Final: 1635×962 `image/webp`, 106,074 bytes; SHA-256 `78f9d6cc81a5259a0bc34ba1c1a56ddc2961b9bfd39abd007f4b1a4c029b6d97`; complete source preserved with no crop or resize; decode **PASS** | Centered full-bleed cover with dark overlay passed at 768×750, 1024×750, 1280×750, 1600×750, and 1920×750; focal subject, left copy-safe zone, and above-native-width softness remained acceptable | Decorative background with empty alternative because adjacent heading/copy conveys the message; no raster substitute; do not reuse as mobile hero | Authorized project-generated `STATIC-001-home-hero-desktop-source.png`: 1635×962 `image/png`, 1,869,823 bytes, SHA-256 `a54117a9987e2d1e2a9bc5a90c187b5b58129a920e851da5b34691f0e0ee1672`; project production-use permission supplied 2026-08-08; **Ready** |
| `STATIC-002` Mobile home hero | `home-mobile`; export line 161; screenshot bitmap 207×1600 (**Observed**, rescaled) | `public/images/marketing/home-hero-mobile.webp` | Final: 1085×1449 `image/webp`, 71,602 bytes; SHA-256 `92f23648a7477bb540d724110afc2c887c8ef3892428095ad40269fa5add1989`; complete corrected source preserved with no crop or resize; decode **PASS** | Default-centered portrait cover with bottom gradient passed at 358×480, 390×480, 607×480, and 639×480 (last base/mobile width before `sm ≥640`); headroom, face, balance, lower copy region, sharpness, and artifact checks passed | Decorative background with empty alternative; no raster substitute; reuse only for the mobile hero; contains no text, logo, CTA, or UI | Corrected authorized project-generated `STATIC-002-home-hero-mobile-source.png`: 1085×1449 `image/png`, 1,663,003 bytes, SHA-256 `c42de8f931af209de7f74fc2fc76cdff2d83464873125769a8134c2bb447ea94`; project production-use permission supplied 2026-08-08; previous and `REJECTED-*` sources excluded; **Ready** |
| `STATIC-003` Desktop home promotion background | `home-desktop`; export line 305 | `public/images/marketing/home-promotion-summer-refresh.webp` | Final: 1672×611 `image/webp`, 80,974 bytes; SHA-256 `943303e76651bd7edfa95aeb079f1b5582fbf34075f3f446925d31eb86407202`; native crop `left: 0, top: 40, width: 1672, height: 611`, no resize; decode **PASS** | Right-centered cover with left blue gradient passed at 1024×450 and 1232×450; right focal subject and left copy region remained intact | Decorative background with empty alternative; no fallback image. The asset does not approve a coupon, discount, sale route, or CTA behavior excluded by `PRD.md` | Authorized project-generated `STATIC-003-home-promotion-summer-refresh-source.png`: 1672×941 `image/png`, 2,077,613 bytes, SHA-256 `e84a6e44288ee6ae693d7d5495807f0f9ad98d2f17c9b3d87ecf00816dc5aa90`; project production-use permission supplied 2026-08-08; **Ready** |
| `STATIC-004` Fulfillment-center banner | `saved-addresses-desktop`; export line 262; screenshot bitmap 1600×1535 (**Observed**, rescaled) | `public/images/decorative/fulfillment-center-banner.webp` | Final: 1763×470 `image/webp`, 107,466 bytes; SHA-256 `6bdba794d5bdac6f414576d17d9ba5c4f50fd5b432903784d744eaa67a9c1eab`; native crop `left: 0, top: 211, width: 1763, height: 470`, no resize; decode **PASS** | Centered cover with left-to-right surface gradient passed at 944×256 and in the recorded compact-desktop and narrow-center responsive checks; fulfillment imagery stayed coherent and no meaningful or prominent text, signage, or logo survived | Decorative with empty alt because adjacent copy owns meaning; use a tonal surface if absent; do not reuse as category/order media; mobile behavior remains unpaired and **Uncertain** | Authorized project-generated `STATIC-004-fulfillment-center-banner-source.png`: 1763×892 `image/png`, 1,985,112 bytes, SHA-256 `5f57572836b02df8dc81d6e019646b67e7d9efd8e1d260a1773c3f5c3aca12ab`; project production-use permission supplied 2026-08-08; **Ready** |

Every `Ready` row records the supplied original and project-use permission, source and final checksum, actual MIME type, pixel dimensions, file size, and tested crop. Localization must not upscale. One reviewed optimization encode from an approved original is permitted; repeated lossy recompression is prohibited. Never download a Stitch reference as a production substitute.

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
| `REMOTE-014` | `home-desktop:175` | `50e77ddff239` | Desktop home hero | A — `STATIC-001`; **Ready** local production asset; Stitch URL remains art direction only |
| `REMOTE-015` | `home-desktop:199` | `749f3d653434` | Designer Fashion category bento | B — category API media |
| `REMOTE-016` | `home-desktop:208` | `84350af36b4a` | Electronics category bento | B — category API media |
| `REMOTE-017` | `home-desktop:215` | `a3f42132bfb6` | Home & Living category bento | B — category API media |
| `REMOTE-018` | `home-desktop:223` | `920d8b59dde4` | Beauty & Grooming category bento | B — category API media |
| `REMOTE-019` | `home-desktop:305` | `7348374a11e7` | Desktop promotion background | A — `STATIC-003`; **Ready** local production asset; functionally non-authoritative |
| `REMOTE-020` | `home-mobile:161` | `60177063f956` | Mobile home hero | A — `STATIC-002`; **Ready** local production asset; Stitch URL remains art direction only |
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
| `REMOTE-060` | `saved-addresses-desktop:262` | `8a2f5cbb0c21` | Fulfillment-center banner | A — `STATIC-004`; **Ready** local production asset; Stitch URL remains art direction only |
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

D04 is `Complete`. `STATIC-001` through `STATIC-004` have authorized project-specific sources, repository-local production WebPs, recorded source and final checksums, verified MIME/dimensions/size, successful decode checks, and passing approved browser crops. The CSS-cover validation did not require a layout or object-position exception. No Stitch-hosted URL or API-driven media was copied locally.

No empty asset directory, placeholder raster, logo file, avatar, map, provider mark, or interface-icon component was added. Deferred and API-owned media remain governed by their existing gates.
