const db = require('../tools/db');

module.exports = db.defineModel('adType', {
    type: {
        type: db.STRING(30),    // 目前存在的广告类型长度最长 13
        allowNull: false,
        unique: true
    },
    name: {
        type: db.STRING(30),
        allowNull: false,
        unique: true
    },
    test: {
        type: db.BOOLEAN,
        allowNull: false
    },
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
