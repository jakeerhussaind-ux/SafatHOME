# SafatHOME Room Inspirations

A bilingual furniture-shopping prototype with five prepared rooms and original generated imagery. It runs locally without an account or API key.

## Open on a Mac

1. Install the LTS version of [Node.js](https://nodejs.org/). The application requires Node.js 20.9 or newer and includes an npm lockfile.
2. In Terminal, open the project folder (the one containing `package.json`). You can type `cd ` and drag the folder from Finder into Terminal, then press Return.
3. Run `npm ci`, then `npm run dev`.
4. Open [Room Inspirations](http://localhost:3000) in your browser. Keep Terminal open while using the app.

To run the production version, stop the development server with Control-C, then run `npm run build` and `npm start`.

## Sample shopper journey

Choose **Design your room → Living Room → Warm Neutrals → Minimal → Bright Daylight**. Set **From** to **250** and **To** to **300**. Open **Quiet Mornings** and select **Noura Linen Sofa** (KWD 199.000) and **Rami Walnut Coffee Table** (KWD 69.000). The selected total and demo cart total should both be **KWD 268.000**. The **Luma Arc Floor Lamp** is out of stock.

## Demo data

Edit the bilingual room and product data in `app/catalog.ts`. Prices use whole fils. Replace the WebP files in `public/images/` using the associated room or product ID as the filename.

The room finder filters prepared rooms by type and the inclusive range of their available-product totals, then ranks them by matching mood, style and lighting. The live ABYAT post-budget behaviour could not be verified, so this uses the requested fallback. Photos, prices and inventory are illustrative. The demo cart reflects the current submitted selection and is held in memory. There is no checkout or live stock integration.
