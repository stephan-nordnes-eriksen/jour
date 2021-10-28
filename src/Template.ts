import Handlebars from 'handlebars'
import path from 'path'
import { FileSystem } from './FileSystem'
import { JourError } from './JourError'
import { JourSystem } from './JourSystem'

const randomAwesomeShorts = [
	"Ran a marathon",
	"Had dinner with family",
	"Hiked a mountain",
]
export function jourTemplate(js: JourSystem, title = ""): string {
	const currentDateString = js.config.currentTime.toLocaleDateString(js.config.locale)
	const jourTemplateData: TemplateData = {
		entryTitle: 'Jour cli',
		date: js.config.currentTime,
		currentDateString: currentDateString,
		title: title || randomAwesomeShorts[Math.round(Math.random() * randomAwesomeShorts.length)],
		details: "",
		footer: "Generated by Jour cli",
	}

	return Template.ProcessTemplateName(js, js.config.template, jourTemplateData)
}
export class TemplateData {
	entryTitle = 'Jour cli'
	date: Date = new Date()
	currentDateString: string = this.date.toDateString()
	title = "Title"
	details = "Details"
	footer = "Generated by Jour cli"
}

export class Template {
	static ProcessTemplateName(js: JourSystem, templateName = "memo", templateData: TemplateData): string {
		// Dirty code
		js.LOG.debug('__dirname', __dirname)
		const templateFilePath = Template.ToPath(templateName)
		js.LOG.debug('templateFilePath', templateFilePath)
		if (Template.IsValidTemplateLocation(templateFilePath)){
			const templateFile = FileSystem.ReadFile(templateFilePath)
			if(Template.IsValidTemplate(templateFile)){
				const template = Handlebars.compile(templateFile)
				return template({jour: templateData, extra: {}})
			} else {
				throw new JourError("Invalid template")
			}
		} else {
			throw new JourError('Template file not found. Set it with `jour --template-path <path-to-template-folder>`')
		}
	}
	static IsValidTemplate(templateString: string): boolean{
		try {
			Handlebars.precompile(templateString)
			return true
		} catch (error) {
			return false
		}
	}
	static IsValidTemplateLocation(templateNameOrPath: string): boolean {
		return FileSystem.IsFile(templateNameOrPath)
		|| FileSystem.IsFile(path.join(__dirname, '..', 'templates', templateNameOrPath + '.hbs'))
	}
	static ToPath(templateNameOrPath: string): string {
		if(FileSystem.IsFile(templateNameOrPath)){
			return FileSystem.GetRealPath(templateNameOrPath)
		} else {
			return path.join(__dirname, '..', 'templates', templateNameOrPath + '.hbs')
		}
	}
}
