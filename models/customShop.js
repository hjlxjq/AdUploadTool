const db = require('../tools/db');

module.exports = db.defineModel('customShop', {
    key: {
        type: db.STRING(20),
        allowNull: false,
        unique: 'idx_key'
    },
    type: {
        type: db.STRING(10),
        allowNull: false,
    },
    description: {
        type: db.STRING(250),
        allowNull: false,
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_key'
    },
    creatorId: db.CHAR(36),
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
