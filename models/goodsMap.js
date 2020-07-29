const db = require('../tools/db');

module.exports = db.defineModel('goodsMap', {
    value: {
        type: db.STRING(150),
        allowNull: true,
    },
    shopId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'shop_goods'
    },
    goodsId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'shop_goods'
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
    },
    creatorId: db.CHAR(36)

});
