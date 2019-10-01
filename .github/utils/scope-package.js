const pkg = require('../../package.json');
const fs = require('fs');
const path = require('path');
pkg.name = '@bergie/where';
fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(pkg, null, 2), 'utf-8');
