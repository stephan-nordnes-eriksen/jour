# Jour cli

> Simple, and hopefully effective, personal journaling tool

Use jour to help you create daily journal entries, right from your terminal.

## Install

```
$ npm install --global jour-cli
```

## Usage

```
Usage: cli [options]

Options:
  -d, --dir <directory>                         Set jour directory
  -t, --template <template-name>                Set which template to use. Name, or path to template
  -i, --info                                    Display information about current jour directory
  -v, --version                                 Display version info
  -c, --connect [optional-git-origin-repo-url]  Initialize, and optionally connect to remote, git in current jour directory.
  -s, --save                                    Adds, and commits, all files in current jour directory to git.
  -u, --upload                                  Pushes all git changes to remote repository.
  -V, --verbose                                 Print verbose debug logging
  -o, --open                                    Open current jour directory
  -l, --locale <locale>                         Set your desired locale, for date and time formatting. eg. "en-GB" (Unicode Language Identifier)
  -a, --about                                   Display information about Jour CLI
  -h, --help                                    display help for command

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

```


> jour --dir ./my

## Intended use
This tool is intended to aid you in making a daily journal. Typically, you want to configure your desired journal path once, and then use the tool to generate new entries each day from anywhere in your terminal.

There is one global jour directory at a time, so no matter which directory your terminal points to, the generated jour entry will always be put into your currently selected jour directory.

## License
MIT
