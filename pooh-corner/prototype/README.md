# Pooh Corner — clickable redesign concept

An independent design concept for Pooh Corner, Hartfield. It is **not** the official website and is not endorsed by the business.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Plan your visit | `visit.html` |
| Shop landing (search, category chips, budget filter, sort) | `shop.html` |
| Product detail (any product: `product.html?p=<handle>`) | `product.html` |
| Our story | `story.html` |
| About this prototype, credits, real vs simulated | `credits.html` |

## View it

- **On your computer:** double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.
- **Share a link (free):** drag this folder onto https://app.netlify.com/drop, or use Cloudflare Pages or GitHub Pages. Keep the link private to the business; every page already carries a "design concept" notice and a `noindex` tag.

## How it's built

Plain HTML, CSS and JavaScript, with no build step and no paid services.

- `assets/css/styles.css`: design tokens (colours, type, spacing) at the top, then components.
- `assets/js/site.js`: shared header and footer, "open now" logic, simulated basket, product card.
- `assets/js/pages.js`: shop filtering and search, product page, small page behaviours.
- `assets/js/products.js`: a snapshot of 27 real products from the shop's public `products.json` feed. Product images are hot-linked from the shop's CDN and are not stored here.

## Change things quickly

- **Colours and fonts:** edit the `:root` block at the top of `styles.css`.
- **Opening hours and contact details:** edit the `INFO` object at the top of `site.js`.
- **Featured products:** change the handles in `data-products="..."` on `index.html` and `shop.html`.
- **Add a product:** copy an entry in `products.js`. Its handle is the last part of its URL on the live shop.
