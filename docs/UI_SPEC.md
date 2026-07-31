# Nexa Store UI Implementation Specification

## 1. Purpose and source policy

This document translates the approved Google Stitch work into an implementation specification for the customer-facing React UI. It describes visual behavior and proposed component boundaries; it does not authorize application implementation, API behavior, new routes, or new dependencies.

Source precedence is:

1. `design/stitch/screenshots` — primary visual truth.
2. `design/stitch/DESIGN.md` — intended design-system semantics.
3. `design/stitch/export` — reference for measurements, responsive hints, and asset art direction only.
4. `docs/PRD.md` and `docs/ROUTES.md` — functional and route boundaries.

Filesystem validation on 2026-07-31 found 27 PNG screenshots and 27 HTML exports with 27 matching base filenames and no unmatched files. This confirms artifact pairing only. The screenshots are authoritative because the project designates them as approved; matching exported code does not establish visual approval.

Do not copy the exported JavaScript, CDN Tailwind setup, placeholder links, repeated page-local configuration, or remote-image architecture. Use the exported files only to explain a screenshot when the screenshot itself does not provide a reliable measurement.

### 1.1 Confidence labels

Every numeric or behavioral statement in this specification uses one of these labels:

| Label | Meaning |
|---|---|
| **Observed** | Directly visible in one or more approved screenshots, including sampled colors. |
| **Design token** | Declared by `DESIGN.md` and compatible with the screenshots. |
| **Code-derived** | Taken from exported HTML/CSS because the screenshot cannot establish the value. |
| **Estimated / uncertain** | Visually inferred from a rescaled capture or inferred for a viewport without an approved screenshot. Validate during visual QA. |
| **Deferred** | Visible in a design but unsupported by the PRD, API inventory, or route map. It must not become functional scope. |

Several screenshot files were rescaled after capture: for example, `home-desktop.png` is only 392 pixels wide while visibly containing a desktop composition. Bitmap width therefore does not equal the CSS viewport. Do not calculate breakpoints, gutters, or type sizes by dividing the bitmap dimensions.

### 1.2 Product and routing guardrails

- Render only response fields whose contracts have been verified, as required by the PRD.
- Treat product names, prices, totals, stock, ratings, dates, user names, and reward values in screenshots as illustrative content, not fixture contracts.
- Do not create routes absent from `ROUTES.md`. In particular, the account overview and order-detail designs are reference-only until routes and data contracts are approved.
- Product-detail add-to-cart submits one `productId` and adds one item. Initial quantity selection is deferred because `POST /cart` has no `count` field; quantity changes belong to cart lines through verified `PUT /cart/{id}` behavior. Never simulate quantity by repeating add-to-cart requests.
- Do not infer online-payment success from return-route query parameters. `/checkout/online/return` must initially show a neutral reconciliation state.
- Do not add admin screens; none are present in the approved screenshot set.
- Light mode is the only approved theme. Exported `dark:` classes do not establish a dark-mode design.

## 2. Design tokens

### 2.1 Color

The canonical UI palette below follows screenshot-observed output. Semantic names deliberately avoid copying conflicting names from the exported per-page Tailwind configurations.

| Token | Value | Use | Confidence |
|---|---:|---|---|
| `color.brand.primary` | `#004AC6` | Brand wordmark, primary buttons, active controls, focus indicators | **Observed** |
| `color.brand.primaryStrong` | `#003EA8` | Primary hover/pressed state where additional contrast is needed | **Code-derived** |
| `color.brand.accent` | `#2563EB` | Brighter promotional/rewards panels and selected mobile treatments | **Observed** |
| `color.onPrimary` | `#FFFFFF` | Text and icons on primary fills | **Observed** |
| `color.background` | `#FAF8FF` | Default page canvas | **Observed** |
| `color.surface.card` | `#FFFFFF` | Cards, form panels, address tiles | **Observed** |
| `color.surface.low` | `#F3F3FE` | Subtle panels, inputs, sidebars, trust panels | **Observed** |
| `color.surface.base` | `#EDEDF9` | Secondary controls and skeleton bands | **Observed** |
| `color.surface.high` | `#E7E7F3` | Raised neutral controls and selected navigation backgrounds | **Observed** |
| `color.surface.highest` | `#E1E2ED` | Footers, dividers, image placeholders | **Observed** |
| `color.text.primary` | `#191B23` | Primary headings and body text | **Observed** |
| `color.text.secondary` | `#434655` | Supporting text, labels, metadata | **Observed** |
| `color.text.muted` | `#565E74` | Tertiary metadata and disabled-looking content | **Observed** |
| `color.outline` | `#737686` | Strong outlines and secondary icons | **Observed** |
| `color.outline.subtle` | `#C3C6D7` | Card borders, input borders, separators | **Observed** |
| `color.selection` | `#DAE2FD` | Selected side-navigation rows, filter chips, pale status backgrounds | **Observed** |
| `color.error` | `#BA1A1A` | Destructive actions and error borders/icons | **Observed** |
| `color.error.container` | `#FFDAD6` | Error alert background | **Observed** |
| `color.error.text` | `#93000A` | Error copy on the error container | **Design token** |
| `color.warning` | `#943700` | Warning labels, sale accents, stock emphasis | **Observed** |
| `color.warning.container` | `#FFDBCD` | Pale warning/processing badges | **Observed** |
| `color.success` | `#004AC6` | Delivered/success indicators; this design uses brand blue rather than green | **Observed** |
| `color.inverse.surface` | `#191B23` | Dark newsletter/social button surfaces | **Observed** |
| `color.inverse.text` | `#F0F0FB` | Text on inverse surfaces | **Code-derived** |

Rules:

