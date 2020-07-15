/**
 * 导入 广告组和广告
 */
const _ = require('lodash');
const _readXMLFile = require('../tools/excelXMLutils');
const _readCSVFile = require('../tools/excelCSVutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const model = require('../tools/model');

// 获取指定导入的应用哈希表
async function getProductNameHash(DefineDir) {
    const productDataList = await _readXLSXFile('广告配置导入模板.xlsx', DefineDir);
    // 去掉第一行的描述
    productDataList.shift();

    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = {};

    _.each(productDataList, (productData) => {
        const { app_name, platform, group, package } = productData;
        const device = platform.toLowerCase();
        const packageName = package.toLowerCase();

        if (!productNameHashHash[device]) {
            productNameHashHash[device] = {};

        }
        productNameHashHash[device][packageName] = { productName: app_name, productGroupName: group };

    });
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

// 获取所有的广告类型哈希表
async function getAdTypeHash() {
    // 广告类型模型
    const AdTypeModel = model.adType;

    const adTypeVoList = await AdTypeModel.findAll();

    // 广告类型哈希表，键为广告类型，值为数据库广告类型表主键
    const adTypeHash = {};

    _.each(adTypeVoList, (adTypeVo) => {
        const { id, type } = adTypeVo;
        adTypeHash[type] = id;

    });
    return adTypeHash;

}

// 获取版本条件分组哈希
async function getVersionGroupHash(clientPackage, productNameHashHash) {
    const adVersionGroupHashHash = {};    // 键为 应用主键，值为版本条件分组哈希
    const gameVersionGroupHashHash = {};    // 键为 应用主键，值为版本条件分组哈希

    for (const item of clientPackage) {
        if (!item.status) continue;

        const { device, condition, groupName, config } = item;
        let packageName = item.packageName;
        let nationCode = null;

        // 纸牌有个例外的包名
        if (packageName !== 'Classic-5xing') {
            const packageNameArr = _.split(packageName, '-');
            if (packageNameArr.length > 1) {
                nationCode = packageNameArr.pop();

            }
            packageName = packageNameArr.join('-');

        }
        // 导入指定包
        if (!productNameHashHash[device]) {
            continue;

        }
        if (!productNameHashHash[device][packageName]) {
            continue;

        }

        // 获取应用主键
        const productId = await getProductId(device, packageName);

        if (!adVersionGroupHashHash[productId]) {
            adVersionGroupHashHash[productId] = {};

        }
        if (!adVersionGroupHashHash[productId][condition]) {
            adVersionGroupHashHash[productId][condition] = {};

        }
        if (!adVersionGroupHashHash[productId][condition][groupName]) {
            adVersionGroupHashHash[productId][condition][groupName] = [];

        }
        adVersionGroupHashHash[productId][condition][groupName].push(nationCode);

        if (!gameVersionGroupHashHash[productId]) {
            gameVersionGroupHashHash[productId] = {};

        }
        if (!gameVersionGroupHashHash[productId][condition]) {
            gameVersionGroupHashHash[productId][condition] = {};

        }
        if (!gameVersionGroupHashHash[productId][condition][config]) {
            gameVersionGroupHashHash[productId][condition][config] = [];

        }
        gameVersionGroupHashHash[productId][condition][config].push(nationCode);
        // if (!gameVersionGroupHashHash[productId]) {
        //     gameVersionGroupHashHash[productId] = {};

        // }
        // if (nationCode === null) {
        //     gameVersionGroupHashHash[productId][condition] = config;
        // }

    }
    return { adVersionGroupHashHash, gameVersionGroupHashHash };

}

// 获取广告组哈希，键为广告组，值为广告数据
async function getAd_IDControlHash(XMLDir, project) {
    const ad_IDControlHashHash = {};    // 广告 xml 表读取的哈希表，键为广告组，值为广告数据

    const headerBiddingHash = {};    // bidding xml 表读取的哈希表，键为 hbkey，值为 placementID

    try {
        const headerBidding_ID = await _readXMLFile('HeaderBidding_ID.xml', XMLDir, project);

        _.each(headerBidding_ID, (item) => {
            if (item.status) {
                headerBiddingHash[item.hbkey] = item.placementID;
            }

        });

    } catch (e) { }

    const ad_IDControl = await _readXMLFile('Ad_IDControl.xml', XMLDir, project);

    _.each(ad_IDControl, (item) => {
        if (item.status) {
            const {
                groupName, adID, ecpm, loader, subloader, interval, weight
            } = item;

            const channel = item.channel.toLowerCase();
            const adType = item.adType.toLowerCase();

            const channelList = [
                'facebook', 'unity', 'aol', 'fbhb', 'admob', 'mopub', 'tiktok', 'vungle', 'applovin',
                'ironsource', 'mobvista', 'fyber', 'tapjoy', 'chartboost', 'inmobi', 'adcolony',
            ];

            let newChannel = channel;
            // 忽略广告平台后面的数字
            _.each(channelList, (channelItem) => {
                if (channel.indexOf(channelItem) !== -1) {
                    newChannel = channelItem;

                }

            });
            // fbhb 渠道即为 facebook
            if (newChannel === 'fbhb') {
                newChannel = 'facebook';

            }
            // adomb 是拼写错误，即 admob
            if (newChannel !== 'adomb') {
                // 广告 placementID
                let placementID = adID;
                let bidding = false;

                if (headerBiddingHash[placementID]) {
                    placementID = headerBiddingHash[placementID];
                    bidding = true;

                }
                if (!ad_IDControlHashHash[groupName]) {
                    ad_IDControlHashHash[groupName] = {};

                }
                if (!ad_IDControlHashHash[groupName][adType]) {
                    ad_IDControlHashHash[groupName][adType] = [];

                }
                ad_IDControlHashHash[groupName][adType].push({
                    placementID, ecpm, loader, subloader, interval, weight, adChannel: newChannel, bidding
                });
            }
        }

    });

    return ad_IDControlHashHash;

}

// 获取 ab 分组哈希，键为 clientPackage xml读取的广告组，值为 ab 分组数组
async function getGroupWeightHash(XMLDir, project) {
    const groupWeightHash = {};    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml 读取的广告组，值为 ab 分组数组

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

    return groupWeightHash;

}

// 获取 版本条件分组版本范围哈希，键为 condition，值为开始范围
async function getConditionHash(XMLDir, project) {
    const conditionHash = {};    // condition xml 表读取的哈希表，键为 condition，值为开始范围
    // 默认组开始范围为 0
    conditionHash.default = 0;
    try {
        const conditionContrl = await _readXMLFile('Condition.xml', XMLDir, project);

        _.each(conditionContrl, (item) => {
            if (item.status) {
                conditionHash[item.key] = item.startVCode;

            }

        });

    } catch (e) { }

    return conditionHash;

}

// 创建 ab 测试分组表
async function createAdAbTestGroup(
    productId, versionGroupId, groupWeight, gameGroupWeight, adTypeHash, ad_IDControlHashHash,
    name = 'default', begin = -1, end = -1
) {
    // ab 测试分组表模型
    const AbTestGroupModel = model.abTestGroup;
    // 广告位表模型
    const AbTestMapModel = model.abTestMap;
    // native 模板配置组表模型
    const NativeTmplConfGroupModel = model.nativeTmplConfGroup;
    // 常量组表模型
    const ConfigGroupModel = model.configGroup;
    // 广告组表模型
    const AdGroupModel = model.adGroup;

    const { toGroup } = groupWeight;
    const { toGroup: configGroupName } = gameGroupWeight

    // 查找 native 模板配置组
    const nativeTmplConfGroupVo = await NativeTmplConfGroupModel.findOne({
        where: {
            name: toGroup, productId
        }
    });
    // 查找默认 native 模板配置组
    const defaultNativeTmplConfGroupVo = await NativeTmplConfGroupModel.findOne({
        where: {
            name: 'default', productId
        }
    });

    // 查找常量组
    const configGroupVo = await ConfigGroupModel.findOne({
        where: {
            name: configGroupName, type: 0, productId
        }
    });

    // 获取 native 模板配置组主键
    let nativeTmplConfGroupId = defaultNativeTmplConfGroupVo.id;
    if (!_.isEmpty(nativeTmplConfGroupVo)) {
        nativeTmplConfGroupId = nativeTmplConfGroupVo.id;

    }
    // 获取描述
    let description = name;
    if (description === 'default') {
        description = '默认组';

    }

    const abTestGroupVo = {
        name, begin, end, description,
        configGroupId: configGroupVo.id, nativeTmplConfGroupId, versionGroupId, active: 1
    }
    // 查找或创建 ab 测试分组
    const [currentAbTestGroupVo] = await AbTestGroupModel.findOrCreate({
        where: {
            name, versionGroupId
        }, defaults: abTestGroupVo
    });

    //  ab 测试分组主键
    const abTestGroupId = currentAbTestGroupVo.id;
    // 广告组下数据
    const ad_IDControlHash = ad_IDControlHashHash[toGroup];

    // 广告组和广告类型组合为新后台的新广告组
    if (!_.isEmpty(ad_IDControlHash)) {
        for (const adType in ad_IDControlHash) {
            // 广告组表中广告组名
            const name = toGroup + '_' + adType;
            // 广告类型表主键
            const adTypeId = adTypeHash[adType];
            // 查找或创建广告组
            const adGroupVo = await AdGroupModel.findOne({
                where: {
                    name, adTypeId, productId
                }
            });
            if (_.isEmpty(adGroupVo)) {
                console.log(`name: ${name}`);
                console.log(`productId: ${productId}`);
            }
            const adGroupId = adGroupVo.id;
            // 默认 ab 测试下的广告位信息
            const abTestMapVo = {
                place: adType, adGroupId, abTestGroupId, active: 1
            };
            await AbTestMapModel.create(abTestMapVo);

        }

    }

}

// 批量创建 ab 测试分组表
async function createAdAbTestGroupList(
    productId, versionGroupId, groupWeightList, gameGroupWeightList, adTypeHash, ad_IDControlHashHash
) {
    // 创建默认 ab 测试分组
    const defaultGroupWeight = groupWeightList.shift();
    const defaultGameGroupWeight = gameGroupWeightList.shift();
    await createAdAbTestGroup(
        productId, versionGroupId, defaultGroupWeight, defaultGameGroupWeight, adTypeHash, ad_IDControlHashHash
    );

    // 创建所有 ab 测试分组
    const groupNum = groupWeightList.length;
    if (groupNum > 1) {

        // 获取广告常量分组
        let gameGroupWeight = defaultGameGroupWeight;
        if (!_.isEmpty(gameGroupWeightList)) {
            gameGroupWeight = gameGroupWeightList[0];

        }

        // 分组后缀，默认最大 26 个字母
        const nameList = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        let begin = 1;
        let end = 100;
        const step = (end - begin + 1) / groupNum;
        // 分组左右均包含
        end = begin + step - 1;

        // 循环创建 ab 测试分组和 ab 测试分组下的广告位
        for (let i = 0; i < groupNum; i++) {
            const groupWeight = groupWeightList[i];
            const abTestGroupName = 'group_' + nameList[i];

            await createAdAbTestGroup(
                productId, versionGroupId, groupWeight, gameGroupWeight, adTypeHash,
                ad_IDControlHashHash, abTestGroupName, begin, end
            );

            // 范围叠加
            begin = end + 1;
            end += step;

        }

    }

}

// 创建游戏常量 ab 测试分组表
async function createConfigAbTestGroup(
    productId, versionGroupId, groupWeight, name = 'default', begin = -1, end = -1
) {
    // ab 测试分组表模型
    const AbTestGroupModel = model.abTestGroup;
    // 常量组表模型
    const ConfigGroupModel = model.configGroup;

    const { toGroup } = groupWeight;

    // 查找或创建常量组
    const configGroupVo = await ConfigGroupModel.findOne({
        where: {
            name: toGroup, type: 1, productId
        }
    });
    // 获取常量组主键
    let configGroupId = null;
    if (!_.isEmpty(configGroupVo)) {
        configGroupId = configGroupVo.id;

    }
    // 获取描述
    let description = name;
    if (description === 'default') {
        description = '默认组';

    }

    const abTestGroupVo = {
        name, begin, end, description,
        configGroupId, nativeTmplConfGroupId: undefined, versionGroupId, active: 1
    }
    // 创建 ab 测试分组
    await AbTestGroupModel.create(abTestGroupVo);

}

// 批量创建游戏常量 ab 测试分组表
async function createConfigAbTestGroupList(productId, versionGroupId, groupWeightList) {
    // 创建默认 ab 测试分组
    const defaultGroupWeight = groupWeightList.shift();
    await createConfigAbTestGroup(productId, versionGroupId, defaultGroupWeight);

    // 创建所有 ab 测试分组
    const groupNum = groupWeightList.length;
    if (groupNum > 1) {
        // 分组后缀，默认最大 26 个字母
        const nameList = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        let begin = 1;
        let end = 100;
        const step = (end - begin + 1) / groupNum;
        // 分组左右均包含
        end = begin + step - 1;

        // 循环创建 ab 测试分组和 ab 测试分组下的广告位
        for (let i = 0; i < groupNum; i++) {
            const abTestGroupName = 'group_' + nameList[i];
            const groupWeight = groupWeightList[i];

            await createConfigAbTestGroup(
                productId, versionGroupId, groupWeight, abTestGroupName, begin, end
            );

            // 范围叠加
            begin = end + 1;
            end += step;

        }

    }

}

// 导入广告版本条件分组
async function readAdVersionGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readAdVersionGroup()');

    // 版本条件分组表模型
    const VersionGroupModel = model.versionGroup;

    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 广告 xml 表读取的哈希表，键为广告组，值为广告数据
    const ad_IDControlHashHash = await getAd_IDControlHash(XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的广告组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // condition xml 表读取的哈希表，获取 版本条件分组版本范围哈希，键为 condition，值为开始范围
    const conditionHash = await getConditionHash(XMLDir, project);
    // ClientPackage xml 表读取的版本条件分组哈希
    const { adVersionGroupHashHash, gameVersionGroupHashHash }
        = await getVersionGroupHash(clientPackage, productNameHashHash);

    // 获取所有的广告类型哈希表
    const adTypeHash = await getAdTypeHash();

    // 应用主键列表
    const productIdList = _.keys(adVersionGroupHashHash);

    // 遍历应用
    for (const productId of productIdList) {
        const conditionList = _.keys(adVersionGroupHashHash[productId]);

        // 遍历版本
        for (const condition of conditionList) {
            const groupNameList = _.keys(adVersionGroupHashHash[productId][condition]);

            const configGroupName = gameVersionGroupHashHash[productId][condition];
            if (!configGroupName) {
                console.log('productId: ', productId);
                console.log('condition: ', condition);

            }

            const gameGroupWeightList = (_.cloneDeep(groupWeightHash[configGroupName])) || [{
                toGroup: configGroupName,
                weightGroup: '-1'
            }];
            // 遍历 ab 分组
            for (let groupName of groupNameList) {
                // xml 表中未配置，则取默认值
                // 克隆数组，后面更改了数组
                const groupWeightList = (_.cloneDeep(groupWeightHash[groupName])) || [{
                    toGroup: groupName,
                    weightGroup: '-1'
                }];

                let nationCodeList = _.cloneDeep(adVersionGroupHashHash[productId][condition][groupName]);
                const name = `${condition}_${groupName}`;
                const description = name;
                const begin = conditionHash[condition] || conditionHash['default'];

                // 存在 null，表示存在没有国家分组
                if (_.indexOf(nationCodeList, null) !== -1) {
                    nationCodeList = _.compact(nationCodeList);

                    // 版本条件分组表对象
                    const noVersionGroupVo = {
                        name: name + `_native`, begin, description, type: 0,
                        code: '[]', include: 1, productId, active: 1
                    };

                    if (condition === 'default') {
                        noVersionGroupVo.name = 'default';
                        noVersionGroupVo.description = '默认组';

                    }

                    if (!noVersionGroupVo.name) {
                        console.log('noVersionGroupVo: ', noVersionGroupVo);
                    }

                    // 查找或创建版本条件分组
                    const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
                        where: {
                            name: noVersionGroupVo.name, type: 0, productId
                        }, defaults: noVersionGroupVo
                    });

                    // 如果首次，则创建广告
                    if (created) {
                        const versionGroupId = currentVersionGroupVo.id;

                        await createAdAbTestGroupList(
                            productId, versionGroupId, _.cloneDeep(groupWeightList),
                            _.cloneDeep(gameGroupWeightList), adTypeHash, ad_IDControlHashHash
                        );

                    }

                }

                if (!_.isEmpty(nationCodeList)) {
                    // 版本条件分组的国家代码列表 json 字符串
                    const code = JSON.stringify(nationCodeList);

                    // 版本条件分组表对象
                    const versionGroupVo = {
                        name, begin, description, type: 0, code, include: 1, productId, active: 1
                    };
                    if (!name) {
                        console.log('versionGroupVo: ', versionGroupVo);
                    }
                    // 查找或创建版本条件分组
                    const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
                        where: {
                            name, type: 0, productId
                        }, defaults: versionGroupVo
                    });

                    // 如果首次，则创建广告
                    if (created) {
                        const versionGroupId = currentVersionGroupVo.id;

                        await createAdAbTestGroupList(
                            productId, versionGroupId, _.cloneDeep(groupWeightList), _.cloneDeep(gameGroupWeightList),
                            adTypeHash, ad_IDControlHashHash
                        );

                    }

                }

            }

        }

    }

}

