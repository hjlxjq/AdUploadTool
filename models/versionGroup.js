const db = require('../tools/db');

module.exports = db.defineModel('versionGroup', {
    name: {
        type: db.STRING(50),
        allowNull: false,
        unique: 'idx_name'
    },
    begin: {
        type: db.SMALLINT.UNSIGNED,
        allowNull: false,
    },
    description: {
        type: db.STRING(50),
        allowNull: false,
    },
    type: {
        type: db.BOOLEAN,
        allowNull: false,
        unique: 'idx_name'
    },
    code: {
        type: db.STRING(500),
        allowNull: false,
    },
    include: {
        type: db.BOOLEAN,
        allowNull: false
    },
    productId: {
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
        allowNull: true,
        defaultValue: '2020-05-01 00:00:00',
        unique: 'idx_name'
    }

});
