# Resonate Local Customer Workflow

This is the normal build process when a real customer wants to move forward with a Resonate Local page.

## Goal

Create a customer-ready local business page that feels custom to the business, uses strong visual assets, and keeps the final implementation clean inside the Resonate Solutions codebase.

The working pattern:

1. Customer sends details by email.
2. Codex turns the customer details into a strong Lovable prompt.
3. Kurt runs the prompt in Lovable and shares the generated assets or preview link.
4. Codex extracts or receives the best assets.
5. Codex implements the assets and copy in the production app.
6. Codex verifies the page in-browser before customer review.

## Customer Email Intake

When a customer says they want to move forward, collect or infer only what is needed for the page.

Ask for:

- Business name
- Business type
- Service area or location
- Main services or packages
- Hours or availability
- Best contact method
- Booking, quote, order, or social links
- Photos, logo, colors, or brand preferences
- Pricing notes or starting prices, if they want them public
- Customer trust signals, such as reviews, years in business, licensed/insured, family-owned, mobile service, locally owned
- Any updates they often need to share, such as openings, weather delays, sold-out services, specials, route changes, policies, or seasonal offers

If details are missing, make reasonable placeholders for the Lovable concept only. Do not publish guessed factual details without customer review.

## Business Type Mapping

Use the closest Resonate Local track:

- MenuPilot: food trucks, restaurants, popups, menus, specials, ordering, sold-out items, location changes
- LawnPilot: lawn care, landscaping, quotes, service areas, mowing, cleanup, mulch, weather delays
- CleanPilot: maids, cleaning services, packages, checklists, recurring cleans, open slots, trust signals
- DetailPilot: mobile car detailers, packages, before/after photos, mobile booking, promos
- BeautyPilot: nail techs, beauty pros, galleries, policies, open slots, booking
- WellnessPilot: massage therapists, wellness providers, sessions, availability, new-client offers, booking
- Other local service: custom services, photos, proof, booking, quote requests

## Lovable Prompt Creation

Codex should generate a Lovable prompt that includes:

- The business type and intended customer
- The business name and trade-specific language
- Desired page feeling and brand direction
- Concrete customer-facing sections
- Specific calls to action
- Premium update examples
- Visual asset instructions
- Constraints that match Resonate taste

Use this prompt structure:

```text
Create a responsive customer-facing local business page section for [BUSINESS NAME], a [BUSINESS TYPE] business in [LOCATION/SERVICE AREA].

The page is part of Resonate Local by Resonate Solutions. It should feel custom branded, practical, polished, and clear for customers who are deciding whether to call, book, request a quote, or learn more.

Business details:
- Business name: [NAME]
- Business type: [TYPE]
- Services: [SERVICES]
- Service area/location: [AREA]
- Main customer action: [BOOK / QUOTE / CALL / ORDER / DIRECTIONS]
- Trust signals: [TRUST SIGNALS]
- Brand feel: [COLORS / MOOD / STYLE]

Create a branded page preview with:
- A customer-facing hero image or visual treatment that fits the trade
- Business name and short positioning line
- Status badge
- 3 primary action buttons
- 3 service/package highlight tiles
- 1 premium update banner
- Strong mobile-first layout

Copy direction:
- Use plain language a local customer would understand.
- Avoid generic SaaS language.
- Avoid lorem ipsum.
- Avoid food/menu language unless this is a food business.
- Keep the tone professional, warm, and direct.

Design direction:
- It should feel like a real local business page, not a dashboard.
- Use distinct colors and imagery for this trade.
- Use realistic image assets or generated visuals that can be exported.
- Use rounded corners, subtle shadows, strong typography, and good spacing.
- Do not use purple-heavy generic SaaS gradients.
```

## Asset Handoff From Lovable

Preferred handoff:

- Lovable preview link
- Downloaded image assets
- Screenshot of the generated section
- Any copy the user especially likes

Codex should first try to use real exported assets from Lovable. If assets are embedded in a bundle, Codex can inspect the preview page and download the generated image files when available.

Fallbacks:

- Crop from a high-resolution screenshot only if individual assets are not available.
- Use generated or locally created placeholder visuals only when Lovable does not provide usable images.

## Implementation Rules

When bringing Lovable output into the Resonate app:

- Keep the Resonate Local structure and navigation consistent.
- Use Lovable visuals as assets, not as a wholesale copy-paste of the page.
- Save customer assets under `public/assets/`.
- Use durable filenames, such as `customer-slug-lawn-hero.jpg`.
- Keep copy concise and customer-facing.
- Preserve the trade-specific language.
- Do not add a new design system unless the existing Tailwind patterns cannot support the page.
- Avoid external image dependencies in production when possible.

## QA Checklist

Before customer review:

- Run `npm.cmd run build`.
- Run smoke checks with `BASE_URL` pointed at the active local server.
- Open the page in Browser Use.
- Verify images render.
- Verify text contrast is readable.
- Verify mobile layout does not overlap.
- Verify calls to action point to the right destination.
- Verify no console warnings or errors.
- Confirm no placeholder factual claims are presented as final truth.

## Customer Review Loop

Send the customer a concise review note:

```text
Here is the first version of your Resonate Local Page.

Please check:
- Business name and spelling
- Services/packages
- Hours or availability
- Phone, booking, quote, and social links
- Photos and brand feel
- Any wording that does not sound like your business

After your notes, I will make the final polish pass.
```

## Internal Decision Rule

Use Lovable for visual exploration and fast asset generation.

Use Codex for:

- Turning the customer email into the right prompt
- Deciding what assets are worth keeping
- Integrating assets into the real codebase
- Protecting the product style
- Running build and browser verification
- Making the page feel like Resonate, not like a pasted template
