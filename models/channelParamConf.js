const db = require('../tools/db');

module.exports = db.defineModel('channelParamConf', {
    value1: db.STRING(100),
    value2: db.STRING(100),
    value3: db.STRING(100),
    adChannelId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_channel'
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_channel'
    }

});
