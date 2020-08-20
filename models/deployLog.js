const db = require('../tools/db');

module.exports = db.defineModel('deployLog', {
    log: {
        type: db.STRING(500),
        allowNull: false,
    },
    type: {
        type: db.BOOLEAN,
        allowNull: false,
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
    },
    userId: {
        type: db.CHAR(36),
        allowNull: false,
    }

});
