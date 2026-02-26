/**
 * DICOM library logging abstraction.
 *
 * Design principles:
 * - `IDicomLogger` interface: thin contract that users can implement with any
 *   backend (console, winston, pino, log4js, …).
 * - Built-in implementations: `NullLogger` (silent) and `ConsoleLogger`.
 * - `LogManager`: global factory — call `LogManager.setFactory()` once at app
 *   startup to redirect all internal library log output.
 *
 * Reference: fo-dicom's Microsoft.Extensions.Logging integration
 * (FO-DICOM.Core/Log/).  The old fo-dicom ILogger/LogManager is
 * marked [Obsolete]; this TypeScript port goes straight to the clean
 * pluggable design without the legacy layer.
 */

// ---------------------------------------------------------------------------
// Log level
// ---------------------------------------------------------------------------

export const enum LogLevel {
  Debug   = 0,
  Info    = 1,
  Warning = 2,
  Error   = 3,
  Fatal   = 4,
}

// ---------------------------------------------------------------------------
// Logger interface
// ---------------------------------------------------------------------------

/**
 * Logger contract used throughout the dicom-ts library.
 *
 * Implement this interface and pass it to `LogManager.setFactory()` to
 * redirect library log output to your preferred logging backend.
 */
export interface IDicomLogger {
  /** Returns `true` if the given level is currently enabled. */
  isEnabled(level: LogLevel): boolean;

  /** Log a message at the given level.  `args` are substituted into
   *  `{0}`, `{1}`, … placeholders in `message`, matching fo-dicom style. */
  log(level: LogLevel, message: string, ...args: unknown[]): void;

  /** Shorthand for `log(LogLevel.Debug, …)`. */
  debug(message: string, ...args: unknown[]): void;

  /** Shorthand for `log(LogLevel.Info, …)`. */
  info(message: string, ...args: unknown[]): void;

  /** Shorthand for `log(LogLevel.Warning, …)`. */
  warn(message: string, ...args: unknown[]): void;

  /** Shorthand for `log(LogLevel.Error, …)`. */
  error(message: string, ...args: unknown[]): void;

  /** Shorthand for `log(LogLevel.Fatal, …)`. */
  fatal(message: string, ...args: unknown[]): void;
}

// ---------------------------------------------------------------------------
// Message formatting helper
// ---------------------------------------------------------------------------

/**
 * Substitute `{0}`, `{1}`, … (or fo-dicom named `{Name}`) placeholders
 * with the corresponding positional argument, then append any surplus args.
 */
function formatMessage(message: string, args: unknown[]): string {
  let i = 0;
  // Replace positional/named placeholders
  const result = message.replace(/\{[^}]*\}/g, () => {
    const v = args[i++];
    return v == null ? "" : String(v);
  });
  // Append any remaining args not consumed by placeholders
  if (i < args.length) {
    const extra = args.slice(i).map((v) => String(v)).join(" ");
    return `${result} ${extra}`;
  }
  return result;
}

// ---------------------------------------------------------------------------
// NullLogger — does nothing (default when no factory is set)
// ---------------------------------------------------------------------------

/**
 * A no-op logger.  All methods are empty stubs with zero overhead.
 * Used as the default when no logger factory has been registered.
 */
export class NullLogger implements IDicomLogger {
  static readonly instance: NullLogger = new NullLogger();

  isEnabled(_level: LogLevel): boolean { return false; }
  log(_level: LogLevel, _message: string, ..._args: unknown[]): void { /* noop */ }
  debug(_message: string, ..._args: unknown[]): void { /* noop */ }
  info(_message: string, ..._args: unknown[]): void { /* noop */ }
  warn(_message: string, ..._args: unknown[]): void { /* noop */ }
  error(_message: string, ..._args: unknown[]): void { /* noop */ }
  fatal(_message: string, ..._args: unknown[]): void { /* noop */ }
}

