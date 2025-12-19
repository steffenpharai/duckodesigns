/**
 * Structured logging utility for Cloud Logging compatibility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  severity: string
  message: string
  timestamp: string
  [key: string]: unknown
}

function formatLogEntry(level: LogLevel, message: string, metadata?: Record<string, unknown>): LogEntry {
  return {
    severity: level.toUpperCase(),
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
  }
}

export const logger = {
  debug: (message: string, metadata?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify(formatLogEntry('debug', message, metadata)))
    }
  },

  info: (message: string, metadata?: Record<string, unknown>) => {
    console.log(JSON.stringify(formatLogEntry('info', message, metadata)))
  },

  warn: (message: string, metadata?: Record<string, unknown>) => {
    console.warn(JSON.stringify(formatLogEntry('warn', message, metadata)))
  },

  error: (message: string, error?: Error | unknown, metadata?: Record<string, unknown>) => {
    const errorMetadata: Record<string, unknown> = {
      ...metadata,
    }

    if (error instanceof Error) {
      errorMetadata.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      errorMetadata.error = error
    }

    console.error(JSON.stringify(formatLogEntry('error', message, errorMetadata)))
  },
}

