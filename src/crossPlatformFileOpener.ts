import { exec } from 'child_process'
import os from 'os'
export function openFile(path: string) {
	switch(os.platform()){
		case 'darwin':
			exec('open ' + path)
			break
		case 'freebsd':
			exec('xdg-open ' + path)
			break
		case 'linux':
			exec('xdg-open ' + path)
			break
		case 'openbsd':
			exec('xdg-open ' + path)
			break
		case 'sunos':
			break
		case 'win32':
			exec('start ' + path)
			break
	}
}
