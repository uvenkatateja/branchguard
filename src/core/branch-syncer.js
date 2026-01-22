import { GitService } from '../services/git-service.js';

export class BranchSyncer {
  constructor() {
    this.gitService = new GitService();
  }

  /**
   * Sync current branch with base branch
   * @param {Object} options - Sync options
   * @param {string} options.currentBranch - Current branch name
   * @param {string} options.baseBranch - Base branch to sync with
   * @param {boolean} options.shouldStash - Whether to stash changes
   * @param {Object} options.spinner - Spinner instance for progress updates
   * @returns {Promise<{success: boolean, stashed: boolean, error?: string}>}
   */
  async sync({ currentBranch, baseBranch, shouldStash, spinner }) {
    let stashed = false;

    try {
      // Stash changes if needed
      if (shouldStash) {
        spinner.text = 'Stashing uncommitted changes...';
        await this.gitService.stash();
        stashed = true;
      }

      // Fetch latest changes
      spinner.text = 'Fetching latest changes...';
      await this.gitService.fetch();

      // Rebase current branch onto base
      spinner.text = `Rebasing ${currentBranch} onto ${baseBranch}...`;
      await this.gitService.rebase(`origin/${baseBranch}`);

      // Pop stash if we stashed
      if (stashed) {
        spinner.text = 'Restoring stashed changes...';
        await this.gitService.stashPop();
      }

      return {
        success: true,
        stashed,
      };
    } catch (error) {
      // Try to recover from failed rebase
      try {
        await this.gitService.rebaseAbort();
        if (stashed) {
          await this.gitService.stashPop();
        }
      } catch {
        // Ignore recovery errors
      }

      return {
        success: false,
        stashed,
        error: error.message,
      };
    }
  }
}
