/**
 * Provides a logger utility for interactive scripts.
 *
 * This module allows you to adjust the verbosity of logging output (debug, info, warn, error) while the script is running,
 * making it easier to troubleshoot or reduce noise as needed. The log level can be changed programmatically using
 * `InteractiveLogger.setLogLevel()`, and all log methods respect the current log level and the global logging setting.
 *
 * Currently log level can be set during setup, by setting the `--logging` flag, or using the interactive prompt,
 * and it is not changed during runtime.
 */
class InteractiveLogger {
  private static logLevel: 0 | 1 | 2 | 3 = 0;
  private static _isLoggingEnabled: boolean = false;
  static setLogLevel(logLevel: 'debug' | 'info' | 'warn' | 'error') {
    switch (logLevel) {
      case 'debug':
        this.logLevel = 0;
        break;
      case 'info':
        this.logLevel = 1;
        break;
      case 'warn':
        this.logLevel = 2;
        break;
      case 'error':
        this.logLevel = 3;
        break;
      default:
        this.logLevel = 0;
        break;
    }
  }
  static setLogging(logging: boolean) {
    InteractiveLogger._isLoggingEnabled = logging;
  }
  static get isLoggingEnabled() {
    return InteractiveLogger._isLoggingEnabled;
  }

  static debug(...data: Parameters<typeof console.debug>) {
    if (InteractiveLogger._isLoggingEnabled) {
      if (this.logLevel <= 0) {
        console.debug(...data);
      }
    }
  }

  static info(...data: Parameters<typeof console.info>) {
    if (InteractiveLogger._isLoggingEnabled) {
      if (this.logLevel <= 1) {
        console.info(...data);
      }
    }
  }

  static warn(...data: Parameters<typeof console.warn>) {
    if (InteractiveLogger._isLoggingEnabled) {
      if (this.logLevel <= 2) {
        console.warn(...data);
      }
    }
  }

  static error(...data: Parameters<typeof console.error>) {
    if (InteractiveLogger._isLoggingEnabled) {
      if (this.logLevel <= 3) {
        console.error(...data);
      }
    }
  }
}

export { InteractiveLogger };
