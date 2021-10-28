import path from 'path'
import { JourConfig } from './JourConfig'
import { jourTemplate, Template } from './Template'
import { openFile } from './crossPlatformFileOpener'
import { FileSystem } from './FileSystem'

import { Logger } from './Logger'
import { GitHandler } from './GitHandler'
import { JourError } from './JourError'
export class JourSystem {
	constructor(public config: JourConfig, public LOG: Logger) {

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
		this.LOG.debug('Jour entry path', jourEntryPath)
		if (FileSystem.IsFile(jourEntryPath)) {
			if(title === "") {
				FileSystem.Open(jourEntryPath)
				this.LOG.info('Jour entry exists, opening', jourEntryPath)
				return
			}
			jourEntryPath = jourEntryPath.slice(0, -3) + '-' + this.config.currentTime.getTime() + '.md'
		}
		FileSystem.WriteFile(jourEntryPath, template)
		openFile(jourEntryPath)
		this.LOG.info('Jour entry created at', jourEntryPath)
	}
	Directory(jourPath?: string): void {
		if (!jourPath) {
			throw new JourError('Please provide a valid path')
		}
		let absoluteJourPath = jourPath
		if (!FileSystem.IsDirectory(jourPath)) {
			throw new JourError('Directory does not exist')
		} else {
			absoluteJourPath = FileSystem.GetRealPath(absoluteJourPath)
		}
		this.LOG.debug('JourConfig.getGlobalSettingsPath()', JourConfig.GetGlobalSettingsPath())
		this.LOG.debug('absoluteJourPath', absoluteJourPath)
		this.LOG.debug('JourConfig.getGlobalSettingsPath()', JourConfig.GetGlobalSettingsPath())
		FileSystem.WriteFile(JourConfig.GetGlobalSettingsPath(), absoluteJourPath, true)
		this.LOG.info('Jour directory set to', absoluteJourPath)
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
			this.LOG.info('Template updated to', this.config.template)
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
		GitHandler.Init(this, jourPath, gitRemote)
		this.LOG.info('Git connected in', jourPath)
	}

	Save(): void {
		const jourPath = JourConfig.GetCurrentJourPath() // I think this is available in the config.
		GitHandler.Save(this, jourPath)
		this.LOG.info('Saved in git', jourPath)
	}

	Upload(): void {
		const jourPath = JourConfig.GetCurrentJourPath()
		GitHandler.Upload(this, jourPath)
		this.LOG.info('Uploaded in git', jourPath)
	}

	Info(): void {
		this.Version()
		this.LOG.info('Current Jour directory ', this.config.path)
		this.LOG.info('Template               ', this.config.template)
		this.LOG.info('Extra data             ', this.config.extraData)
		this.LOG.info('Locale                 ', this.config.locale)
		this.LOG.debug('Full config:')
		this.LOG.debug(JSON.stringify(this.config, null, 2))
	}
	Version(): void {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pj = require('../package.json')
		this.LOG.info('Jour CLI version', pj.version)
		this.LOG.debug('Dependency versions:')
		this.LOG.debug(JSON.stringify(pj.dependencies, null, 2))
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
			this.LOG.debug(err)
			throw new JourError("Invalid locale " + locale)
		}
		if (this.config.updateLocale(actualLocale)) {
			this.LOG.info('Locale updated to', locale)
		}
	}
	About(): void {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pj = require('../package.json')
		this.LOG.info('')
		this.LOG.info('')
		this.LOG.info('Jour cli')
		this.LOG.info('')
		this.LOG.info('Created by')
		this.LOG.info(pj.author.name)
		this.LOG.info('')
		this.LOG.info('License')
		this.LOG.info(pj.license)
		this.LOG.info('')
		this.LOG.info('Code available at')
		this.LOG.info('https://github.com/' + pj.repository)
		this.LOG.info('   Give it a ⭐ if you like it!')
		this.LOG.info('')

		this.printLogo("Jour CLI - Simply write 📔")
	}

	List(): void {
		const jourDirectory = JourConfig.GetCurrentJourPath()
		const files = FileSystem.FilesInDirectory(jourDirectory).filter(file => {
			return file.startsWith('jour-') && file.endsWith('.md')
		})
		if(files.length > 0) {
			this.LOG.info("Jour entries:")
		}
		files.forEach(file => {
			this.LOG.info(file)
		})
	}

	async printLogo(inputText: string, progress = 1): Promise<unknown> {
		if(progress > inputText.length){
			this.LOG.info('')
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
