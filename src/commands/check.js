import { DivergenceChecker } from '../core/divergence-checker.js';
import { ConfigManager } from '../core/config-manager.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

export async function checkCommand(from, to) {
  // Skip check if bypass flag is set
  if (process.env.BRANCH_GUARD_BYPASS === '1') {
    process.exit(0);
  }

  // Skip if no branches provided
  if (!from || !to) {
    process.exit(0);
  }

  const spin = spinner(`Checking divergence: ${from} → ${to}`);
  
  try {
    const configManager = new ConfigManager();
    const config = await configManager.getAll();
    
    // Skip if disabled
    if (!config.enabled) {
      spin.stop();
      process.exit(0);
    }

    const checker = new DivergenceChecker();
    const result = await checker.check(from, to);

    if (result.error) {
      spin.warn('Could not check divergence');
      logger.dim(result.error);
      process.exit(0);
    }

    const threshold = config.threshold || 10;
    
    if (result.total > threshold) {
      spin.fail(`Blocked: ${result.total} divergent commits detected!`);
      
      logger.error('');
      logger.error(`Branch "${to}" has diverged significantly:`);
      logger.info(`  Behind: ${result.behind} commits`);
      logger.info(`  Ahead:  ${result.ahead} commits`);
      logger.info(`  Total:  ${result.total} commits (threshold: ${threshold})`);
      logger.error('');
      logger.warn('💡 Recommended actions:');
      logger.dim(`   1. git fetch origin ${to}`);
      logger.dim(`   2. git rebase origin/${to}`);
      logger.dim('   Or run: npx branch-guard sync');
      logger.error('');
      logger.dim('To force switch: BRANCH_GUARD_BYPASS=1 git checkout ' + to);
      
      process.exit(1);
    }

    spin.succeed(`Safe to switch (${result.total} divergent commits)`);
    process.exit(0);
    
  } catch (error) {
    spin.fail('Check failed');
    logger.error(error.message);
    process.exit(1);
  }
}
