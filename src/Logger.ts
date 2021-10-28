export class Logger {
	constructor(private debugEnabled = false) {}

	info(...data: unknown[]): void {
		console.info(...data)
	}

	debug(...data: unknown[]): void {
		if(this.debugEnabled){
			console.debug(...data)
		}
	}
	error(...data: unknown[]): void {
		console.error(...data)
	}
}
