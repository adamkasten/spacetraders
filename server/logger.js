import * as winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

const node_env = process.env.APP_ENV;

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
          winston.format.prettyPrint()
        ),
      }),
      new DailyRotateFile({
        filename: `orange_dragon_${node_env}-%DATE%.log`,
        dirname: `${process.cwd()}/logs/${node_env}`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        maxAge: "7d",
        auditFile: `${process.cwd()}/logs/audit`,
        json: true,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
          winston.format.prettyPrint()
        ),
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });

export default logger;
