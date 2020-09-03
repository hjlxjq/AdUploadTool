/**
 * 导入商品组合商品
 */
const _ = require('lodash');
const model = require('../tools/model');
const Bluebird = require('bluebird');

// 获取所有应用在数据里的主键
async function getProductIdList() {
    const ProductModel = model.product;    // 应用表模型

    const productVoList = await ProductModel.findAll();

    return _.map(productVoList, (productVo) => {
        return productVo.id;

    });

}

// 获取暂存的 consumable 通用内购字段主键
async function getNativeShopId(key, type, description) {
    // 通用内购字段模型
    const NativeShopModel = model.nativeShop;

    const nativeShopVo = {
        key, type, description, active: 1
    };
    const [currentNativeShopVo, created] = await NativeShopModel.findOrCreate({
        where: {
            key
        }, defaults: nativeShopVo
    });

    return currentNativeShopVo.id;

}

// 重新命名通用内购字段，即替换自定义内购字段
async function renameNativeShop(oldKey, newKey) {
    // 通用内购字段模型
    const NativeShopModel = model.nativeShop;

    try {
        await NativeShopModel.update(
            {
                key: oldKey
            },
            {
                where: {
                    key: newKey
                }

            }

        );

    } catch (e) { }

}

// 获取自定义内购字段主键
async function getCustomShopId(productId, key) {
    // 自定义内购字段模型
    const CustomShopModel = model.customShop;

    const customShopVo = await CustomShopModel.findOne({
        where: {
            productId, key
        }
    });

    return customShopVo ? customShopVo.id : undefined;

}

// 批量更新商品组下商品
async function updateGoods(nativeShopId, customShopId) {
    const GoodsMapModel = model.goodsMap;    //商品映射表模型

    await GoodsMapModel.update(
        {
            shopId: nativeShopId
        },
        {
            where: {
                shopId: customShopId
            }

        }

    )

}

// 批量删除商品组下商品
async function delCustomShop(key) {
    // 自定义内购字段模型
    const CustomShopModel = model.customShop;

    await CustomShopModel.destroy(
        {
            where: {
                key
            }

        }

    )

}

// 更换内购字段
async function replaceShop() {
    console.log('begin execute function: replaceShop()');

    // 通用内购字段对象
    const newKey = 'consumableTest';
    const newDescription = '0是消耗品,1是非消耗品,2是订购商品';
    const newType = 'string';

    const oldKey = 'consumable';

    // 获取所有应用主键列表
    const productIdList = await getProductIdList();
    // console.log('productIdList length：', productIdList.length);
    // 创建或者获取新增的通用内购字段表主键
    const nativeShopId = await getNativeShopId(newKey, newType, newDescription);
    console.log('nativeShopId：', nativeShopId);

    // 创建所有商品组和商品组下商品
    for (const productId of productIdList) {
        // 获取替换的的自定义内购字段表主键
        const customShopId = await getCustomShopId(productId, oldKey);
        // console.log('customShopId', customShopId);

        if (!customShopId) continue;

        await updateGoods(nativeShopId, customShopId);

    }
    // 先删除需替换的自定义内购字段
    await delCustomShop(oldKey);
    // 再把新创建的通用内购字段替换成自定义内购字段
    await renameNativeShop(oldKey, newKey);

}

module.exports = {
    replaceShop
};