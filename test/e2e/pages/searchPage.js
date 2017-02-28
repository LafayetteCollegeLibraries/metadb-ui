const searchCommands = {
	search(query) {
		return this
			.waitForElementVisible('@queryInput')
			.setValue('@queryInput', query)
			.waitForElementVisible('@searchButton')
			.click('@searchButton')
	}
}


export default {
	url: 'http://localhost:8080/search',
	commands: [searchCommands],
	elements: {
		queryInput: {
			selector: 'input[type=text][name=query]'
		},
		searchButton: {
			selector: 'button'
		}
	}
}
