import fs from 'fs'

export class FileSystem {
	static writeFile(path: string, absoluteJournalPath: string) {
		fs.writeFileSync(path, absoluteJournalPath)
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
