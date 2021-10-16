#!/usr/bin/env node
import { Command } from 'commander'

import { JourConfig } from './JourConfig.js'
import { JourError } from './JourError.js'
import { JourSystem } from './JourSystem.js'
import { Logger } from './Logger.js'


const program = new Command()
//.argument('<words...>') // This seems suboptimal
program
.option('-d, --dir <directory>', 'Set jour directory')
.option('-t, --template <template-name>', 'Set which template to use. Name, or path to template')
.option('-i, --info', 'Display information about current jour directory')
.option('-v, --version', 'Display version info')
// .option('-c, --config <configuration-file>', 'Set configuration file') // I think this is simply implicit from the jour path
.option('-c, --connect [optional-git-origin-repo-url]', 'Initialize, and optionally connect to remote, git in current jour directory.')
.option('-s, --save', 'Adds, and commits, all files in current jour directory to git.')
.option('-u, --upload', 'Pushes all git changes to remote repository.')
.option('-V, --verbose', 'Print verbose debug logging')
.option('-o, --open', 'Open current jour directory')
.option('-l, --locale <locale>', 'Set your desired locale, for date and time formatting. eg. "en-GB" (Unicode Language Identifier)')
.option('-a, --about', 'Display information about Jour CLI')
.addHelpText('after', `
Examples:
$ jour --dir ./my/desired/jour/directory
	Set current jour directory. Jour directory is set globally.
$ jour
	Generate todays jour entry, or open existing entry if one already exists. Open in default editor.
$ jour Title for todays entry
	Generate a new daily jour entry, tagged today, with the provided written title. Unix timestamped if exists.
$ jour --template memo
	Set jour template for the current jour directory. Updates jour.json in jour directory.
$ jour --template ./my/desired/template.hbs
	Set custom jour template for the current jour directory. Updates jour.json in jour directory.

Git connection:
$ jour --connect
	Initializes git in current jour directory. Jour creates a branch named "jour" which is used by default.
$ jour --connect https://github.com/YOUR-USERNAME/my-daily-journal
	Initializes git in current jour directory, connecting to your provided remote url.
$ jour --save
	Adds, and commits, all files in current jour directory to git.
$ jour --upload
	Pushes all git changes to remote repository.

`)
.action(() => {
	const programOptions = program.opts()
	const LOG = new Logger(!!programOptions.verbose)
	try {
		const config = JourConfig.getJourConfig()
		const jour = new JourSystem(config, LOG)
		LOG.debug('program.args', program.args)
		switch (true) {
			case !!programOptions.dir:
				LOG.debug('Running dir')
				jour.Directory(programOptions.dir)
				break
			case !!programOptions.template:
				LOG.debug('Running template')
				jour.Template(programOptions.template)
				break
			case !!programOptions.connect:
				LOG.debug('Running connect')
				jour.ConnectGitStorage(programOptions.connect)
				break
			case !!programOptions.save:
				LOG.debug('Running save')
				jour.Save()
				break
			case !!programOptions.upload:
				LOG.debug('Running upload')
				jour.Upload()
				break
			case !!programOptions.info:
				LOG.debug('Running info')
				jour.Info()
				break
			case !!programOptions.version:
				LOG.debug('Running version')
				jour.Version()
				break
			case !!programOptions.open:
				LOG.debug('Running open')
				jour.Open()
				break
			case !!programOptions.locale:
				LOG.debug('Running locale')
				jour.Locale(programOptions.locale)
				break
			case !!programOptions.about:
				LOG.debug('Running about')
				jour.About()
				break
			default:
				LOG.debug('Running default')
				LOG.debug('programOptions', programOptions)
				jour.NewJourEntry(program?.args?.join(' ') || '')
				break
		}
	} catch (error) {
		if(error instanceof JourError){
			LOG.error(error.message)
			process.exit(1)
		}
	}
}).parse(process.argv)
