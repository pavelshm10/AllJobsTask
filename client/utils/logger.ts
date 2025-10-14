type LogLevel = "info" | "warn" | "error" | "debug";

type LogData = string | number | boolean | object | null | undefined;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: LogData;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: LogData
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      stack: data instanceof Error ? data.stack : undefined,
    };
  }

  private log(level: LogLevel, message: string, data?: LogData) {
    const entry = this.createLogEntry(level, message, data);

    // Always log to console in development
    if (this.isDevelopment) {
      const consoleMethod =
        level === "error" ? "error" : level === "warn" ? "warn" : "log";
      console[consoleMethod](
        `[${entry.timestamp}] [${level.toUpperCase()}]`,
        message,
        data || ""
      );
    }

    // In production, you would send logs to a service (e.g., Sentry, LogRocket, DataDog)
    if (!this.isDevelopment && level === "error") {
      this.sendToErrorService(entry);
    }

    // Store in localStorage for debugging (limit to last 100 entries)
    this.storeLog(entry);
  }

  private storeLog(entry: LogEntry) {
    try {
      const logs = this.getLogs();
      logs.push(entry);

      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.shift();
      }

      localStorage.setItem("app-logs", JSON.stringify(logs));
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  private sendToErrorService(entry: LogEntry) {
    // Future: Implement error tracking service (Sentry, LogRocket, DataDog)
    // Example: Sentry.captureException(entry);
  }

  public info(message: string, data?: LogData) {
    this.log("info", message, data);
  }

  public warn(message: string, data?: LogData) {
    this.log("warn", message, data);
  }

  public error(message: string, error?: Error | LogData) {
    this.log("error", message, error);
  }

  public debug(message: string, data?: LogData) {
    if (this.isDevelopment) {
      this.log("debug", message, data);
    }
  }

  public getLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem("app-logs");
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  public clearLogs() {
    try {
      localStorage.removeItem("app-logs");
    } catch (error) {
      console.warn("Failed to clear logs:", error);
    }
  }

  // Log API errors with consistent format
  public logApiError(endpoint: string, error: Error, context?: LogData) {
    const errorData = {
      endpoint,
      error: error.message,
      name: error.name,
      context,
      timestamp: new Date().toISOString(),
    };

    this.error(`API Error: ${endpoint}`, errorData);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export default logger;
