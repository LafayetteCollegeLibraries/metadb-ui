export default {
	'User Searches by Title': (client) => {
		const searchPage = client.page.searchPage()
		const resultsPage = client.page.resultsPage()

		searchPage
			.navigate()
			.search('DE MARQUIS DE LA FAYETTE')

		resultsPage.expect.element('@firstResultRow').text.to.contain('DE MARQUIS DE LA FAYETTE')

		client.end()
	}
}
