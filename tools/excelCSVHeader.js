const bluebird = require('bluebird');
const fs = require('fs');
const _ = require('lodash');
const readFile = bluebird.promisify(fs.readFile);
const parse = bluebird.promisify(require('csv').parse);

// 读取 csv 文件
function readCSV(filePath) {
	if (fs.existsSync(filePath)) {
		return readFile(filePath, 'utf8')
			.then(fileData => {
				return parse(fileData, { columns: true, trim: true, skip_empty_lines: true, skip_lines_with_empty_values: true });
			});

	}
	else {
		throw new Error(`文件${filePath}不存在`);

	}

}

// 解析读到的 CSV 信息，返回一个表头信息列表
function parseCSVInfo(csvObject) {
	// 取到表的信息部分
	const shopList = [];

	_.each(csvObject, (typeName, titleName) => {
		let type = _.lowerCase(typeName);
		const shop = {
            key: titleName,
            type
        };
        shopList.push(shop);

	});

	return shopList;

}

// 解析读到的 CSV 对象，返回一个 CSV 表的行数据对象列表
async function _readCSVHeader(csvName, CSVDir, project) {
	let filePath = `${CSVDir}/${csvName}`;
	if (project) {
		filePath = `${CSVDir}/${project}/${csvName}`;

	}

	const csvArr = await readCSV(filePath);
	const rowDataList = parseCSVInfo(csvArr[0]);

	if (!rowDataList) throw new Error('parse ' + csvName + ' failed.');

	// console.log('parse ' + csvName + ' completed, total number：' + rowDataList.length);
	return rowDataList;

}

module.exports = _readCSVHeader;