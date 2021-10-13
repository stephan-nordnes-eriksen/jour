import { execSync } from 'child_process'
import { JournalError } from './JournalError'
import { JournalSystem } from './JournalSystem'

export class GitHandler {
	static init(js: JournalSystem, directory: string, gitRemote?: string) {
		try {
			execSync('git rev-parse --is-inside-work-tree', {
				cwd: directory,
				stdio: "ignore"
			})
			js.LOG.debug("Git already initialized")
			throw new JournalError("Git already initialized")
		} catch (error) {
			// We expect that this git command throw an error if git isn't initialized
			// However, if that command succeeds, it means that we have a git repo already
			if(error instanceof JournalError){
				throw error
			}
		}
		js.LOG.info('Setting up git in directory ', directory)
		execSync('git init', {
			cwd: directory
		})
		if(gitRemote){
			js.LOG.info(`Connecting to git remote ${gitRemote}`)
			execSync(`git remote add origin ${gitRemote}`, {
				cwd: directory
			})
		}
		execSync('git checkout -b journal', {
			cwd: directory
		})
	}
	static save(js: JournalSystem,directory: string) {
		const now = new Date()

		execSync('git add .', {
			cwd: directory
		})
		execSync(`git commit -m "journal entry ${now.toDateString()}"`, {
			cwd: directory
		})
	}
	static upload(js: JournalSystem, directory: string) {
		execSync('git push origin journal', {
			cwd: directory
		})
	}
}
