import path from 'path'
import fs from 'fs'

export class JournalConfig {
	static getJournalSettingsPath(){
		return path.join(__dirname, 'journal.settings')
	}
	static getJournalPath() {
		const settingsPath = JournalConfig.getJournalSettingsPath()
		if(!fs.existsSync(settingsPath)){
			return ""
		}
		return fs.readFileSync(settingsPath).toString()
	}
}
