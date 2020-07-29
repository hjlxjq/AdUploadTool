const db = require('../tools/db');

module.exports = db.defineModel('abTestGroup', {
    name: {
        type: db.STRING(20),
        allowNull: false,
        unique: 'idx_name'
    },
    begin: {
        type: db.TINYINT,
        allowNull: false,
    },
    end: {
        type: db.TINYINT,
        allowNull: false,
    },
    description: {
        type: db.STRING(50),
        allowNull: false,
    },
    nativeTmplConfGroupId: db.CHAR(36),
    configGroupId: db.CHAR(36),
    goodsGroupId: db.CHAR(36),
    versionGroupId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_name'
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
        unique: 'idx_name'
    }

});
