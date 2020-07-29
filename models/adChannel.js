const db = require('../tools/db');

module.exports = db.defineModel('adChannel', {
    channel: {
        type: db.STRING(20),    // 目前存在的最大长度为 15, 'Admob-Mediation'
        allowNull: false,
        unique: true
    },
    key1: db.STRING(50),
    key2: db.STRING(50),
    key3: db.STRING(50),
    test: {
        type: db.BOOLEAN,
        allowNull: false
    },
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
