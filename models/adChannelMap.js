const db = require('../tools/db');

module.exports = db.defineModel('adChannelMap', {
    adChannelId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'channel_type'
    },
    adTypeId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'channel_type'
    }

});