- Use `color.brand.primary`, not `color.brand.accent`, for ordinary primary actions.
- Disabled controls use reduced contrast and/or `color.surface.high`; do not encode disabled state by opacity alone.
- Use red only for actual errors or destructive actions. Orange/brown is reserved for warning, processing, sale, or sustainability accents.
- Borders on cards should normally use `color.outline.subtle` at reduced visual emphasis; inputs use the full color.
- Validate text/background combinations to WCAG AA during implementation. The very pale text shown under the checkout primary button is not an approved accessible treatment.

### 2.2 Typography

Inter is the sole approved typeface. Use the framework's built-in font loading when implementation begins; do not add a font package.

| Token | Size / line height | Weight | Tracking | Use | Confidence |
|---|---|---:|---:|---|---|
| `type.display.desktop` | `48px / 1.2` | 700 | `-0.02em` | Desktop page and hero titles | **Design token** |
| `type.display.mobile` | `32px / 1.2` | 700 | `0` | Mobile page titles | **Design token** |
| `type.heading.2` | `30px / 1.3` | 600 | `-0.01em` | Major section headings and auth titles | **Design token** |
| `type.heading.3` | `24px / 1.3` | 600 | `0` | Card/section headings and brand lockup | **Design token** |
| `type.heading.4` | `20px / 1.4` | 600 | `0` | Product/card titles and subsection headings | **Design token** |
| `type.body.large` | `18px / 1.6` | 400 | `0` | Introductory copy and spacious form copy | **Design token** |
| `type.body` | `16px / 1.6` | 400 | `0` | Default body and form text | **Design token** |
| `type.body.small` | `14px / 1.5` | 400 | `0` | Metadata, helper text, compact navigation | **Design token** |
| `type.button` | `14px / 1` | 600 | `0.02em` | Button and compact control labels | **Design token** |
| `type.caption` | `12px / 1.4` | 500 | `0` | Breadcrumbs, overlines, badges, timestamps | **Design token** |

Additional usage rules:

- The screenshots occasionally use weight 800 for mobile marketing titles and the wordmark. Treat this as a local emphasis modifier, not a new global text style. **Observed**
- Product prices use heading size with tabular numerals where available.
- Avoid uppercase except overlines, compact badges, and table headings. Apply `0.06em–0.10em` tracking to those local treatments. **Estimated / uncertain**
- Do not allow mobile display headings to scale below 32px solely to fit a single line; wrapping is preferred.

### 2.3 Spacing

All layout spacing is based on a 4px unit.

| Token | Value | Typical use | Confidence |
|---|---:|---|---|
| `space.1` | `4px` | Tight icon/text gaps, badge inset | **Design token** |
| `space.2` | `8px` | Related control gaps, compact padding | **Design token** |
| `space.3` | `12px` | Product-card metadata gaps | **Code-derived** |
| `space.4` | `16px` | Mobile gutter, form-control gaps | **Design token** |
| `space.5` | `20px` | Intermediate card spacing | **Code-derived** |
| `space.6` | `24px` | Desktop compact gutter, card padding | **Design token** |
| `space.8` | `32px` | Form and section groups | **Code-derived** |
| `space.10` | `40px` | Desktop outer gutter | **Design token** |
| `space.12` | `48px` | Standard section separation | **Design token** |
| `space.16` | `64px` | Large page bands and mobile header clearance | **Observed** |
| `space.20` | `80px` | Major desktop section separation and account header height | **Design token** |

Do not introduce arbitrary values where one of these tokens is within 4px of the visual target. Optical exceptions for icon alignment may use 2px.

### 2.4 Shape, border, and elevation

| Token | Value | Use | Confidence |
|---|---:|---|---|
| `radius.xs` | `4px` | Badges and compact tags | **Observed** |
| `radius.sm` | `8px` | Buttons, inputs, small controls | **Observed** |
| `radius.md` | `12px` | Standard cards and media | **Observed** |
| `radius.lg` | `16px` | Large cards, auth panels, summary panels | **Observed** |
| `radius.xl` | `24px` | Rare feature/promotional containers | **Design token** |
| `radius.full` | `9999px` | Circular media, dots, pills, circular icon buttons | **Design token** |
| `border.standard` | `1px` | Cards and separators | **Observed** |
| `border.input` | `1.5px` | Text inputs and secondary buttons | **Design token** |
| `border.focus` | `2px` | Focus outline or focused input border | **Design token** |
| `shadow.subtle` | `0 2px 4px rgba(15, 23, 42, 0.05)` | Standard raised card/header | **Code-derived** |
| `shadow.floating` | `0 8px 24px rgba(15, 23, 42, 0.10)` | Mobile bottom sheet or floating action surface | **Estimated / uncertain** |

Use tonal layering before shadows. Dashed borders are reserved for add-new and empty-state drop-zone patterns.

### 2.5 Layout and containers

| Token | Value | Use | Confidence |
|---|---:|---|---|
| `layout.pageMax` | `1280px` | Main desktop content and shared header/footer content | **Design token** |
| `layout.gutter.mobile` | `16px` | Phone page inset | **Design token** |
| `layout.gutter.tablet` | `24px` | Tablet and compact desktop inset | **Design token** |
| `layout.gutter.desktop` | `40px` | Wide desktop inset | **Design token** |
| `layout.accountSidebar` | `256px` | Fixed desktop account navigation | **Design token** |
| `layout.formNarrow` | `440px` | Sign-in, forgot-password, OTP cards | **Code-derived** |
| `layout.formStandard` | `480–540px` | Reset-password and registration cards | **Code-derived** |
| `layout.formWide` | `640–672px` | Account/security and address forms | **Code-derived** |
| `layout.header.compact` | `64px` | Auth, catalog, and mobile top bars | **Observed** |
| `layout.header.standard` | `80px` | Storefront/account desktop header | **Observed** |
| `layout.bottomNav` | `64–72px` | Fixed mobile primary navigation | **Observed** |

Desktop cards normally use 24–48px internal padding. Mobile cards use 16–24px. Form controls are 48–56px tall on desktop and 52–56px on mobile, with a minimum 44px interactive target.

