const db = require('../tools/db');

module.exports = db.defineModel('product', {
    name: {
        type: db.STRING(100),
        allowNull: false,
    },
    packageName: {
        type: db.STRING(100),
        allowNull: false,
        unique: 'platform_packageName'
    },
    platform: {
        type: db.STRING(10),
        allowNull: false,
        unique: 'platform_packageName'
    },
    pid: db.STRING(50),
    productGroupId: {
        type: db.CHAR(36),
        allowNull: false
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
