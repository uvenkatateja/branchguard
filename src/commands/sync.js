import { BranchSyncer } from '../core/branch-syncer.js';
import { GitService } from '../services/git-service.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

export async function syncCommand(options) {
  const spin = spinner('Preparing to sync branch...');
  
  try {
    const gitService = new GitService();
    const currentBranch = await gitService.getCurrentBranch();
    
    if (!currentBranch) {
      spin.fail('Could not determine current branch');
      process.exit(1);
    }

    if (currentBranch === options.base) {
      spin.warn(`Already on ${options.base}`);
      logger.info('Nothing to sync');
      process.exit(0);
    }

    spin.text = 'Checking repository status...';
    const status = await gitService.getStatus();
    const hasChanges = status.files.length > 0;

    const syncer = new BranchSyncer();
    const result = await syncer.sync({
      currentBranch,
      baseBranch: options.base,
      shouldStash: options.stash && hasChanges,
      spinner: spin
    });

    if (result.success) {
      spin.succeed('Branch synced successfully!');
      logger.info('');
      logger.success(`✓ Rebased ${currentBranch} onto ${options.base}`);
      if (result.stashed) {
        logger.success('✓ Changes restored from stash');
      }
    } else {
      spin.fail('Sync failed');
      logger.error(result.error);
      process.exit(1);
    }
    
  } catch (error) {
    spin.fail('Sync failed');
    logger.error(error.message);
    process.exit(1);
  }
}
