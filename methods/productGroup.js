/**
 * 导入项目组
 */
const model = require('../tools/model');
const _readXLSXFile = require('../tools/excelXLSXutils');

// 创建项目组
async function readProductGroup(DefineDir) {
    console.log('begin execute function: readProductGroup()');

    const ProductGroupModel = model.productGroup;

    const productDataList = await _readXLSXFile('广告配置导入模板.xlsx', DefineDir);
    // 去掉第一行的描述
    productDataList.shift();

    for (const productData of productDataList) {
        const name = productData.group;
        
        const productGroupVo = {
            name,
            description: name + ' 项目组',
            active: 1
        }
    
        try {
            // console.log('productGroupVo: ', productGroupVo);
            await ProductGroupModel.create(productGroupVo);
    
        } catch (e) {
            if (e.name !== 'SequelizeUniqueConstraintError') {
                throw e;
    
            }
    
        }

    }

}

module.exports = {
    readProductGroup
};