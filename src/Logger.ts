export class Logger {
	constructor(private debugEnabled = false) {}

	info(...data: unknown[]) {
		console.info(...data)
	}

	debug(...data: unknown[]) {
		if(this.debugEnabled){
			console.debug(...data)
		}
	}
	error(...data: unknown[]) {
		console.error(...data)
	}
}
