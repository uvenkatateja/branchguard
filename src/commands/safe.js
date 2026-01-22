import { DivergenceChecker } from '../core/divergence-checker.js';
import { ConfigManager } from '../core/config-manager.js';
import { GitService } from '../services/git-service.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

export async function safeCommand(targetBranch) {
  const spin = spinner(`Analyzing branch divergence...`);
  
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

    console.log('');
    console.log(logger.chalk.dim('│'));
    logger.info(`${logger.chalk.dim('○')}  Current branch: ${logger.chalk.cyan(currentBranch)}`);
    console.log(logger.chalk.dim('│'));
    logger.info(`${logger.chalk.dim('○')}  Target branch:  ${logger.chalk.cyan(targetBranch)}`);
    console.log(logger.chalk.dim('│'));
    console.log('');

    if (result.total <= threshold) {
      console.log(logger.chalk.dim('│'));
      logger.success(`${logger.chalk.dim('✓')} SAFE to switch`);
      console.log(logger.chalk.dim('│'));
      logger.info(`  Divergence: ${logger.chalk.green(result.total)} commits (threshold: ${threshold})`);
      console.log(logger.chalk.dim('│'));
      logger.dim(`  Behind: ${result.behind} | Ahead: ${result.ahead}`);
      console.log(logger.chalk.dim('│'));
    } else {
      console.log(logger.chalk.dim('│'));
      logger.error(`${logger.chalk.dim('✗')} UNSAFE to switch`);
      console.log(logger.chalk.dim('│'));
      logger.info(`  Divergence: ${logger.chalk.red(result.total)} commits (threshold: ${threshold})`);
      console.log(logger.chalk.dim('│'));
      logger.dim(`  Behind: ${result.behind} | Ahead: ${result.ahead}`);
      console.log(logger.chalk.dim('│'));
      console.log('');
      console.log(logger.chalk.dim('│'));
      logger.warn(`${logger.chalk.dim('*')} What to do?`);
      console.log(logger.chalk.dim('│'));
      console.log(logger.chalk.dim('│  ') + logger.chalk.cyan('> ') + 'Run "branchguard sync"');
      console.log(logger.chalk.dim('│    ') + logger.chalk.dim('Or manually rebase'));
      console.log(logger.chalk.dim('│'));
    }
    console.log('');
    
  } catch (error) {
    spin.fail('Safety check failed');
    logger.error(error.message);
    process.exit(1);
  }
}
