const db = require('../tools/db');

module.exports = db.defineModel('productGroup', {
    name: {
        type: db.STRING(20),
        allowNull: false,
        unique: true
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
