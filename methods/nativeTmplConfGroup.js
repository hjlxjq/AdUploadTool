/**
 * 导入 native 模板配置组合native 模板配置
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
        if (!productNameHashHash[platform]) {
            productNameHashHash[platform] = {};

        }
        productNameHashHash[platform][package] = { productName: app_name, productGroupName: group };

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

// 获取所有的常规配置 native 模板哈希表
async function getNativeTmplHash() {
    //  native 模板模型
    const NativeTmplModel = model.nativeTmpl;

    const nativeTmplVoList = await NativeTmplModel.findAll();

    //  native 模板哈希表，键为 native 模板，值为数据库 native 模板表主键
    const nativeTmplHash = {};

    _.each(nativeTmplVoList, (nativeTmplVo) => {
        const { id, key } = nativeTmplVo;
        nativeTmplHash[key] = id;

    });
    return nativeTmplHash;

}

// 获取 native 模板配置组哈希，键为 native 模板配置组，值为 native 模板配置数据
async function getNativeTmplConfHash(XMLDir, project) {
    // native 模板配置 xml 表读取的哈希表，键为 native 模板配置组，值为 native 模板配置数据
    const nativeTmplConfHash = {};

    try {
        const nativeAdTemplate = await _readXMLFile('NativeAdTemplate.xml', XMLDir, project);

        _.each(nativeAdTemplate, (item) => {
            if (item.status) {
                const { groupName, key, weight, clickArea, isFull } = item;

                if (!nativeTmplConfHash[groupName]) {
                    nativeTmplConfHash[groupName] = [];

                }
                nativeTmplConfHash[groupName].push({
                    key, weight, clickArea, isFull
                });
            }

        });

    } catch (e) { }

    // console.log('nativeTmplConfHash: ', nativeTmplConfHash);
    return nativeTmplConfHash;

}

// 获取 ab 分组哈希，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组
async function getGroupWeightHash(XMLDir, project) {
    const groupWeightHash = {};    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组

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

// 批量创建 native 模板配置组下 native 模板配置
async function createNativeTmplConf(nativeTmplConfGroupId, nativeTmplHash, nativeTmplConfDataList) {
    const NativeTmplConfModel = model.nativeTmplConf;    // native 模板配置表模型

    // console.log(`nativeTmplConfDataList: `, nativeTmplConfDataList);
    // 批量创建 native 模板配置
    for (const nativeTmplConfData of nativeTmplConfDataList) {
        const { key, weight, clickArea, isFull } = nativeTmplConfData;
        const nativeTmplId = nativeTmplHash[key];

        const nativeTmplConfVo = {
            weight, clickArea, isFull, nativeTmplId, nativeTmplConfGroupId, active: 1
        };

        try {
            await NativeTmplConfModel.create(nativeTmplConfVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;
            }

        }

    }

}

// 导入 native 模板配置组和 native 模板配置
async function readNativeTmplConfGroup(DefineDir, XMLDir, project) {
    console.log('begin execute function: readNativeTmplConfGroup()');

    // native 模板配置组表模型
    const NativeTmplConfGroupModel = model.nativeTmplConfGroup;

    // 读取 ClientPackage xml 表
    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);

   // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
   const productNameHashHash = await getProductNameHash(DefineDir);

    // native 模板配置 xml 表读取的哈希表，键为 native 模板配置组，值为 native 模板配置数据
    const nativeTmplConfHash = await getNativeTmplConfHash(XMLDir, project);

    // ab 分组 xml 表读取的哈希表，键为 clientPackage xml读取的native 模板配置组，值为 ab 分组数组
    const groupWeightHash = await getGroupWeightHash(XMLDir, project);

    // 获取所有的常规配置 native 模板哈希表
    const nativeTmplHash = await getNativeTmplHash();

    // 不存在的 native 模板组
    const nativeTmplConfGroupNameList = [];

    // 创建所有 native 模板配置组和 native 模板配置组下 native 模板配置
    for (const item of clientPackage) {
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
        // 导入指定包
        if (!productNameHashHash[device]) {
            continue;

        }
        if (!productNameHashHash[device][packageName]) {
            continue;

        }

        // 获取应用主键
        const productId = await getProductId(device, packageName);

        // xml 表中未配置，则取默认值
        const groupWeightList = groupWeightHash[groupName] || [{
            toGroup: groupName,
            weightGroup: '-1'
        }];

        // 循环 ab 分组,创建 native 模板配置组和 native 模板配置
        for (const groupWeight of groupWeightList) {
            const adGroupName = groupWeight.toGroup;

            const nativeTmplConfDataList = nativeTmplConfHash[adGroupName];
            if (!_.isEmpty(nativeTmplConfDataList)) {
                // 数据库 native 模板配置组表对象
                const nativeTmplConfGroupVo = {
                    name: adGroupName, description: adGroupName, productId, active: 1
                };

                // 查找或创建 native 模板配置组
                const [currentNativeTmplConfGroupVo, created] = await NativeTmplConfGroupModel.findOrCreate({
                    where: {
                        name: adGroupName, productId
                    }, defaults: nativeTmplConfGroupVo
                });

                // 如果首次，则创建 native 模板配置
                if (created) {
                    const currentNativeTmplConfGroupId = currentNativeTmplConfGroupVo.id;

                    await createNativeTmplConf(
                        currentNativeTmplConfGroupId, nativeTmplHash, nativeTmplConfDataList
                    );
                }

            } else {
                nativeTmplConfGroupNameList.push(adGroupName);

            }

        }
        // 查找或创建 native 模板配置组
        const [currentNativeTmplConfGroupVo, created] = await NativeTmplConfGroupModel.findOrCreate({
            where: {
                name: 'default', productId
            }, defaults: { name: 'default', description: '默认组', productId, active: 1 }
        });
        // 如果首次，则创建 native 模板配置
        if (created) {
            const currentNativeTmplConfGroupId = currentNativeTmplConfGroupVo.id;
            const nativeTmplConfDataList = nativeTmplConfHash['default'];

            if (!_.isEmpty(nativeTmplConfDataList)) {
                await createNativeTmplConf(
                    currentNativeTmplConfGroupId, nativeTmplHash, nativeTmplConfDataList
                );

            }

        }

    }
    // console.log('nativeTmplConfGroupNameList uniq name：' + _.uniq(nativeTmplConfGroupNameList));
    // console.log('nativeTmplConfGroupNameList uniq name length: ' + _.uniq(nativeTmplConfGroupNameList).length);

}

module.exports = {
    readNativeTmplConfGroup
};