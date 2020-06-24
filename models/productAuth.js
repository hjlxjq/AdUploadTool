const db = require('../tools/db');

module.exports = db.defineModel('productAuth', {
    editAd: {
        type: db.BOOLEAN,
        allowNull: false
    },
    viewAd: {
        type: db.BOOLEAN,
        allowNull: false
    },
    editGameConfig: {
        type: db.BOOLEAN,
        allowNull: false
    },
    viewGameConfig: {
        type: db.BOOLEAN,
        allowNull: false
    },
    viewPurchase: {
        type: db.BOOLEAN,
        allowNull: false
    },
    editPurchase: {
        type: db.BOOLEAN,
        allowNull: false
    },
    editProduct: {
        type: db.BOOLEAN,
        allowNull: false
    },
    master: {
        type: db.BOOLEAN,
        allowNull: false
    },
    productId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_uid'
    },
    userId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pid_uid'
    }

});
