#!/usr/bin/env node
const _ = require('lodash');
const { replaceShop } = require('./methods/replaceShop');

async function init() {
    await replaceShop();
}

init();