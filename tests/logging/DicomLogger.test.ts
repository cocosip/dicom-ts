import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  LogLevel,
  NullLogger,
  ConsoleLogger,
  LogManager,
  LogCategories,
} from "../../src/logging/DicomLogger.js";

describe("NullLogger", () => {
  const logger = NullLogger.instance;

  it("isEnabled always returns false", () => {
    expect(logger.isEnabled(LogLevel.Debug)).toBe(false);
    expect(logger.isEnabled(LogLevel.Fatal)).toBe(false);
  });

  it("log methods do not throw", () => {
    expect(() => logger.debug("msg")).not.toThrow();
    expect(() => logger.info("msg")).not.toThrow();
    expect(() => logger.warn("msg")).not.toThrow();
    expect(() => logger.error("msg")).not.toThrow();
    expect(() => logger.fatal("msg")).not.toThrow();
    expect(() => logger.log(LogLevel.Info, "msg", 1, 2)).not.toThrow();
  });

  it("is a singleton", () => {
    expect(NullLogger.instance).toBe(NullLogger.instance);
  });
});

describe("ConsoleLogger", () => {
  it("isEnabled respects minLevel", () => {
    const logger = new ConsoleLogger("test", LogLevel.Warning);
    expect(logger.isEnabled(LogLevel.Debug)).toBe(false);
    expect(logger.isEnabled(LogLevel.Info)).toBe(false);
    expect(logger.isEnabled(LogLevel.Warning)).toBe(true);
    expect(logger.isEnabled(LogLevel.Error)).toBe(true);
    expect(logger.isEnabled(LogLevel.Fatal)).toBe(true);
  });

  it("default minLevel is Info", () => {
    const logger = new ConsoleLogger("test");
    expect(logger.isEnabled(LogLevel.Debug)).toBe(false);
    expect(logger.isEnabled(LogLevel.Info)).toBe(true);
  });

  it("debug/warn routes to correct console method", () => {
    const logSpy   = vi.spyOn(console, "log").mockImplementation(() => {});
    const warnSpy  = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const logger = new ConsoleLogger("cat", LogLevel.Debug);
    logger.debug("d");
    logger.warn("w");
    logger.error("e");

    expect(logSpy).toHaveBeenCalledOnce();
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledOnce();

    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("formats {0} {1} placeholders", () => {
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = new ConsoleLogger("cat", LogLevel.Debug);
    logger.error("tag {0} vr {1}", "0010,0010", "PN");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("tag 0010,0010 vr PN"));
    logSpy.mockRestore();
  });

  it("skips output when below minLevel", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const logger = new ConsoleLogger("cat", LogLevel.Warning);
    logger.debug("hidden");
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });
});

describe("LogManager", () => {
  beforeEach(() => {
    LogManager.disableLogging();
  });

  it("default factory returns NullLogger", () => {
    const logger = LogManager.getLogger("test");
    expect(logger.isEnabled(LogLevel.Info)).toBe(false);
  });

  it("setFactory redirects getLogger", () => {
    LogManager.setFactory((cat) => new ConsoleLogger(cat, LogLevel.Debug));
    const logger = LogManager.getLogger("test");
    expect(logger.isEnabled(LogLevel.Debug)).toBe(true);
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it("enableConsole sets a ConsoleLogger factory", () => {
    LogManager.enableConsole(LogLevel.Warning);
    const logger = LogManager.getLogger("io");
    expect(logger.isEnabled(LogLevel.Warning)).toBe(true);
    expect(logger.isEnabled(LogLevel.Info)).toBe(false);
  });

  it("disableLogging restores NullLogger", () => {
    LogManager.enableConsole();
    LogManager.disableLogging();
    const logger = LogManager.getLogger("net");
    expect(logger.isEnabled(LogLevel.Info)).toBe(false);
  });
});

describe("LogCategories", () => {
  it("exposes expected category strings", () => {
    expect(LogCategories.Network).toBe("DicomTs.Network");
    expect(LogCategories.IO).toBe("DicomTs.IO");
    expect(LogCategories.Codec).toBe("DicomTs.Imaging.Codec");
    expect(LogCategories.Encoding).toBe("DicomTs.Encoding");
    expect(LogCategories.Printing).toBe("DicomTs.Printing");
  });
});
