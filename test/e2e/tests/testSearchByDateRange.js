export default {
	'User Searches by Date Range': (client) => {
		const searchPage = client.page.searchPage()
		const resultsPage = client.page.resultsPage()

		searchPage
			.navigate()
			.search('')

		resultsPage.expect.element('@facetPanel').to.be.present
		client.click('.facet-panel[data-facet^="date"] header')
		resultsPage.expect.element('@dateOriginal').to.be.present

		client.execute(() => {
			document.getElementsByTagName('input')[2].setAttribute('max', '1945-08-15')
			document.getElementsByTagName('input')[1].setAttribute('max', '1945-08-15')

			document.getElementsByTagName('input')[2].setAttribute('min', '1785-08-26')
			document.getElementsByTagName('input')[1].setAttribute('min', '1785-08-26')
		})

		resultsPage.expect.element('@dateOriginal').to.have.attribute('min').which.equals('1785-08-26')


		resultsPage.expect.element('@dateOriginal').to.have.attribute('max').which.equals('1945-08-15')
		client.click('.facet-panel[data-facet^="date"] button')

		resultsPage.expect.element('@thumbnail').to.be.present
		client.execute(() => {
			let link = document.getElementsByTagName('a')
			Array.prototype.forEach.call(link, (val) => {
				if(val.href.match(/.*\/works\//g)) {
					val.click()
				}
			})
		})

		resultsPage.expect.element('@dateOriginal').to.be.present

		// client.execute(() => {
		// 	var date = document.getElementsByClassName('MetadataForm')[0].childNodes[6].getElementsByTagName("input")[0]
		// 	date = date.split('-')
		// 	date = date.join(',')
		// 	date = new Date(date).getTime()
		// })
		// client.expect.that(false)

		// test
		client.end()
	}
}
