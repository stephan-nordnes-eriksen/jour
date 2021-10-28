import { FileSystem } from './FileSystem'


let cachedJourPath = ""
let cachedJourConfig: JourConfig | undefined = undefined

export class JourConfig {
	constructor(
		public path: string,
		public template: string,
		public extraData: Record<string, unknown>,
		public currentTime: Date = new Date(),
		public locale: string = Intl.DateTimeFormat().resolvedOptions().locale,
	){}

	updateTemplate(template: string): boolean {
		this.template = template
		return this.save()
	}
	updateExtraData(extraData: Record<string, unknown>): boolean {
		this.extraData = extraData
		return this.save()
	}
	updateLocale(locale: string): boolean {
		this.locale = locale
		return this.save()
	}
	save(): boolean {
		const configPath = JourConfig.getJourConfigPath()
		const fullConfigContent = JSON.parse(FileSystem.readFile(configPath) || "{}")
		fullConfigContent.template = this.template
		fullConfigContent.extraData = this.extraData
		fullConfigContent.locale = this.locale

		FileSystem.writeFile(configPath, JSON.stringify(fullConfigContent, null, 2), true)
		return true
	}
	static getGlobalSettingsPath(): string { // Should be private, but need it right now
		return FileSystem.JoinResolve(FileSystem.HomeDir(), '.jour.settings')
	}

	static getCurrentJourPath(): string {
		if(cachedJourPath) {
			return cachedJourPath
		}
		const settingsPath = JourConfig.getGlobalSettingsPath()
		cachedJourPath = FileSystem.readFile(settingsPath)
		return cachedJourPath
	}

	private static getJourConfigPath(){
		return FileSystem.JoinResolve(JourConfig.getCurrentJourPath(), 'jour.json')
	}

	static getJourConfig(): JourConfig {
		if(cachedJourConfig) {
			return cachedJourConfig
		}
		cachedJourConfig = this.loadConfigFile()
		cachedJourConfig.path = JourConfig.getCurrentJourPath()
		return cachedJourConfig
	}
	private static loadConfigFile(): JourConfig {
		try {
			const configPath = JourConfig.getJourConfigPath()
			const jsonConfig = JSON.parse(FileSystem.readFile(configPath))

			return new JourConfig(
				JourConfig.getCurrentJourPath(),
				jsonConfig?.template || defaultConfig.template,
				jsonConfig?.extraData || defaultConfig.extraData,
				new Date(),
				jsonConfig?.locale || defaultConfig.locale,
			)
		} catch (error) {
			if(error.message !== 'Unexpected end of JSON input'){
				console.error('Error reading config file. Using default', error)
			}
			return defaultConfig
		}
	}
}

const defaultConfig: JourConfig = new JourConfig('', 'journal', {}, new Date(), Intl.DateTimeFormat().resolvedOptions().locale)
