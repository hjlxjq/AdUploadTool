const XML = require('pixl-xml');
const fs = require('fs');
const _ = require('lodash');

// 判断 xml 文件是否存在
function exists(path) {
    try {
        return fs.statSync(path, fs.F_OK);

    } catch (error) {
        return false;

    }

}

// 读取 xml 对象
function readXML(filePath) {
    // console.log(`filePath: ${filePath}`);

    if (exists(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const result = XML.parse(fileData);
        return Promise.resolve(result);

    } else {
        return Promise.reject(`文件${filePath}不存在`);

    }

};

// 解析读到的 XML 对象，返回一个 xml 表的行数据对象列表
function parseXMLInfo(xmlObject) {
    const Rows = xmlObject.Worksheet.Table.Row;    // xml 表的所有行数据，数组

    const titleRow = Rows[0].Cell;    // 首行（即数据的名称）列表
    const typeRow = Rows[1].Cell;    // 第二行（即数据的类型）列表

    const shopList = [];

    for (let index = 0; index < titleRow.length; index++) {
        const titleName = titleRow[index].Data['_Data'];
        const typeName = typeRow[index].Data['_Data'];

        let type = _.lowerCase(typeName);

        const shop = {
            key: titleName,
            type
        };
        shopList.push(shop);

    }

    return shopList;

};

// 解析读到的 XML 对象，返回一个 xml 表的行数据对象列表
async function _readXMLFile(xmlName, XMLDir, project) {
    const filePath = `${XMLDir}/${project}/${xmlName}`;
    const xmlObject = await readXML(filePath);
    const rowDataList = parseXMLInfo(xmlObject);

    if (!rowDataList) throw new Error('parse ' + xmlName + ' failed.');

    // console.log('parse ' + xmlName + ' completed, total number：' + rowDataList.length);
    return rowDataList;

}

module.exports = _readXMLFile;