const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.argv[2] || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function resolvePath(urlPath) {
  let cleanPath = "/";
  try {
    cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  } catch {
    return null;
  }

  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const fullPath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, fullPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    return null;
  }

  return fullPath;
}

function serveFile(targetPath, response, method) {
  fs.readFile(targetPath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
      return;
    }

    const ext = path.extname(targetPath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
    });

    if (method === "HEAD") {
      response.end();
      return;
    }

    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "GET")) {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("405 Method Not Allowed");
    return;
  }

  const filePath = resolvePath(request.url);

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("403 Forbidden");
    return;
  }

  let targetPath = filePath;
  fs.stat(targetPath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      targetPath = path.join(targetPath, "index.html");
    }

    if (statError && statError.code !== "ENOENT") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 Not Found");
      return;
    }

    serveFile(targetPath, response, request.method || "GET");
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Midsteel preview running at http://127.0.0.1:${port}/`);
});
