const XML = require('pixl-xml');
const fs = require('fs');

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
  const titleList = [];    // 行名称列表

  for (let index = 0; index < titleRow.length; index++) {
    const titleName = titleRow[index].Data['_Data'];
    titleList[index] = titleName;

  }

  const typeRow = Rows[1].Cell;    // 第二行（即数据的类型）列表
  const typeList = [];    // 行类型列表

  for (let index = 0; index < typeRow.length; index++) {
    const typeName = typeRow[index].Data['_Data'];
    typeList[index] = typeName;

  }

  const rowDataList = [];

  for (let index = 2; index < Rows.length; index++) {
    // const cells = Rows[index].Cell;
    const rowData = checkRowData(Rows[index], index - 1, titleList, typeList);

    if (!rowData) return false;

    rowDataList.push(rowData);

  }

  return rowDataList;

};

// 获取行数据对象，key 为 名称（titleName），value 为 数据
function checkRowData(row, rowIndex, titleList, typeList) {
  const cells = row.Cell;    // 行数据列表
  const rowObject = {};    // 行数据对象，key 为 名称（titleName），value 为 数据

  for (let cellIdx = 0, titleIndex = 0; cellIdx < cells.length; cellIdx++, titleIndex++) {
    const element = cells[cellIdx];

    // 属性 ss:Index 存在,则表示该列前面一列 存在空格
    if (element['ss:Index']) {
      const pos = element['ss:Index'] - 1;

      // console.error('第' + rowIndex + '行, 第' + pos + '列' + titleList[pos - 1] + '数据有缺失');
      // console.log(`titleIndex: ${titleIndex}`);

      // 行名称 index 跳到该行
      titleIndex = pos;

    }

    // const cellData = element.Data;

    const { ssType, Data } = parseObject(element);

    if (ssType && Data) {
      const titleName = titleList[titleIndex];
      const typeName = typeList[titleIndex];

      // const cellType = cellData['ss:Type'];
      // 类型为数字
      if (typeName === 'Number') {
        rowObject[titleName] = Number(Data);

        // 类型为布尔值
      } else if (typeName === 'Boolean') {
        if (Data === '1') {
          rowObject[titleName] = true;

        } else {
          rowObject[titleName] = false;

        }
        // console.log(rowObject[titleName]);

        // 类型为字符串
      } else if (typeName === 'String') {

        // 如果数据为 true 或 false 字符串，则数据为 'true' 或 'false', 否则输出字符串
        if (ssType === 'Boolean') {

          if (Data === '1') {
            rowObject[titleName] = 'true';

          } else if (Data === '0') {
            rowObject[titleName] = 'false';

          } else {
            rowObject[titleName] = Data + '';

          }

        } else {
          rowObject[titleName] = Data + '';

        }

      }

    }

  }
  // console.dir(rowObject);
  return rowObject;
}

// 获取 ssType, Data;
function parseObject(xmlObject) {
  let ssType, Data;
  const flattenObj = TraversalObject(xmlObject);

  if (flattenObj['ss:Type']) {
    ssType = flattenObj['ss:Type'];

  }
  if (flattenObj['_Data']) {
    Data = flattenObj['_Data'];

  }

  return { ssType, Data };

}

// 遍历对象, 拉平对象
function TraversalObject(obj, flattenObj = {}) {
  for (const a in obj) {

    if (typeof (obj[a]) === 'object') {
      return TraversalObject(obj[a], flattenObj); // 递归遍历

    } else {
      flattenObj[a] = obj[a];

    }

  }

  return flattenObj;

}

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