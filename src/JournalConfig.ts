import path from 'path'
import { FileSystem } from './FileSystem'


let cachedJournalPath: string = ""
let cachedJournalConfig: JournalConfig | undefined = undefined

export class JournalConfig {
	constructor(
		public path: string,
		public template: string,
		public extraData: {},
	){}

	updateTemplate(template: string) {
		this.template = template
		return this.save()
	}
	updateExtraData(extraData: any){
		this.extraData = extraData
		return this.save()
	}
	save() {
		const configPath = JournalConfig.getJournalConfigPath()
		const fullConfigContent = JSON.parse(FileSystem.readFile(configPath) || "{}")
		fullConfigContent.template = this.template
		fullConfigContent.extraData = this.extraData
		FileSystem.writeFile(configPath, JSON.stringify(fullConfigContent), true)
		return true
	}
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
		cachedJournalConfig = this.loadConfigFile()
		cachedJournalConfig.path = JournalConfig.getCurrentJournalPath()
		return cachedJournalConfig
	}
	private static loadConfigFile(): JournalConfig {
		try {
			const configPath = JournalConfig.getJournalConfigPath()
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

const defaultConfig: JournalConfig = new JournalConfig('', 'journal', {})
