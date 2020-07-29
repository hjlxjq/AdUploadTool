const db = require('../tools/db');

module.exports = db.defineModel('goods', {
    goodsGroupId: {
        type: db.CHAR(36),
        allowNull: false
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
    },
    creatorId: db.CHAR(36),
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