// ---------------------------------------------------------------------------
// ConsoleLogger — writes to Node.js console
// ---------------------------------------------------------------------------

const LEVEL_PREFIX: Record<LogLevel, string> = {
  [LogLevel.Debug]:   "[DEBUG]",
  [LogLevel.Info]:    "[INFO ]",
  [LogLevel.Warning]: "[WARN ]",
  [LogLevel.Error]:   "[ERROR]",
  [LogLevel.Fatal]:   "[FATAL]",
};

/**
 * A simple console-based logger.
 *
 * - `debug` / `info` → `console.log`
 * - `warn`           → `console.warn`
 * - `error` / `fatal` → `console.error`
 */
export class ConsoleLogger implements IDicomLogger {
  private readonly _category: string;
  private readonly _minLevel: LogLevel;

  constructor(category: string, minLevel: LogLevel = LogLevel.Info) {
    this._category = category;
    this._minLevel = minLevel;
  }

  isEnabled(level: LogLevel): boolean {
    return level >= this._minLevel;
  }

  log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.isEnabled(level)) return;
    const text = `${LEVEL_PREFIX[level]} [${this._category}] ${formatMessage(message, args)}`;
    if (level >= LogLevel.Error) {
      console.error(text);
    } else if (level === LogLevel.Warning) {
      console.warn(text);
    } else {
      console.log(text);
    }
  }

  debug(message: string, ...args: unknown[]): void { this.log(LogLevel.Debug, message, ...args); }
  info(message: string, ...args: unknown[]): void  { this.log(LogLevel.Info,  message, ...args); }
  warn(message: string, ...args: unknown[]): void  { this.log(LogLevel.Warning, message, ...args); }
  error(message: string, ...args: unknown[]): void { this.log(LogLevel.Error, message, ...args); }
  fatal(message: string, ...args: unknown[]): void { this.log(LogLevel.Fatal, message, ...args); }
}

// ---------------------------------------------------------------------------
// Log category constants
// ---------------------------------------------------------------------------

/**
 * Standard logging categories used internally by dicom-ts.
 * Mirrors fo-dicom's `LogCategories` static class.
 */
export const LogCategories = {
  Network:  "DicomTs.Network",
  Codec:    "DicomTs.Imaging.Codec",
  Encoding: "DicomTs.Encoding",
  IO:       "DicomTs.IO",
  Printing: "DicomTs.Printing",
} as const;

// ---------------------------------------------------------------------------
// LogManager — global factory
// ---------------------------------------------------------------------------

/** Factory function type: given a category name, returns a logger. */
export type LoggerFactory = (category: string) => IDicomLogger;

/**
 * Global logger factory.
 *
 * By default every `getLogger()` call returns a `NullLogger`.
 * Call `LogManager.setFactory()` once at application startup to redirect
 * all library logging to your preferred backend:
 *
 * ```ts
 * import { LogManager, ConsoleLogger, LogLevel } from "dicom-ts";
 *
 * LogManager.setFactory((category) => new ConsoleLogger(category, LogLevel.Debug));
 * ```
 */
export class LogManager {
  private static _factory: LoggerFactory = (_cat) => NullLogger.instance;

  /**
   * Replace the global logger factory.
   * All subsequent `getLogger()` calls will use `factory`.
   */
  static setFactory(factory: LoggerFactory): void {
    LogManager._factory = factory;
  }

  /**
   * Get a logger for the given category name.
   * Typically called with a module/class name or a `LogCategories` constant.
   */
  static getLogger(category: string): IDicomLogger {
    return LogManager._factory(category);
  }

  /** Convenience: enable console logging for all categories at `minLevel`. */
  static enableConsole(minLevel: LogLevel = LogLevel.Info): void {
    LogManager.setFactory((cat) => new ConsoleLogger(cat, minLevel));
  }

  /** Convenience: disable all logging (restore NullLogger factory). */
  static disableLogging(): void {
    LogManager._factory = (_cat) => NullLogger.instance;
  }
}
