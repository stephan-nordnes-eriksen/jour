
export class Logger {
	static debugMode = false
	static SetDebugMode(debug: boolean): void {
		this.debugMode = debug
	}
	static info(...data: unknown[]): void {
		console.info(...data)
	}

	static debug(...data: unknown[]): void {
		if(Logger.debugMode){
			console.debug(...data)
		}
	}
	static error(...data: unknown[]): void {
		console.error(...data)
	}
}
