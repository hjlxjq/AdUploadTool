/**
 * 导入阶段转发应用配置表
 */
const fs = require('fs');
const model = require('../tools/model');

// 创建阶段转发应用配置
async function readAppConfig(DefineDir) {
    // sequelize 数据库 model
    const AppConfigModel = model.appConfig;    // 阶段转发应用配置表模型

    const appConfigPath = DefineDir + '/AppsConfig.json';
    const appConfigList = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
    
    for (const appConfig of appConfigList) {
        const { PackageName, Platform } = appConfig;
    
        // 转发应用配置表对象
        const appConfigVo = {
            PackageName, Platform
        };
        try {
            await AppConfigModel.create(appConfigVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }
    
    }

}

module.exports = {
    readAppConfig
};