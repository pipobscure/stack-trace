#!/usr/bin/env node

import * as PATH from 'node:path';
import * as FS from 'node:fs';

const nxt = process.argv[2];
for (const file of process.argv.slice(3)) {
	const ext = PATH.extname(file);
	const dir = PATH.dirname(file);
	const bas = PATH.basename(file, ext);
	const nam = PATH.resolve(dir, `${bas}.${nxt}`);
	console.error(`rename: ${file} -> ${nam}`);
	FS.renameSync(file, nam);
}

