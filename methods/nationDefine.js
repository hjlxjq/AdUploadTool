/**
 * 导入 国家代码 nationDefine 表
 */
const fs = require('fs');
const model = require('../tools/model');

// 创建国家代码表，一次性
async function readNationDefine(DefineDir) {
    const NationDefineModel = model.nationDefine;    // 国家代码表模型

    const nationCodePath = DefineDir + '/nationCode.json';
    const nationCodeList = JSON.parse(fs.readFileSync(nationCodePath, 'utf8'));
    
    for (const nationCode of nationCodeList) {
        const { name, code } = nationCode;
    
        // 国家代码表对象
        const nationDefineVo = {
            name, code
        };
        await NationDefineModel.create(nationDefineVo);
    
    }

}

module.exports = {
    readNationDefine
};