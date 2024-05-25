export function loadModule<T>(modulePath: string): T {
	return require(modulePath) as T;
}
