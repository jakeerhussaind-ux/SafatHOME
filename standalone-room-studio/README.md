# SafatHOME Room Inspirations

A standalone Node.js shopping prototype with no npm dependencies. This directory is independent of the earlier Next.js prototype.

## Run or export

- From this directory, run `node studio.cjs` and visit http://localhost:3004 on the same machine. Set the `PORT` environment variable to choose another port.
- Run `node studio.cjs --export SafatHOME-Room-Inspirations.html` to build a self-contained offline copy. Open the exported file in a browser. It includes all images and needs no server.

## Demo catalogue

The Abyat Imagine and SafatHOME websites were blocked by the cloud proxy. The original photo-realistic scenes were generated for this demo. The cards use crops from the exact corresponding room scenes. Product names, finish descriptions, KWD prices and stock are illustrative. The interface simulates selecting available products and calculating a total.

Edit the product descriptions, pricing in fils and stock in `catalogue.json`. The photo files are in `images/`. For each room, ambience and palette combination, `visuals.json` lists image dimensions and the positions of the numbered hotspots. The image files use the same combination key, with a zero-based suffix for the product crops in the order defined by the room's look in the catalogue. To use official items, replace the appropriate scene and matching crops and update the catalogue and hotspot positions before exporting again.
