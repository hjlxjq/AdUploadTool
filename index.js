#!/usr/bin/env node
const _ = require('lodash');
const XMLDir = process.cwd() + '/xml';
const XMLIapDir = process.cwd() + '/xmlIap';
const DefineDir = process.cwd() + '/defineFiles';

const { readChannelAndType, readNativeTmpl, readBaseConfig, readNativeShop } = require('./methods/common');
const { readProduct } = require('./methods/product');
const { readConfigGroup } = require('./methods/configGroup');
const { readAdGroup } = require('./methods/adGroup');
const { readNativeTmplConfGroup } = require('./methods/nativeTmplConfGroup');
const { readCustomShop, readGoodsGroup } = require('./methods/goodsGroup');
const { readConfigVersionGroup, readAdVersionGroup, testVersionGroup } = require('./methods/versionGroup');
const { readIapVersionGroup } = require('./methods/iapVersionGroup');
const { readProductGroup } = require('./methods/productGroup');
const { readAppConfig } = require('./methods/appConfig');

// 命令行输入 node index ${project}
// 读取 project
let argv;
if (process.env.npm_config_argv) {
    argv = JSON.parse(process.env.npm_config_argv).original;

} else {
    argv = process.argv;

}
const project = argv[2] || 'word';

console.log(`project: ${project}`);

async function init() {
    await readChannelAndType(XMLDir, project);
    await readNativeTmpl(XMLDir, project);
    await readProductGroup(DefineDir);
    await readAppConfig(DefineDir)
    await readBaseConfig(DefineDir);
    await readNativeShop(DefineDir);
    await readBaseConfig(DefineDir, project);
    await readProduct(DefineDir, XMLDir, project);
    await readConfigGroup(DefineDir, XMLDir, project);
    await readAdGroup(DefineDir, XMLDir, project);
    await readNativeTmplConfGroup(DefineDir, XMLDir, project);
    await readCustomShop(DefineDir, XMLIapDir, project);
    await readGoodsGroup(DefineDir, XMLIapDir, project);
    await readIapVersionGroup(DefineDir, XMLIapDir, project);
    await readConfigVersionGroup(DefineDir, XMLDir, project);
    await readAdVersionGroup(DefineDir, XMLDir, project);
    // await testVersionGroup(XMLDir, project);
}

init();