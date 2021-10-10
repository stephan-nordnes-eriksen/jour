import path from 'path'
import fs from 'fs'
import { JournalConfig } from './JournalConfig'
import { journalTemplate } from './Template'
import { openFile } from './crossPlatformFileOpener'
import { FileSystem } from './FileSystem'

import { Logger } from './Logger'

export class JournalSystem {
	constructor(private config: JournalConfig, private LOG: Logger){

	}

	NewJournalEntry(title: string) {
		// ...
		const journalDirectory = JournalConfig.getCurrentJournalPath()
		if(!journalDirectory || !fs.existsSync(journalDirectory)) {
			this.LOG.info('Journal directory not available. Setup with `journal setup <path>`')
			return
		}
		// const title = cli?.input?.join(' ') || ''


		const currentDate = new Date()
		const template = journalTemplate(currentDate, title)
		if(!template){
			return
		}
		let journalEntryPath = path.join(journalDirectory, `journal-${currentDate.toDateString().split(' ').join('-')}.md`)
		if(fs.existsSync(journalEntryPath)){
			journalEntryPath = journalEntryPath.slice(0, -3) + '-' + currentDate.getTime() + '.md'
		}
		fs.writeFileSync(journalEntryPath, template)
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
		if(!fs.existsSync(journalPath)){
			// absoluteJournalPath = fileURLToPath(path.join(process.cwd(), journalPath))
			this.LOG.info('Directory does not exist')
			return
		} else {
			absoluteJournalPath = fs.realpathSync(absoluteJournalPath)
		}
		this.LOG.debug('JournalConfig.getGlobalSettingsPath()', JournalConfig.getGlobalSettingsPath())
		this.LOG.debug('absoluteJournalPath', absoluteJournalPath)
		this.LOG.debug('JournalConfig.getGlobalSettingsPath()', JournalConfig.getGlobalSettingsPath())
		FileSystem.writeFile(JournalConfig.getGlobalSettingsPath(), absoluteJournalPath)
		this.LOG.info('Journal location saved to', absoluteJournalPath)
	}

	Template(dir: any) {
		throw new Error('Method not implemented.');
	}
	Config(dir: any) {
		throw new Error('Method not implemented.');
	}

	InitializeGitStorage() {

	}

	Save() {

	}

	Upload() {

	}
}
