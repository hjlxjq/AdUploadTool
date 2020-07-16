const xlsx = require('xlsx');
const _ = require('lodash');
const fsPromises = require('fs').promises;

function readXLSX(path, shift) {
    const wb = xlsx.readFile(path);

    let totalRows = [];

    for (const sheet of _.keys(wb.Sheets)) {
        const ws = wb.Sheets[sheet];
        const rows = xlsx.utils.sheet_to_json(ws);

        // 去掉第一行的描述
        if (shift === 1) {
            rows.shift();
        }
        totalRows = _.concat(totalRows, rows);

    }
    return totalRows;

}

// 解析读到的 XLSX 对象，返回一个 XLSX 表的行数据对象列表
async function _readXLSXFile(xlsxName, XLSXDir, shift) {
    const filePath = `${XLSXDir}/${xlsxName}`;
    // console.log('filePath：' + filePath);
  
    const rowDataList = await readXLSX(filePath, shift);
  
    if (!rowDataList) throw new Error('parse ' + xlsxName + ' failed.');
  
    // console.log('parse ' + xlsxName + ' completed, total number：' + rowDataList.length);
    return rowDataList;
  
  }
  
  module.exports = _readXLSXFile;