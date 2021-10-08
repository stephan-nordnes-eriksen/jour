# journal-cli

> A simple, and hopefully effective, personal journal tool

## Install

```
$ npm install --global journal-cli (? or what)
```

## Usage

```
$ journal --help

  Usage
		$ journal
		$ journal <title>
	Options
		--template  Which template to use. Only one now  [Default: memo]
		--setup		Setup journal directory
	Examples
		$ journal --setup ./my/desired/journal/directory
			Setup your journal to target this folder
		$ journal
			creates a new journal entry, tagged today.
		$ journal This is my journal title entry
			creates a new journal entry, tagged today, with the provided written title.
```


> journal --setup ./my

License MIT
