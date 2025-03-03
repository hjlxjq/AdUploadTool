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

// 获取广告名称哈希表
async function getAdNameHash(DefineDir) {
    const admobDataList = await _readCSVFile('admob.csv', DefineDir);
    const facebookDataList = await _readCSVFile('facebookPlacement.csv', DefineDir);
    const tiktokDataList = await _readCSVFile('tiktokPlacement.csv', DefineDir);

    // 广告名称哈希表，键为广告平台，值为广告 placementId 对应 广告名称的哈希表
    const adNameHashHash = {};
    if (!adNameHashHash['admob']) {
        adNameHashHash['admob'] = {};

    }
    if (!adNameHashHash['facebook']) {
        adNameHashHash['facebook'] = {};

    }
    if (!adNameHashHash['tiktok']) {
        adNameHashHash['tiktok'] = {};

    }

    _.each(admobDataList, (admobData) => {
        const { siteName, placementId, status } = admobData;
        // 只处理生效的
        if (status) {
            adNameHashHash['admob'][placementId] = siteName;

        }

    });
    _.each(facebookDataList, (facebookData) => {
        const { siteName, placementId, status } = facebookData;
        // 只处理生效的
        if (status) {
            adNameHashHash['facebook'][placementId] = siteName;

        }

    });
    _.each(tiktokDataList, (tiktokData) => {
        const { siteName, placementId, status } = tiktokData;

        if (status) {
            adNameHashHash['tiktok'][placementId] = siteName;

        }

    });
    return adNameHashHash;

}

