/**
 * 导入商品组合商品
 */
const _ = require('lodash');
const _readXMLFile = require('../tools/excelXMLutils');
const _readXMLHeader = require('../tools/excelXMLHeader');
const _readCSVHeader = require('../tools/excelCSVHeader');
const _readCSVFile = require('../tools/excelCSVutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const model = require('../tools/model');
const Bluebird = require('bluebird');

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

// 获取所有的通用内购字段哈希表
async function getNativeShopHash() {
    // 通用内购字段模型
    const NativeShopModel = model.nativeShop;

    const nativeShopVoList = await NativeShopModel.findAll();

    // 通用内购字段哈希表，键为通用内购字段，值为数据库通用内购字段表主键
    const nativeShopHash = {};

    _.each(nativeShopVoList, (nativeShopVo) => {
        const { id, key } = nativeShopVo;
        nativeShopHash[key] = id;

    });
    return nativeShopHash;

}

// 获取所有的自定义内购字段哈希表
async function getCustomShopHash(productId) {
    // 自定义内购字段模型
    const CustomShopModel = model.customShop;

    const customShopVoList = await CustomShopModel.findAll({
        where: {
            productId
        }
    });

    // 自定义内购字段哈希表，键为自定义内购字段，值为数据库自定义内购字段表主键
    const customShopHash = {};

    _.each(customShopVoList, (customShopVo) => {
        const { id, key } = customShopVo;
        customShopHash[key] = id;

    });
    return customShopHash;

}

// 获取自定义内购字段对象列表
async function getShopList(XMLDir, project) {
    // 自定义内购字段对象列表
    let shopVoList = [];

    let shopList;
    let iapProductList;

    try {
        shopList = await _readXMLHeader('shop.xml', XMLDir, project);
        iapProductList = await _readXMLHeader('iapProduct.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        shopList = await _readCSVHeader('shop.csv', XMLDir, project);
        iapProductList = await _readCSVHeader('iapProduct.csv', XMLDir, project);

    }

    shopVoList = _.concat(shopList, iapProductList);

    const nativeShopVoList = [
        {
            key: "name",
            type: "string"
        },
        {
            key: "payId",
            type: "string"
        },
        {
            key: "price",
            "type": "number"
        },
        {
            key: "key",
            type: "string"
        },
        {
            key: "status",
            type: "boolean"
        },
        {
            key: "platform",
            type: "string"
        }
    ];

    _.pullAllWith(shopVoList, nativeShopVoList, _.isEqual);

    return shopVoList;

}

// 获取商品组哈希，键为商品组，值为商品数据
async function getShopListHash(XMLDir, project) {
    // shop xml 表读取的哈希表，键为商品组，值为商品数据
    const shopHashHash = {};
    const shopListHash = {};

    let shop;

    try {
        // 读取 shop xml 表
        shop = await _readXMLFile('shop.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        // 读取 shop csv 表
        shop = await _readCSVFile('shop.csv', XMLDir, project);

    }

    _.each(shop, (item) => {
        if (item.status) {
            const { key, name } = item;

            const attr = _.omit(item, ['key', 'status']);

            if (!shopHashHash[key]) {
                shopHashHash[key] = {};

            }
            shopHashHash[key][name] = attr;
        }

    });

    const keys = _.keys(shopHashHash);

    for (const key of keys) {
        const shopHash = shopHashHash[key];
        const shopList = _.values(shopHash);
        shopListHash[key] = shopList;

    }

    return shopListHash;

}

// 获取内购哈希，键为平台，值为内购数据哈希
async function getIapProductHashHash(XMLDir, project) {
    // iapProduct xml 表读取的哈希表，键为平台，值为内购数据哈希
    const iapProductHashHash = {};

    let iapProduct;

    try {
        // 读取 iapProduct xml 表
        iapProduct = await _readXMLFile('iapProduct.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        // 读取 iapProduct csv 表
        iapProduct = await _readCSVFile('iapProduct.csv', XMLDir, project);

    }

    _.each(iapProduct, (item) => {
        if (item.status) {
            const { payId, platform } = item;
            const attr = _.omit(item, ['payId', 'platform', 'status']);

            if (!iapProductHashHash[platform]) {
                iapProductHashHash[platform] = {};

            }
            iapProductHashHash[platform][payId] = attr;
        }

    });

    return iapProductHashHash;

}

// 获取 ab 分组哈希，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组
async function getGroupWeightHash(XMLDir, project) {
    const groupWeightHash = {};    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组

    let groupWeightContrl;

    try {
        // 读取 groupContrl xml 表
        groupWeightContrl = await _readXMLFile('groupContrl.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        // 读取 groupContrl csv 表
        groupWeightContrl = await _readCSVFile('groupContrl.csv', XMLDir, project);

    }

    _.each(groupWeightContrl, (item) => {
        if (item.status) {
            if (!groupWeightHash[item.key]) {
                groupWeightHash[item.key] = [];

            }
            groupWeightHash[item.key].push({
                toGroup: item.toGroup,
                weightGroup: String(item.index)
            });
        }

    });

    return groupWeightHash;

}

// 批量创建商品组下商品
async function createGoods(
    productId, goodsGroupId, iapProductHash, shopList, nativeShopHash, customShopHash
) {
    const GoodsModel = model.goods;    //商品表模型
    const GoodsMapModel = model.goodsMap;    //商品映射表模型

    // 批量创建商品
    for (const shop of shopList) {
        _.assign(shop, iapProductHash[shop.payId]);

        const goodsVo = {
            goodsGroupId, productId, active: 1
        };

        try {
            const currentGoodsVo = await GoodsModel.create(goodsVo);

            if (!_.isEmpty(currentGoodsVo)) {
                const goodsId = currentGoodsVo.id;
                const keys = _.keys(shop);

                await Bluebird.map(keys, async (key) => {
                    let shopId = nativeShopHash[key];
                    if (!shopId) {
                        shopId = customShopHash[key];

                    }
                    if (!shopId) {
                        console.log(`key: ${key}`);

                    }
                    let value = shop[key];

                    if (value === false) {
                        value = '0';

                    }
                    else if (value === false) {
                        value = '1';

                    }
                    else {
                        value = String(value);

                    }
                    const goodsMapVo = {
                        value, shopId, goodsId, productId
                    };

                    await GoodsMapModel.create(goodsMapVo);

                }, { concurrency: 3 });


            }

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }

}

// 导入自定义内购字段
async function readCustomShop(DefineDir, XMLDir, project) {
    console.log('begin execute function: readCustomShop()');

    // 自定义内购字段表模型
    const CustomShopModel = model.customShop;

    let clientPackage;

    try {
        // 读取 ClientPackage xml 表
        clientPackage = await _readXMLFile('clientPackage.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        // 读取 ClientPackage csv 表
        clientPackage = await _readCSVFile('clientPackage.csv', XMLDir, project);

    }
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 获取自定义内购字段对象列表
    const shopList = await getShopList(XMLDir, project);

    // 没有描述自定义内购字段列表
    const shopNameList = [];

    // 创建获取自定义内购字段表
    for (const item of clientPackage) {
        if (!item.status) continue;

        const { packageName, device, shopGroup } = item;

        if (shopGroup === 'null') continue;

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

        // 循环向数据库自定义内购字段表对象添加应用表主键和描述
        for (const shop of shopList) {
            const { key, type } = shop;
            let description = key;

            if (key === 'type') {
                description = '类型表示商品类型，1普通,2一次,3限时,4存钱罐,5周卡,6闯关助手礼包1,7闯关助手礼包2,8闯关助手礼包3';

            }
            else if (key === 'file') {
                description = '用于展示图标的名称';

            }
            else if (key === 'order') {
                description = '排序使用';

            }
            else if (key === 'sign') {
                description = '0表示无标识,1标识热销hot,2标识最好best。项目组可以自己定义具体含义';

            }
            else if (key === 'desc') {
                description = '用于描述信息';

            }
            else if (key === 'discount') {
                description = '折扣比例 0-100';

            }
            else if (key === 'count') {
                description = '购买后对应获得物品数量';

            }
            else if (key === 'obtain') {
                description = '用于定义购买商品后,玩家获取的游戏内道具。如：1金币2普通提示；3可选提示。1|200;2|10;3|1 表示购买该商品获得200个金币,10个免费提示道具1和1个免费提示道具2';

            }
            else if (key === 'cVersion') {
                description = '控制该商品从哪个版本开始展示，当客户端版本大于等于该值的时候，会收到这个商品的信息';

            }
            else if (key === 'ad') {
                description = 'TRUE/FALSE是否带去广告功能';

            }
            else if (key === 'timer') {
                description = '限时倒计时,-1表示永久';

            }
            else if (key === 'typeSingle') {
                description = '类型[0非一次性商品,1一次性商品]';

            }
            else if (key === 'gIndex') {
                description = '商品组排序标识，替换，从0开始，当一组中的一个商品被购买且下一组商品存在，切换到下一组商品';

            }
            else if (key === 'custom1') {
                description = '自定义字段，项目组可以根据自己的需要来设置这个字段';

            }
            else if (key === 'custom2') {
                description = '自定义字段，项目组可以根据自己的需要来设置这个字段';

            }
            else if (key === 'consumable') {
                description = '0是消耗品,1是非消耗品,2是订购商品';

            }
            else if (key === 'userTag') {
                description = '用户标签';

            }
            else {
                shopNameList.push(key);

            }

            const shopVo = { key, type, description, productId, active: 1 };

            try {
                if (!_.isEmpty(shopVo)) {
                    await CustomShopModel.create(shopVo);

                }

            } catch (e) {
                if (e.name !== 'SequelizeUniqueConstraintError') {
                    throw e;

                }

            }

        }

    }
    console.log('shopNameList uniq name：' + _.uniq(shopNameList));

}

// 导入商品组和商品
async function readGoodsGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readGoodsGroup()');

    //商品组表模型
    const GoodsGroupModel = model.goodsGroup;

    let clientPackage;

    try {
        // 读取 ClientPackage xml 表
        clientPackage = await _readXMLFile('clientPackage.xml', XMLDir, project);

    } catch (e) {
        // console.log(e);
        // 读取 ClientPackage csv 表
        clientPackage = await _readCSVFile('clientPackage.csv', XMLDir, project);

    }
    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 获取商品组哈希，键为商品组，值为商品数据
    const shopListHash = await getShopListHash(XMLDir, project);
    // 获取内购哈希，键为平台，值为内购数据哈希
    const iapProductHashHash = await getIapProductHashHash(XMLDir, project);
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // 获取所有的通用内购字段哈希表
    const nativeShopHash = await getNativeShopHash();

    // 不存在的商品组
    const goodsGroupNameList = [];

    // 创建所有商品组和商品组下商品
    for (const item of clientPackage) {
        if (!item.status) continue;

        const { packageName, device, shopGroup } = item;

        if (shopGroup === 'null') continue;

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

        // 获取所有的自定义内购字段哈希表
        const customShopHash = await getCustomShopHash(productId);

        // xml 表中未配置，则取默认值
        const groupWeightList = groupWeightHash[shopGroup] || [{
            toGroup: shopGroup,
            weightGroup: '-1'
        }];

        // 循环 ab 分组,创建商品组和商品
        for (const groupWeight of groupWeightList) {
            const goodsGroupName = groupWeight.toGroup;

            const shopList = shopListHash[goodsGroupName];

            if (!_.isEmpty(shopList)) {
                // 数据库商品组表对象
                const goodsGroupVo = {
                    name: goodsGroupName, description: goodsGroupName, productId, active: 1
                };

                // 查找或创建商品组
                const [currentGoodsGroupVo, created] = await GoodsGroupModel.findOrCreate({
                    where: {
                        name: goodsGroupName, productId
                    }, defaults: goodsGroupVo
                });

                // 如果首次，则创建商品
                if (created) {
                    const currentGoodsGroupId = currentGoodsGroupVo.id;

                    if (goodsGroupName === 'swipeDEios') {
                        console.log('shopList length: ', shopList.length);

                    }

                    await createGoods(
                        productId, currentGoodsGroupId, iapProductHashHash[device], shopList,
                        nativeShopHash, customShopHash
                    );
                }

            } else {
                goodsGroupNameList.push(adGroupName);

            }

        }

    }
    console.log('goodsGroupNameList uniq name：' + _.uniq(goodsGroupNameList));

}

module.exports = {
    readCustomShop,
    readGoodsGroup
};