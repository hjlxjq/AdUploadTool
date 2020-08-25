#!/usr/bin/env node
const _ = require('lodash');
const XMLIapDir = process.cwd() + '/xmlIap';
const DefineDir = process.cwd() + '/defineFiles';

const { readProduct } = require('./methods/product');
const { readCustomShop, readGoodsGroup } = require('./methods/goodsGroup');
const { readIapVersionGroup } = require('./methods/iapVersionGroup');

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
    await readProduct(DefineDir, XMLIapDir, project);
    await readCustomShop(DefineDir, XMLIapDir, project);
    await readGoodsGroup(DefineDir, XMLIapDir, project);
    await readIapVersionGroup(DefineDir, XMLIapDir, project);
}

init();