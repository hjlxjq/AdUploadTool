const db = require('../tools/db');

module.exports = db.defineModel('nativeShop', {
    key: {
        type: db.STRING(20),
        allowNull: false,
        unique: true
    },
    type: {
        type: db.STRING(10),
        allowNull: false,
    },
    description: {
        type: db.STRING(50),
        allowNull: false,
    },
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
