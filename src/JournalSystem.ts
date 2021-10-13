import path from 'path'
import { JournalConfig } from './JournalConfig'
import { journalTemplate, Template } from './Template'
import { openFile } from './crossPlatformFileOpener'
import { FileSystem } from './FileSystem'

import { Logger } from './Logger'
import { GitHandler } from './gitHandler'
import { JournalError } from './JournalError'

export class JournalSystem {
	constructor(private config: JournalConfig, public LOG: Logger){

	}

	NewJournalEntry(title: string) {
		// ...
		const journalDirectory = JournalConfig.getCurrentJournalPath()
		if(!journalDirectory || !FileSystem.isDirectory(journalDirectory)) {
			throw new JournalError('Journal directory not available. Setup with `journal --dir <path>`')
		}
		// const title = cli?.input?.join(' ') || ''


		const currentDate = new Date()
		const template = journalTemplate(this.config, title)
		if(!template){
			throw new JournalError("No template found.")
		}
		let journalEntryPath = path.join(journalDirectory, `journal-${currentDate.toDateString().split(' ').join('-')}.md`)
		if(FileSystem.isFile(journalEntryPath)){
			journalEntryPath = journalEntryPath.slice(0, -3) + '-' + currentDate.getTime() + '.md'
		}
		FileSystem.writeFile(journalEntryPath, template)
		openFile(journalEntryPath)
		this.LOG.debug('Journal set created at', journalEntryPath)
	}
	Directory(journalPath?: string) {
		// const journalPath = programOptions.dir
		if(!journalPath){
			throw new JournalError('Please provide a valid path')
		}
		let absoluteJournalPath = journalPath
		if(!FileSystem.isDirectory(journalPath)){
			// absoluteJournalPath = fileURLToPath(path.join(process.cwd(), journalPath))
			throw new JournalError('Directory does not exist')
		} else {
			absoluteJournalPath = FileSystem.getRealPath(absoluteJournalPath)
		}
		this.LOG.debug('JournalConfig.getGlobalSettingsPath()', JournalConfig.getGlobalSettingsPath())
		this.LOG.debug('absoluteJournalPath', absoluteJournalPath)
		this.LOG.debug('JournalConfig.getGlobalSettingsPath()', JournalConfig.getGlobalSettingsPath())
		FileSystem.writeFile(JournalConfig.getGlobalSettingsPath(), absoluteJournalPath, true)
		this.LOG.info('Journal location saved to', absoluteJournalPath)
	}

	Template(template: string) {
		const templatePath = Template.toPath(template)
		if (!Template.isValidTemplateLocation(templatePath)){
			throw new JournalError('Invalid template name or path')
		}
		if (!Template.isValidTemplate(templatePath)){
			throw new JournalError('Invalid template format\n\nJournal uses handlebars. Read about it here https://handlebarsjs.com')
		}
		if(this.config.updateTemplate(template)){
			this.LOG.info('Template updated to', this.config.template)
		} else {
			throw new JournalError("Unable to save template change.")
		}
	}
	// Config(configFilePath: string) {
	// }

	ConnectGitStorage(gitRemote?: string | boolean) {
		const journalPath = JournalConfig.getCurrentJournalPath()
		if (typeof(gitRemote) === 'boolean'){
			gitRemote = ""
		}
		GitHandler.init(this, journalPath, gitRemote)
		this.LOG.info('Git connected in', journalPath)
	}

	Save() {
		const journalPath = JournalConfig.getCurrentJournalPath()
		GitHandler.save(this, journalPath)
		this.LOG.info('Saved in git', journalPath)
	}

	Upload() {
		const journalPath = JournalConfig.getCurrentJournalPath()
		GitHandler.upload(this, journalPath)
		this.LOG.info('Uploaded in git', journalPath)
	}

	Info() {
		this.Version()
		this.LOG.info('Current Journal ', this.config.path)
		this.LOG.info('Template        ', this.config.template)
		this.LOG.info('Extra data      ', this.config.extraData)
		// this.LOG.info('config:         ', this.config)
	}
	Version() {
		const pj = require('../package.json')
		this.LOG.info('Journal CLI version', pj.version)
	}
	Open() {
		const journalPath = JournalConfig.getCurrentJournalPath()
		FileSystem.Open(journalPath)
	}
	Locale(locale: string) {
		// todo; but set locale in config
		if(this.config.updateLocale(locale)){
		}
	}
}
