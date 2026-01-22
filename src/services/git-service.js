import simpleGit from 'simple-git';

export class GitService {
  constructor() {
    this.git = simpleGit();
  }

  /**
   * Check if current directory is a Git repository
   * @returns {Promise<boolean>}
   */
  async isGitRepository() {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   * @returns {Promise<string|null>}
   */
  async getCurrentBranch() {
    try {
      const status = await this.git.status();
      return status.current;
    } catch {
      return null;
    }
  }

  /**
   * Get repository status
   * @returns {Promise<Object>}
   */
  async getStatus() {
    return await this.git.status();
  }

  /**
   * Fetch from remote
   * @param {string} remote - Remote name (default: origin)
   * @returns {Promise<void>}
   */
  async fetch(remote = 'origin') {
    await this.git.fetch(remote);
  }

  /**
   * Get divergence between two branches
   * @param {string} base - Base branch
   * @param {string} target - Target branch
   * @returns {Promise<{behind: number, ahead: number}>}
   */
  async getDivergence(base, target) {
    try {
      const result = await this.git.raw([
        'rev-list',
        '--left-right',
        '--count',
        `${base}...${target}`
      ]);

      const [behind, ahead] = result.trim().split('\t').map(Number);
      
      return {
        behind: behind || 0,
        ahead: ahead || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get divergence: ${error.message}`);
    }
  }

  /**
   * Stash current changes
   * @returns {Promise<void>}
   */
  async stash() {
    await this.git.stash();
  }

  /**
   * Pop stashed changes
   * @returns {Promise<void>}
   */
  async stashPop() {
    await this.git.stash(['pop']);
  }

  /**
   * Rebase current branch onto target
   * @param {string} target - Target branch
   * @returns {Promise<void>}
   */
  async rebase(target) {
    await this.git.rebase([target]);
  }

  /**
   * Abort current rebase
   * @returns {Promise<void>}
   */
  async rebaseAbort() {
    await this.git.rebase(['--abort']);
  }

  /**
   * Checkout a branch
   * @param {string} branch - Branch name
   * @returns {Promise<void>}
   */
  async checkout(branch) {
    await this.git.checkout(branch);
  }

  /**
   * Get list of branches
   * @returns {Promise<Array<string>>}
   */
  async getBranches() {
    const result = await this.git.branch();
    return result.all;
  }
}
