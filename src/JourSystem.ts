import path from 'path'
import { JourConfig, JourGlobalSettings } from './JourConfig'
import { jourTemplate, Template } from './Template'
import { OpenFile } from './CrossPlatformFileOpener'
import { FileSystem } from './FileSystem'

import { Logger } from './Logger'
import { GitHandler } from './GitHandler'
import { JourError } from './JourError'
export class JourSystem {
	constructor(public config: JourConfig) {
	}

	NewJourEntry(title: string): void {
		const jourDirectory = JourConfig.GetCurrentJourPath()
		if (!jourDirectory || !FileSystem.IsDirectory(jourDirectory)) {
			throw new JourError('Jour directory not available. Setup with `jour --dir <path>`')
		}

		const template = jourTemplate(this, title)
		if (!template) {
			throw new JourError("No template found.")
		}
		let jourEntryPath = path.join(jourDirectory, `jour-${this.config.currentTime.toLocaleDateString(this.config.locale).split(/ |\/|\./).join('-')}.md`)
		Logger.debug('Jour entry path', jourEntryPath)
		if (FileSystem.IsFile(jourEntryPath)) {
			if(title === "") {
				FileSystem.Open(jourEntryPath)
				Logger.info('Jour entry exists, opening', jourEntryPath)
				return
			}
			jourEntryPath = jourEntryPath.slice(0, -3) + '-' + this.config.currentTime.getTime() + '.md'
		}
		FileSystem.WriteFile(jourEntryPath, template)
		OpenFile(jourEntryPath)
		Logger.info('Jour entry created at', jourEntryPath)
	}
	Register(jourPath?: string, jourName?: string): void {
		if (!jourPath) {
			throw new JourError('Please provide a valid path')
		}
		let absoluteJourPath = jourPath
		if (!FileSystem.IsDirectory(jourPath)) {
			throw new JourError('Directory does not exist')
		} else {
			absoluteJourPath = FileSystem.GetRealPath(absoluteJourPath)
		}
		Logger.debug('JourGlobalSettings.GetGlobalSettingsPath()', JourGlobalSettings.GetGlobalSettingsPath())
		Logger.debug('absoluteJourPath', absoluteJourPath)
		Logger.debug('JourGlobalSettings.GetGlobalSettingsPath()', JourGlobalSettings.GetGlobalSettingsPath())
		const globalSettings = JourGlobalSettings.GetGlobalSettings()
		globalSettings.RegisterJournal( absoluteJourPath, jourName)
		globalSettings.Save()
	}

	Template(template: string): void {
		const templatePath = Template.ToPath(template)
		if (!Template.IsValidTemplateLocation(templatePath)) {
			throw new JourError('Invalid template name or path')
		}
		if (!Template.IsValidTemplate(templatePath)) {
			throw new JourError('Invalid template format\n\nJour uses handlebars. Read about it here https://handlebarsjs.com')
		}
		if (this.config.updateTemplate(template)) {
			Logger.info('Template updated to', this.config.template)
		} else {
			throw new JourError("Unable to save template change.")
		}
	}
	// Config(configFilePath: string) {
	// }

	ConnectGitStorage(gitRemote?: string | boolean): void {
		const jourPath = JourConfig.GetCurrentJourPath()
		if (typeof (gitRemote) === 'boolean') {
			gitRemote = ""
		}
		GitHandler.Init(jourPath, gitRemote)
		Logger.info('Git connected in', jourPath)
	}

	Save(): void {
		const jourPath = JourConfig.GetCurrentJourPath() // I think this is available in the config.
		GitHandler.Save(jourPath)
		Logger.info('Saved in git', jourPath)
	}

	Upload(): void {
		const jourPath = JourConfig.GetCurrentJourPath()
		GitHandler.Upload(jourPath)
		Logger.info('Uploaded in git', jourPath)
	}

	Info(): void {
		this.Version()
		Logger.info('Current Jour directory ', this.config.path)
		Logger.info('Template               ', this.config.template)
		Logger.info('Extra data             ', this.config.extraData)
		Logger.info('Locale                 ', this.config.locale)
		Logger.debug('Full config:')
		Logger.debug(JSON.stringify(this.config, null, 2))
	}
	Version(): void {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pj = require('../package.json')
		Logger.info('Jour CLI version', pj.version)
		Logger.debug('Dependency versions:')
		Logger.debug(JSON.stringify(pj.dependencies, null, 2))
	}
	Open(): void {
		const jourPath = JourConfig.GetCurrentJourPath()
		FileSystem.Open(jourPath)
	}
	Locale(locale: string): void {
		// todo; but set locale in config
		// Intl.DateTimeFormat().resolvedOptions().locale
		let actualLocale = locale
		try {
			// Intl.getCanonicalLocales('EN_US');
			actualLocale = Intl.DateTimeFormat(locale).resolvedOptions().locale
		} catch (err) {
			Logger.debug(err)
			throw new JourError("Invalid locale " + locale)
		}
		if (this.config.updateLocale(actualLocale)) {
			Logger.info('Locale updated to', locale)
		}
	}
	About(): void {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pj = require('../package.json')
		Logger.info('')
		Logger.info('')
		Logger.info('Jour cli')
		Logger.info('')
		Logger.info('Created by')
		Logger.info(pj.author.name)
		Logger.info('')
		Logger.info('License')
		Logger.info(pj.license)
		Logger.info('')
		Logger.info('Code available at')
		Logger.info('https://github.com/' + pj.repository)
		Logger.info('   Give it a ⭐ if you like it!')
		Logger.info('')

		this.printLogo("Jour CLI - Simply write 📔")
	}

	List(): void {
		const jourDirectory = JourConfig.GetCurrentJourPath()
		const files = FileSystem.FilesInDirectory(jourDirectory).filter(file => {
			return file.startsWith('jour-') && file.endsWith('.md')
		})
		if(files.length > 0) {
			Logger.info("Jour entries:")
		}
		files.forEach(file => {
			Logger.info(file)
		})
	}

	ListTemplates(): void {
		Logger.info('Available templates')
		Template.ListTemplates().forEach(template => {
			Logger.info(template)
		})
	}

	async printLogo(inputText: string, progress = 1): Promise<unknown> {
		if(progress > inputText.length){
			Logger.info('')
			return
		}
		process.stdout.clearLine(1)
		process.stdout.cursorTo(0)
		process.stdout.write(inputText.slice(0, progress))
		setTimeout(() => {
			this.printLogo(inputText, progress + 1)
		}, 50 + Math.random()*100)
	}
}
