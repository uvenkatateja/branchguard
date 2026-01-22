#!/usr/bin/env node
import simpleGit from 'simple-git';
import chalk from 'chalk';
import ora from 'ora';
import { program } from 'commander';
import { writeFileSync, chmodSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const git = simpleGit();
const THRESHOLD = 10;

async function checkDivergence(base, target) {
  try {
    await git.fetch();
    const log = await git.raw(['rev-list', '--left-right', '--count', `${base}...${target}`]);
    const [behind, ahead] = log.trim().split('\t').map(Number);
    return { behind, ahead, total: behind + ahead };
  } catch (error) {
    return { behind: 0, ahead: 0, total: 0, error: error.message };
  }
}

async function getCurrentBranch() {
  const status = await git.status();
  return status.current;
}

async function installHook() {
  const spinner = ora('Installing pre-checkout hook...').start();
  
  try {
    const hooksDir = '.git/hooks';
    if (!existsSync(hooksDir)) {
      mkdirSync(hooksDir, { recursive: true });
    }

    const hookPath = join(hooksDir, 'pre-checkout');
    const hookContent = `#!/bin/sh
# branch-guard pre-checkout hook
if [ -n "$BRANCH_GUARD_BYPASS" ]; then
  exit 0
fi

npx branch-guard check "$1" "$2" || exit 1
`;

    writeFileSync(hookPath, hookContent, { mode: 0o755 });
    
    if (process.platform !== 'win32') {
      chmodSync(hookPath, 0o755);
    }

    spinner.succeed(chalk.green('✅ Pre-checkout hook installed successfully!'));
    console.log(chalk.dim('\nNow protected from dangerous branch switches.'));
    console.log(chalk.dim('To bypass: BRANCH_GUARD_BYPASS=1 git checkout <branch>'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to install hook'));
    console.error(error.message);
    process.exit(1);
  }
}

async function checkSwitch(from, to) {
  if (!from || !to) {
    process.exit(0);
  }

  const spinner = ora(`Checking divergence between ${from} and ${to}...`).start();
  
  const div = await checkDivergence(from, to);
  
  if (div.error) {
    spinner.warn(chalk.yellow('⚠️  Could not check divergence'));
    process.exit(0);
  }

  if (div.total > THRESHOLD) {
    spinner.fail(chalk.red(`❌ Blocked: ${to} has ${div.total} divergent commits!`));
    console.log(chalk.yellow('\n💡 Recommendation:'));
    console.log(chalk.dim(`   git pull origin ${to}`));
    console.log(chalk.dim(`   git rebase ${to}`));
    console.log(chalk.dim('\nOr run: npx branch-guard sync'));
    process.exit(1);
  }

  spinner.succeed(chalk.green(`✅ Safe to switch (${div.total} divergent commits)`));
  process.exit(0);
}

async function checkSafety(targetBranch) {
  const current = await getCurrentBranch();
  const div = await checkDivergence(current, targetBranch);

  if (div.error) {
    console.log(chalk.yellow(`⚠️  Could not check ${targetBranch}: ${div.error}`));
    return;
  }

  if (div.total <= THRESHOLD) {
    console.log(chalk.green(`✅ ${targetBranch} is safe (${div.total} divergent commits)`));
  } else {
    console.log(chalk.red(`❌ ${targetBranch} is unsafe (${div.total} divergent commits)`));
    console.log(chalk.dim(`   Behind: ${div.behind}, Ahead: ${div.ahead}`));
  }
}

async function syncBranch() {
  const spinner = ora('Syncing branch...').start();
  
  try {
    const current = await getCurrentBranch();
    const status = await git.status();

    if (status.files.length > 0) {
      spinner.text = 'Stashing changes...';
      await git.stash();
    }

    spinner.text = 'Fetching latest changes...';
    await git.fetch();

    spinner.text = 'Rebasing...';
    await git.rebase(['origin/main']);

    if (status.files.length > 0) {
      spinner.text = 'Restoring stashed changes...';
      await git.stash(['pop']);
    }

    spinner.succeed(chalk.green('✅ Branch synced successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Sync failed'));
    console.error(chalk.dim(error.message));
    process.exit(1);
  }
}

program
  .name('branch-guard')
  .description('Prevent merge conflicts by blocking dangerous branch switches')
  .version('1.0.0');

program
  .command('init')
  .description('Install pre-checkout hook')
  .action(installHook);

program
  .command('check <from> <to>')
  .description('Check if branch switch is safe (used by hook)')
  .action(checkSwitch);

program
  .command('safe <branch>')
  .description('Check if switching to branch is safe')
  .action(checkSafety);

program
  .command('sync')
  .description('Auto-sync current branch with main')
  .action(syncBranch);

program.parse();