// 导入游戏常量版本条件分组
async function readConfigVersionGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readConfigVersionGroup()');

    // 版本条件分组表模型
    const VersionGroupModel = model.versionGroup;

    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的广告组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // condition xml 表读取的哈希表，获取 版本条件分组版本范围哈希，键为 condition，值为开始范围
    const conditionHash = await getConditionHash(XMLDir, project);
    // ClientPackage xml 表读取的广告版本条件分组哈希
    const { gameVersionGroupHashHash } = await getVersionGroupHash(clientPackage, productNameHashHash);

    // 应用主键列表
    const productIdList = _.keys(gameVersionGroupHashHash);

    // 遍历应用
    for (const productId of productIdList) {
        const conditionList = _.keys(gameVersionGroupHashHash[productId]);

        // 遍历版本
        for (const condition of conditionList) {
            const configGroupName = gameVersionGroupHashHash[productId][condition];
            // xml 表中未配置，则取默认值
            // 克隆数组，后面更改了数组
            const groupWeightList = (_.cloneDeep(groupWeightHash[configGroupName])) || [{
                toGroup: configGroupName,
                weightGroup: '-1'
            }];

            let name = `${condition}`;
            let description = name;
            const begin = conditionHash[condition] || conditionHash['default'];

            if (condition === 'default') {
                name = 'default';
                description = '默认组';

            }

            // 版本条件分组表对象
            const versionGroupVo = {
                name, begin, description, type: 1, code: '[]', include: 1, productId, active: 1
            };
            // 查找或创建版本条件分组
            const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
                where: {
                    name, type: 1, productId
                }, defaults: versionGroupVo
            });

            // 如果首次，则创建广告
            if (created) {
                const versionGroupId = currentVersionGroupVo.id;
                await createConfigAbTestGroupList(productId, versionGroupId, _.cloneDeep(groupWeightList));

            }

        }

    }

}

