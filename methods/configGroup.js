/**
 * 导入 常量组和常量
 */
const _ = require('lodash');
const _readXMLFile = require('../tools/excelXMLutils');
const model = require('../tools/model');

// 根据 平台和包名获取应用在数据里的主键
async function getProductId(platform, packageName) {
    const ProductModel = model.product;    // 应用表模型

    // 纸牌有个例外的包名
    if (packageName !== 'Classic-5xing') {
        const packageNameArr = _.split(packageName, '-');
        if (packageNameArr.length > 1) {
            packageNameArr.pop();

        }
        packageName = packageNameArr.join('-');

    }

    // 广告平台的平台名，android, ios, wenxin, instant
    if (platform === 'web') {
        platform = 'instant';

    }
    if (platform === 'wx') {
        platform = 'weixin';

    }
    // 数据里库该应用 主键
    const productId = (await ProductModel.findOne({
        where: {
            platform, packageName
        }
    })).id;

    return productId;

}

// 获取常量组哈希，键为常量组，值为常量数据
async function getConfigConstantHash(XMLDir, project) {
    const configConstantHash = {};    // 常量 xml 表读取的哈希表，键为常量组，值为常量数据

    try {
        const configConstant = await _readXMLFile('ConfigConstant.xml', XMLDir, project);

        _.each(configConstant, (item) => {
            if (item.status) {
                if (!configConstantHash[item.groupName]) {
                    configConstantHash[item.groupName] = [];

                }
                configConstantHash[item.groupName].push({
                    key: item.key,
                    value: item.value,
                    description: item.description
                });
            }

        });

    } catch (e) { }

    return configConstantHash;

}

// 获取 ab 分组哈希，键为 clientPackage xml读取的常量组，值为 ab 分组数组
async function getGroupWeightHash(XMLDir, project) {
    const groupWeightHash = {};    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的常量组，值为 ab 分组数组

    try {
        const groupWeightContrl = await _readXMLFile('GroupWeightContrl.xml', XMLDir, project);

        _.each(groupWeightContrl, (item) => {
            if (item.status) {
                if (!groupWeightHash[item.key]) {
                    groupWeightHash[item.key] = [];

                }
                groupWeightHash[item.key].push({
                    toGroup: item.toGroup,
                    weightGroup: item.weightGroup
                });
            }

        });

    } catch (e) { }

    // console.log('groupWeightHash: ', groupWeightHash);
    return groupWeightHash;

}

// 批量创建常量组下常量
async function createConfig(configGroupId, configDataList = []) {
    const ConfigModel = model.config;    // 常量表模型

    // 批量创建常量
    for (const configData of configDataList) {
        const { key, value, description } = configData;

        const configVo = {
            key, value, description, configGroupId, active: 1
        };

        try {
            await ConfigModel.create(configVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                console.log(e);
                throw e;
            }

        }

    }

}

// 导入 常量组和常量
async function readConfigGroup(XMLDir, project) {
    console.log('begin execute function: readConfigGroup()');

    // 常量组表模型
    const ConfigGroupModel = model.configGroup;
    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 常量 xml 表读取的哈希表，键为常量组，值为常量数据
    const configConstantHash = await getConfigConstantHash(XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的常量组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);

    // 创建默认常量组和默认常量组下常量
    for (const item of clientPackage) {
        if (!item.status) continue;

        let packageName = item.packageName;
        const { device } = item;

        const productId = await getProductId(device, packageName);

        // facebook 小游戏没有依赖默认组
        if (device !== 'web') {
            // 每个应用都存在的默认组
            const defaultConfigGroupVo = {
                name: 'default', description: '默认游戏常量组', type: 1, productId, active: 1
            };
            // 查找或创建默认常量组
            const [currentDefaultConfigGroupVo, created] = await ConfigGroupModel.findOrCreate({
                where: {
                    name: 'default', type: 1, productId
                }, defaults: defaultConfigGroupVo
            });

            // 如果首次，则创建常量
            if (created) {
                await createConfig(currentDefaultConfigGroupVo.id, configConstantHash['default']);

            }

        }

    }

    // 创建所有常量组和常量组下常量
    for (const item of clientPackage) {
        if (!item.status) continue;

        let packageName = item.packageName;
        const { device } = item;

        const productId = await getProductId(device, packageName);

        // 默认组主键 id，其他组依赖默认组
        let defaultConfigGroupId = null;

        // facebook 小游戏没有依赖默认组
        if (device !== 'web') {
            // 查找默认组
            const currentDefaultConfigGroupVo = await ConfigGroupModel.findOne({
                where: {
                    name: 'default', type: 1, productId
                }
            });

            if (!_.isEmpty(currentDefaultConfigGroupVo)) {
                defaultConfigGroupId = currentDefaultConfigGroupVo.id;

            }

        }

        // xml 表中未配置，则取默认值
        const groupWeightList = groupWeightHash[item.config] || [{
            toGroup: item.config,
            weightGroup: '-1'
        }];

        for (const groupWeight of groupWeightList) {
            const configGroupName = groupWeight.toGroup;

            if (configGroupName !== 'default') {
                const configDataList = configConstantHash[configGroupName];

                const configGroupVo = {
                    name: configGroupName, description: configGroupName,
                    dependentId: defaultConfigGroupId, type: 1, productId, active: 1
                };
                // 查找或创建常量组
                const [currentConfigGroupVo, created] = await ConfigGroupModel.findOrCreate({
                    where: {
                        name: configGroupName, type: 1, productId
                    }, defaults: configGroupVo
                });

                // 如果首次，则创建常量
                if (created) {
                    await createConfig(currentConfigGroupVo.id, configDataList);

                }

            }

        }

    }

}


module.exports = {
    readConfigGroup
};