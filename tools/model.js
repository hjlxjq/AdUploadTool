// scan all models defined in models:
const fs = require('fs');
const db = require('./db');

const files = fs.readdirSync(process.cwd() + '/models');
const js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

for (const f of js_files) {
    // console.log(`import model from file ${f}...`);
    const name = f.substring(0, f.length - 3);
    module.exports[name] = require(process.cwd() + '/models/' + f);
}

module.exports.sync = () => {
    return db.sync();
};
