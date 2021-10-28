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
		const configPath = JourConfig.GetJourConfigPath()
		const fullConfigContent = JSON.parse(FileSystem.ReadFile(configPath) || "{}")
		fullConfigContent.template = this.template
		fullConfigContent.extraData = this.extraData
		fullConfigContent.locale = this.locale

		FileSystem.WriteFile(configPath, JSON.stringify(fullConfigContent, null, 2), true)
		return true
	}
	static GetGlobalSettingsPath(): string { // Should be private, but need it right now
		return FileSystem.JoinResolve(FileSystem.HomeDir(), '.jour.settings')
	}

	static GetCurrentJourPath(): string {
		if(cachedJourPath) {
			return cachedJourPath
		}
		const settingsPath = JourConfig.GetGlobalSettingsPath()
		cachedJourPath = FileSystem.ReadFile(settingsPath)
		return cachedJourPath
	}

	private static GetJourConfigPath(){
		return FileSystem.JoinResolve(JourConfig.GetCurrentJourPath(), 'jour.json')
	}

	static GetJourConfig(): JourConfig {
		if(cachedJourConfig) {
			return cachedJourConfig
		}
		cachedJourConfig = this.LoadConfigFile()
		cachedJourConfig.path = JourConfig.GetCurrentJourPath()
		return cachedJourConfig
	}
	private static LoadConfigFile(): JourConfig {
		try {
			const configPath = JourConfig.GetJourConfigPath()
			const jsonConfig = JSON.parse(FileSystem.ReadFile(configPath))

			return new JourConfig(
				JourConfig.GetCurrentJourPath(),
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
