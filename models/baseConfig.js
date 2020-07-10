const db = require('../tools/db');

module.exports = db.defineModel('baseConfig', {
    key: {
        type: db.STRING(50),
        allowNull: false,
        unique: true
    },
    value: {
        type: db.STRING(100),
        allowNull: false
    },
    description: {
        type: db.STRING(150),
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
