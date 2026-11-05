# Resonate Solutions Visual Direction

## Brand thesis

Resonate turns scattered business information into one clear, trustworthy customer experience. The visual system should feel warm, capable, and unusually polished without becoming decorative or playful.

## Signature treatment

The circular Resonate mark is the source of the brand's ombre field. Coral and gold carry warmth, lavender adds a digital note, and mint signals clarity. A fine grain gives large gradients a physical finish. Use this signature on Resonate-owned marketing surfaces only; customer subsites retain their own identities.

## Color tokens

- Ink: `#202320`
- Warm ivory: `#fffdf9`
- Resonate coral: `#f05f3b`
- Resonate gold: `#ffd35e`
- Resonate mint: `#7bd7c4`
- Resonate lavender: `#b9b5ff`
- Brand ombre: coral to gold to rose to lavender to mint

Runtime ownership lives in `app/globals.css`. Tailwind aliases remain in `tailwind.config.ts` for established utility usage.

## Typography

- Display: Bricolage Grotesque
- Body and interface copy: Karla
- Headlines are compact and confident; body copy stays conversational and easy to scan.

## Depth and interaction

- Grain is reserved for large Resonate ombre surfaces, never text-heavy panels or customer content.
- Primary coral actions use layered inset, contact, and ambient shadows with a clear pressed state.
- Secondary actions remain quieter so each section has one obvious next step.
- Motion must respect `prefers-reduced-motion`.

## Logo use

- Use `resonate-logo-primary.png` for the primary Resonate navigation and footer lockups.
- Keep the wordmark dark for readability; the circular mark and Solutions line carry the ombre.
- Customer brands, including Excellent Pins, keep their own logo assets and route-specific styling.

## Scope boundary

The Resonate marketing system applies to the company website and Resonate product pages. It must not override `/excellent-pins`, `/m/*`, admin, dashboard, or other customer-branded routes.
