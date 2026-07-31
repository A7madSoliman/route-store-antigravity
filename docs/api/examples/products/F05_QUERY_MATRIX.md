# F05 Product Query Matrix

## Run outcome

The controlled F05 run completed on `2026-07-31` between `17:04:52Z` and `17:04:58Z`. It made `17` anonymous, bodyless requests to `GET /products` only. No request included a token, credential, cookie, or body. Every sent request returned HTTP `200` JSON without a redirect.

Sent rows are recorded in request order: the baseline and every individual parameter test preceded the practical combinations. The run sent fewer than the maximum because repeated `category[in]` keys were conclusive, so comma encoding was not tested, and the matching-keyword test was Unresolved, so the gated `keyword + page` combination was not sent. Those skipped cases are explicitly classified below.

## Value provenance and sanitization

- Sanitized F04 evidence established the field paths and types used for derivation; its placeholders were not used as request values. The F05 baseline reacquired actual values and retained them in process memory only.
- The matching keyword was the first alphanumeric token of at least three characters from the first baseline title. Its value is represented as `<title-keyword>`.
- The no-match candidate was deterministic and is represented as `<unlikely-keyword>`.
- The baseline contained `29` distinct numeric prices. The one-third and two-thirds selections produced safe thresholds `749` and `2379`.
- Brand and category values came from the first baseline product's `brand._id` and `category._id`. A second category came from the first later baseline product with a distinct `category._id`.
- All actual titles, IDs, products, media URLs, and response bodies were discarded after in-memory comparison. No F03 or Postman identifier was used.

## Classification rules

- **Supported:** HTTP success plus observable metadata, ordering, projection, or filtering behavior consistent with the tested value.
- **Unsupported:** the tested value was rejected safely or demonstrably failed its expected observable effect.
- **Unresolved:** HTTP success was inconclusive, a valid intersection was empty, or a prerequisite prevented the request.
- Numeric bounds, accepted value ranges, matching semantics, inclusivity, and behavior beyond the tested values are not generalized.

## Query results

