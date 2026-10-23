# Pooh Corner concept — 01: Research, direction and first session

Independent concept, not commissioned or endorsed by Pooh Corner.
Research done 23 October 2026 by fetching both live sites (desktop and mobile renders).

---

## 1. Audit of the current experience

### Observed facts

**Main site — poohcorner.co.uk**

- Platform: WordPress 7.1.3, "Corretto" theme (a generic restaurant theme), WPBakery page builder, Slider Revolution 5.4.7.3.
- **Theme demo content is still live on every page.** A side panel shows "Lorem ipsum dolor sit amet…", `example@email.com` and `+369-7482-36-96`. Several `mailto:` links point to `example@email.com`. The Facebook icon links to facebook.com, not to the business's page.
- **Out-of-date content:**
  - The homepage says "95 years of Winnie the Pooh", but the shop is selling a 100th-anniversary range.
  - The Additional Information page says "Updated 13.6.22" and still has a COVID-19 section and "adjustments… during 2022".
  - Afternoon-tea blackout dates are listed without a year (Feb, Easter, May and summer half-terms), and those dates have now passed.
- Hero: a 2019 banner of the cottage with film-style character images layered around it and a large semi-transparent "WELCOME".
- In my headless mobile render, the menu icon showed as the letter "a" and the search icon as "U", which suggests an icon font isn't loading. **Check this on a real phone before relying on it.**
- On mobile the homepage is about 8,000px tall. Opening hours appear near the bottom.
- The Contact page returned "403 Forbidden" to my automated request. This could be bot protection, so **check it in a normal browser**.
- Type and colour: Ubuntu typeface, mid-blue header bar.
- **There's plenty of useful content, but it's scattered:**
  - Hours: Mon–Sat 11:00–5:00, Sundays and bank holidays 11:00–4:00. Closed 25/26 Dec and 1/2 Jan. Food service ends about an hour before closing.
  - Walk-in only, no table reservations. Afternoon tea must be pre-booked. Wheelchair users can ask for a table to be held at peak times.
  - The museum is described as free.
  - Tearoom: two rooms, the E.H. Shepard Room and Piglet's Tearoom. The menu covers gluten-free, vegan and dairy-free diets.
  - Afternoon tea:
    - £35pp, 2–4 people, Tue–Fri, 12:00 and 2:00.
    - £10pp non-refundable deposit and 72 hours' notice.
    - Not available weekends or school holidays.
    - Book via afternoontea@poohcorner.co.uk or 07563 627326.
  - Parking: free roadside parking on the High Street on weekdays. At weekends and in school holidays, also at St Mary's C of E Primary School.
  - Travel: train to East Grinstead or Tunbridge Wells, then the 291 Metrobus.
  - FAQ: dogs welcome on a lead. The team recommends visiting before heading to Poohsticks Bridge and sells a £2.50 guide map.
  - Accessibility: Grade II listed cottage, with several small steps. The toilet isn't wheelchair-accessible.
  - History:
    - The building dates from 1703 and was known as Sackville Cottage.
    - Mike and June Ridley opened the gift and tea shop in 1978.
    - The Ashby family took over in 2013.
    - Neil and Samantha Reed have owned it since 25 Jan 2019.
  - A Tripadvisor 2025 award graphic is shown.

**Online shop — shop.poohcorner.co.uk**

- Platform: Shopify. Theme: **Reformation v16.1.0** (Shopify Theme Store, Online Store 2.0), named "Updated copy of Reformation".
- Type and colour: EB Garamond, with a mustard scrolling announcement bar: "Free shipping for UK orders over £30.00".
- Navigation: 13 top-level menu items that wrap onto two rows on desktop (Characters, Books, Music & Movies, Cuddly Toys, Baby, Games & Toys, Collectables, Household, Pooh Corner, 100th Anniversary, Pre-Order, Christmas…).
- Hero: an auto-rotating carousel of 5 slides (gift wrapping, afternoon-tea vouchers, books, sale…).
- The 100th Anniversary collection has 30 products, filters for availability and price, and full sorting.
- Product page (e.g. Winnie The Pooh 100 Commemorative Soft Toy, £24.99):
  - Has: 3 images, size, maker, "suitable from birth", and delivery tabs (UK dispatch within 48h by Royal Mail, international tracked).
  - Supports click-and-collect.
  - No related products or reviews are visible.
- Contact: shop@poohcorner.co.uk, **01892 771155**. The main site lists **07563 627326** and info@poohcorner.co.uk.
- Link back to the main site: one "Find Out More…" button, under "Visit our shop, tearoom & museum".
- Gift cards and afternoon-tea e-vouchers are sold here and redeemable in store, tearoom and online, according to the main site's FAQ.

**Across both sites:** different typefaces, colours, header layouts and logo treatment. To a visitor they look like two separate businesses.

### Assumptions — not verified

