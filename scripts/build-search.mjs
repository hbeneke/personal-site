import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Pagefind can hang on CI; the timeout keeps the build moving (override via env).
const PAGEFIND_TIMEOUT = Number.parseInt(process.env.PAGEFIND_TIMEOUT ?? "30000", 10);

function findBuildOutput() {
  const vercelPath = path.join(process.cwd(), ".vercel", "output", "static");
  const distPath = path.join(process.cwd(), "dist");

  if (fs.existsSync(vercelPath)) return vercelPath;
  if (fs.existsSync(distPath)) return distPath;
  return null;
}

// Vercel serves from .vercel/output/static, but `npm run preview` reads from dist.
function copyIndexToDist(sitePath, indexPath) {
  const distPath = path.join(process.cwd(), "dist");
  if (sitePath === distPath || !fs.existsSync(distPath)) return;

  fs.cpSync(indexPath, path.join(distPath, ".pagefind-cache"), { recursive: true });
}

function buildSearch() {
  const sitePath = findBuildOutput();
  if (!sitePath) {
    console.log("No build output found, skipping search index generation");
    return;
  }

  const htmlFiles = fs.readdirSync(sitePath).filter((file) => file.endsWith(".html"));
  if (htmlFiles.length === 0) {
    console.log("No HTML files in build output, skipping search index generation");
    return;
  }

  const indexPath = path.join(sitePath, ".pagefind-cache");

  try {
    execSync(`npx pagefind --site "${sitePath}" --output-path "${indexPath}"`, {
      stdio: "inherit",
      timeout: PAGEFIND_TIMEOUT,
    });
    copyIndexToDist(sitePath, indexPath);
    console.log("Search index built successfully");
  } catch (error) {
    // Search is a progressive enhancement: ship the site without it rather than fail the deploy.
    console.error("Failed to build search index:", error.message);
    console.log("Continuing without search functionality");
  }
}

buildSearch();
