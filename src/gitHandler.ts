import { execSync } from 'child_process'

export class GitHandler {
	static init(directory: string, gitRemote: string) {
		execSync('git --init', {
			cwd: directory
		})
		execSync(`git remote add origin ${gitRemote}`, {
			cwd: directory
		})
		execSync('git checkout -b journal', {
			cwd: directory
		})
	}
	static save(directory: string) {
		const now = new Date()

		execSync('git add .', {
			cwd: directory
		})
		execSync(`git commit -m "journal entry ${now.toDateString()}"`, {
			cwd: directory
		})
	}
	static upload(directory: string) {
		execSync('git push origin journal', {
			cwd: directory
		})
	}
}
