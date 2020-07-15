const xlsx = require('xlsx');
const fsPromises = require('fs').promises;

function readXLSX(path) {
    const wb = xlsx.readFile(path);
    const ws = wb.Sheets.Sheet1;
    const rows = xlsx.utils.sheet_to_json(ws);
    
    return rows;

}

// 解析读到的 XLSX 对象，返回一个 XLSX 表的行数据对象列表
async function _readXLSXFile(xlsxName, XLSXDir) {
    const filePath = `${XLSXDir}/${xlsxName}`;
    // console.log('filePath：' + filePath);
  
    const rowDataList = await readXLSX(filePath);
  
    if (!rowDataList) throw new Error('parse ' + xlsxName + ' failed.');
  
    // console.log('parse ' + xlsxName + ' completed, total number：' + rowDataList.length);
    return rowDataList;
  
  }
  
  module.exports = _readXLSXFile;