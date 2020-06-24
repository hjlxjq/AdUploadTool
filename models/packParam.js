const db = require('../tools/db');

module.exports = db.defineModel('packParam', {
    key: {
        type: db.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: db.STRING(50),
        allowNull: false,
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
