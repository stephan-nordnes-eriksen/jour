import path from 'path'
import { JournalConfig } from './JournalConfig'
import { journalTemplate, Template } from './Template'
import { openFile } from './crossPlatformFileOpener'
import { FileSystem } from './FileSystem'

import { Logger } from './Logger'
import { GitHandler } from './gitHandler'

export class JournalSystem {
	constructor(private config: JournalConfig, private LOG: Logger){

	}

	NewJournalEntry(title: string) {
		// ...
		const journalDirectory = JournalConfig.getCurrentJournalPath()
		if(!journalDirectory || !FileSystem.isDirectory(journalDirectory)) {
			this.LOG.info('Journal directory not available. Setup with `journal --dir <path>`')
			return
		}
		// const title = cli?.input?.join(' ') || ''


		const currentDate = new Date()
		const template = journalTemplate(currentDate, title)
		if(!template){
			return
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
			this.LOG.info('Please provide a valid path')
			return
		}
		let absoluteJournalPath = journalPath
		if(!FileSystem.isDirectory(journalPath)){
			// absoluteJournalPath = fileURLToPath(path.join(process.cwd(), journalPath))
			this.LOG.info('Directory does not exist')
			return
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
			this.LOG.error('Invalid template name or path')
			return
		}
		if (!Template.isValidTemplate(templatePath)){
			this.LOG.error('Invalid template format')
			this.LOG.error('Journal uses handlebars. Read about it here https://handlebarsjs.com')
			return
		}
		if(this.config.updateTemplate(template)){
			this.LOG.info('Template updated to', this.config.template)
		}
	}
	// Config(configFilePath: string) {
	// }

	ConnectGitStorage(gitRemote: string) {
		const journalPath = JournalConfig.getCurrentJournalPath()
		GitHandler.init(journalPath, gitRemote)
		this.LOG.info('Git connected in', journalPath)
	}

	Save() {
		const journalPath = JournalConfig.getCurrentJournalPath()
		GitHandler.save(journalPath)
		this.LOG.info('Saved in git', journalPath)
	}

	Upload() {
		const journalPath = JournalConfig.getCurrentJournalPath()
		GitHandler.upload(journalPath)
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
}
