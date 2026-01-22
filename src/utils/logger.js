import chalk from 'chalk';

class Logger {
  constructor() {
    this.chalk = chalk; // Expose chalk for direct use
  }

  /**
   * Log info message
   * @param {...any} args - Message arguments
   */
  info(...args) {
    console.log(chalk.blue('ℹ'), ...args);
  }

  /**
   * Log success message
   * @param {...any} args - Message arguments
   */
  success(...args) {
    console.log(chalk.green('✓'), ...args);
  }

  /**
   * Log warning message
   * @param {...any} args - Message arguments
   */
  warn(...args) {
    console.log(chalk.yellow('⚠'), ...args);
  }

  /**
   * Log error message
   * @param {...any} args - Message arguments
   */
  error(...args) {
    console.log(chalk.red('✗'), ...args);
  }

  /**
   * Log dimmed message
   * @param {...any} args - Message arguments
   */
  dim(...args) {
    console.log(chalk.dim(...args));
  }

  /**
   * Log plain message
   * @param {...any} args - Message arguments
   */
  log(...args) {
    console.log(...args);
  }
}

export const logger = new Logger();
