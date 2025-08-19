import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

function buildSearch() {
  const vercelPath = path.join(process.cwd(), ".vercel", "output", "static");
  const distPath = path.join(process.cwd(), "dist");

  let targetDir = null;
  let absolutePath = null;

  if (fs.existsSync(vercelPath)) {
    targetDir = ".vercel/output/static";
    absolutePath = vercelPath;
    console.log("📁 Found Vercel output directory, building search index...");
  } else if (fs.existsSync(distPath)) {
    targetDir = "dist";
    absolutePath = distPath;
    console.log("📁 Found dist directory, building search index...");
  } else {
    console.log("⚠️  No build output found, skipping search index generation");
    return;
  }

  const htmlFiles = fs.readdirSync(absolutePath).filter((f) => f.endsWith(".html"));
  console.log(`📄 Found ${htmlFiles.length} HTML files in target directory`);

  if (htmlFiles.length === 0) {
    console.log("⚠️  No HTML files found, skipping search index generation");
    return;
  }

  try {
    console.log(`🔍 Running: pagefind --site "${targetDir}"`);
    console.log(`📂 Absolute path: ${absolutePath}`);

    if (process.platform === "win32") {
      try {
        execSync(`pagefind.exe --site "${targetDir}" --verbose`, {
          stdio: "inherit",
          cwd: process.cwd(),
          timeout: 30000,
        });
      } catch (exeError) {
        console.log("⚠️  pagefind.exe failed, trying pagefind...");
        execSync(`pagefind --site "${targetDir}" --verbose`, {
          stdio: "inherit",
          cwd: process.cwd(),
          timeout: 30000,
        });
      }
    } else {
      execSync(`pagefind --site "${targetDir}" --verbose`, {
        stdio: "inherit",
        cwd: process.cwd(),
        timeout: 30000,
      });
    }

    console.log("✅ Search index built successfully!");

    const pagefindDir = path.join(absolutePath, "_pagefind");
    if (fs.existsSync(pagefindDir)) {
      const pagefindFiles = fs.readdirSync(pagefindDir);
      console.log(`📦 Created ${pagefindFiles.length} search index files`);
    }
  } catch (error) {
    console.error("❌ Failed to build search index:", error.message);
    console.log("🔧 Attempting alternative approach...");

    try {
      const altCommand =
        process.platform === "win32"
          ? `pagefind --site "${absolutePath.replace(/\\/g, "/")}"`
          : `pagefind --site "${absolutePath}"`;

      console.log(`🔄 Trying: ${altCommand}`);
      execSync(altCommand, {
        stdio: "inherit",
        cwd: process.cwd(),
        timeout: 30000,
      });
      console.log("✅ Search index built successfully with alternative approach!");
    } catch (altError) {
      console.error("❌ Alternative approach also failed:", altError.message);
      console.log("📋 Directory contents for debugging:");
      try {
        const files = fs.readdirSync(absolutePath);
        for (const file of files.slice(0, 10)) {
          const stat = fs.statSync(path.join(absolutePath, file));
          console.log(`  - ${file} ${stat.isDirectory() ? "[DIR]" : `[${stat.size} bytes]`}`);
        }
        if (files.length > 10) {
          console.log(`  ... and ${files.length - 10} more files`);
        }
      } catch (e) {
        console.log("  Could not read directory contents");
      }

      console.log("🖥️  System info:");
      console.log(`  Platform: ${process.platform}`);
      console.log(`  Node version: ${process.version}`);
      console.log(`  Working directory: ${process.cwd()}`);

      console.log("⚠️  Continuing deployment without search functionality");
      console.log("💡 The site will work fine, but search will be disabled");
    }
  }
}

buildSearch();
