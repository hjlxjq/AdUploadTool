const db = require('../tools/db');

module.exports = db.defineModel('userAuth', {
    editComConf: {
        type: db.BOOLEAN,
        allowNull: false
    },
    viewComConf: {
        type: db.BOOLEAN,
        allowNull: false
    },
    createProductGroup: {
        type: db.BOOLEAN,
        allowNull: false
    },
    master: {
        type: db.BOOLEAN,
        allowNull: false
    },
    userId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: true
    }

});
