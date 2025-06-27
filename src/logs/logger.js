import pino from 'pino';

const logger = pino({
    transports: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
        },
    },
});

export default logger;