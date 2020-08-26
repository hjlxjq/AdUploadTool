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
    const productVo = (await ProductModel.findOne({
        where: {
            platform, packageName
        }
    }));

    if (_.isEmpty(productVo)) {
        return;

    }
    return productVo.id;

}

// 获取版本条件分组哈希
async function getVersionGroupHash(clientPackage, productNameHashHash) {
    const versionGroupHash = {};    // 键为应用主键，值为版本条件分组哈希

    for (const item of clientPackage) {
        if (!item.status) continue;

        const { packageName, device, shopGroup } = item;

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

        if (!productId) continue;

        versionGroupHash[productId] = shopGroup;

    }
    return versionGroupHash;

}

// 获取 ab 分组哈希，键为 clientPackage xml 读取的内购组，值为 ab 分组数组
async function getGroupWeightHash(XMLDir, project) {
    const groupWeightHash = {};    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml 读取的内购组，值为 ab 分组数组

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

// 创建内购 ab 测试分组表
async function createAbTestGroup(
    productId, versionGroupId, groupWeight, name = 'default', begin = -1, end = -1
) {
    // ab 测试分组表模型
    const AbTestGroupModel = model.abTestGroup;
    // 商品组表模型
    const GoodsGroupModel = model.goodsGroup;

    const { toGroup } = groupWeight;

    // 查找或创建商品组
    const goodsGroupVo = await GoodsGroupModel.findOne({
        where: {
            name: toGroup, productId
        }
    });
    // 获取商品组主键
    let goodsGroupId = null;
    if (!_.isEmpty(goodsGroupVo)) {
        goodsGroupId = goodsGroupVo.id;

    }
    // 获取描述
    let description = name;
    if (description === 'default') {
        description = '默认组';

    }

    const abTestGroupVo = {
        name, begin, end, description, goodsGroupId,
        configGroupId: undefined, nativeTmplConfGroupId: undefined, versionGroupId, active: 1
    }
    // 创建 ab 测试分组
    await AbTestGroupModel.create(abTestGroupVo);

}

// 批量创建商品 ab 测试分组表
async function createAbTestGroupList(productId, versionGroupId, groupWeightList) {
    // 创建默认 ab 测试分组
    const defaultGroupWeight = groupWeightList.shift();
    await createAbTestGroup(productId, versionGroupId, defaultGroupWeight);

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
            if (i === groupNum - 1) {
                end = 100;

            }
            const abTestGroupName = 'group_' + nameList[i];
            const groupWeight = groupWeightList[i];

            await createAbTestGroup(
                productId, versionGroupId, groupWeight, abTestGroupName, begin, end
            );

            // 范围叠加
            begin = end + 1;
            end += step;

        }

    }

}

// 导入内购版本条件分组
async function readIapVersionGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readIapVersionGroup()');

    // 版本条件分组表模型
    const VersionGroupModel = model.versionGroup;

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
    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的广告组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);
    // ClientPackage xml 表读取的游戏版本条件分组哈希
    const versionGroupHash = await getVersionGroupHash(clientPackage, productNameHashHash);

    // 应用主键列表
    const productIdList = _.keys(versionGroupHash);

    // 遍历应用
    for (const productId of productIdList) {
        const groupName = versionGroupHash[productId];

        // xml 表中未配置，则取默认值
        // 克隆数组，后面更改了数组
        const groupWeightList = (_.cloneDeep(groupWeightHash[groupName])) || [{
            toGroup: groupName,
            weightGroup: '-1'
        }];

        const name = 'default';
        const description = '默认组';
        const begin = 0;

        // 版本条件分组表对象
        const versionGroupVo = {
            name, begin, description, type: 2,
            code: '[]', include: 1, productId, active: 1
        };

        // 查找或创建版本条件分组
        const [currentVersionGroupVo, created] = await VersionGroupModel.findOrCreate({
            where: {
                name, type: 2, productId
            }, defaults: versionGroupVo
        });

        // 如果首次，则创建广告
        if (created) {
            const versionGroupId = currentVersionGroupVo.id;

            await createAbTestGroupList(
                productId, versionGroupId, _.cloneDeep(groupWeightList)
            );

        }

    }

}

module.exports = {
    readIapVersionGroup,
};