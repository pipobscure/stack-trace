import * as Path from 'node:path';

const runtime = {
	get base() {
		const value = process.argv[1] ? Path.dirname(process.argv[1]) : process.cwd();
		Object.defineProperty(this, 'base', { value });
		return value;
	},
};

const ErrorPrepareStackTrace = Error.prepareStackTrace;

Object.defineProperty(Error, 'enableTrace', {
	get: function () {
		return Error.prepareStackTrace === prepareStackTrace;
	},
	set: function (enabled: boolean) {
		Error.prepareStackTrace = enabled ? prepareStackTrace : ErrorPrepareStackTrace;
	},
	enumerable: true,
	configurable: true,
});

function prepareStackTrace(error: Error, callsites: NodeJS.CallSite[]) {
	Object.defineProperty(error, 'trace', {
		get: function () {
			const value = callsites.map(callSiteInfo);
			Object.defineProperty(this, 'trace', {
				value,
				enumerable: true,
				configurable: true,
			});
			return value;
		},
		enumerable: true,
		configurable: true,
	});
	const first = `${error}`;
	return [first, ...callsites.map((s) => `\tat ${s}`)].join('\n');
}

export type TraceEntry = ReturnType<typeof callSiteInfo>;
function callSiteInfo(site: NodeJS.CallSite) {
	const fileName = site.getFileName();
	const result = {
		this: site.getThis(),
		typeName: site.getTypeName(),
		function: site.getFunction(),
		functionName: site.getFunctionName(),
		methodName: site.getMethodName(),
		fileName: fileName && Path.isAbsolute(fileName) ? Path.relative(runtime.base, fileName) : fileName,
		lineNumber: site.getLineNumber(),
		columnNumber: site.getColumnNumber(),
		evalOrigin: site.getEvalOrigin(),
		toplevel: site.isToplevel(),
		eval: site.isEval(),
		native: site.isNative(),
		constructor: site.isConstructor?.(),
		async: site.isAsync?.(),
		promiseAll: site.isPromiseAll?.(),
		promiseIndex: site.getPromiseIndex?.(),
	};
	return result;
}

export interface TraceErrorConstructor extends ErrorConstructor {
	new (msg: string): Error & { trace: TraceEntry[] };
	enableTrace: boolean;
}
export default Error as TraceErrorConstructor;
