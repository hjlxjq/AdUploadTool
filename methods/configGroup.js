/**
 * 导入常量组和常量
 */
const _ = require('lodash');
const _readXMLFile = require('../tools/excelXMLutils');
const _readCSVFile = require('../tools/excelCSVutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const model = require('../tools/model');

// 获取指定导入的应用哈希表
async function getProductNameHash(DefineDir) {
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    let productNameHashHash = {};

    try {
        // 去掉第一行的描述
        const productDataList = await _readXLSXFile('广告配置阶段导入.xlsx', DefineDir);

        _.each(productDataList, (productData) => {
            const { app_name, platform, group, package } = productData;
            const device = platform.toLowerCase();

            if (!productNameHashHash[device]) {
                productNameHashHash[device] = {};

            }
            productNameHashHash[device][package] = { productName: app_name, productGroupName: group };

        });

    } catch (e) {
        productNameHashHash = {};

    }
    return productNameHashHash;

}

// 根据 平台和包名获取应用在数据里的主键
async function getProductId(platform, packageName) {
    const ProductModel = model.product;    // 应用表模型

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
async function getConfigConstantHash(DefineDir, XMLDir, project) {
    const gameConfigConstantHash = {};    // 常量 xml 表读取的哈希表，键为常量组，值为常量数据
    const adConfigConstantHash = {};    // 常量 xml 表读取的哈希表，键为常量组，值为常量数据

    try {
        const configConstant = await _readXMLFile('ConfigConstant.xml', XMLDir, project);
        // 解析基础常量
        const baseConfigList = await _readXLSXFile('常规常量.xlsx', DefineDir);

        const baseConfigKeys = _.map(baseConfigList, (baseConfig) => {
            return baseConfig.key;

        });

        _.each(configConstant, (item) => {
            if (!item.description) {
                console.log('key: ', item.key);
            }
            if (item.status) {
                if (!gameConfigConstantHash[item.groupName]) {
                    gameConfigConstantHash[item.groupName] = [];

                }
                if (!adConfigConstantHash[item.groupName]) {
                    adConfigConstantHash[item.groupName] = [];

                }
                if (_.indexOf(baseConfigKeys, item.key) === -1) {
                    gameConfigConstantHash[item.groupName].push({
                        key: item.key,
                        value: item.value,
                        description: item.description
                    });

                } else {
                    adConfigConstantHash[item.groupName].push({
                        key: item.key,
                        value: item.value,
                        description: item.description
                    });

                }

            }

        });

    } catch (e) { }

    return { gameConfigConstantHash, adConfigConstantHash };

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

        let newValue = value;
        if (_.isUndefined(value)) {
            newValue = '';
        }

        const configVo = {
            key, value: newValue, description, configGroupId, active: 1
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

// 批量创建常量组下常量
async function createConfigGroup(
    name, description, type, productId, configConstantHash, defaultConfigGroupId = null
) {
    if (!_.isEmpty(configConstantHash[name])) {
        // 常量组表模型
        const ConfigGroupModel = model.configGroup;

        // 每个应用都存在的默认组
        const configGroupVo = {
            name, description, type, productId, dependentId: defaultConfigGroupId, active: 1
        };
        // 查找或创建默认常量组
        const [currentConfigGroupVo, created] = await ConfigGroupModel.findOrCreate({
            where: {
                name, type, productId
            }, defaults: configGroupVo
        });

        // 如果首次，则创建常量
        if (created) {
            await createConfig(currentConfigGroupVo.id, configConstantHash[name]);

        }

    }

}

// 导入常量组和常量
async function readConfigGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readConfigGroup()');

    // 常量组表模型
    const ConfigGroupModel = model.configGroup;
    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 常量 xml 表读取的哈希表，键为常量组，值为常量数据
    const { adConfigConstantHash, gameConfigConstantHash } = await getConfigConstantHash(DefineDir, XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的常量组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);

    // 创建默认常量组和默认常量组下常量
    for (const item of clientPackage) {
        if (!item.status) continue;

        let packageName = item.packageName;
        const { device } = item;
        let nationCode = null;

        // 纸牌有个例外的包名
        if (packageName !== 'Classic-5xing') {
            const packageNameArr = _.split(packageName, '-');
            if (packageNameArr.length > 1) {
                nationCode = packageNameArr.pop();

            }
            packageName = packageNameArr.join('-');

        }
        // 存在阶段导入
        if (!_.isEmpty(productNameHashHash)) {
            // 导入指定包
            if (!productNameHashHash[device]) {
                continue;

            }
            if (!productNameHashHash[device][packageName]) {
                continue;

            }

        }

        const productId = await getProductId(device, packageName);

        // facebook 小游戏没有依赖默认组
        if (device !== 'web') {
            await createConfigGroup('default', '默认游戏常量组', 1, productId, gameConfigConstantHash);
            await createConfigGroup('default', '默认广告常量组', 0, productId, adConfigConstantHash);

        }

    }

    // 创建所有常量组和常量组下常量
    for (const item of clientPackage) {
        if (!item.status) continue;

        let packageName = item.packageName;
        const { device } = item;
        let nationCode = null;

        // 纸牌有个例外的包名
        if (packageName !== 'Classic-5xing') {
            const packageNameArr = _.split(packageName, '-');
            if (packageNameArr.length > 1) {
                nationCode = packageNameArr.pop();

            }
            packageName = packageNameArr.join('-');

        }
        // 存在阶段导入
        if (!_.isEmpty(productNameHashHash)) {
            // 导入指定包
            if (!productNameHashHash[device]) {
                continue;

            }
            if (!productNameHashHash[device][packageName]) {
                continue;

            }

        }

        const productId = await getProductId(device, packageName);

        // 默认组主键 id，其他组依赖默认组
        let defaultGameConfigGroupId = null;
        let defaultAdConfigGroupId = null;

        // facebook 小游戏没有依赖默认组
        if (device !== 'web') {
            // 查找游戏默认组
            const currentDefaultGameConfigGroupVo = await ConfigGroupModel.findOne({
                where: {
                    name: 'default', type: 1, productId
                }
            });

            if (!_.isEmpty(currentDefaultGameConfigGroupVo)) {
                defaultGameConfigGroupId = currentDefaultGameConfigGroupVo.id;

            }
            // 查找广告默认组
            const currentDefaultAdConfigGroupVo = await ConfigGroupModel.findOne({
                where: {
                    name: 'default', type: 0, productId
                }
            });

            if (!_.isEmpty(currentDefaultAdConfigGroupVo)) {
                defaultAdConfigGroupId = currentDefaultAdConfigGroupVo.id;

            }

        }

        // xml 表中未配置，则取默认值
        const groupWeightList = groupWeightHash[item.config] || [{
            toGroup: item.config,
            weightGroup: '-1'
        }];

        for (const groupWeight of groupWeightList) {
            const configGroupName = groupWeight.toGroup;

            if (configGroupName === 'null') {
                continue;

            }

            if (configGroupName !== 'default') {
                await createConfigGroup(
                    configGroupName, configGroupName, 1, productId, gameConfigConstantHash, defaultGameConfigGroupId
                );
                await createConfigGroup(
                    configGroupName, configGroupName, 0, productId, adConfigConstantHash, defaultAdConfigGroupId
                );

            }

        }

    }

}


module.exports = {
    readConfigGroup
};