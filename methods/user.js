/**
 * 导入用户 user userAuth 两种表
 */
const crypto = require('crypto');
const model = require('../tools/model');

// 创建 admin 管理员
async function readUser() {
    const UserModel = model.user;    // 用户表
    const UserAuthModel = model.userAuth;    // 用户权限表

    const md5 = crypto.createHash('md5');
    const defaultPassword = '1234567890';
    const password = md5.update(defaultPassword).digest('hex');
    // 用户表对象
    const userVo = {
        email: 'admin@talefun.com', name: 'admin', password, active: 1
    };
    // 查找或创建用户
    const [currentUserVo] = await UserModel.findOrCreate({
        where: {
            email: 'admin@talefun.com'
        }, defaults: userVo
    });

    // 用户权限表对象
    const userAuthVo = {
        editComConf: 1, viewComConf: 1, createProductGroup: 1, master: 1, userId: currentUserVo.id
    };
    // 创建用户权限
    await UserAuthModel.create(userAuthVo);

}

module.exports = {
    readUser
};