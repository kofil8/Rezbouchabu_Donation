import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, label, printf } = format;

// Custom format for console logging with colors and emoji
const consoleLogFormat = format.combine(
  format.colorize(),
  format.label({ label: " 🚀" }),
  printf(({ level, label, message, timestamp }) => {
    return `${label} ${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;