### 2.6 Breakpoints

Breakpoint values are **Code-derived** because the screenshots do not expose their original CSS viewport widths.

| Name | Range | Required behavior |
|---|---|---|
| `base` | `<640px` | Phone-first layout, one-column forms, two-column compact product grids, horizontal rails, mobile app bars |
| `sm` | `≥640px` | Allow two/three-column transitional grids where content remains readable |
| `md` | `≥768px` | Desktop-style top navigation, two-column content, desktop footer; close mobile filter sheets |
| `lg` | `≥1024px` | Account sidebar, 12-column commerce layouts, three/four-column product grids |
| `xl` | `≥1280px` | Full 1280px container and three-column address/wishlist grids |

## 3. Shared layout and responsive behavior

### 3.1 Proposed documentation-only interfaces

These names and props define implementation boundaries. They are not application code and do not require new dependencies.

```ts
type AppShellVariant = "storefront" | "account" | "auth" | "checkout";
type ViewState = "ready" | "loading" | "empty" | "error";
type ControlSize = "small" | "medium" | "large";
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ProductCardLayout = "grid" | "compact" | "horizontal" | "wishlist";
type StatusTone = "neutral" | "info" | "success" | "warning" | "error";

interface AppShellProps {
  variant: AppShellVariant;
  activeNav?: string;
  showAnnouncement?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
  children: React.ReactNode;
}

interface StoreHeaderProps {
  variant: "full" | "compact" | "secure" | "auth";
  activeNav?: string;
  cartCount?: number;
  authenticated?: boolean;
}

interface ProductCardProps {
  product: ProductSummary;
  layout: ProductCardLayout;
  wishlistState?: "saved" | "not-saved" | "pending";
  showRating?: boolean;
  showBadge?: boolean;
}

interface ResponsiveImageSpec {
  src: string;
  alt: string;
  aspectRatio: string;
  objectPosition?: string;
  priority?: boolean;
}
```

`ProductSummary` and all other data types must be based on verified API responses when implementation begins. Do not define fields solely because mock content displays them.

### 3.2 Shared shells

| Component | Responsibility | Desktop | Phone/tablet |
|---|---|---|---|
| `AppShell` | Selects the header, navigation, footer, and content offsets for a page family | Uses page maximum and optional sidebar | Uses app bar, bottom navigation, and safe-area padding |
| `AnnouncementBar` | Short storewide message above the header | Full-width, approximately 32px high | Full-width, fixed above the 64px app bar on home |
| `StoreHeader` | Brand, route-backed navigation, search, wishlist/cart/account actions | 64px or 80px; links and utility actions visible | Brand remains central/left; links collapse; retain only contextual actions |
| `PageContainer` | Applies maximum width and responsive gutters | `max-width: 1280px` | Fluid width with 16px inset |
| `AccountSidebar` | Verified identity summary, route-backed account navigation, and optional local sign-out after session architecture is resolved; no avatar is required | Fixed 256px from the 80px header at `lg` | Hidden below `lg` |
| `MobileBottomNav` | Shared mobile navigation renderer with shell-specific item lists | Hidden at or above the shell's desktop threshold | Fixed 64–72px, active item uses blue fill/text |
| `CheckoutStepper` | Cart → Shipping → Payment progress | Horizontal, centered, connected nodes | Compact horizontal treatment; labels may shorten but remain accessible |
| `SiteFooter` | Brand, approved route-backed links, static support/legal copy, copyright | Full multi-column or compact centered variant | Marketing pages may use accordion groups; task/account pages may omit it when bottom navigation is present |

Primary global navigation should expose only route-backed destinations: Shop (`/products`), Categories (`/categories`), and Brands (`/brands`). New Arrivals, Collections, Deals, Sale, and Promotions are visible design labels but remain **Deferred** until a supported route or verified query contract exists. `StoreHeader` must accept a route-driven link list rather than hard-code per-screen labels.

Bottom-navigation contents differ by shell and are passed as data. Items without approved destinations are omitted rather than rendered with placeholder links:

- Storefront: Home, Shop, Wishlist, Account, Cart.
- Catalog/cart compact variant: Shop, Cart, Saved, Account.
- Account: Shop, Search, Account; add Orders only after the conditional `/account/orders` gate passes and that route is implemented.

The Account item targets `/account/profile` for authenticated customers. For anonymous customers it targets `/sign-in?returnTo=%2Faccount%2Fprofile`; the decoded `returnTo` value must remain an allowlisted relative path. Search opens or focuses product-search UI on `/products`; it does not require a new route. Local sign-out may clear the application session only after D07/A00 resolves the session boundary. It must not claim API token revocation or sign-out from other devices.

### 3.3 Responsive patterns

- **Storefront:** Desktop uses a full-width hero, bento category grid, four-column benefits, and multi-column footer. Phone uses an inset hero card, horizontal circular categories/products, stacked benefits, a dark static newsletter promotion, accordion footer, and bottom navigation. **Observed**
- **Catalog:** Desktop uses a 256px sticky filter panel plus a three-column product grid. Phone uses a two-column grid and a filter/sort context bar; filters open in a bottom sheet with a sticky result CTA. Tablet behavior is a two-column grid with filters kept in a drawer. **Observed / Code-derived**
- **Product detail:** Desktop uses a 7/5 gallery/details split and four-column recommendations. Phone uses a full-width carousel, stacked detail content, accordions, a horizontal recommendation rail, and a fixed total/add-to-cart bar. **Observed**
- **Cart and checkout:** Desktop uses an 8/4 content/summary split; the summary becomes sticky when content is taller. Phone stacks line items and reserves bottom space for a fixed total/CTA bar above bottom navigation. Checkout-only mobile behavior without a screenshot is **Estimated / uncertain** and must follow the same stacking pattern.
- **Account:** At `lg`, the fixed sidebar offsets the main content by 256px. From `md` to `lg`, use the desktop header, hide the sidebar, and retain the account bottom navigation. On phones, account dashboards become stacked cards and settings lists. **Observed / Code-derived**
- **Auth:** Desktop centers a 440–540px card in the available viewport. Phone removes the surrounding card chrome, uses full-width controls, keeps the 64px brand app bar, and vertically spaces secondary actions toward the bottom. **Observed**
- **Desktop-only screens:** Use exported `sm`/`md`/`lg` class behavior only to collapse columns or hide sidebars. Do not invent content, alternate sections, or unseen mobile states. Mark visual QA for these layouts as pending.

