/** 
 * 初始化数据库
 */
const model = require('./model.js');

const { readUser } = require('../methods/user');
const { readNationDefine } = require('../methods/nationDefine');
const DefineDir = process.cwd() + '/defineFiles';

async function init() {
    // 初始化数据库
    await model.sync();
    // 创建管理员
    await readUser();
    // 创建国家代码表，一次性
    await readNationDefine(DefineDir)

}

init();

console.log('init db ok.');