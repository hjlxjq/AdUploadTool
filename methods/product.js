/**
 * 导入 productGroup, product
 */
const _ = require('lodash');
const bluebird = require('bluebird');
const _readXMLFile = require('../tools/excelXMLutils');
const _readXLSXFile = require('../tools/excelXLSXutils');
const model = require('../tools/model');

// 创建项目组
async function readProductGroup(project) {
    console.log('begin execute function: readProductGroup()');

    const ProductGroupModel = model.productGroup;

    const productGroupVo = {
        name: project + ' 项目组',
        description: project + ' 项目组',
        active: 1
    }

    try {
        await ProductGroupModel.create(productGroupVo);

    } catch (e) {
        if (e.name !== 'SequelizeUniqueConstraintError') {
            throw e;

        }

    }

}

// 创建应用
async function readProduct(DefineDir, XMLDir, project) {
    console.log('begin execute function: readProduct()');

    const ProductModel = model.product;
    const ProductGroupModel = model.productGroup;

    const productGroupId = (await ProductGroupModel.findOne({ where: { name: project + ' 项目组' } })).id;

    const clientPackage = await _readXMLFile('ClientPackage.xml', XMLDir, project);
    const productDataList = await _readXLSXFile('产品列表.xlsx', DefineDir);

    const packageNameList = [];
    const platformList = [];

    await bluebird.map(clientPackage, async (item) => {
        if (!item.status) return;

        let packageName = item.packageName;
        const { device } = item;

        // 平台列表
        platformList.push(device);

        // 纸牌有个例外的包名
        if (packageName !== 'Classic-5xing') {
            const packageNameArr = _.split(packageName, '-');
            if (packageNameArr.length > 1) {
                packageNameArr.pop();

            }
            packageName = packageNameArr.join('-');

        }

        let name = null;
        for (const productData of productDataList) {
            if (productData.platform === device && productData.packageName === packageName) {
                name = productData.appName;
                break;
            }

        }
        if (!name) {
            for (const productData of productDataList) {
                if (productData.applovin === packageName) {
                    name = productData.appName;
                    break;
                }

            }

        }
        if (!name) {
            name = packageName;
            packageNameList.push(packageName + device);

        }

        // 广告平台的平台名，android, ios, wenxin, instant
        let platform = device;
        if (device === 'web') {
            platform = 'instant';

        }
        if (device === 'wx') {
            platform = 'wenxin';

        }
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

    // 输出 福超提供的 产品列表.xlsx 中不存在的包名
    console.log('packageNameList: ' + _.uniq(packageNameList));
    // 输出平台名 
    console.log('platformList: ' + _.uniq(platformList));

}

module.exports = {
    readProductGroup,
    readProduct
};