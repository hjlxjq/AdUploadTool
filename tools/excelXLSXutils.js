const xlsx = require('xlsx');
const _ = require('lodash');

function readXLSX(path, shift) {
    const wb = xlsx.readFile(path);
    const sheets = _.keys(wb.Sheets);
    const sheet = sheets[sheets.length - 1];

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

    // const ws1 = wb.Sheets['0'];
    // const rows1 = xlsx.utils.sheet_to_json(ws1);

    // // 去掉第一行的描述
    // if (shift === 1) {
    //     rows1.shift();
    // }
    // totalRows = _.concat(totalRows, rows1);

    // const ws2 = wb.Sheets['1'];
    // const rows2 = xlsx.utils.sheet_to_json(ws2);

    // // 去掉第一行的描述
    // if (shift === 1) {
    //     rows2.shift();
    // }
    // totalRows = _.concat(totalRows, rows2);

    // const ws = wb.Sheets[sheet];
    // const rows = xlsx.utils.sheet_to_json(ws);

    // // 去掉第一行的描述
    // if (shift === 1) {
    //     rows.shift();
    // }
    // totalRows = _.concat(totalRows, rows);

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