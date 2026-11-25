# SafatHOME Room Inspirations in React

Node.js runs the tooling and the application server. Next.js supplies routing and the production build. React renders the controls and product cards in the browser.

## Install and run on Windows

Install Node.js LTS and Git for Windows. Close any open Command Prompt after installation. In File Explorer, open the extracted project folder containing `package.json`, type `cmd` in the address bar and press Enter. Run:

```cmd
node -v
git --version
npm ci
npm run dev
```

Open http://localhost:3000/room-inspirations. Use the port shown in the console if it differs. Keep Command Prompt open. To build and serve the production version, press Ctrl+C to stop development, then run `npm run build` followed by `npm start`.

## Structure

```text
SafatHOME/
  app/
    room-inspirations/page.tsx       Route and page metadata
  features/room-inspirations/
    RoomStudio.tsx                   Room selectors, markers and product selection
    studio.module.css                Styles scoped to the page
    catalogue.ts                     Typed access and KWD formatting
    catalogue.json                   Rooms, palettes, products and finishes
    visuals.json                     Image dimensions and marker positions
  public/room-inspirations/          Room photos and product crops
  package.json                       Scripts and dependencies
  package-lock.json                  Exact dependency resolution for npm ci
  standalone-room-studio/            Separate offline prototype
```

To scaffold a new repo instead, run `npx create-next-app@latest safathome-catalog --typescript --app --use-npm --no-tailwind`. Choose a layout without a `src/` directory if asked, then copy the route, feature folder and asset directory into the new project. The provided ZIP already has the full project and needs no scaffolding.

## Add a room such as Kitchen

1. In `catalogue.json`, add a `kitchen` room with a name, description, and a `looks` entry that maps each supported ambience to its ordered product IDs. Add the products and finish labels. Prices are stored in fils, so 29.500 KWD is `29500`.
2. Add a furnished scene for each supported ambience and palette, such as `kitchen-calm-sand.webp`, to `public/room-inspirations/`. Use matching product crops named `kitchen-calm-sand-0.webp`, `kitchen-calm-sand-1.webp`, and so on, in the same order as the product IDs.
3. In `visuals.json`, add `kitchen-calm-sand` with the scene dimensions and an ordered `items` array. Each item has `x` and `y` marker coordinates as percentages, and may specify a finish override. Add at least one visual entry per listed ambience. The room selector picks up new rooms from the data and only offers palettes that have a scene.
4. Run the build and check that markers, matching photos, stock, and totals work for the new room.

## Push to GitHub

For an **empty** GitHub repository, open Command Prompt in the extracted ZIP directory containing `package.json` and run:

```cmd
git init -b main
git add .
git status
git commit -m "Build SafatHOME room inspirations catalogue"
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the URL with the HTTPS URL from your GitHub repository. If Git asks for your identity, configure `git config user.name "Your Name"` and `git config user.email "you@example.com"` in that folder, then retry the commit. Sign in through Git Credential Manager when prompted. If the folder is already a clone, skip initializing Git and adding a remote, and use `git remote -v` to confirm the destination.

If the GitHub repository already has commits, clone it first. Create a branch such as `room-inspirations`, add the route, feature and public assets to the clone, then commit and push that branch. Open a pull request on GitHub. Keep your existing site's dependencies and integrate the route with its router if it uses a different React framework.

Pushing stores the source on GitHub. To make the website open on another device, deploy the project with a Next.js-compatible host.
