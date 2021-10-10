import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { JournalConfig } from './JournalConfig';
import { journalTemplate } from './Template';
import { openFile } from './crossPlatformFileOpener';



export class JournalSystem {
	static NewJournalEntry(title: string) {
		const journalDirectory = JournalConfig.getJournalPath()
		if(!journalDirectory || !fs.existsSync(journalDirectory)) {
			console.log('Journal directory not available. Setup with `journal setup <path>`')
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
		console.log('Journal set created at', journalEntryPath)
	}
	static Directory(journalPath?: string) {
		// const journalPath = programOptions.dir
		if(!journalPath){
			console.log('Please provide a valid path')
			return
		}
		let absoluteJournalPath = journalPath
		if(!fs.existsSync(journalPath)){
			// absoluteJournalPath = fileURLToPath(path.join(process.cwd(), journalPath))
			console.log('Directory does not exist')
			return
		} else {
			absoluteJournalPath = fs.realpathSync(absoluteJournalPath)
		}
		fs.writeFileSync(JournalConfig.getJournalSettingsPath(), absoluteJournalPath)
		console.log('Journal location saved to', absoluteJournalPath)
	}
}
