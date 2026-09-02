# Morsel Pastry Studio — Visual Refinement v3

This build is the visual refinement pass focused on the hero, brand identity and responsive hierarchy.

## Updated
- Reworked hero slideshow into a clean editorial split layout on desktop.
- Removed text-over-image crowding and global image wash.
- Reworked mobile hero into a stacked image-first composition.
- Reduced mobile hero content density and removed the secondary CTA from the hero.
- Introduced a distinct soft-lilac / blush / sage hero colour system per slide.
- Refined the Morsel logo into a stronger monogram + wordmark system.
- Updated the favicon to match the new monogram.
- Preserved the existing slideshow controls, autoplay, progress indicator and catalogue interactions.
- Kept the premium footer and downstream sections intact for the next visual QA pass.

## Run locally
Open `index.html` in a browser or serve the folder with any static web server.

## Functional / checkout phase
- Added persistent cart state using browser localStorage.
- Added a full responsive checkout form with pickup/delivery, customer details, order notes and payment selection.
- Added demo-safe Paystack and Flutterwave initialization routes through `worker.js`. With no secret keys configured, checkout records a portfolio demonstration order instead of attempting a live charge.
- When test credentials are configured as Cloudflare Worker secrets, the same routes can initialize real test transactions without exposing secret keys in the browser. Paystack requires server-side initialization and verification; Flutterwave similarly supports server-side payment flows.
- Added `wrangler.toml` for Cloudflare Workers + static assets deployment.

### Payment setup
Set `PAYSTACK_SECRET_KEY` and/or `FLW_SECRET_KEY` as Worker secrets only when you are ready to test the payment providers. Do not put secret keys in `app.js` or any client-side asset.

The default portfolio build remains in demo mode when no credentials are present.


## Asset note — Chicken Pie
The Chicken Pie product uses a distinct free-to-use Pexels photograph (Nano Erdozain, Pexels photo 29535632) because the original local fish-pie and chicken-pie assets were effectively the same image. The site references the Pexels image URL directly for this portfolio build.
