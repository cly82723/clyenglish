// A local preview of the site, for the teacher's own computer. Test mode (challenge.html?test) works only here.
// Run: node tools/serve.js   then open http://localhost:8000/challenge.html?test
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8000;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".gs": "text/plain", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  // Only files inside the site folder are served.
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log("Preview running. Open http://localhost:" + PORT + "/challenge.html?test  (close this window to stop)"));
