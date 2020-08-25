/**
 * 导入项目组
 */
const model = require('../tools/model');
const _readXLSXFile = require('../tools/excelXLSXutils');

// 创建项目组
async function readProductGroup(DefineDir) {
    console.log('begin execute function: readProductGroup()');

    const ProductGroupModel = model.productGroup;

    let productDataList = []

    try {
        // 去掉第一行的描述
        productDataList = await _readXLSXFile('广告配置阶段导入.xlsx', DefineDir);

    } catch (e) {
        // 不存在则默认创建的项目组名
        productDataList = [
            {group: 'Solitaire Fish'}, {group: 'Solitaire Fishdom'}, {group: 'Word Cross'},
            {group: 'Word Flat'}, {group: 'Word Swipe'}, {group: '老纸牌'}, {group: 'Solitaire Farm'},
            {group: 'Word Restaurant'}, {group: 'Word Across'}, {group: 'Word Shuffle'}, {group: 'Bible Word Cross'},
            {group: 'Word Swipe Board'}, {group: 'Word Dream'}, {group: 'Word Sushi'}, {group: 'fuzhou'},
        ]

    }

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