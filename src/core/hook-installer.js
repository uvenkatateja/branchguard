import { existsSync, mkdirSync, writeFileSync, chmodSync, readFileSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';

export class HookInstaller {
  constructor() {
    this.hooksDir = '.git/hooks';
    this.hookPath = join(this.hooksDir, 'pre-checkout');
  }

  /**
   * Install the pre-checkout hook
   * @param {boolean} force - Force reinstall if exists
   * @returns {Promise<boolean>}
   */
  async install(force = false) {
    try {
      // Create hooks directory if it doesn't exist
      if (!existsSync(this.hooksDir)) {
        mkdirSync(this.hooksDir, { recursive: true });
      }

      // Check if hook already exists
      if (existsSync(this.hookPath) && !force) {
        const existing = readFileSync(this.hookPath, 'utf-8');
        if (existing.includes('branchguard')) {
          return true; // Already installed
        }
      }

      // Create hook content
      const hookContent = this.generateHookContent();

      // Write hook file
      writeFileSync(this.hookPath, hookContent, { mode: 0o755 });

      // Make executable (Unix-like systems)
      if (platform() !== 'win32') {
        chmodSync(this.hookPath, 0o755);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to install hook: ${error.message}`);
    }
  }

  /**
   * Check if hook is installed
   * @returns {Promise<boolean>}
   */
  async isInstalled() {
    try {
      if (!existsSync(this.hookPath)) {
        return false;
      }

      const content = readFileSync(this.hookPath, 'utf-8');
      return content.includes('branchguard');
    } catch {
      return false;
    }
  }

  /**
   * Uninstall the hook
   * @returns {Promise<boolean>}
   */
  async uninstall() {
    try {
      if (existsSync(this.hookPath)) {
        const content = readFileSync(this.hookPath, 'utf-8');
        if (content.includes('branchguard')) {
          // Remove file if it only contains branchguard
          const lines = content.split('\n').filter(line => 
            !line.includes('branchguard') && line.trim() !== ''
          );
          
          if (lines.length <= 1) {
            // Remove entire file
            const { unlinkSync } = await import('fs');
            unlinkSync(this.hookPath);
          }
        }
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to uninstall hook: ${error.message}`);
    }
  }

  /**
   * Generate hook script content
   * @returns {string}
   */
  generateHookContent() {
    return `#!/bin/sh
# branchguard pre-checkout hook
# Prevents dangerous branch switches that could lead to merge conflicts

# Allow bypass with environment variable
if [ -n "$BRANCHGUARD_BYPASS" ]; then
  exit 0
fi

# Skip in CI environments
if [ -n "$CI" ] || [ -n "$CONTINUOUS_INTEGRATION" ]; then
  exit 0
fi

# Run branchguard check
npx --no-install branchguard check "$1" "$2" || exit 1
`;
  }
}
