const db = require('../tools/db');

module.exports = db.defineModel('user', {
    email: {
        type: db.STRING(36),
        allowNull: false,
        unique: true
    },
    name: {
        type: db.STRING(5),
        allowNull: false,
        unique: true
    },
    password: {
        type: db.CHAR(32),
        allowNull: false,
    },
    active: {
        type: db.BOOLEAN,
        allowNull: false
    },

});
