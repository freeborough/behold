import winston from "winston"

// TODO: Use env variables for some of these config properties.
export const log = winston.createLogger({
    level: "debug",
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ],
})
