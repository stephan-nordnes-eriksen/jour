# Jour cli

> Simple, and hopefully effective, personal journaling tool

## Install

```
$ npm install --global jour
```

## Usage

```
$ jour --help

  Usage
		$ jour
		$ jour <title>
	Options
		--template  Which template to use. Only one now  [Default: memo]
		--dir		Setup jour directory
	Examples
		$ jour --dir ./my/desired/jour/directory
			Setup your jour to target this folder
		$ jour
			creates a new jour entry, tagged today.
		$ jour This is my jour title entry
			creates a new jour entry, tagged today, with the provided written title.
```


> jour --dir ./my

## Intended use
This tool is intended to aid you in making a daily journal. Typically, you want to configure your desired journal path once, and then use the tool to generate new entries each day from anywhere in your terminal.

There is one global jour directory at a time, so no matter which directory your terminal points to, the generated jour entry will always be put into your currently selected jour directory.

## License
MIT
