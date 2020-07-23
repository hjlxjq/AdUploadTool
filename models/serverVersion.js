const db = require('../tools/db');

module.exports = db.defineModel('serverVersion', {
    version: {
        type: db.STRING(10),
        allowNull: false,
        unique: true
    },
    gitTag: {
        type: db.STRING(30),
        allowNull: false,
        unique: true
    }

});
