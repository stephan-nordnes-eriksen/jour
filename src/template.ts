import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const randomAwesomeShorts = [
	"Ran a marathon",
	"Had dinner with family",
	"Hiked a mountain",
]
export function journalTemplate(currentDate: Date, title = "") {
	const currentDateString = currentDate.toDateString()
	const journalTemplateData: TemplateData = {
		entryTitle: 'Journal',
		date: currentDate,
		currentDateString: currentDateString,
		title: title || randomAwesomeShorts[Math.round(Math.random() * randomAwesomeShorts.length)],
		details: "",
		footer: "Generated by Journal.cli",
	}
	return Template.processTemplateName('memo', journalTemplateData)
}
export class TemplateData {
	entryTitle = 'Journal'
	date: Date = new Date()
	currentDateString: string = this.date.toDateString()
	title = "Title"
	details = "Details"
	footer = "Generated by Journal.cli"
}
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export class Template {
	static processTemplateName(templateName = "memo", templateData: TemplateData): string {
		console.log('__dirname', __dirname)
		const templateFilePath = path.join(__dirname, '..', 'templates', templateName + '.hbs')
		console.log('templateFilePath', templateFilePath)
		if(fs.existsSync(templateFilePath)){
			const templateFile = fs.readFileSync(templateFilePath).toString()
			const template =  Handlebars.compile(templateFile)
			return template({journal: templateData, extra: {}})
		} else {
			console.log('Template file not found. Set it with `journal --template-path <path-to-template-folder>`')
			return ""
		}
	}
}
