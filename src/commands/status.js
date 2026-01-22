import { ConfigManager } from '../core/config-manager.js';
import { HookInstaller } from '../core/hook-installer.js';
import { GitService } from '../services/git-service.js';
import { logger } from '../utils/logger.js';
import { showBanner } from '../utils/banner.js';

export async function statusCommand() {
  showBanner();
  
  try {
    const gitService = new GitService();
    const configManager = new ConfigManager();
    const hookInstaller = new HookInstaller();

    const isRepo = await gitService.isGitRepository();
    const config = await configManager.getAll();
    const hookInstalled = await hookInstaller.isInstalled();
    const currentBranch = await gitService.getCurrentBranch();

    logger.info('');
    logger.info('═══════════════════════════════════════');
    logger.info('        branch-guard Status');
    logger.info('═══════════════════════════════════════');
    logger.info('');

    // Repository info
    logger.info('Repository:');
    logger.info(`  Git Repository: ${isRepo ? '✓ Yes' : '✗ No'}`);
    if (currentBranch) {
      logger.info(`  Current Branch: ${currentBranch}`);
    }
    logger.info('');

    // Hook status
    logger.info('Protection:');
    logger.info(`  Hook Installed: ${hookInstalled ? '✓ Yes' : '✗ No'}`);
    logger.info(`  Status: ${config.enabled ? '✓ Enabled' : '✗ Disabled'}`);
    logger.info('');

    // Configuration
    logger.info('Configuration:');
    logger.info(`  Threshold: ${config.threshold || 10} commits`);
    logger.info('');

    if (!hookInstalled) {
      logger.warn('⚠ Hook not installed. Run "branch-guard init" to enable protection.');
    } else if (!config.enabled) {
      logger.warn('⚠ Protection is disabled.');
    } else {
      logger.success('✓ Your repository is protected!');
    }

    logger.info('');
    
  } catch (error) {
    logger.error('Failed to get status:', error.message);
    process.exit(1);
  }
}