## 4. Component catalog

### 4.1 Primitives

| Component | Variants and required behavior |
|---|---|
| `Button` | Primary, secondary outline, ghost, and danger; small/medium/large; optional leading/trailing icon; loading disables repeat submission |
| `IconButton` | Circular or square; accessible name required; minimum 44px target on touch devices |
| `Card` | Standard, tonal, outlined, selected, dashed, inverse; padding controlled by composition rather than arbitrary values |
| `Badge` | New, sale, default, sustainable, stock; compact uppercase label |
| `StatusBadge` | Neutral/info/success/warning/error; text plus optional icon/dot, never color-only |
| `AlertBanner` | Info/error/warning; icon, title, message, optional dismiss action |
| `FormField` | Label, control, description, error message, required state; generates stable label/control/error associations |
| `PasswordField` | `FormField` plus show/hide button and optional `StrengthMeter` |
| `Checkbox` | Native semantic control with visible checked, focus, disabled, and error states |
| `RadioCard` | Entire payment/address choice is clickable; selected state uses 2px primary outline |
| `SelectField` | Native/select-like control with label, value, error, and keyboard behavior |
| `OtpInput` | Six visually separated digits backed by accessible input behavior; paste and correction supported |
| `StrengthMeter` | Segmented or continuous meter with textual strength; color is supplemental |
| `Breadcrumbs` | Caption text, chevrons, final item exposed as current page |
| `Tabs` | Desktop product-description tabs with roving keyboard focus |
| `Accordion` | Mobile detail/footer rows with expanded state and associated panel |
| `QuantityStepper` | Cart-line control only in the initial implementation; decrement, value, increment, pending/disabled bounds, and accessible quantity announcement through verified `PUT /cart/{id}` behavior. The product-detail instance is **Deferred**. |
| `Skeleton` | Image, text, card, or grid shapes; animation respects reduced-motion settings |
| `Pagination` | Previous/next and page buttons; current page clearly indicated |
| `EmptyState` | Icon/illustration slot, title, description, recovery CTA |
| `Divider` | Horizontal or vertical; decorative unless conveying structure |

All icons must be maintained as local inline SVG React components using a consistent 24×24 view box and approximately 2px rounded strokes. Do not add an icon package or load Material Symbols at runtime.

### 4.2 Commerce and account components

| Component | Responsibility |
|---|---|
| `PriceDisplay` | Current price, optional previous price, discount label; currency and totals come from verified server data |
| `ProductCard` | Image, overline/category, name, price, optional badge/wishlist action; layout variants cover grid, horizontal rail, and wishlist |
| `ProductGrid` | Responsive grid and `ready/loading/empty/error` state switching |
| `ProductRail` | Horizontally scrollable mobile recommendations/categories with keyboard-accessible controls |
| `ProductGallery` | Main image, thumbnails or dots, selected state, correct responsive crop |
| `FilterPanel` | Shared filter fields rendered as desktop sidebar or mobile `FilterSheet` |
| `FilterChipList` | Selected filters with individual removal and clear-all action |
| `CartLine` | Product image, name, supported metadata, price, quantity, remove action, pending state |
| `OrderSummary` | Server-derived subtotal and total rows, optional shipping/tax only when confirmed, primary checkout action |
| `CheckoutItemList` | Compact read-only cart lines for final review |
| `AddressCard` | Address display and selected state; remove action only where API-backed |
| `AddressForm` | Only `name`, `details`, `phone`, and `city` are API-backed; additional screenshot fields are deferred |
| `PaymentMethodSelector` | Cash and generic online-payment choices only; provider-specific saved-card/PayPal UI is deferred |
| `CheckoutResultCard` | Neutral reconciling, cash-order confirmed, failed/retryable states; online success requires server evidence |
| `AccountIdentity` | Generic account icon or initials derived from a verified name, plus verified identity text; no local or uploaded profile avatar is required |
| `AccountNav` | Shared source for desktop sidebar and account bottom navigation |
| `OrderCard` | Order identifier, date/status/total when present in verified history data |
| `OrderStatusTimeline` | Reference-only until order-detail/tracking fields and route are approved |

## 5. Approved screen coverage and component mapping

Each row accounts for one approved screenshot and its matching export. A component marked **Deferred** is mapped for design traceability but must not be made functional.

