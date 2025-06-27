import 'dotenv/config.js';
import app from './app.js';
import logger from './logs/logger.js';
import config from './config/env.js';
import { sequelize } from './database/database.js';

async function main(){
    await sequelize.sync({force: true});
    const port = config.PORT;
    app.listen(port);
    logger.info('Server started on port  '+ process.env.PORT);
    logger.error('This is an error message');
    logger.warn('This is a warning message');
    logger.fatal('This is a fatal message');
}

main();