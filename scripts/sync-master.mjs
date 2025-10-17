#!/usr/bin/env node

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const noTag = args.includes("--no-tag");

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

if (noTag) {
  console.log("🔄 Syncing develop to master (without tagging)...\n");
} else {
  console.log("🔄 Syncing develop to master...\n");
}

const currentBranch = execSilent("git rev-parse --abbrev-ref HEAD");
if (currentBranch !== "develop") {
  console.error('❌ Error: You must be on "develop" branch');
  console.error(`   Current branch: ${currentBranch}`);
  process.exit(1);
}

const hasChanges = execSilent('git diff-index --quiet HEAD -- || echo "changes"');
if (hasChanges === "changes") {
  console.error("❌ Error: You have uncommitted changes");
  console.error("   Please commit or stash them first");
  process.exit(1);
}

console.log("📤 Pushing develop...");
exec("git push origin develop");

console.log("🔀 Switching to master...");
exec("git checkout master");

console.log("🔗 Merging develop into master...");
const env = noTag ? { ...process.env, SKIP_VERSION_BUMP: "1" } : process.env;

try {
  execSync("git merge develop --no-edit", {
    encoding: "utf8",
    stdio: "pipe",
    env,
  });
  console.log("✓ Merge completed successfully");
} catch (error) {
  // Check if there are merge conflicts
  const conflictedFiles = execSilent("git diff --name-only --diff-filter=U");
  
  if (conflictedFiles) {
    console.log("⚠️  Merge conflicts detected, resolving automatically...");
    
    // For package.json conflicts, always use develop's version
    if (conflictedFiles.includes("package.json")) {
      console.log("   → Resolving package.json: using develop's version");
      execSync("git checkout --theirs package.json", { stdio: "pipe" });
      execSync("git add package.json", { stdio: "pipe" });
    }
    
    // Check if there are other conflicted files
    const remainingConflicts = execSilent("git diff --name-only --diff-filter=U");
    
    if (remainingConflicts) {
      console.error(`❌ Unresolved conflicts in: ${remainingConflicts}`);
      console.error("   Please resolve them manually");
      process.exit(1);
    }
    
    // Complete the merge
    execSync("git commit --no-edit", {
      encoding: "utf8",
      stdio: "inherit",
      env,
    });
    console.log("✓ Conflicts resolved and merge completed");
  } else {
    console.error("❌ Error executing merge");
    process.exit(1);
  }
}

console.log("📤 Pushing master...");
exec("git push origin master");

console.log("📤 Pushing develop (synced version)...");
exec("git push origin develop");

let latestTag = "";
if (!noTag) {
  latestTag = execSilent("git describe --tags --abbrev=0");
  if (latestTag) {
    console.log(`📤 Pushing tag ${latestTag}...`);
    exec(`git push origin ${latestTag}`);
  }
}

console.log("🔙 Returning to develop...");
exec("git checkout develop");

console.log("\n✅ Sync completed!");

if (skipTag) {
  console.log("⚠️  No tag was created (--no-tag flag used)");
} else {
  try {
    const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
    console.log(`📦 Current version: ${packageJson.version}`);
  } catch (error) {
    console.log("📦 Current version: unknown");
  }

  const latestTag = execSilent("git describe --tags --abbrev=0");
  if (latestTag) {
    console.log(`🏷️  Tag: ${latestTag}`);
  }
}

console.log("");
