import ora from 'ora';

/**
 * Create a spinner instance
 * @param {string} text - Initial spinner text
 * @returns {Object} Spinner instance
 */
export function spinner(text) {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
  }).start();
}
