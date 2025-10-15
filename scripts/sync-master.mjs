#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * Script para sincronizar develop con master
 * Automatiza: push develop -> merge a master -> push master y tags -> volver a develop
 */

const exec = (command, options = {}) => {
  try {
    return execSync(command, { encoding: "utf8", stdio: "inherit", ...options });
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    process.exit(1);
  }
};

const execSilent = (command) => {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" }).trim();
  } catch (error) {
    return "";
  }
};

console.log("🔄 Syncing develop to master...\n");

// 1. Verificar que estamos en develop
const currentBranch = execSilent("git rev-parse --abbrev-ref HEAD");
if (currentBranch !== "develop") {
  console.error('❌ Error: You must be on "develop" branch');
  console.error(`   Current branch: ${currentBranch}`);
  process.exit(1);
}

// 2. Verificar que no hay cambios sin commit
const hasChanges = execSilent('git diff-index --quiet HEAD -- || echo "changes"');
if (hasChanges === "changes") {
  console.error("❌ Error: You have uncommitted changes");
  console.error("   Please commit or stash them first");
  process.exit(1);
}

// 3. Push develop
console.log("📤 Pushing develop...");
exec("git push origin develop");

// 4. Checkout master
console.log("🔀 Switching to master...");
exec("git checkout master");

// 5. Merge develop
console.log("🔗 Merging develop into master...");
exec("git merge develop --no-edit");

// El hook post-merge se ejecuta aquí y:
// - Incrementa versión (MINOR)
// - Crea tag
// - Sincroniza versión a develop

// 6. Push master
console.log("📤 Pushing master...");
exec("git push origin master");

// 7. Push develop (con la versión sincronizada)
console.log("📤 Pushing develop (synced version)...");
exec("git push origin develop");

// 8. Push tags
const latestTag = execSilent("git describe --tags --abbrev=0");
if (latestTag) {
  console.log(`📤 Pushing tag ${latestTag}...`);
  exec(`git push origin ${latestTag}`);
}

// 9. Volver a develop
console.log("🔙 Returning to develop...");
exec("git checkout develop");

// Mostrar información final
console.log("\n✅ Sync completed!");

try {
  const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
  console.log(`📦 Current version: ${packageJson.version}`);
} catch (error) {
  console.log("📦 Current version: unknown");
}

if (latestTag) {
  console.log(`🏷️  Tag: ${latestTag}`);
}

console.log("");
