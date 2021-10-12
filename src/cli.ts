#!/usr/bin/env node
import { Command } from 'commander'

import { JournalConfig } from './JournalConfig.js'
import { JournalSystem } from './JournalSystem.js'
import { Logger } from './Logger.js'


const program = new Command()
//.argument('<words...>') // This seems suboptimal
program
.option('-d, --dir <directory>', 'Setup journal directory')
.option('-i, --info', 'Display information about current journal')
.option('--version', 'Display version info')
// .option('-c, --config <configuration-file>', 'Set configuration file') // I think this is simply implicit from the journal path
.option('-c, --connect <git-repo-url>', 'Connect to git storage solution on current journal directory')
.option('-s, --save', 'save all modified journals with provided storage solution')
.option('-u, --upload', 'Upload saved journal entries to provided storage solution')
.option('-v, --verbose', 'Print verbose debug logging')
.option('--delete', 'Delete something? Not sure')
.option('-t, --template <template-name>', 'Set which template to use. Name, or path to template')
.addHelpText('after', `
Examples:
$ journal --dir ./my/desired/journal/directory
	Setup your journal to target this folder
$ journal
	creates a new journal entry, tagged today.
$ journal This is my journal title entry
	creates a new journal entry, tagged today, with the provided written title.
$ journal --template=memo Todays Title
	creates a new journal entry from template name memo
$ journal --template-path <path-to-template-folder>
	Set your desired template
$ journal --config <path-to-config-file>
	Set your desired config file.
`)
.action(() => {
	// program.parse(process.argv)
	const programOptions = program.opts()
	// if(programOptions.dir) {
	// 	return
	// }
	const config = JournalConfig.getJournalConfig()
	const LOG = new Logger(!!programOptions.verbose)
	const journal = new JournalSystem(config, LOG)
	LOG.debug('program.args', program.args)
	switch (true) {
		case !!programOptions.dir:
			LOG.debug('Running dir')
			journal.Directory(programOptions.dir)
			break
		// case !!programOptions.config: // Going to remove this probably, as it is fully implicit
		// 	LOG.debug('Running config')
		// 	journal.Config(programOptions.config)
		// 	break
		// template is a setting, not a something else
		case !!programOptions.template:
			LOG.debug('Running template')
			journal.Template(programOptions.template)
			break
		case !!programOptions.connect:
			LOG.debug('Running connect')
			journal.ConnectGitStorage()
			break
		case !!programOptions.save:
			LOG.debug('Running save')
			journal.Save()
			break
		case !!programOptions.upload:
			LOG.debug('Running upload')
			journal.Upload()
			break
		case !!programOptions.delete:
			LOG.debug('Running upload')
			journal.Upload()
			break
		case !!programOptions.info:
			LOG.debug('Running info')
			journal.Info()
			break
		case !!programOptions.version:
			LOG.debug('Running version')
			journal.Version()
			break
		default:
			LOG.debug('Running default')
			LOG.debug('programOptions', programOptions)
			journal.NewJournalEntry(program?.args?.join(' ') || '')
			break
	}
}).parse(process.argv)
