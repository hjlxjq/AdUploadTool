const db = require('../tools/db');

module.exports = db.defineModel('nationDefine', {
    code: {
        type: db.CHAR(2),
        allowNull: false,
        unique: true
    },
    name: {
        type: db.STRING(20),
        allowNull: false,
        unique: true
    }

});
