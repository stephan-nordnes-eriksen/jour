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
		const jourDirectory = JourConfig.getCurrentJourPath()
		if (!jourDirectory || !FileSystem.isDirectory(jourDirectory)) {
			throw new JourError('Jour directory not available. Setup with `jour --dir <path>`')
		}

		const currentDate = new Date()
		const template = jourTemplate(this, title)
		if (!template) {
			throw new JourError("No template found.")
		}
		let jourEntryPath = path.join(jourDirectory, `jour-${currentDate.toDateString().split(' ').join('-')}.md`)
		if (FileSystem.isFile(jourEntryPath)) {
			if(title === "") {
				FileSystem.Open(jourEntryPath)
				this.LOG.info('Jour entry exists, opening', jourEntryPath)
				return
			}
			jourEntryPath = jourEntryPath.slice(0, -3) + '-' + currentDate.getTime() + '.md'
		}
		FileSystem.writeFile(jourEntryPath, template)
		openFile(jourEntryPath)
		this.LOG.info('Jour entry created at', jourEntryPath)
	}
	Directory(jourPath?: string): void {
		if (!jourPath) {
			throw new JourError('Please provide a valid path')
		}
		let absoluteJourPath = jourPath
		if (!FileSystem.isDirectory(jourPath)) {
			throw new JourError('Directory does not exist')
		} else {
			absoluteJourPath = FileSystem.getRealPath(absoluteJourPath)
		}
		this.LOG.debug('JourConfig.getGlobalSettingsPath()', JourConfig.getGlobalSettingsPath())
		this.LOG.debug('absoluteJourPath', absoluteJourPath)
		this.LOG.debug('JourConfig.getGlobalSettingsPath()', JourConfig.getGlobalSettingsPath())
		FileSystem.writeFile(JourConfig.getGlobalSettingsPath(), absoluteJourPath, true)
		this.LOG.info('Jour directory set to', absoluteJourPath)
	}

	Template(template: string): void {
		const templatePath = Template.toPath(template)
		if (!Template.isValidTemplateLocation(templatePath)) {
			throw new JourError('Invalid template name or path')
		}
		if (!Template.isValidTemplate(templatePath)) {
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
		const jourPath = JourConfig.getCurrentJourPath()
		if (typeof (gitRemote) === 'boolean') {
			gitRemote = ""
		}
		GitHandler.init(this, jourPath, gitRemote)
		this.LOG.info('Git connected in', jourPath)
	}

	Save(): void {
		const jourPath = JourConfig.getCurrentJourPath() // I think this is available in the config.
		GitHandler.save(this, jourPath)
		this.LOG.info('Saved in git', jourPath)
	}

	Upload(): void {
		const jourPath = JourConfig.getCurrentJourPath()
		GitHandler.upload(this, jourPath)
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
		const jourPath = JourConfig.getCurrentJourPath()
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
