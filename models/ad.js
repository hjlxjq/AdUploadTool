const db = require('../tools/db');

module.exports = db.defineModel('ad', {
    name: {
        type: db.STRING(100),
        allowNull: false,
    },
    placementID: {
        type: db.STRING(100),
        allowNull: false
    },
    ecpm: {
        type: db.DECIMAL(6, 2),
        allowNull: false,
    },
    loader: db.STRING(10),
    subloader: db.STRING(10),
    interval: {
        type: db.SMALLINT.UNSIGNED,
        allowNull: false,
    },
    weight: {
        type: db.TINYINT.UNSIGNED,
        allowNull: false,
    },
    bidding: {
        type: db.BOOLEAN,
        allowNull: false,
    },
    adChannelId: {
        type: db.CHAR(36),
        allowNull: false,
    },
    adTypeId: {
        type: db.CHAR(36),
        allowNull: false
    },
    adGroupId: {
        type: db.CHAR(36),
        allowNull: false
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false
    },
    creatorId: db.CHAR(36),
    active: {
        type: db.BOOLEAN,
        allowNull: false
    },
    activeTime: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: '2020-05-01 00:00:00'
    }

}, {
    indexes: [
        {
            unique: true,
            name: 'idx_placementID',
            fields: ['activeTime', 'adGroupId', 'placementID']
        }, {
            unique: true,
            name: 'idx_name',
            fields: ['name', 'activeTime', 'adGroupId', 'adChannelId']
        }
    ]

});
