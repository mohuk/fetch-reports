const mongoose = require('mongoose');
const dbConfig = require('./config/db');

mongoose.Promise = global.Promise;

module.exports = () => {
    let config = {
        host: `${dbConfig.host}:${dbConfig.port}`,
        db: dbConfig.name,
        options: {
            user: dbConfig.username,
            pass: dbConfig.password
        }
    };

    mongoose.connection.on('open', () => {
        console.log(`MongoDB Connected at ${config.host}`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(err);
    });

    mongoose.connection.on('disconnect', () => {
        console.log('MongoDB Disconnected');
    });

    mongoose.connect(`mongodb://${config.options.user}:${config.options.pass}@${config.host}/${config.db}`);
};
