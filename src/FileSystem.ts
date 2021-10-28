import {
	realpathSync,
	writeFileSync,
	existsSync,
	lstatSync,
	readFileSync,
	readdirSync,
} from 'fs'
import { resolve, join } from 'path'
import { homedir } from 'os'
import { execSync } from 'child_process'
import { JourError } from './JourError'
export class FileSystem {
	static getRealPath(path: string): string {
		return realpathSync(path)
	}
	static JoinResolve(...pathParts: string[]): string {
		return resolve(join(...pathParts))
	}
	static writeFile(path: string, absoluteJourPath: string, overwrite = false): void {
		if (overwrite || !FileSystem.isFile(path)) {
			writeFileSync(path, absoluteJourPath)
		}
	}
	static pathExists(path: string): boolean {
		return existsSync(path)
	}
	static isFile(path: string): boolean {
		return FileSystem.pathExists(path) && lstatSync(path).isFile()
	}
	static isDirectory(path: string): boolean {
		return FileSystem.pathExists(path) && lstatSync(path).isDirectory()
	}
	static readFile(path: string): string {
		try {
			return readFileSync(path).toString()
		} catch (error) {
			return ""
		}
	}
	static FilesInDirectory(path: string): string[] {
		if (FileSystem.isDirectory(path)) {
			return readdirSync(path)
		} else {
			throw new JourError("Not a directory. FilesInDirectory requires a directory")
		}
	}
	static Open(path: string): unknown {
		switch (process.platform) {
		case 'darwin':
			return execSync('open ' + path)
		case 'win32':
			return execSync('start ' + path)
		default:
			return execSync('xdg-open ' + path)
		}
	}
	static HomeDir(): string {
		return homedir()
	}
}
