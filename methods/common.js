/**
 * 导入 adType, adChannel, nativeTmpl, baseConfig, nativeShop 五张表
 */
const _ = require('lodash');
const bluebird = require('bluebird');
const _readXMLFile = require('../tools/excelXMLutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const model = require('../tools/model');

// 默认图片地址
const defaultPreview = 'http://adtest.weplayer.cc/opt/upload/preview/1/upload_8635bd7ad2b69b8627d79f33705238c1.jpg';

// 创建广告平台和广告类型
async function readChannelAndType(XMLDir, project) {
    console.log('begin execute function: readChannelAndType()');

    // sequelize 数据库 model
    const AdTypeModel = model.adType;
    const AdChannelModel = model.adChannel;

    // 解析广告
    const Ad_IDControl = await _readXMLFile('Ad_IDControl.xml', XMLDir, project);
    // 解析产品
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    // 解析 ab 分组，有些项目未配置 ab 分组
    let groupWeightContrl = [];
    try {
        groupWeightContrl = await _readXMLFile('GroupWeightContrl.xml', XMLDir, project);

    } catch (e) {
        groupWeightContrl = [];

    }
    const groupWeightContrlHash = {};    // ab 分组 哈希，key 为需要分组的 groupName, value 为 ab 分组对象列表
    _.each(groupWeightContrl, (item) => {
        // 只处理生效的
        if (item.status) {
            if (!groupWeightContrlHash[item.key]) {
                groupWeightContrlHash[item.key] = [];

            }
            groupWeightContrlHash[item.key].push({
                toGroup: item.toGroup,
                weightGroup: item.weightGroup
            });

        }

    });

    // 线上生效的广告组
    let adGroupNameList = [];
    _.each(clientPackage, (item) => {
        if (item.status) {
            const key = item.groupName;
            if (!groupWeightContrlHash[key]) {
                adGroupNameList.push(key);

            } else {
                _.each(groupWeightContrlHash[key], (subItem) => {
                    adGroupNameList.push(subItem.toGroup);
                });
            }
        }

    });
    adGroupNameList = _.uniq(adGroupNameList);    // 消除重复组，不同应用可能存在相同的 组（key）

    const channels = [];    // 广告平台列表
    const adTypes = [];    // 广告类型

    await bluebird.map(Ad_IDControl, async (item) => {
        // 不处理关闭项
        if (!item.status) return;
        // 不处理无用项
        if (adGroupNameList.indexOf(item.groupName) === -1) return;

        // 广告渠道和类型均小写
        let channel = item.channel.toLowerCase();
        let adType = item.adType.toLowerCase();

        adTypes.push(adType);

        const channelList = [
            'facebook', 'unity', 'aol', 'fbhb', 'admob', 'mopub', 'tiktok', 'vungle', 'applovin',
            'ironsource', 'mobvista', 'fyber', 'tapjoy', 'chartboost', 'inmobi', 'adcolony',
        ];

        // 忽略广告平台后面的数字
        channel = channel.replace(/\d+$/, '');
        // _.each(channelList, (channelItem) => {
        //     if (channel.indexOf(channelItem) !== -1) {
        //         channel = channelItem;

        //     }

        // });
        // fbhb 渠道即为 facebook
        // if (channel === 'fbhb') {
        //     channel = 'facebook';

        // }
        // adomb 是拼写错误，即 admob
        if (channel !== 'adomb') {
            channels.push(channel);

        }

    }, { concurrency: 2 });

    console.log('channelList：' + _.uniq(channels));

    // 保存广告类型
    for (const type of adTypes) {
        let name = type;
        // 广告类型显示名称
        if (type === 'native') {
            name = '原生';

        }
        if (type === 'interstitial') {
            name = '插屏';

        }
        if (type === 'banner') {
            name = '横幅';

        }
        if (type === 'rewardvideo') {
            name = '激励视频';

        }

        const adTypeVo = {
            type, name, test: 0, active: 1
        };

        try {
            await AdTypeModel.create(adTypeVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }
    // 保存广告平台
    for (const channel of channels) {
        const adChannelVo = {
            channel, key1: undefined, key2: undefined, key3: undefined, test: 0, active: 1
        };

        try {
            await AdChannelModel.create(adChannelVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }

}

// 创建常规配置 native 模板
async function readNativeTmpl(XMLDir, project) {
    console.log('begin execute function: readNativeTmpl()');

    // sequelize 数据库 model
    const NativeTmplModel = model.nativeTmpl;

    // 解析 native 模板，模板不存在，直接返回不处理
    let nativeAdTemplate = [];
    try {
        nativeAdTemplate = await _readXMLFile('NativeAdTemplate.xml', XMLDir, project);

    } catch (e) {
        return;

    }
    // 模板编号列表
    const keyList = [];

    _.each(nativeAdTemplate, async (item) => {
        // 不处理关闭项
        if (!item.status) return;

        keyList.push(item.key);

    });
    console.log('nativeAdTemplate uniq total keys：' + _.uniq(keyList));

    // 保存 native 模板
    for (const key of keyList) {
        const nativeTmplVo = {
            key, preview: defaultPreview, test: 0, active: 1
        };

        try {
            await NativeTmplModel.create(nativeTmplVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }

}

// 创建常规配置基础常量
async function readBaseConfig(DefineDir) {
    console.log('begin execute function: readBaseConfig()');

    // sequelize 数据库 model
    const BaseConfigModel = model.baseConfig;

    // 解析基础常量
    const baseConfigList = await _readXLSXFile('常规常量.xlsx', DefineDir);

    // 保存基础常量
    for (const baseConfig of baseConfigList) {
        const { key, value, 描述 } = baseConfig;

        let newValue = value;
        if (_.isUndefined(value)) {
            newValue = '';
        }


        // 基础常量对象
        const baseConfigVo = {
            key, value: newValue, description: 描述, test: 0, active: 1
        };

        try {
            await BaseConfigModel.create(baseConfigVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }

}

// 通用内购字段表
async function readNativeShop(DefineDir) {
    console.log('begin execute function: readNativeShop()');
    // sequelize 数据库 model
    const NativeShopModel = model.nativeShop;    // 通用内购字段表模型

    // 解析通用内购字段
    const nativeShopList = await _readXLSXFile('nativeShop.xlsx', DefineDir);

    // 保存通用内购字段
    for (const nativeShop of nativeShopList) {
        const { type, key, description } = nativeShop;

        // 通用内购字段对象
        const nativeShopVo = {
            key, type, description, active: 1
        };

        try {
            await NativeShopModel.create(nativeShopVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }


}

module.exports = {
    readChannelAndType,
    readNativeTmpl,
    readBaseConfig,
    readNativeShop
};