// 导入广告版本条件分组
async function testVersionGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readAdVersionGroup()');

    // 版本条件分组表模型
    const VersionGroupModel = model.versionGroup;

    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 广告 xml 表读取的哈希表，键为广告组，值为广告数据
    const ad_IDControlHashHash = await getAd_IDControlHash(XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的广告组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // condition xml 表读取的哈希表，获取 版本条件分组版本范围哈希，键为 condition，值为开始范围
    const conditionHash = await getConditionHash(XMLDir, project);
    // ClientPackage xml 表读取的版本条件分组哈希
    const { adVersionGroupHashHash, gameVersionGroupHashHash }
        = await getVersionGroupHash(clientPackage, productNameHashHash);

    // 获取所有的广告类型哈希表
    const adTypeHash = await getAdTypeHash();

    // 应用主键列表
    const productIdList = _.keys(adVersionGroupHashHash);

    // 遍历应用
    for (const productId of productIdList) {
        const conditionList = _.keys(adVersionGroupHashHash[productId]);

        // 遍历版本
        for (const condition of conditionList) {
            const groupNameList = _.keys(adVersionGroupHashHash[productId][condition]);
            const configGroupNameList = gameVersionGroupHashHash[productId][condition];


            const gameGroupWeightList = (_.cloneDeep(groupWeightHash[configGroupName])) || [{
                toGroup: configGroupName,
                weightGroup: '-1'
            }];
            // 遍历 ab 分组
            for (let groupName of groupNameList) {
                // xml 表中未配置，则取默认值
                // 克隆数组，后面更改了数组
                const groupWeightList = (_.cloneDeep(groupWeightHash[groupName])) || [{
                    toGroup: groupName,
                    weightGroup: '-1'
                }];

                let nationCodeList = _.cloneDeep(adVersionGroupHashHash[productId][condition][groupName]);
                const name = `${condition}_${groupName}`;
                const description = name;
                const begin = conditionHash[condition] || conditionHash['default'];

                // 存在 null，表示存在没有国家分组
                if (_.indexOf(nationCodeList, null) !== -1) {
                    nationCodeList = _.compact(nationCodeList);

                    // 版本条件分组表对象
                    const noVersionGroupVo = {
                        name: name + `_native`, begin, description, type: 0,
                        code: '[]', include: 1, productId, active: 1
                    };

                    if (condition === 'default') {
                        noVersionGroupVo.name = 'default';
                        noVersionGroupVo.description = '默认组';

                    }

                    if (!noVersionGroupVo.name) {
                        console.log('noVersionGroupVo: ', noVersionGroupVo);
                    }

                    // 查找或创建版本条件分组
                    const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
                        where: {
                            name: noVersionGroupVo.name, type: 0, productId
                        }, defaults: noVersionGroupVo
                    });

                    // 如果首次，则创建广告
                    if (created) {
                        const versionGroupId = currentVersionGroupVo.id;

                        await createAdAbTestGroupList(
                            productId, versionGroupId, _.cloneDeep(groupWeightList),
                            _.cloneDeep(gameGroupWeightList), adTypeHash, ad_IDControlHashHash
                        );

                    }

                }

                if (!_.isEmpty(nationCodeList)) {
                    // 版本条件分组的国家代码列表 json 字符串
                    const code = JSON.stringify(nationCodeList);

                    // 版本条件分组表对象
                    const versionGroupVo = {
                        name, begin, description, type: 0, code, include: 1, productId, active: 1
                    };
                    if (!name) {
                        console.log('versionGroupVo: ', versionGroupVo);
                    }
                    // 查找或创建版本条件分组
                    const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
                        where: {
                            name, type: 0, productId
                        }, defaults: versionGroupVo
                    });

                    // 如果首次，则创建广告
                    if (created) {
                        const versionGroupId = currentVersionGroupVo.id;

                        await createAdAbTestGroupList(
                            productId, versionGroupId, _.cloneDeep(groupWeightList), _.cloneDeep(gameGroupWeightList),
                            adTypeHash, ad_IDControlHashHash
                        );

                    }

                }

            }

        }

    }

}

module.exports = {
    readConfigVersionGroup,
    readAdVersionGroup
};