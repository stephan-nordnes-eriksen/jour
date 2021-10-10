export class Logger {
	constructor(private debugEnabled = false) {}

	info(...data: any[]) {
		console.info(...data)
	}

	debug(...data: any[]) {
		if(this.debugEnabled){
			console.debug(...data)
		}
	}
	error(...data: any[]) {
		console.error(...data)
	}
}
