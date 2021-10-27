import fs from 'fs'
import { execSync } from 'child_process'
import { JourError } from './JourError'
export class FileSystem {
	static getRealPath(path: string): string {
		return fs.realpathSync(path)
	}
	static writeFile(path: string, absoluteJourPath: string, overwrite = false) {
		if (overwrite || !FileSystem.isFile(path)) {
			fs.writeFileSync(path, absoluteJourPath)
		}
	}
	static pathExists(path: string): boolean {
		return fs.existsSync(path)
	}
	static isFile(path: string): boolean {
		return FileSystem.pathExists(path) && fs.lstatSync(path).isFile()
	}
	static isDirectory(path: string): boolean {
		return FileSystem.pathExists(path) && fs.lstatSync(path).isDirectory()
	}
	static readFile(path: string): string {
		try {
			return fs.readFileSync(path).toString()
		} catch (error) {
			return ""
		}
	}
	static FilesInDirectory(path: string): string[] {
		if(FileSystem.isDirectory(path)){
			return fs.readdirSync(path)
		} else {
			throw new JourError("Not a directory. FilesInDirectory requires a directory")
		}
	}
	static Open(path: string) {
		switch (process.platform) {
			case 'darwin':
				return execSync('open ' + path)
			case 'win32':
				return execSync('start ' + path)
			default:
				return execSync('xdg-open ' + path)
		}
	}
}
