const cp = require('child_process');
const examples = require('./examples');

const cmds = examples.map(function(dirname) {
	return `CONTEXT=${dirname} node examples/build.js`; // node_modules/.bin/babel-node src/bin/packing.js build`;
});

let failed = 0;
let i = 0;
for(const cmd of cmds) {
	console.log(`[${++i}/${cmds.length}] ${cmd}`);
	try {
		cp.execSync(cmd, { encoding: 'utf-8' });
	} catch(e) {
		failed++;
		console.log(e);
	}
}
console.log('done');
if(failed > 0)
console.log(`${failed} failed`);
