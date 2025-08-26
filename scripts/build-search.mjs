import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

function buildSearch() {
  const vercelPath = path.join(process.cwd(), ".vercel", "output", "static");
  const distPath = path.join(process.cwd(), "dist");

  let absolutePath = null;

  if (fs.existsSync(vercelPath)) {
    absolutePath = vercelPath;
    console.log("📁 Found Vercel output directory, building search index...");
  } else if (fs.existsSync(distPath)) {
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
    // Use the modern Pagefind 1.0+ API (no deprecation warnings)
    const outputPath = path.join(absolutePath, ".pagefind-cache");
    const command = `pagefind --site "${absolutePath}" --output-path "${outputPath}" --verbose`;

    console.log(`🔍 Running: ${command}`);
    console.log(`📂 Site path: ${absolutePath}`);
    console.log(`📂 Output path: ${outputPath}`);

    if (process.platform === "win32") {
      try {
        execSync(`npx ${command}`, {
          stdio: "inherit",
          cwd: process.cwd(),
          timeout: 30000,
        });
      } catch (exeError) {
        console.log("⚠️  npx pagefind failed, trying direct command...");
        execSync(command, {
          stdio: "inherit",
          cwd: process.cwd(),
          timeout: 30000,
        });
      }
    } else {
      execSync(`npx ${command}`, {
        stdio: "inherit",
        cwd: process.cwd(),
        timeout: 30000,
      });
    }

    console.log("✅ Search index built successfully!");

    // Check if files were actually created
    const pagefindDir = path.join(absolutePath, ".pagefind-cache");
    console.log(`📂 Checking for pagefind directory: ${pagefindDir}`);

    if (fs.existsSync(pagefindDir)) {
      const pagefindFiles = fs.readdirSync(pagefindDir);
      console.log(`📦 Created ${pagefindFiles.length} search index files`);
      for (const file of pagefindFiles) {
        console.log(`  - ${file}`);
      }
    } else {
      console.log("❌ Pagefind directory was not created");
      // List what was actually created in the target directory
      console.log("📋 Current contents of target directory:");
      const currentFiles = fs.readdirSync(absolutePath);
      for (const file of currentFiles) {
        const stat = fs.statSync(path.join(absolutePath, file));
        console.log(`  - ${file} ${stat.isDirectory() ? "[DIR]" : `[${stat.size} bytes]`}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to build search index:", error.message);
    console.log("🔧 Attempting alternative approach...");

    try {
      const altCommand =
        process.platform === "win32"
          ? `npx pagefind --site "${absolutePath.replace(/\\/g, "/")}" --output-subdir .pagefind-cache`
          : `npx pagefind --site "${absolutePath}" --output-subdir .pagefind-cache`;

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
