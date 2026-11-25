"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const catalogue = require("./catalogue.json");
const visuals = require("./visuals.json");

const read = (name) => fs.readFileSync(path.join(__dirname, name), "utf8");
const embed = (name) => "data:image/webp;base64," + fs.readFileSync(path.join(__dirname, "images", name)).toString("base64");

for (const [key, look] of Object.entries(visuals)) {
  const [room, mood] = key.split("-");
  if (look.items.length !== catalogue.rooms[room].looks[mood].length) {
    throw new Error("The room and its product crops must have matching entries for " + key);
  }
  look.scene = embed(key + ".webp");
  look.items.forEach((item, index) => { item.image = embed(key + "-" + index + ".webp"); });
}

const html = read("studio.html")
  .replace("/* STUDIO_CSS */", () => read("studio.css"))
  .replace("/* STUDIO_DATA */", () => JSON.stringify({ ...catalogue, visuals }).replace(/</g, "\\u003c"))
  .replace("/* STUDIO_JS */", () => read("studio.js"));

if (process.argv[2] === "--export" && process.argv[3]) {
  fs.writeFileSync(process.argv[3], html);
} else {
  const port = Number(process.env.PORT || 3004);
  http.createServer((request, response) => {
    if (request.url.split("?")[0] !== "/") {
      response.writeHead(404).end("Page not found");
      return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : html);
  }).listen(port, "0.0.0.0", () => console.log("SafatHOME Room Inspirations is running on port " + port));
}
