var path = require('path');

var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    dev: {
        db: 'mongodb://cato:monzter1@ds031213.mongolab.com:31213/csa',
        rootPath: rootPath,
        port: process.env.PORT || 7203
    },
    production: {
        db: 'mongodb://cato:monzter1@ds031213.mongolab.com:31213/csa',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};