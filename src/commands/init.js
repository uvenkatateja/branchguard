import { HookInstaller } from '../core/hook-installer.js';
import { ConfigManager } from '../core/config-manager.js';
import { GitService } from '../services/git-service.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';
import { showBanner } from '../utils/banner.js';

export async function initCommand(options) {
  showBanner();
  
  const spin = spinner('Initializing branch-guard...');
  
  try {
    // Verify we're in a Git repository
    const gitService = new GitService();
    const isRepo = await gitService.isGitRepository();
    
    if (!isRepo) {
      spin.fail('Not a Git repository');
      logger.error('Please run this command inside a Git repository');
      process.exit(1);
    }

    // Install Git hook
    const hookInstaller = new HookInstaller();
    const hookInstalled = await hookInstaller.install(options.force);
    
    if (!hookInstalled) {
      spin.fail('Failed to install hook');
      process.exit(1);
    }

    // Save configuration
    const configManager = new ConfigManager();
    await configManager.set('threshold', parseInt(options.threshold, 10));
    await configManager.set('enabled', true);

    spin.succeed('branch-guard initialized successfully!');
    
    logger.info('');
    logger.success('✓ Pre-checkout hook installed');
    logger.success(`✓ Divergence threshold set to ${options.threshold} commits`);
    logger.info('');
    logger.dim('Your repository is now protected from dangerous branch switches.');
    logger.dim('To bypass protection: BRANCH_GUARD_BYPASS=1 git checkout <branch>');
    
  } catch (error) {
    spin.fail('Initialization failed');
    logger.error(error.message);
    process.exit(1);
  }
}
