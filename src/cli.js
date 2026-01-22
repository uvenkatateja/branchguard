#!/usr/bin/env node
import { program } from 'commander';
import { initCommand } from './commands/init.js';
import { checkCommand } from './commands/check.js';
import { safeCommand } from './commands/safe.js';
import { syncCommand } from './commands/sync.js';
import { statusCommand } from './commands/status.js';
import { logger } from './utils/logger.js';
import { version } from './utils/version.js';
import { showBanner } from './utils/banner.js';

// Show banner for main commands (not for check which is used by hooks, or version/help)
const command = process.argv[2];
const shouldShowBanner = command && !['check', '--version', '-V', '--help', '-h'].includes(command);

if (shouldShowBanner) {
  showBanner();
}

program
  .name('branchguard')
  .description('Prevent merge conflicts by blocking dangerous branch switches')
  .version(version);

program
  .command('init')
  .description('Install pre-checkout hook to protect your repository')
  .option('-f, --force', 'Force reinstall hook')
  .option('-t, --threshold <number>', 'Set divergence threshold (default: 10)', '10')
  .action(initCommand);

program
  .command('check <from> <to>')
  .description('Check if branch switch is safe (used internally by Git hook)')
  .action(checkCommand);

program
  .command('safe <branch>')
  .description('Check if switching to a branch is safe without actually switching')
  .action(safeCommand);

program
  .command('sync')
  .description('Auto-sync current branch with base branch (default: main)')
  .option('-b, --base <branch>', 'Base branch to sync with', 'main')
  .option('--no-stash', 'Skip stashing changes')
  .action(syncCommand);

program
  .command('status')
  .description('Show branchguard status and configuration')
  .action(statusCommand);

program.parse();

// Handle unknown commands
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

// Global error handler
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled error:', error.message);
  process.exit(1);
});
