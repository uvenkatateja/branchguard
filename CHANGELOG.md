# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-01-22

### Fixed
- Fixed bin path in package.json (dist/cli.js → dist/index.js)
- CLI command now works correctly after global install

## [1.0.0] - 2025-01-22

### Added
- Initial release of branchguard
- Beautiful ASCII art banner with BRANCHGUARD branding
- `branchguard init` - Install Git pre-checkout hook
- `branchguard safe <branch>` - Check branch safety before switching
- `branchguard sync` - Auto-sync current branch with base branch
- `branchguard status` - Show protection status and configuration
- `branchguard check` - Internal command for Git hook
- Divergence detection using git rev-list
- Configurable threshold (default: 10 commits)
- Automatic CI environment detection
- Bypass protection with BRANCHGUARD_BYPASS environment variable
- Color-coded CLI output with connecting lines
- Spinner animations for long operations
- Cross-platform support (Windows, macOS, Linux)
- Comprehensive error handling and user feedback

### Features
- Prevents dangerous branch switches that could lead to merge conflicts
- Smart threshold-based blocking (>10 divergent commits)
- Auto-stash and rebase functionality
- Configuration stored in `.git/branchguard/config.json`
- Professional CLI UI with visual feedback
- Zero overhead on normal Git workflows

[1.0.0]: https://github.com/yourusername/branchguard/releases/tag/v1.0.0
