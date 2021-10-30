import { execSync } from 'child_process'
import { JourError } from './JourError'
import { Logger } from './Logger'

export class GitHandler {
	static Init(directory: string, gitRemote?: string): void {
		try {
			execSync('git rev-parse --is-inside-work-tree', {
				cwd: directory,
				stdio: "ignore"
			})
			Logger.debug("Git already initialized")
			throw new JourError("Git already initialized")
		} catch (error) {
			// We expect that this git command throw an error if git isn't initialized
			// However, if that command succeeds, it means that we have a git repo already
			if(error instanceof JourError){
				throw error
			}
		}
		Logger.info('Setting up git in directory ', directory)
		execSync('git init', {
			cwd: directory
		})
		if(gitRemote){
			Logger.info(`Connecting to git remote ${gitRemote}`)
			execSync(`git remote add origin ${gitRemote}`, {
				cwd: directory
			})
		}
		execSync('git checkout -b jour', {
			cwd: directory
		})
	}
	static Save(directory: string): void {
		const now = new Date()

		execSync('git add .', {
			cwd: directory
		})
		execSync(`git commit -m "jour entry ${now.toDateString()}"`, {
			cwd: directory
		})
	}
	static Upload(directory: string): void {
		execSync('git push origin jour', {
			cwd: directory
		})
	}
}