| Screenshot / export | Route | Shell | Visible composition mapped to components | Responsive/status notes |
|---|---|---|---|---|
| `home-desktop.png` / `home-desktop.html` | `/` | `AppShell(storefront)` | `AnnouncementBar` → `StoreHeader(full)` → `HomeHero` → `CategoryBentoGrid` → `BrandStrip` → `TrendingSection` + eight `ProductCard` placeholders → `PromotionBanner` → `BenefitGrid` → static `NewsletterPromo` → `SiteFooter(marketing)` | Desktop reference; full hero and multi-column sections. Newsletter styling/copy is preserved without a form, email input, or submit action. |
| `home-mobile.png` / `home-mobile.html` | `/` | `AppShell(storefront)` | `AnnouncementBar` → `StoreHeader(compact)` → inset `HomeHero` → `CategoryRail` → `PromotionBanner` → `ProductRail` → stacked `BenefitList` → inverse static `NewsletterPromo` → `SiteFooter(accordion)` → `MobileBottomNav` | Approved phone layout; category/product rails scroll horizontally. Newsletter styling/copy is preserved without interactive subscription controls. |
| `products-desktop.png` / `products-desktop.html` | `/products` | `AppShell(storefront)` | `AnnouncementBar` → `StoreHeader` → `AlertBanner` → `Breadcrumbs` + `CatalogHeading` + `SortControl` → `FilterChipList` → `FilterPanel(sidebar)` → `ProductGrid` → `SkeletonGrid` → `Pagination` → `EmptyState` → `SiteFooter` | Skeleton and no-results blocks are demonstration states; implementation must show one grid state at a time |
| `products-mobile.png` / `products-mobile.html` | `/products` | `AppShell(storefront)` | `StoreHeader(compact)` → `CatalogContextBar` with filter/sort → `Breadcrumbs` + `CatalogHeading` → two-column `ProductGrid` → `Pagination` → `SkeletonGrid` → `EmptyState` → `SiteFooter(compact)` → open `FilterSheet` containing category, price, brand, sustainability, and result CTA | Filter availability remains conditional on verified query behavior; screenshot shows the sheet-open state |
| `product-details-desktop.png` / `product-details-desktop.html` | `/products/[productId]` | `AppShell(storefront)` | `StoreHeader` → `Breadcrumbs` → `ProductGallery(thumbnails)` + `ProductSummary` containing overline, title, **Deferred** rating, `PriceDisplay`, **Deferred** color/size/stock selectors, **Deferred** product-detail `QuantityStepper`, add-one-to-cart/wishlist → `TrustPanel` → `Tabs` → `ProductDescription` + feature list/media → `RelatedProductsGrid` → `SiteFooter` | 7/5 desktop split; initial add-to-cart sends one `productId` once. Hidden exported not-found state is not a separately approved screenshot. |
| `product-details-mobile.png` / `product-details-mobile.html` | `/products/[productId]` | `AppShell(storefront)` | `StoreHeader(compact/back)` → `ProductGallery(dots)` → `ProductSummary` → visible simulated `Skeleton` → detail `Accordion` rows → `ProductRail` → visible simulated `EmptyState/error` → `StickyPurchaseBar(add-one)` | Simulated loading/error sections describe alternate states and must not appear simultaneously with ready content. The bar has no initial-quantity control. |
| `login-desktop.png` / `login-desktop.html` | `/sign-in` | `AppShell(auth)` | `AuthBrand` → visible `AlertBanner(error)` → `AuthCard` containing heading, email `FormField`, `PasswordField`, forgot link, submit `Button`, divider, **Deferred** `SocialAuthButtons`, registration link → `AuthFooter` | Error is a demonstrated server-error state, not default content |
| `login-mobile.png` / `login-mobile.html` | `/sign-in` | `AppShell(auth)` | `StoreHeader(auth/back)` → auth heading/copy → email `FormField` → `PasswordField` + forgot link → submit `Button` → divider → **Deferred** social icon buttons → registration link | Full-width phone form; hidden export success modal is not an approved screen state |
| `signup-desktop.png` / `signup-desktop.html` | `/sign-up` | `AppShell(auth)` | simplified `StoreHeader(auth)` → `AuthCard` containing name/email/password/confirm `FormField`s, `StrengthMeter`, **Deferred** terms `Checkbox`, submit, divider, **Deferred** social buttons → `AuthFooter` | API-backed phone field is absent from this design and must be included when implementation is specified against the PRD. Terms consent remains absent unless a product/legal requirement and approved Terms and Privacy destinations are added. |
| `signup-mobile.png` / `signup-mobile.html` | `/sign-up` | `AppShell(auth)` | `StoreHeader(auth/back)` → heading/copy → name/email/password/confirm fields → submit → divider → **Deferred** Google/Apple buttons → sign-in link | Do not preserve the overflowing GOOGLE glyph or download icon artifact; phone input is still required by the PRD |
| `forgot-password-desktop.png` / `forgot-password-desktop.html` | `/forgot-password` | `AppShell(auth)` | simplified header → atmospheric background → `Breadcrumbs` → `AuthCard` with recovery icon, heading/copy, email field, submit, back-to-login → support copy → compact footer | Desktop approved; smaller layouts collapse card padding and breadcrumb according to export reference |
| `verify-email-desktop.png` / `verify-email-desktop.html` | `/verify-reset-code` | `AppShell(auth)` | centered `AuthCard` with brand, heading/copy, `OtpInput`, resend timer, verify button, back link → compact footer | Six-digit presentation is observed; exact backend code constraints remain unverified |
| `set-new-password-desktop.png` / `set-new-password-desktop.html` | `/reset-password` | `AppShell(auth)` | full header → atmospheric background → `AuthCard` with heading/copy, new/confirm `PasswordField`s, `StrengthMeter`, reset button, secure note → footer | Exported success state is hidden and not separately approved; rules remain conditional on backend validation |
| `cart-desktop.png` / `cart-desktop.html` | `/cart` | `AppShell(checkout)` | compact secure header → `CartHeading` + clear-cart action → two `CartLine` cards → sticky `OrderSummary` → rewards callout **Deferred** → compact footer | 8/4 layout; hidden empty cart becomes the `empty` view state, not simultaneous content |
| `cart-mobile.png` / `cart-mobile.html` | `/cart` | `AppShell(storefront)` | compact brand header → `CartHeading` → stacked `CartLine`s with remove/quantity → fixed `CartCheckoutBar` → `MobileBottomNav` | Sticky checkout bar sits above bottom navigation and includes safe-area padding |
| `shipping-desktop.png` / `shipping-desktop.html` | `/account/addresses/new` | `AppShell(checkout)` | secure header → centered `Card` containing `AddressForm`, default-address checkbox **Deferred**, primary/ghost actions → compact footer | Implement only API-backed address fields; state/province and ZIP are visual references, not request fields |
| `shipping-selected-desktop.png` / `shipping-selected-desktop.html` | `/checkout` shipping phase | `AppShell(checkout)` | secure header → `CheckoutStepper` → heading/copy → `AddressGrid` with add-new tile and three `AddressCard`s → map preview **Deferred** + `ShippingInfoCard` **Deferred** → compact footer | Address selection is valid as frontend composition; map, GPS tracking, delivery tiers, default/edit behavior are not API-backed |
| `checkout-desktop.png` / `checkout-desktop.html` | `/checkout` payment/review phase | `AppShell(checkout)` | secure header → `CheckoutStepper` → `ShippingSummaryCard` → `PaymentMethodSelector` → `CheckoutItemList` → sticky `OrderSummary` → `TrustPanel` → compact footer | Keep only cash and generic online redirect choices; saved card and PayPal rows are deferred |
| `payment-desktop.png` / `payment-desktop.html` | `/checkout/online/return` | `AppShell(checkout)` | secure header → demo state switcher **Deferred** → `CheckoutResultCard` → compact footer | Replace the shown success assertion with neutral “checking order/payment status” until verified server evidence exists; cash confirmation may use verified order response |
| `account-desktop.png` / `account-desktop.html` | **Unresolved; reference-only** | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → account heading → rewards/balance card **Deferred** → manage-account links **Deferred** → wishlist preview → recent-order table → `SiteFooter` | Do not add `/account`; component structure may be reused after route approval |
| `account-mobile.png` / `account-mobile.html` | **Unresolved; reference-only** | `AppShell(account)` | compact header → identity/rewards hero **Deferred** → quick-stat cards → settings list → local sign-out after A00 → version label **Deferred** → `MobileBottomNav` | Approved phone composition for the unresolved account overview only; sign-out means clearing the application session, not revoking the server token. |
| `edit-profile-desktop.png` / `edit-profile-desktop.html` | `/account/profile` | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → heading → profile-media card **Deferred** → profile `FormCard` → security/preferences tiles **Deferred** → footer | Only name, email, and phone are API-backed; avatar display/upload, country, bio, storage, notifications, and payments are deferred. |
| `change-password-desktop.png` / `change-password-desktop.html` | `/account/security` | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → `Breadcrumbs` + heading → security `FormCard` with current/new/confirm password fields and `StrengthMeter` → security notice → footer | Session-wide logout claim in the notice is unverified and must not be promised |
| `saved-addresses-desktop.png` / `saved-addresses-desktop.html` | `/account/addresses` | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → heading/add action → address cards + add-new dashed card → fulfillment/policy banner → footer | Remove and add are supported; edit/default tags and edit buttons are deferred because no update endpoint exists |
| `wishlist-desktop.png` / `wishlist-desktop.html` | `/wishlist` | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → heading/count → three-column wishlist `ProductGrid` with six `ProductCard(wishlist)` entries → footer | Remove and add-to-cart actions use pending states and server reconciliation |
| `order-history-desktop.png` / `order-history-desktop.html` | `/account/orders` | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → heading/copy → three `OrderCard`s → footer | Entire route remains conditional on verified user ID and backend ownership enforcement; view-details control is deferred |
| `order-details-desktop.png` / `order-details-desktop.html` | **Unresolved; reference-only** | `AppShell(account)` | `StoreHeader` → `AccountSidebar` → `Breadcrumbs` + heading/actions → `OrderStatusTimeline` → tracking card → shipping/payment cards → order-item table/totals → support/return actions → footer | No order-detail endpoint or route; tracking, invoice, buy-again, return, and saved payment data are deferred |