// 根据 平台和包名获取应用在数据里的主键
async function getProductId(platform, packageName) {
    // sequelize 数据库 model
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
    // 广告类型模型，sequelize 数据库 model
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

// 获取所有的广告平台哈希表
async function getAdChannelHash() {
    // 广告平台模型，sequelize 数据库 model
    const AdChannelModel = model.adChannel;

    const adChannelVoList = await AdChannelModel.findAll();

    // 广告平台哈希表，键为广告平台，值为数据库广告平台表主键
    const adChannelHash = {};

    _.each(adChannelVoList, (adChannelVo) => {
        const { id, channel } = adChannelVo;
        adChannelHash[channel] = id;

    });
    return adChannelHash;

}

// 获取广告组哈希，键为广告组，值为广告数据对象列表
async function getAd_IDControlHash(XMLDir, project) {
    const ad_IDControlHashHash = {};    // 广告 xml 表读取的哈希表，键为广告组，值为广告数据
    const headerBiddingHash = {};    // bidding xml 表读取的哈希表，键为 hbkey，值为 placementID

    try {
        const headerBidding_ID = await _readXMLFile('HeaderBidding_ID.xml', XMLDir, project);

        _.each(headerBidding_ID, (item) => {
            // 只处理生效的
            if (item.status) {
                headerBiddingHash[item.hbkey] = item.placementID;

            }

        });

    } catch (e) { }

    const ad_IDControl = await _readXMLFile('Ad_IDControl.xml', XMLDir, project);

    _.each(ad_IDControl, (item) => {
        // 只处理生效的
        if (item.status) {
            const {
                groupName, adID, ecpm, loader, subloader, interval, weight
            } = item;

            // 广告类型和广告平台均为小写
            const channel = item.channel.toLowerCase();
            const adType = item.adType.toLowerCase();
            // 忽略广告平台后面的数字
            const newChannel = channel.replace(/\d+$/, '');

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
                    ad_IDControlHashHash[groupName][adType] = {};

                }
                if (!ad_IDControlHashHash[groupName][adType][newChannel]) {
                    ad_IDControlHashHash[groupName][adType][newChannel] = [];

                }
                ad_IDControlHashHash[groupName][adType][newChannel].push({
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
            // 只处理生效的
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

// 批量创建广告组下广告
async function createAd(
    adGroupId, adTypeId, productId, adChannelHash, adDataHash, adNameHashHash
) {
    // sequelize 数据库 model
    const AdModel = model.ad;    // 广告表模型

    // 广告渠道列表
    const adChannelList = _.keys(adDataHash);

    // 批量创建广告
    for (const adChannel of adChannelList) {
        // 渠道下的广告列表
        const adDataList = adDataHash[adChannel];
        // 同渠道下名称不相同
        const nameList = [];

        for (const adData of adDataList) {
            const { placementID, ecpm, loader, subloader, interval, weight, adChannel, bidding } = adData;

            const adChannelId = adChannelHash[adChannel];
            if (!adChannelId) {
                console.log(`adChannel: ${adChannel}`);

            }
            let name = placementID;

            if (adChannel === 'unity') {
                const placementIDArr = _.split(placementID, '$');
                name = placementIDArr[placementIDArr.length - 1];

            }

            let newChannel = adChannel;
            if (adChannel === 'fullfacebook' || adChannel === 'fbhb' || adChannel === 'fullfbhb') {
                newChannel = 'facebook';

            }
            if (adChannel === 'admob-mediation') {
                newChannel = 'admob';

            }
            if (!_.isEmpty(adNameHashHash[newChannel]) && adNameHashHash[newChannel][placementID]) {
                name = adNameHashHash[newChannel][placementID];

            }
            // 广告名称唯一
            if (_.indexOf(nameList, name) === -1) {
                nameList.push(name);

                // 广告名称存在，则直接使用广告 ID
            } else {
                name = placementID;

            }
            const adVo = {
                name, placementID, ecpm, loader, subloader, interval, weight, bidding,
                adChannelId, adTypeId, adGroupId, productId, active: 1
            };

            try {
                await AdModel.create(adVo);

            } catch (e) {
                if (e.name !== 'SequelizeUniqueConstraintError') {
                    console.log('adVo: ', adVo);
                    throw e;
                }

            }

        }

    }

}

// 导入 广告组和广告
async function readAdGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readAdGroup()');

    // 广告组表模型，sequelize 数据库 model
    const AdGroupModel = model.adGroup;

    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 广告名称哈希表，键为广告平台，值为广告 placementId 对应 广告名称的哈希表
    const adNameHashHash = await getAdNameHash(DefineDir);
    // 广告 xml 表读取的哈希表，键为广告组，值为广告数据
    const ad_IDControlHashHash = await getAd_IDControlHash(XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的广告组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // 获取所有的广告类型哈希表
    const adTypeHash = await getAdTypeHash();
    // 获取所有的广告平台哈希表
    const adChannelHash = await getAdChannelHash();

    // 不存在的广告组
    const adGroupNameList = [];

    // 创建所有广告组和广告组下广告
    for (const item of clientPackage) {
        // 不处理生效的
        if (!item.status) continue;

        let packageName = item.packageName;
        const { device, groupName } = item;

        // 纸牌有个例外的包名
        if (packageName !== 'Classic-5xing') {
            const packageNameArr = _.split(packageName, '-');
            if (packageNameArr.length > 1) {
                packageNameArr.pop();

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

        // 获取应用主键
        const productId = await getProductId(device, packageName);

        // xml 表中未配置，则取默认值
        const groupWeightList = groupWeightHash[groupName] || [{
            toGroup: groupName,
            weightGroup: '-1'
        }];

        // 循环 ab 分组创建广告组和广告
        for (const groupWeight of groupWeightList) {
            const adGroupName = groupWeight.toGroup;

            if (adGroupName === 'null') {
                continue;

            }
            // 广告组下数据
            const ad_IDControlHash = ad_IDControlHashHash[adGroupName];
            // 广告组和广告类型组合为新后台的新广告组
            if (!_.isEmpty(ad_IDControlHash)) {
                for (const adType in ad_IDControlHash) {
                    // 广告组表中广告组名
                    const name = adGroupName + '_' + adType;
                    // 广告类型表主键
                    const adTypeId = adTypeHash[adType];

                    // 数据库广告组表对象
                    const adGroupVo = {
                        name, description: name, adTypeId, productId, active: 1
                    };

                    // 查找或创建广告组
                    const [currentAdGroupVo, created] = await AdGroupModel.findOrCreate({
                        where: {
                            name, adTypeId, productId
                        }, defaults: adGroupVo
                    });

                    // 如果首次，则创建广告
                    if (created) {
                        const adDataHash = ad_IDControlHash[adType];
                        const currentAdGroupId = currentAdGroupVo.id;
                        await createAd(
                            currentAdGroupId, adTypeId, productId, adChannelHash, adDataHash, adNameHashHash
                        );
                    }
                }

            } else {
                adGroupNameList.push(adGroupName);

            }

        }

    }
    console.log('adGroupNameList uniq name：' + _.uniq(adGroupNameList));

}

module.exports = {
    readAdGroup
};