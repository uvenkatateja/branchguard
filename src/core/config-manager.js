import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export class ConfigManager {
  constructor() {
    this.configDir = '.git/branch-guard';
    this.configPath = join(this.configDir, 'config.json');
    this.defaultConfig = {
      enabled: true,
      threshold: 10,
      baseBranch: 'main',
    };
  }

  /**
   * Get all configuration
   * @returns {Promise<Object>}
   */
  async getAll() {
    try {
      if (!existsSync(this.configPath)) {
        return { ...this.defaultConfig };
      }

      const content = readFileSync(this.configPath, 'utf-8');
      const config = JSON.parse(content);
      
      return {
        ...this.defaultConfig,
        ...config,
      };
    } catch {
      return { ...this.defaultConfig };
    }
  }

  /**
   * Get a specific configuration value
   * @param {string} key - Configuration key
   * @returns {Promise<any>}
   */
  async get(key) {
    const config = await this.getAll();
    return config[key];
  }

  /**
   * Set a configuration value
   * @param {string} key - Configuration key
   * @param {any} value - Configuration value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    const config = await this.getAll();
    config[key] = value;
    await this.save(config);
  }

  /**
   * Save configuration to file
   * @param {Object} config - Configuration object
   * @returns {Promise<void>}
   */
  async save(config) {
    try {
      // Create config directory if it doesn't exist
      if (!existsSync(this.configDir)) {
        mkdirSync(this.configDir, { recursive: true });
      }

      // Write config file
      writeFileSync(
        this.configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
    } catch (error) {
      throw new Error(`Failed to save config: ${error.message}`);
    }
  }

  /**
   * Reset configuration to defaults
   * @returns {Promise<void>}
   */
  async reset() {
    await this.save({ ...this.defaultConfig });
  }
}