No screenshots exist for category directories/details, subcategories, brands, address detail, online-return neutral state, or conditional admin routes. This document does not invent their visual designs.

## 6. State behavior

The exports often render several states one after another for demonstration. React pages must model them as mutually exclusive states.

| Page area | `loading` | `empty` | `error` | `ready` |
|---|---|---|---|---|
| Product listing | Card/image/text skeleton grid | No matching products with clear-filters CTA | Page-level alert with retry/dismiss as appropriate | Filtered product grid and pagination |
| Product detail | Main image/text skeleton | Product-not-found state | Unavailable-product recovery state | Gallery, supported product fields, purchase actions |
| Cart | Cart-line and summary skeletons | Empty-cart message and shop CTA | Recoverable cart alert | Lines and server-derived summary |
| Wishlist | Product-card skeletons | Empty saved-items state | Recoverable wishlist alert | Saved product grid |
| Orders | Order-card skeletons | No-orders state | Unauthorized/network recovery | Verified order-history rows |
| Auth form | Pending submit button | Not applicable | Field or form-level accessible errors | Interactive form |
| Online return | Neutral reconciliation spinner/message | No verified order found | Retry/contact guidance | Confirmed result only after server evidence |

Loading, error, and empty sections shown together in `products-*` and `product-details-mobile` are storyboard demonstrations, not a single page composition.

## 7. Image and icon asset manifest

The 27 exports reference Google-hosted generated images. Those URLs are art-direction references only and must not become runtime sources. The screenshot set contains 67 visible image placements, but that number is not a local-asset requirement: commerce and taxonomy media belongs to verified API responses, while only approved static presentation assets are localized.

### 7.1 API-driven media

| UI area | Required source | Display behavior | Missing-field behavior |
|---|---|---|---|
| Home/category media | Verified category response image fields | Preserve bento, circular, and card crops from the screenshots while displaying the returned category identity | Use an approved neutral placeholder or omit the image slot; never substitute a local Stitch category photograph |
| Brand media | Verified brand response image fields | Preserve logo/media containment without stretching | Render the verified brand name when no image field exists |
| Product cards, rails, listing, and related products | Verified product list/detail image fields | Use responsive card crops and concise alt text derived from the verified product name | Use an approved neutral placeholder or a tonal media surface; do not create local product copies |
| Product gallery and feature media | Verified product-detail image/gallery fields | Use only returned gallery media and preserve thumbnail/dot selection behavior | Omit unsupported gallery/feature slots rather than inventing detail photography |
| Cart, wishlist, and checkout items | Verified media fields in their own response shapes or already-returned verified product data | Normalize through the relevant adapter and preserve compact card crops | Do not add per-item fetch fan-out or local product media merely to match screenshots; use the approved neutral fallback |
| Order history/items | Verified order response media fields | Show thumbnails only when the conditional order contract provides them | Omit the thumbnail or use the approved neutral fallback; never source screenshot product files |

