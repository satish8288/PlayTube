// utils/logger.js
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors, colorize } = winston.format;

winston.addColors({
  ERROR: "red",
  WARN: "yellow",
  INFO: "green",
  DEBUG: "blue",
});

const upperCaseLevel = winston.format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

// printf hamesha sabse AAKHIR me chalta hai — isliye ise transport-level
// format me use karenge, logger-level format me kabhi nahi
const logFormat = printf(({ timestamp, level, message, stack }) => {
  return stack
    ? `${timestamp} [${level}]: ${message}\n${stack}`
    : `${timestamp} [${level}]: ${message}`;
});

// logger-level format — sirf SHARED processing, koi string-conversion nahi
const baseFormat = combine(
  errors({ stack: true }),
  upperCaseLevel(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: baseFormat, // 👈 yahan printf/logFormat NAHI hai
  transports: [
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: logFormat, // 👈 har transport apna printf khud lagata hai, LAST step
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "error",
      format: logFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat), // colorize pehle, printf LAST
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: logFormat,
    })
  );
}

export { logger };