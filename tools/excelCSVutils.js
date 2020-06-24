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

// 解析读到的 CSV 信息，返回一个 csvObject 列表
function parseCSVInfo(csvArr) {
	// 取到表的信息部分
	const typeList = {};

	_.each(csvArr[0], (v, k) => {
		const lowerValue = _.lowerCase(v);
		typeList[k] = lowerValue;

	});

	const csvObjects = [];

	for (let index = 1; index < csvArr.length; index++) {
		const csvObject = {};

		_.each(csvArr[index], (value, key) => {
			if (typeList[key] === 'number') {
				if (value !== '') {
					csvObject[key] = Number(value);

				}

			}
			else if (typeList[key] === 'boolean') {
				if (value !== '') {
					if (value === '1' || _.lowerCase(value) === 'true') {
						csvObject[key] = true;
	
					}
					else {
						csvObject[key] = false;
	
					}

				}

			}
			else if (typeList[key] === 'string') {
				if (value !== '') {
					csvObject[key] = value + '';

				}

			}

		});

		if (_.isEmpty(csvObject)) continue;

		csvObjects.push(csvObject);

	}

	return csvObjects;

}

// 解析读到的 CSV 对象，返回一个 CSV 表的行数据对象列表
async function _readCSVFile(csvName, CSVDir) {
    const filePath = `${CSVDir}/${csvName}`;
  
    const csvObject = await readCSV(filePath);
    const rowDataList = parseCSVInfo(csvObject);
  
    if (!rowDataList) throw new Error('parse ' + csvName + ' failed.');
  
    // console.log('parse ' + csvName + ' completed, total number：' + rowDataList.length);
    return rowDataList;
  
  }
  
  module.exports = _readCSVFile;