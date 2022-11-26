const rawConfigs    = require('./config');

let currentEnvironment = (process.env.APP_ENV && process.env.APP_ENV.trim().length > 0) ? process.env.APP_ENV : 'DEFAULT';

console.log(`Loading configuration for environment - ${currentEnvironment}`);

let currentConfig = rawConfigs[currentEnvironment];

module.exports.get = (key) => {
    return currentConfig[key]
}

