const db = require('../tools/db');

module.exports = db.defineModel('abTestMap', {
    place: {
        type: db.STRING(30),
        allowNull: false,
        unique: 'idx_place'
    },
    adGroupId: db.CHAR(36),
    abTestGroupId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'idx_place'
    },
    creatorId: db.CHAR(36),
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