API media URLs remain data, not repository assets. Adapters must allowlist supported URL schemes/hosts as decided during architecture, preserve no remote Stitch URL, and derive content alt text from verified names. The implementation must not infer image fields from screenshot content.

### 7.2 Static local assets

| Group | Local roles | Ratio/crop guidance | Alt behavior |
|---|---|---|---|
| Brand | Approved Nexa wordmark/logo, if supplied; otherwise retain the approved text treatment | Preserve intrinsic proportions at header/footer sizes | Meaningful logo alt only when the visible brand text is not already present |
| Home marketing | Desktop/mobile hero art and promotion-banner art | Keep screenshot-observed responsive art direction and copy-safe focal zones; do not merge distinct desktop/mobile crops blindly | Describe content-bearing campaign art; use empty alt when adjacent copy carries the message |
| Auth decoration | Atmospheric backgrounds and approved recovery/security illustrations | Backgrounds cover the composition without becoming form content | Decorative assets use empty alt or CSS backgrounds |
| Fulfillment/support | Approved static fulfillment-center banner | Very wide crop with its copy-safe region preserved | Empty alt when adjacent text duplicates its meaning |
| Empty states | Approved generic catalog, cart, wishlist, and order empty-state illustrations | Scale without implying a specific product or customer | Empty alt when the component title explains the state |

The deferred delivery-zone map is not a required static asset and must not introduce a live map dependency. Customer/profile avatars are not local assets: render a generic account icon or verified-name initials until a verified avatar field exists. D04 must record filename, license/source, dimensions, responsive crop, and content/decorative classification for each approved static file.

### 7.3 Vector assets

Create one internal SVG icon set during UI implementation, not as part of this documentation task. It needs:

- Navigation: menu, back, search, home/store, categories/grid, wishlist/heart, cart/bag, orders/package, account/person.
- Actions: add, close, remove/trash, edit, chevrons, arrow, visibility on/off, filter, sort, clear, refresh, log out.
- Commerce/status: truck, shield/lock, card, cash, location, phone, check, info, warning/error, sustainability leaf, star, inventory, gift/rewards.
- Auth/provider marks: Google, Apple, and Facebook marks only if social authentication later becomes approved. Use official brand SVGs; never represent them with generic glyph names.

SVGs should default to `currentColor`, expose a 24×24 view box, and use decorative `aria-hidden` behavior when the parent control has an accessible name.

## 8. Inconsistency and conflict ledger

### 8.1 Screenshots, design tokens, and export code

| Issue | Evidence | Resolution |
|---|---|---|
| Primary color naming/value drift | `DESIGN.md` frontmatter calls `#003594` primary, prose calls `#004AC6` primary, exports and screenshots predominantly render `#004AC6` | Canonical primary is `#004AC6`; retain darker blue only for interaction emphasis |
| Bright-blue semantic drift | `DESIGN.md` uses `#004AC6` as `primary-container`; exports call `#2563EB` `primary-container`; mobile account panels visibly use `#2563EB` | Name `#2563EB` `color.brand.accent`, not primary container |
| Neutral colors differ by one channel | Design values such as `#EDEDF8`, `#E7E7F2`, `#434654`, and `#737685` differ from screenshot/export values `#EDEDF9`, `#E7E7F3`, `#434655`, and `#737686` | Use screenshot-observed values in section 2 |
| Radius semantics conflict | `DESIGN.md` describes 8px as default and up to 24px; every export config maps default/large/extra-large to 4/8/12px | Use semantic 4/8/12/16/24px scale; components choose by role |
| Captures are rescaled | Several desktop bitmap widths are smaller than CSS desktop breakpoints while visibly retaining desktop layouts | Do not infer CSS pixels from screenshot bitmap dimensions |
| Standalone mobile files are not responsive architecture | Mobile exports are separate pages, and some contain no breakpoint classes or hard-cap content at 390px | Rebuild responsive React components from shared structures; do not copy documents wholesale |
| Remote assets and missing background alternatives | Exports use `lh3.googleusercontent.com`; CSS background images often have no semantic alternative | API-driven media uses verified response fields; approved static presentation assets are localized. Content-bearing images use semantic image elements. |
| CDN/runtime architecture | Exports load Tailwind CDN, Google Fonts, Material Symbols, and page-local scripts/config | Do not copy; use the existing application toolchain and local React behavior with no new dependency |

### 8.2 Cross-viewport visual inconsistencies

- Home desktop and mobile use different heroes, category systems, promotions, product sets, benefits, navigation labels, newsletter layouts, and footer structures. Treat these as intentional responsive art-direction variants, not shared content requirements.
- Products desktop shows three items while mobile shows four different items. Product content comes from the API; only card density and grid behavior are authoritative.
- Product detail desktop shows `$289.00`, “Nexa Performance,” and 124 reviews; mobile shows `$295.00`, a `$350.00` previous price, “Stratus Technical,” and a 15% discount. All values and unsupported rating/variant fields are illustrative.
- Cart desktop shows different prices, quantities, and totals from mobile. Server cart totals are authoritative.
- Account desktop and mobile use different people, membership dates, point balances, quick stats, and settings. Do not construct an identity or rewards contract from either.
- Header navigation varies among Shop, Shop All, Categories, Brands, Collections, Deals, New Arrivals, Sale, and Promotions. Render the route-backed link set described in section 3.2.
- Mobile bottom-navigation labels and item counts vary by page. Use the shared renderer with shell-specific data rather than separate markup.

