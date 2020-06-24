const db = require('../tools/db');

module.exports = db.defineModel('nativeTmpl', {
    key: {
        type: db.STRING(5),        // 模板最大 99999
        allowNull: false,
        unique: true
    },
    preview: {
        type: db.STRING(100),        // 图片地址最大长度
        allowNull: false
    },
    test: {
        type: db.BOOLEAN,
        allowNull: false
    },
    active: {
        type: db.BOOLEAN,
        allowNull: false
    }

});
