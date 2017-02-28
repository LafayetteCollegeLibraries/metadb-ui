const spawn = require('child_process').spawn

// using `{stdio: 'inherit'}` pipes each script's stdin/stdout/stderr
// to their respective counterpart in the `process` object

// boots the `lafayette-preserve-mock` api server
const mockServer = spawn('npm', ['run', 'mock-server'], {stdio: 'inherit'})

// boots the simple static server that allows us to access files
// in the `build` directory
const testApp = spawn('npm', ['run', 'test:app'], {stdio: 'inherit'})

// a) bundles the app to `build/bundle.js` and `build/style.css`
// b) runs the nightwatch tests
// c) removes the aforementioned build files
const e2e = spawn('npm', ['run', 'e2e-loop'], {stdio: 'inherit'})

// shut down the mock server + test app server after the e2e loop runs
e2e.on('close', () => {
	mockServer.kill()
	testApp.kill()
})
