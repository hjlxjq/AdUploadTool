const db = require('../tools/db');

module.exports = db.defineModel('productGroupAuth', {
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
    createProduct: {
        type: db.BOOLEAN,
        allowNull: false
    },
    master: {
        type: db.BOOLEAN,
        allowNull: false
    },
    productGroupId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pgid_uid'
    },
    userId: {
        type: db.CHAR(36),
        allowNull: false,
        unique: 'pgid_uid'
    }

});
