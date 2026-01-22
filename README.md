# 🛡️ branchguard

**Prevent merge conflicts before they happen.**

Single npm command that blocks dangerous git checkouts when branches have diverged too much.

## The Problem

```bash
$ git checkout main                    # main now 47 commits ahead
$ git checkout feature/login           # divergent history created
*2 days coding → 20 commits*
$ git checkout main                    # main now 52 commits ahead!
$ git merge feature/login              # 💥 15+ files conflict hell (2hrs wasted)
```

## The Solution

```bash
npx branchguard init          # Install once, protected forever

git checkout main             # ❌ Blocked: "main 47 commits ahead!"
branchguard safe main         # ✅ Check before switching
branchguard sync              # Auto-rebase to fix divergence
```

## Installation

```bash
npm install -g branchguard
```

Or use directly with npx:

```bash
npx branchguard init
```

## Commands

### `branchguard init`

Install the pre-checkout hook to protect your repository.

```bash
branchguard init
branchguard init --threshold 20    # Custom threshold
branchguard init --force           # Force reinstall
```

### `branchguard status`

Show current protection status and configuration.

```bash
branchguard status
```

### `branchguard safe <branch>`

Check if switching to a branch is safe without actually switching.

```bash
branchguard safe main
branchguard safe feature/new-feature
```

### `branchguard sync`

Auto-sync current branch with base branch (default: main).

```bash
branchguard sync
branchguard sync --base develop    # Sync with develop
branchguard sync --no-stash        # Don't stash changes
```

### `branchguard check <from> <to>`

Internal command used by Git hook. You typically don't run this manually.

## How It Works

### 1. Divergence Detection
Uses `git rev-list --left-right --count` to calculate exact commit divergence between branches.

### 2. Smart Threshold
Blocks switches when branches differ by more than 10 commits (configurable).

### 3. Pre-Checkout Hook
Runs automatically before every `git checkout` or `git switch` command.

### 4. Auto-Recovery
Provides exact commands to fix divergence or auto-sync with one command.

## Configuration

Configuration is stored in `.git/branchguard/config.json`:

```json
{
  "enabled": true,
  "threshold": 10,
  "baseBranch": "main"
}
```

You can modify these values by editing the file or using the init command.

## Bypass Protection

When you need to force a switch:

```bash
BRANCHGUARD_BYPASS=1 git checkout <branch>
```

The hook is automatically disabled in CI environments (when `CI` or `CONTINUOUS_INTEGRATION` env vars are set).

## Project Structure

```
src/
├── cli.js                 # Main CLI entry point
├── commands/              # Command implementations
│   ├── init.js           # Initialize and install hook
│   ├── check.js          # Check divergence (used by hook)
│   ├── safe.js           # Check branch safety
│   ├── sync.js           # Sync branch with base
│   └── status.js         # Show status
├── core/                  # Core business logic
│   ├── config-manager.js # Configuration management
│   ├── hook-installer.js # Git hook installation
│   ├── divergence-checker.js # Divergence calculation
│   └── branch-syncer.js  # Branch synchronization
├── services/              # External service wrappers
│   └── git-service.js    # Git operations wrapper
└── utils/                 # Utility functions
    ├── logger.js         # Logging utilities
    ├── spinner.js        # Progress spinner
    ├── banner.js         # ASCII art banner
    └── version.js        # Version management
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test Locally

```bash
npm link
cd /path/to/test/repo
branchguard init
```

### Publish

```bash
npm publish --access public
```

## Why branchguard?

- ✅ **Proactive**: Prevents conflicts before they happen
- ✅ **Invisible**: Works automatically via Git hooks
- ✅ **Smart**: Only blocks truly dangerous switches
- ✅ **Fast**: Zero overhead on normal workflows
- ✅ **Universal**: Works with any Git workflow
- ✅ **Production-Ready**: Clean architecture, proper error handling

## Requirements

- Node.js >= 18.0.0
- Git >= 2.23.0

## License

MIT
