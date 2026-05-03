const LOG_METHODS = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  trace: console.trace,
  log: console.log,
};

function getCaller() {
  const stack = new Error().stack;
  if (!stack) return 'unknown';
  const callerLine = stack.split('\n')[3];
  if (!callerLine) return 'unknown';
  return callerLine.trim();
}

export function consoleLogger({ level = 'log', message, error, meta }) {
  const logMethod = LOG_METHODS[level] || console.log;

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    caller: getCaller(),
    message,
  };

  if (meta) payload.meta = meta;

  if (error) {
    payload.error =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error;
  }

  logMethod(JSON.stringify(payload, null, 2));
}
