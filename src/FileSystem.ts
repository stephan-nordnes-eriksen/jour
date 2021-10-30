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
	static GetRealPath(path: string): string {
		return realpathSync(path)
	}
	static JoinResolve(...pathParts: string[]): string {
		return resolve(join(...pathParts))
	}
	static WriteFile(path: string, absoluteJourPath: string, overwrite = false): void {
		if (overwrite || !FileSystem.IsFile(path)) {
			writeFileSync(path, absoluteJourPath)
		}
	}
	static PathExists(path: string): boolean {
		return existsSync(path)
	}
	static IsFile(path: string): boolean {
		return FileSystem.PathExists(path) && lstatSync(path).isFile()
	}
	static IsDirectory(path: string): boolean {
		return FileSystem.PathExists(path) && lstatSync(path).isDirectory()
	}
	static ReadFile(path: string, defaultData = ""): string {
		try {
			return readFileSync(path).toString()
		} catch (error) {
			return defaultData
		}
	}
	static FilesInDirectory(path: string): string[] {
		if (FileSystem.IsDirectory(path)) {
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
