import { DivergenceChecker } from '../core/divergence-checker.js';
import { ConfigManager } from '../core/config-manager.js';
import { GitService } from '../services/git-service.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

export async function safeCommand(targetBranch) {
  const spin = spinner(`Checking safety of ${targetBranch}...`);
  
  try {
    const gitService = new GitService();
    const currentBranch = await gitService.getCurrentBranch();
    
    if (!currentBranch) {
      spin.fail('Could not determine current branch');
      process.exit(1);
    }

    const configManager = new ConfigManager();
    const config = await configManager.getAll();
    const threshold = config.threshold || 10;

    const checker = new DivergenceChecker();
    const result = await checker.check(currentBranch, targetBranch);

    if (result.error) {
      spin.warn(`Could not check ${targetBranch}`);
      logger.error(result.error);
      process.exit(1);
    }

    spin.stop();

    if (result.total <= threshold) {
      logger.success(`✓ ${targetBranch} is SAFE to switch`);
      logger.info(`  Divergence: ${result.total} commits (threshold: ${threshold})`);
      logger.dim(`  Behind: ${result.behind} | Ahead: ${result.ahead}`);
    } else {
      logger.error(`✗ ${targetBranch} is UNSAFE to switch`);
      logger.info(`  Divergence: ${result.total} commits (threshold: ${threshold})`);
      logger.dim(`  Behind: ${result.behind} | Ahead: ${result.ahead}`);
      logger.warn('');
      logger.warn('Run "branch-guard sync" to fix divergence');
    }
    
  } catch (error) {
    spin.fail('Safety check failed');
    logger.error(error.message);
    process.exit(1);
  }
}