### 8.3 Export defects visible in screenshots

- `signup-mobile` asks Material Symbols to render `google`, producing oversized literal “GOOGLE” text that overflows the button.
- Apple buttons in `signup-mobile`, `signup-desktop`, and `login-mobile` use the Material Symbols `file_download` glyph.
- These are reference-code defects. Use real provider SVG marks only if social authentication is later approved.
- Some screenshot storyboards display ready content, skeletons, and empty/error examples on the same long page. These are state samples and must be mutually exclusive in implementation.
- Placeholder `href="#"` links and demo scripts do not define routing or interaction behavior.

### 8.4 PRD and route conflicts

| Visible design capability | Contract status | Specification disposition |
|---|---|---|
| Google/Apple/Facebook sign-in | No API request | **Deferred**; map visual region only |
| Rewards balances, point redemption, purchase points | No API request | **Deferred** |
| Product reviews/ratings | No review endpoint and fields unverified | **Deferred** |
| Product size/color variants, stock quantities, sale/discount behavior | Response fields unverified | **Deferred** until captured contracts exist |
| Product-detail initial quantity | `POST /cart` accepts `productId` only; `count` belongs to later `PUT /cart/{id}` | Product detail adds one item. Its `QuantityStepper` is **Deferred** unless a reviewed contract proves atomic quantity-add; never repeat POST requests to emulate quantity. |
| Sustainability and full filter UI | Candidate product queries are disabled/unverified | Layout approved; controls ship only after query verification |
| Profile avatar, country, bio, storage, notifications, settings, payment methods | Update API supports only name, email, and phone; no avatar source exists | **Deferred**; use a generic account icon or verified-name initials instead of a local avatar. |
| Local sign-out and session revocation claims | No logout endpoint or verified token-rotation behavior | Local application-session clearing is allowed after D07/A00; server revocation and cross-device sign-out claims are **Deferred**. |
| Address edit/default, state, ZIP, and billing distinctions | No update endpoint; API request supports name/details/phone/city | Add/remove/display only; extra controls/fields **Deferred** |
| Saved card and PayPal payment | Only generic online checkout-session and cash order are supported | Offer Cash and Online; provider-specific rows **Deferred** |
| Taxes, shipping fees, rewards, delivery guarantees | Response contracts unverified | Display only verified server totals/copy |
| Payment success on return | No payment-status endpoint | Show neutral reconciliation; never trust query parameters alone |
| Order detail, tracking, invoice, returns, buy again | No detail/tracking/return/invoice requests or mapped route | Entire order-detail page is reference-only |
| Account overview route | Missing from `ROUTES.md` | Reference-only; do not add `/account` |
| Account and Orders navigation | `/account` is absent; `/account/orders` is conditional | Account targets `/account/profile` when authenticated or safe sign-in return flow when anonymous. Hide Orders until its gate passes and route ships. |
| Newsletter subscription | No supporting request | Preserve only static `NewsletterPromo` styling/copy; render no form, email input, or submit action. |
| Signup terms consent | No product/legal requirement or approved Terms/Privacy destinations | Terms checkbox and legal links are **Deferred** until both the requirement and destinations are approved. |

## 9. Accessibility and interaction requirements

- Provide a visible focus indicator using the 2px primary treatment on all interactive elements.
- Preserve a minimum 44×44px touch target, including icon-only controls, quantity actions, gallery dots/thumbnails, and bottom navigation.
- Inputs require persistent labels; placeholders are examples, not labels.
- Associate field errors with controls and announce form-level/server errors through an appropriate live region.
- Do not rely on color alone for selected filters, order status, password strength, stock, or errors.
- Bottom sheets trap focus while open, close with Escape, restore focus to the opener, and prevent background scrolling.
- Sticky bottom actions must account for safe-area insets and must not cover the last content or footer control.
- Product rails and galleries must be usable by keyboard and screen reader; arrow buttons need descriptive names.
- Decorative photography uses empty alt text. Product and user images use concise content-based alternatives derived from actual data.
- Skeleton animation and hover transforms must respect `prefers-reduced-motion`.

## 10. Implementation acceptance checklist

- [ ] All token values come from section 2; no page-local copy of the exported Tailwind configuration is introduced.
- [ ] Shared shells and primitives are implemented once and configured by props/data.
- [ ] All 27 project-approved screenshots in section 5 have a component mapping and matching export reference; export presence is not treated as approval evidence.
- [ ] Each page renders loading, empty, error, and ready states as mutually exclusive where applicable.
- [ ] Paired desktop/mobile screenshots are treated as responsive variants rather than separate product/data contracts.
- [ ] Desktop-only mobile behavior remains limited to documented collapse/stack rules and is visually reviewed before approval.
- [ ] API-driven media uses only verified response fields and never local Stitch/product copies; missing fields use the documented neutral fallback or omit the slot.
- [ ] Every required static image role in section 7 has a local approved asset, responsive crop, dimensions, license/source record, and alt behavior.
- [ ] Icons are local inline SVGs; no icon or font dependency is added.
- [ ] Deferred controls cannot trigger unsupported requests or imply unsupported capabilities.
- [ ] Product detail adds one item per `POST /cart`; quantity updates and `QuantityStepper` behavior exist only in the cart.
- [ ] Account targets `/account/profile` or the safe sign-in return flow, and Orders navigation is absent until its conditional route ships.
- [ ] Newsletter and signup terms regions cannot appear as functioning unsupported controls.
- [ ] Account overview and order details remain route-unresolved/reference-only.
- [ ] `/checkout/online/return` remains neutral until server evidence confirms an outcome.
- [ ] Keyboard, focus, labeling, contrast, error-announcement, reduced-motion, and touch-target requirements pass QA.
- [ ] Application source, configuration, dependencies, and route files remain unchanged while this documentation specification is prepared.