| Parameter or combination | Exact sanitized query shape | Value tested or source | Status | Classification | Observed result behavior | Metadata / empty behavior | Notes and limitations | Decisions |
|---|---|---|---|---|---|---|---|---|
| Baseline | `/products` | No query | `200` | Baseline | `56` total results; `40` items returned; dynamic values derived in memory | `currentPage=1`, `numberOfPages=2`, `limit=40`, `nextPage=2` | Comparison only | `API-004`, `API-005` |
| `limit` | `/products?limit=2` | Literal `2` | `200` | **Supported** | Returned `2` items while total `results` remained `56` | `currentPage=1`, `numberOfPages=28`, `limit=2`, `nextPage=2` | Maximum and other values untested | `API-005`, `API-006` |
| `page` | `/products?page=2` | Literal `2` | `200` | **Supported** | Returned `16` items; identifiers differed from page 1 | `currentPage=2`, `numberOfPages=2`, `limit=40`, `prevPage=1` | Out-of-range pages untested | `API-005`, `API-006` |
| `keyword` — derived match | `/products?keyword=<title-keyword>` | First qualifying baseline-title token | `200` | **Unresolved** | Returned `0` items, so the title-derived token did not demonstrate matching behavior | `results=0`, `currentPage=1`, `numberOfPages=0`, `limit=40`, empty `data` | Tokenization/search fields and matching rules remain unknown | `API-004`, `API-006` |
| `keyword` — unlikely value | `/products?keyword=<unlikely-keyword>` | Deterministic no-match candidate | `200` | **Unresolved overall; empty response observed** | Returned `0` items | `results=0`, `currentPage=1`, `numberOfPages=0`, `limit=40`, empty `data` | Empty behavior alone does not prove positive matching | `API-004`, `API-006` |
| `sort` ascending | `/products?sort=price` | Literal `price` | `200` | **Supported** | All `40` observed prices were nondecreasing; first five were `149, 149, 149, 149, 199` | Standard page-1 list metadata | Only this numeric field/direction tested | `API-006` |
| `sort` descending | `/products?sort=-price` | Literal `-price` | `200` | **Supported** | All `40` observed prices were nonincreasing | Standard page-1 list metadata | Exact leading sequence was not retained; other fields untested | `API-006` |
| `fields` | `/products?fields=title%2Cprice` | Observed F04 fields `title,price` | `200` | **Unsupported** for this value | Response did not satisfy projection criteria: requested fields were not exclusively returned with allowed identity fields | List response remained non-empty | Other separators or field values were not tested and must not be inferred | `API-004`, `API-006` |
| `price[gte]` | `/products?price%5Bgte%5D=749` | Baseline-derived lower threshold `749` | `200` | **Supported** | Every returned price was at least `749` | Non-empty list envelope | Inclusivity was not proved unless a boundary-valued item happened to appear | `API-006` |
| `price[lte]` | `/products?price%5Blte%5D=2379` | Baseline-derived upper threshold `2379` | `200` | **Supported** | Every returned price was at most `2379` | Non-empty list envelope | Inclusivity and other values remain unverified | `API-006` |
| Price range | `/products?price%5Bgte%5D=749&price%5Blte%5D=2379` | Both baseline-derived thresholds | `200` | **Supported** | Every returned price was within the observed range | Non-empty list envelope | Inclusivity and invalid-range behavior remain unverified | `API-006` |
| `brand` | `/products?brand=<brand-id>` | First baseline `brand._id` | `200` | **Supported** | Returned `11` items and all observed brand IDs matched | `results=11`, `currentPage=1`, `numberOfPages=1`, `limit=40` | Only one list-derived brand tested | `API-006` |
| `category[in]` — single | `/products?category%5Bin%5D=<category-id-1>` | First baseline `category._id` | `200` | **Supported** | Returned `11` items and all observed category IDs matched | `results=11`, `currentPage=1`, `numberOfPages=1`, `limit=40` | Only one category tested | `API-006` |
| `category[in]` — repeated keys | `/products?category%5Bin%5D=<category-id-1>&category%5Bin%5D=<category-id-2>` | First two distinct baseline category IDs | `200` | **Supported** | Returned `33` items; every category was requested and both requested categories appeared | `results=33`, `currentPage=1`, `numberOfPages=1`, `limit=40` | Repeated keys are the verified multi-value encoding | `API-006` |
| `category[in]` — comma value | `/products?category%5Bin%5D=<category-id-1>%2C<category-id-2>` | Same two categories | Not sent | **Unresolved** | Repeated keys were already conclusive, so this comparison was unnecessary | Not observed | Comma encoding is not approved for implementation | `API-006` |
| `keyword + page` | `/products?keyword=<title-keyword>&page=2` | Derived keyword and literal page `2` | Not sent | **Unresolved** | Matching-keyword prerequisite was Unresolved | Not observed | Do not enable paginated search from this evidence | `API-005`, `API-006` |
| `brand + price range` | `/products?brand=<brand-id>&price%5Bgte%5D=749&price%5Blte%5D=2379` | Supported individual values | `200` | **Unresolved** | Returned `0` items; an empty valid intersection cannot prove combined filtering | `results=0`, `currentPage=1`, `numberOfPages=0`, `limit=40`, empty `data` | Combination acceptance is plausible but behavior is inconclusive | `API-004`, `API-006` |
| `category + sort` | `/products?category%5Bin%5D=<category-id-1>&sort=price` | Supported category and ascending price sort | `200` | **Supported** | Returned `11` matching-category items with nondecreasing prices; first five were `149, 149, 149, 149, 199` | `results=11`, one-page list | Only ascending price sort tested in this combination | `API-006` |
| `category + brand` | `/products?category%5Bin%5D=<category-id-1>&brand=<brand-id>` | Category and brand from the same baseline product | `200` | **Supported** | Returned `11` items and every item matched both identifiers | `results=11`, `currentPage=1`, `numberOfPages=1`, `limit=40` | Only one list-derived pair tested | `API-006` |

## Implementation allowlist

Later adapters may use only these evidenced forms until further verification:

- `limit=2` and `page=2` as proof that the keys work; UI-selected ranges and bounds still require a conservative product decision.
- `sort=price` and `sort=-price`.
- `price[gte]`, `price[lte]`, and their combined range using numeric values.
- One `brand` ID returned by verified API data.
- One `category[in]` ID or repeated `category[in]` keys for multiple IDs.
- `category[in] + sort` and `category[in] + brand` using individually verified encodings.

Do not enable `fields`, positive keyword search, paginated keyword search, comma-separated categories, or brand-plus-price UI behavior from this evidence. Treat those outcomes as Unsupported or Unresolved exactly as recorded.

## Remaining unknowns

- Maximum/minimum `limit`, page bounds, pagination stability during catalog changes, and arbitrary page sizes.
- Positive keyword syntax, tokenization, searched fields, case sensitivity, and keyword pagination.
- Other sort fields, compound sorts, field-projection syntax, and invalid values.
- Price inclusivity, decimals, currency semantics, invalid/reversed ranges, and broader combinations.
- Multiple brand values, category list size limits, comma-separated categories, and combinations not listed above.
- Error envelopes, query rate limits, caching, and future behavior changes.
