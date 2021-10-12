import fs from 'fs'

export class FileSystem {
	static getRealPath(path: string): string {
		return fs.realpathSync(path)
	}
	static writeFile(path: string, absoluteJournalPath: string, overwrite = false) {
		if(overwrite || !FileSystem.isFile(path)){
			fs.writeFileSync(path, absoluteJournalPath)
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
}
