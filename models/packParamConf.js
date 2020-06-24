const db = require('../tools/db');

module.exports = db.defineModel('packParamConf', {
    value: {
        type: db.STRING(100),
        allowNull: false,
    },
    packParamId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_packParam'
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_packParam'
    }

});
