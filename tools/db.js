const Sequelize = require('sequelize');
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');

const productConfig = require('../config/dbConfig');
const localConfig = require('../config/dbConfig.local');
const testConfig = require('../config/dbConfig.test');

const env = process.env.env || 'local';
let config;

if (env === 'local') {
    config = localConfig;

} else if (env === 'test') {
    config = testConfig;

} else if (env === 'product') {
    config = productConfig;

}

console.log('init sequelize...');
console.log(`env: ${env}`);

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }

});

function generateId() {
    return uuid.v4();

}

const ID_TYPE = Sequelize.CHAR(36);

function defineModel(name, attributes, options) {
    const attrs = {};
    
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };

    for (let key in attributes) {
        let value = attributes[key];

        if (typeof value === 'object' && value['type']) {
            if (_.isUndefined(value.allowNull)) {
                value.allowNull = true;

            } else {
                value.allowNull = value.allowNull;

            }
            attrs[key] = value;

        } else {
            attrs[key] = {
                type: value,
                allowNull: true
            };

        }

    }
    attrs.createdAt = {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    };
    attrs.updatedAt = {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false
    };

    return sequelize.define(name, attrs, {
        indexes: options && options.indexes,
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                const now = moment().format('YYYY-MM-DD HH:mm:ss');
                if (obj.isNewRecord) {

                    if (!obj.id) {
                        obj.id = generateId();

                    }
                    obj.createdAt = now;
                    obj.updatedAt = now;

                } else {
                    obj.updatedAt = now;

                }
            }
        }

    });

}

async function queryView(condition) {
    return await sequelize.query(condition, { type: sequelize.QueryTypes.SELECT });


}

const TYPES = ['CHAR', 'STRING', 'TINYINT', 'SMALLINT', 'TEXT', 'DECIMAL', 'BOOLEAN'];

const exp = {
    defineModel: defineModel,
    queryView: queryView,
    sync: async () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }

};

for (let type of TYPES) {
    exp[type] = Sequelize[type];

}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;
