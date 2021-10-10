#!/usr/bin/env node
// import meow from 'meow';
import { Command } from 'commander'

// import unicornFun from 'unicorn-fun';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { openFile } from './crossPlatformFileOpener.js'
import { JournalConfig } from './JournalConfig.js';
import { JournalSystem } from './JournalSystem.js';
import { Template, TemplateData } from './Template.js'


const program = new Command();
program
//.argument('<words...>') // This seems suboptimal
.option('-d, --dir <directory>', 'Setup journal directory')
.option('-c, --config <configuration-file>', 'Set configuratoin file')
.option('-t, --template <template-name>', 'which template to use', 'memo')
.option('-igs, --initializeGitStorage <git-repo-url>', 'Initialize git storage solution on current journal directory')
.option('-s, --save', 'save all modified journals with provided storage solution')
.option('-u, --upload', 'Upload saved journal entries to provided storage solution')
.option('--delete', 'Upload saved journal entries to provided')
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
	Set your desired template folder
$ journal --config <path-to-config-file>
	Set your desired config file.
`)
.action(() => {
	// program.parse(process.argv)
	console.log('program.args', program.args)
	const programOptions = program.opts();
	// if(programOptions.dir) {
	// 	return
	// }

	switch (true) {
		case !!programOptions.dir:
			console.log('Running dir')
			JournalSystem.Directory(programOptions.dir)
			break;
		case !!programOptions.config:
			// JournalSystem.Directory(programOptions.dir)
			console.log('Running config')
			break;
		case !!programOptions.template:
			// JournalSystem.Directory(programOptions.dir)
			console.log('Running template')
			break;
		case !!programOptions.initializeGitStorage:
			JournalSystem.InitializeGitStorage()
			console.log('Running initializeGitStorage')
			break;
		case !!programOptions.save:
			JournalSystem.Save()
			console.log('Running save')
			break;
		case !!programOptions.upload:
			JournalSystem.Upload()
			console.log('Running upload')
			break;
		default:
			console.log('Running default')
			console.log('programOptions', programOptions)
			JournalSystem.NewJournalEntry(program?.args?.join(' ') || '')
			break;
	}
}).parse(process.argv)

console.log('hello')