- How much traffic is mobile, and how revenue splits between the shop, tearoom and online.
- Who maintains each site (in-house or agency), and whether the WordPress site is still actively edited.
- Whether the two phone numbers and three email addresses are intentional (e.g. landline vs tearoom mobile).
- Licensing status of the character imagery in the current hero and the Shepard-map background on the shop.
- That the centenary is driving current sales. This is plausible given the shop's emphasis, but unproven.

---

## 2. The three biggest opportunities

1. **Restore trust and accuracy.** Placeholder text, dummy contacts, dead social links and 2022 notices are cheap to fix and visibly hurt credibility. This is also the most tactful, concrete opening for the pitch. Frame it as "quick wins I noticed", never as criticism.
2. **One brand across both sites.** Use one header, one type system, one palette and two-way links (Visit ↔ Shop), so the shop feels like the online branch of a real place. That place is the shop's strongest differentiator against generic Pooh retailers. The 2026 centenary gives the work a natural reason to happen now.
3. **Mobile visit planning.** Put the questions families actually ask at the top: open today? Can I book? Where do I park? Is it accessible? Can we walk to Poohsticks Bridge from here? The content already exists. It's buried in an 8,000px homepage and four separate pages.

Gift discovery belongs under #2: shopping by budget and recipient, tied to the £30 free-shipping threshold. Treat it as something to test, not a promised uplift.

---

## 3. Recommended homepage structure (mobile-first)

| # | Section | Purpose | Content source |
|---|---|---|---|
| 0 | Announcement strip, static, one line | Today's practical info | "Open daily from 11am · Tearoom is walk-in only" (verified hours) |
| 1 | Header | Visit · Tearoom · Museum · Shop · Our story, plus search and basket. Mobile: logo, menu, basket | — |
| 2 | Hero, full-bleed photo | Emotion plus the two CTAs: **Plan your visit** / **Explore the shop** | Draft H1 below |
| 3 | Visit at a glance | Hours · address · parking · "no booking needed", then a link to Plan your visit | Verified FAQ facts |
| 4 | Three experiences: Tearoom, Museum, Gift shop | Alternating image and text layouts, not three identical cards. Afternoon tea is a sub-link | Tearoom, FAQ and About pages |
| 5 | "100 years of Winnie-the-Pooh" | Centenary editorial band leading into the shop collection | Shop's 100th Anniversary collection |
| 6 | Featured gifts, 4 products | Real names and prices from the shop | Shop |
| 7 | Gift by budget | Under £10 · Under £30 · Baby gifts · Collectables | Shop collections (price filters) |
| 8 | Start your walk here | Ashdown Forest, Poohsticks Bridge, the £2.50 guide map, "ask our team for directions" | FAQ |
| 9 | Our story teaser | 1703 cottage, est. 1978, then a link to Our Story | About page |
| 10 | Newsletter | Already offered by the business | Homepage |
| 11 | Footer | Address, hours, contact, FAQs, accessibility, shop policies, socials, concept disclaimer | — |

**Hero copy**

- Recommended H1: *"A little corner of storybook magic."* It's warm, though slightly generic.
- Alternative to test: *"Your first stop in Pooh Country."* It's more specific, and it's supported by the business's own advice to visit before heading to the forest.
- Supporting copy: "A welcoming tearoom, free museum and gift shop in Hartfield, on the edge of Ashdown Forest."
  - Verified: tearoom, museum, gift shop, location, and the museum being free (as stated on the homepage).
  - **Confirm before publishing:** that the museum is still free.

---

## 4. Refined visual direction

**Concept: "a well-kept book, not a children's toy box."**
Real place, real light, quiet type, small storybook details.

### Colour (contrast-checked)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| Forest | `#354B37` | Primary buttons, headings, dark bands | 7.9:1 on cream ✅ |
| Charcoal | `#292D26` | Body text | 11.6:1 on cream ✅ |
| Cream | `#F1E9D9` | Main page background | — |
| White | `#FFFFFF` | Product cards, image backgrounds | — |
| Sage | `#DCE4D4` | Alternate section background | Forest on sage 7.3:1 ✅ |
| Soft brown | `#A77C54` | **Decorative only**: rules, icons, large display text | 3.1:1 on cream ❌ for body text |
| Bark *(new)* | `#7A5634` | Links, eyebrow labels, prices | 5.4:1 on cream ✅ |
| Honey *(new, optional)* | `#C8963E` | Tiny accents only (sale badge background with charcoal text, focus underline) | Never as text colour |

Honey deliberately echoes the shop's current mustard, so the shop restyle reads as an evolution, not a takeover.

### Type

- **Fraunces** for headings, at weight 400–500. Use italics for single-word emphasis. Avoid heavy weights, which look "craft fair".
- **DM Sans** for everything else.
- Scale (desktop / phone):
  - H1 64/40
  - H2 44/32
  - H3 26/22
  - Body L 19/18
  - Body 17/16
  - Small 14
  - Eyebrow 13 (uppercase, +8% tracking, Bark)
  - Button 16 (medium)
- Line height: headings 1.1, body 1.6. Max text width about 640px.

