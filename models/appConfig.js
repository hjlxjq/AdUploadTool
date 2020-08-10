const db = require('../tools/db');

module.exports = db.defineModel('appConfig', {
    PackageName: {
        type: db.STRING(100),
        allowNull: false,
        unique: 'platform_packageName'
    },
    Platform: {
        type: db.STRING(10),
        allowNull: false,
        unique: 'platform_packageName'
    },

});
