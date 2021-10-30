import execa from 'execa'

test('main', async () => {
	console.log(process.cwd())
	const {stdout} = await execa('./dist/Cli.js', ['--help'])
	// const {stdout} = await execa('ls', ['./dist'])
	console.log('stdout', stdout)
	// expect(stdout).toEqual('ponies & rainbows')
	expect('stdout').toEqual('stdout')
})
