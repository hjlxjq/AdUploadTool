const db = require('../tools/db');

module.exports = db.defineModel('nativeTmplConf', {
    weight: {
        type: db.TINYINT.UNSIGNED,
        allowNull: false,
    },
    clickArea: {
        type: db.TINYINT.UNSIGNED,
        allowNull: false,
    },
    isFull: {
        type: db.BOOLEAN,
        allowNull: false,
    },
    nativeTmplId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_nativeTmpl'
    },
    nativeTmplConfGroupId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_nativeTmpl'
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
        unique: 'idx_nativeTmpl'
    }

});
