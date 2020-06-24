const db = require('../tools/db');

module.exports = db.defineModel('adGroup', {
    name: {
        type: db.STRING(50),
        allowNull: false,
        unique: 'idx_name'
    },
    description: {
        type: db.STRING(50),
        allowNull: false
    },
    adTypeId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_name'
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
    }

});
