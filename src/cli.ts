#!/usr/bin/env node
import { Command } from 'commander'

import { JournalConfig } from './JournalConfig.js'
import { JournalError } from './JournalError.js'
import { JournalSystem } from './JournalSystem.js'
import { Logger } from './Logger.js'


const program = new Command()
//.argument('<words...>') // This seems suboptimal
program
.option('-d, --dir <directory>', 'Setup journal directory')
.option('-i, --info', 'Display information about current journal')
.option('-v, --version', 'Display version info')
// .option('-c, --config <configuration-file>', 'Set configuration file') // I think this is simply implicit from the journal path
.option('-c, --connect [optional-git-origin-repo-url]', 'Initialize and optionally connect to git storage solution on current journal directory.')
.option('-s, --save', 'save all modified journals with provided storage solution')
.option('-u, --upload', 'Upload saved journal entries to provided storage solution')
.option('-V, --verbose', 'Print verbose debug logging')
.option('-o, --open', 'Open current journal directory')
.option('-l, --locale <locale>', 'Set your desired locale, eg. "en-GB"')
.option('--delete', 'Delete something? Not sure')
.option('-a, --about', 'Display information about Journal CLI')
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
	const programOptions = program.opts()
	const LOG = new Logger(!!programOptions.verbose)
	try {
		const config = JournalConfig.getJournalConfig()
		const journal = new JournalSystem(config, LOG)
		LOG.debug('program.args', program.args)
		switch (true) {
			case !!programOptions.dir:
				LOG.debug('Running dir')
				journal.Directory(programOptions.dir)
				break
			case !!programOptions.template:
				LOG.debug('Running template')
				journal.Template(programOptions.template)
				break
			case !!programOptions.connect:
				LOG.debug('Running connect')
				journal.ConnectGitStorage(programOptions.connect)
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
			case !!programOptions.open:
				LOG.debug('Running open')
				journal.Open()
				break
			case !!programOptions.locale:
				LOG.debug('Running locale')
				journal.Locale(programOptions.locale)
				break
			case !!programOptions.about:
				LOG.debug('Running about')
				journal.About()
				break
			default:
				LOG.debug('Running default')
				LOG.debug('programOptions', programOptions)
				journal.NewJournalEntry(program?.args?.join(' ') || '')
				break
		}
	} catch (error) {
		if(error instanceof JournalError){
			LOG.error(error.message)
			process.exit(1)
		}
	}
}).parse(process.argv)