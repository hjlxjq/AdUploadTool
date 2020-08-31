#!/usr/bin/env node
const _ = require('lodash');
const XMLDir = process.cwd() + '/xml';
const DefineDir = process.cwd() + '/defineFiles';

const { readChannelAndType, readNativeTmpl, readBaseConfig, readNativeShop } = require('./methods/common');
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
    // await readChannelAndType(XMLDir, project);
    // await readNativeTmpl(XMLDir, project);
    // await readProductGroup(DefineDir);
    // await readAppConfig(DefineDir);
    // await readBaseConfig(DefineDir);
    await readNativeShop(DefineDir);
}

init();