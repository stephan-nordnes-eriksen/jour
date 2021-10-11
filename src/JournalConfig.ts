import path from 'path'
import { FileSystem } from './FileSystem'


let cachedJournalPath: string = ""
let cachedJournalConfig: JournalConfig | undefined = undefined

const defaultConfig: JournalConfig = {
	path: '',
	template: 'journal',
	extraData: {},
}

export class JournalConfig {
	constructor(
		public path: string,
		public template: string,
		public extraData: {},
	){}

	static getGlobalSettingsPath(): string { // Should be private, but need it right now
		return path.resolve(path.join(__dirname, '..', 'journal.settings'))
	}

	static getCurrentJournalPath(): string {
		if(cachedJournalPath) {
			return cachedJournalPath
		}
		const settingsPath = JournalConfig.getGlobalSettingsPath()
		cachedJournalPath = FileSystem.readFile(settingsPath)
		return cachedJournalPath
	}

	private static getJournalConfigPath(){
		return path.join(JournalConfig.getCurrentJournalPath(), 'journal.json')
	}

	static getJournalConfig(): JournalConfig {
		if(cachedJournalConfig) {
			return cachedJournalConfig
		}
		const configPath = JournalConfig.getJournalConfigPath()
		cachedJournalConfig = this.loadConfigFile(configPath)
		cachedJournalConfig.path = JournalConfig.getCurrentJournalPath()
		return cachedJournalConfig
	}
	private static loadConfigFile(configPath: string): JournalConfig {
		try {
			const jsonConfig = JSON.parse(FileSystem.readFile(configPath))

			return new JournalConfig(
				JournalConfig.getCurrentJournalPath(),
				jsonConfig?.template || defaultConfig.template,
				jsonConfig?.extraData || defaultConfig.extraData
			)
		} catch (error) {
			if(error.message !== 'Unexpected end of JSON input'){
				console.error('Error reading config file. Using default', error)
			}
			return defaultConfig
		}
	}
}
