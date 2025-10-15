# Git Hooks

This directory contains the custom Git hooks for the project.

## Available Hooks

### pre-commit

Automatically increments the patch version in `package.json` when committing files other than markdown.

**Functionality:**

- Detects if there are changes to non-`.md` files
- If only markdown files are changed, the version is not updated
- Increments the patch number (1.0.0 → 1.0.1)
- Adds the change to the current commit

### post-merge

Automatically increments the minor version in `package.json` when merging `develop` into `master`.

**Functionality:**

- Detects merges from `develop` to `master`
- Verifies that there are changes to non-markdown files
- Increments the minor number and resets patch (1.0.5 → 1.1.0)
- Creates a commit and tag with the new version

## Installation

To install these hooks in your local repository copy, run:

```bash
npm run hooks:install
```

This command will copy the hooks from `.githooks/` to `.git/hooks/` and set execution permissions.

## Uninstallation

If you need to uninstall the hooks, run:

```bash
npm run hooks:uninstall
```

## Notes

- The hooks are written in Bash and require Node.js to be installed
- They are compatible with Linux, macOS, and Windows (with Git Bash)
- They are not automatically uploaded to Git (they are in `.git/hooks/`), which is why they are stored here for sharing
