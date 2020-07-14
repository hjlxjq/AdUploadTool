/**
 * 导入 product
 */
const _ = require('lodash');
const bluebird = require('bluebird');
const _readXMLFile = require('../tools/excelXMLutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const _readCSVFile = require('../tools/excelCSVutils');
const model = require('../tools/model');

// 获取指定导入的应用哈希表
async function getProductNameHash(DefineDir) {
    const productDataList = await _readXLSXFile('广告配置导入测试.xlsx', DefineDir);
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

// 获取所有的项目组哈希表
async function getProductGroupHash() {
    // 项目组模型
    const ProductGroupModel = model.productGroup;

    const productGroupVoList = await ProductGroupModel.findAll();

    // 项目组哈希表，键为项目组名，值为数据库项目组表主键
    const productGroupHash = {};

    _.each(productGroupVoList, (productGroupVo) => {
        const { id, name } = productGroupVo;
        productGroupHash[name] = id;

    });
    return productGroupHash;

}

// 创建应用
async function readProduct(DefineDir, XMLDir, project) {
    console.log('begin execute function: readProduct()');

    const ProductModel = model.product;
    const ProductGroupModel = model.productGroup;

    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);

    // 应用名称哈希表，键为平台，值为包名对应应用名和项目组名哈希表
    const productNameHashHash = await getProductNameHash(DefineDir);
    // 获取所有的项目组哈希表
   const productGroupHash = await getProductGroupHash();

    const packageNameList = [];
    const platformList = [];

    await bluebird.map(clientPackage, async (item) => {
        if (!item.status) return;

        let packageName = item.packageName;
        const { device } = item;

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
            return;

        }
        if (!productNameHashHash[device]) {
            return;

        }
        if (!productNameHashHash[device][packageName]) {
            return;

        }
        // 平台列表
        platformList.push(device);
        packageNameList.push(packageName + device);

        const name = productNameHashHash[device][packageName].productName;
        const productGroupName = productNameHashHash[device][packageName].productGroupName;

        // 广告平台的平台名，android, ios, wenxin, instant
        let platform = device;
        if (device === 'web') {
            platform = 'instant';

        }
        if (device === 'wx') {
            platform = 'weixin';

        }
        const productGroupId = productGroupHash[productGroupName];
        // 数据库应用表对象
        const productVo = {
            platform, packageName, name, productGroupId, test: 0, active: 1
        };

        try {
            await ProductModel.create(productVo);

        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;

            }

        }

    }, { concurrency: 2 });

    console.log('packageNameList length: ' + _.uniq(packageNameList).length);
    console.log('packageNameList: ' + _.uniq(packageNameList));
    // 输出平台名 
    console.log('platformList: ' + _.uniq(platformList));

}

module.exports = {
    readProduct
};