const db = require('../tools/db');

module.exports = db.defineModel('config', {
    key: {
        type: db.STRING(50),
        allowNull: false,
        unique: 'idx_key'
    },
    value: {
        type: db.STRING(2000),    // 最大有近 2000 个字符
        allowNull: false,
    },
    description: {
        type: db.STRING(200),
        allowNull: false,
    },
    configGroupId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_key'
    },
    creatorId: db.CHAR(36),
    active: {
        type: db.BOOLEAN,
        allowNull: false
    },
    activeTime: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: '2020-05-01 00:00:00',
        unique: 'idx_key'
    }

});
