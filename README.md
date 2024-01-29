# @bbtest/stack-trace

This enhances the `Error` object by adding a static setter/getter `enableTrace` to it. This will cause the override of `Error.prepareStackTrace` to a function that adds a `Error.prototype.trace` getter that get's a`StackTraceItem[]`:

```typescript
export interface StackTraceItem {
	this?: unknown;
	typeName: string | null;
	function?: function;
	functionName?: string;
	methodName?: string;
	fileName: string;
	lineNumber: number;
	columnNumber: number;
	evalOrigin?: string;
	toplevel: boolean;
	eval: boolean;
	native: boolean;
	constructor: site.isConstructor?.();
	async: boolean;
	promiseAll: boolean;
	promiseIndex: number | null;
}
```