### Layout and detail

- 8-point spacing: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128. Section padding 96 on desktop and 64 on phone. Content max width 1200.
- Corners: 4px on buttons and inputs, 2–4px on images. No pill buttons, no stacks of rounded cards.
- **Signature device:** chapter-style section labels with a thin hairline rule, e.g. "Chapter one — *In which we have tea*". It's a quiet nod to the books' chapter titles without using any artwork. Use it on 3–4 sections at most.
- Photography:
  - Warm, natural light: the cottage, the tearoom, the forest and the products.
  - No character artwork, no film imagery, and no reuse of Shepard illustrations or map backgrounds. Shepard's work is still in copyright.
  - For the concept, use free-licence woodland images (Unsplash or Pexels) and log every source.
  - Ideally, take your own photos of the exterior from the street, in morning light. That would make the prototype far more convincing.
- Motion: one fade-up (12px, ~400ms, once) on section entry. Nothing else.

---

## 5. Production architecture (for the eventual pitch — not for now)

- **Keep Shopify.** Reformation is an Online Store 2.0 theme, so colours, fonts, header, menus and sections can be restyled in the theme editor, with light code where needed. Checkout, stock and orders stay untouched. This is low-risk.
- **The main site has three options:**
  - **A. Rebuild the visitor pages inside Shopify**, as pages on the same theme. This gives one platform, one login, one header and no extra subscription. **Likely recommendation.**
  - **B. Framer main site plus restyled Shopify.** Nicer editing for marketing pages, but two platforms, an extra Framer plan (Basic is $10/mo, Pro $30/mo at time of writing) and a duplicated header. Framer can embed Shopify Buy Buttons, but it does not replace the Shopify storefront or checkout.
  - **C. Keep WordPress and re-theme it.** This keeps an old theme and plugin stack that would still need maintaining.
- **For this project, Framer is the design and prototyping tool.** Decide the production route after a discovery chat with the owners.

### Framer free plan (from framer.com/pricing, Oct 2026)

- Free Framer subdomain, no custom domain, 1 GB bandwidth.
- The plan is described as "for non-commercial use". A private pitch concept on an unlisted link is the sensible use. Don't promote the link publicly.

---

## 6. Session 1 plan (2 hours in Framer)

**Objective:** a styled project foundation and a finished hero plus "Visit at a glance" strip that works on desktop and phone.

| Time | Task |
|---|---|
| 0:00–0:10 | Sign up for Framer (free). New project → blank. Name it "Pooh Corner — Concept". In the **Pages** panel, rename the default page to *Home* and add the empty pages *Visit*, *Shop*, *Product* and *Our Story*, so links have somewhere to go later. |
| 0:10–0:35 | **Assets → Colors:** add the 8 colour styles above, named exactly as in the table. **Assets → Text Styles:** create H1, H2, H3, Body L, Body, Small, Eyebrow and Button using Fraunces and DM Sans (both available in Framer's font picker). Set phone sizes for each style per breakpoint, if your Framer version offers it in the style panel. |
| 0:35–0:55 | Components. **Button**: a Stack with padding 14/24 and radius 4, using the Button text style. Variants: *Primary* (Forest fill, Cream text), *Secondary* (1px Forest border, transparent fill), *On dark* (Cream fill, Forest text). **Header**: Desktop and Phone variants (text logo "Pooh Corner · Hartfield" in Fraunces for now). |
| 0:55–1:35 | On the Home Desktop breakpoint: the announcement strip, Header, then the **Hero**. The hero is a Stack, full width, min-height 85vh, with a background image and a dark gradient at the bottom for text contrast. It holds the H1, supporting copy and two Buttons. Below it, the **Visit at a glance** strip: Sage background, 4 columns (Hours, Find us, Parking, No booking needed). |
| 1:35–1:50 | Add the **Phone** breakpoint (390 wide). Change the hero to a single column, stack the CTAs at full width, and make the visit strip a 2×2 grid. Check that nothing overflows sideways. |
| 1:50–2:00 | Publish to the free subdomain. Open it on your phone. Note 3 issues. Start `image-licences.md`: one line per image (URL, author, licence). |

The Framer UI changes often. If a menu name differs, look for the same idea (colour styles, text styles, components, breakpoints) in the left Assets panel or the right properties panel.

### Session 1 checklist

- [ ] 8 colour styles and 8 text styles exist and are used. No hand-typed hex values or font sizes on the canvas.
- [ ] The Button component has 3 variants. The Header has Desktop and Phone variants.
- [ ] The hero reads clearly on a phone: H1 fits in 3 lines or fewer, both CTAs are visible without scrolling.
- [ ] Text contrast over the hero photo is clearly readable (gradient overlay applied).
- [ ] The visit strip uses verified facts only.
- [ ] The site is published on the free subdomain and opened on a real phone.
- [ ] The image licence log is started.

**Next session:** sections 4–7 (three experiences, centenary band, featured gifts, gift by budget). These are the parts that sell the shop story.
