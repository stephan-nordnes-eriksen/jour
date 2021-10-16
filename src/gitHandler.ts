import { execSync } from 'child_process'
import { JourError } from './JourError'
import { JourSystem } from './JourSystem'

export class GitHandler {
	static init(js: JourSystem, directory: string, gitRemote?: string) {
		try {
			execSync('git rev-parse --is-inside-work-tree', {
				cwd: directory,
				stdio: "ignore"
			})
			js.LOG.debug("Git already initialized")
			throw new JourError("Git already initialized")
		} catch (error) {
			// We expect that this git command throw an error if git isn't initialized
			// However, if that command succeeds, it means that we have a git repo already
			if(error instanceof JourError){
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
		execSync('git checkout -b jour', {
			cwd: directory
		})
	}
	static save(js: JourSystem,directory: string) {
		const now = new Date()

		execSync('git add .', {
			cwd: directory
		})
		execSync(`git commit -m "jour entry ${now.toDateString()}"`, {
			cwd: directory
		})
	}
	static upload(js: JourSystem, directory: string) {
		execSync('git push origin jour', {
			cwd: directory
		})
	}
}
