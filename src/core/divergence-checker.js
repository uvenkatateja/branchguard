import { GitService } from '../services/git-service.js';

export class DivergenceChecker {
  constructor() {
    this.gitService = new GitService();
  }

  /**
   * Check divergence between two branches
   * @param {string} base - Base branch
   * @param {string} target - Target branch
   * @returns {Promise<{behind: number, ahead: number, total: number, error?: string}>}
   */
  async check(base, target) {
    try {
      // Fetch latest changes
      await this.gitService.fetch();

      // Get divergence count
      const result = await this.gitService.getDivergence(base, target);
      
      return {
        behind: result.behind,
        ahead: result.ahead,
        total: result.behind + result.ahead,
      };
    } catch (error) {
      return {
        behind: 0,
        ahead: 0,
        total: 0,
        error: error.message,
      };
    }
  }

  /**
   * Check if switch is safe based on threshold
   * @param {string} base - Base branch
   * @param {string} target - Target branch
   * @param {number} threshold - Maximum allowed divergence
   * @returns {Promise<boolean>}
   */
  async isSafe(base, target, threshold = 10) {
    const result = await this.check(base, target);
    return !result.error && result.total <= threshold;
  }
}
