import { FileSystem } from './FileSystem'
import { JourError } from './JourError'
import { Logger } from './Logger'


let cachedJourPath = ''
let cachedJourConfig: JourConfig | undefined = undefined

export class JourGlobalSettings {
	/**
	 *
	 * @param journals Array of available directories which contains a journal
	 * @param currentJournal The current selected journal
	 */
	constructor(
		public journals: { [key: string]: string },
		public currentJournal?: string,
	) { }

	RegisterJournal(absoluteJourPath: string, jourName: string | undefined): void {
		// throw new Error('Method not implemented.')
		if (FileSystem.IsDirectory(absoluteJourPath)) {
			if (!this.journals[jourName || absoluteJourPath]) {
				this.journals[jourName || absoluteJourPath] = absoluteJourPath
			}
			this.SetCurrentJour(absoluteJourPath)
		} else {
			throw new JourError('Not a directory')
		}
	}
	SetCurrentJour(absoluteJourPath: string): void {
		this.currentJournal = absoluteJourPath
		Logger.info('Jour directory set to', absoluteJourPath)
	}

	Save(): void {
		FileSystem.WriteFile(JourGlobalSettings.GetGlobalSettingsPath(), JSON.stringify(this), true)
	}
	static GetGlobalSettingsPath(): string { // Should be private, but need it right now
		return FileSystem.JoinResolve(FileSystem.HomeDir(), '.jour.settings')
	}

	static GetGlobalSettings(): JourGlobalSettings {
		try {
			const globalSettings = JSON.parse(FileSystem.ReadFile(JourGlobalSettings.GetGlobalSettingsPath(), '{}'))
			globalSettings.journals = Array.isArray(globalSettings?.currentJournal) ? globalSettings.currentJournal.map((e: unknown) => String(e)) : []
			globalSettings.currentJournal = typeof (globalSettings?.currentJournal) === 'string' ? globalSettings.currentJournal : undefined
			return new JourGlobalSettings(globalSettings?.journals || {}, globalSettings?.currentJournal)
		} catch (error) {
			return new JourGlobalSettings({})
		}
	}
}

export class JourConfig {
	constructor(
		public path: string,
		public template: string,
		public extraData: Record<string, unknown>,
		public currentTime: Date = new Date(),
		public locale: string = Intl.DateTimeFormat().resolvedOptions().locale,
	) { }

	updateTemplate(template: string): boolean {
		this.template = template
		return this.save() // TODO: This makes it harder to unit-test. We should not save automagically. Save explicity on the outside
	}
	updateExtraData(extraData: Record<string, unknown>): boolean {
		this.extraData = extraData
		return this.save() // TODO: This makes it harder to unit-test. We should not save automagically. Save explicity on the outside
	}
	updateLocale(locale: string): boolean {
		this.locale = locale
		return this.save() // TODO: This makes it harder to unit-test. We should not save automagically. Save explicity on the outside
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

	static GetCurrentJourPath(): string {
		if (cachedJourPath) {
			return cachedJourPath
		}
		const settingsPath = JourGlobalSettings.GetGlobalSettings()
		cachedJourPath = settingsPath.currentJournal || ''
		return cachedJourPath
	}

	private static GetJourConfigPath() {
		return FileSystem.JoinResolve(JourConfig.GetCurrentJourPath(), 'jour.json')
	}

	static GetJourConfig(): JourConfig {
		if (cachedJourConfig) {
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
			if (error.message !== 'Unexpected end of JSON input') {
				console.error('Error reading config file. Using default', error)
			}
			return defaultConfig
		}
	}
}

const defaultConfig: JourConfig = new JourConfig('', 'journal', {}, new Date(), Intl.DateTimeFormat().resolvedOptions().locale)
