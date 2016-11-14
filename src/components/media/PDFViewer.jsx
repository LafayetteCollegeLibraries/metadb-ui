import React from 'react'
import pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker'
import viewerSrc from 'pdfjs-dist/web/pdf_viewer'

pdfjsLib.PDFJS.workerSrc = workerSrc

const PDFViewer = React.createClass({
	pdfPath: 'http://localhost:8080/DraftReport.pdf',

	componentDidMount: function(){
		pdfjsLib.getDocument(this.pdfPath).then(function(pdf){
			console.log("Number of pages: " + pdf.numPages)

			var container = document.getElementById("container");

			for(var i = 1; i <= pdf.numPages; i++){
				pdf.getPage(i).then(function(page){
					const viewport = page.getViewport(1.5)
					const div = document.createElement("div")

					div.setAttribute("id", "page-" + (page.pageIndex + 1))
					div.setAttribute("style", "position: relative")
					container.appendChild(div)

					const canvas = document.createElement("canvas")
					div.appendChild(canvas)
					const ctx = canvas.getContext('2d')
					canvas.width = viewport.width
					canvas.height = viewport.height
					const renderContext = {
						canvasContext: ctx,
						viewport: viewport
					};
					page.render(renderContext)
							.then(function(){ return page.getTextContent() })
							.then(function(textContent){
								var textLayerDiv = document.createElement("div")
								textLayerDiv.setAttribute("class", "textLayer")
								console.log(textLayerDiv);
								div.appendChild(textLayerDiv);
								//console.log(viewerSrc);
								var textLayer = new viewerSrc.PDFJS.TextLayerBuilder({
									textLayerDiv: textLayerDiv,
									pageIndex: page.pageIndex,
									viewport: viewport
								})

								textLayer.setTextContent(textContent)
								textLayer.render()
							})
				})
			}

		}).catch(function(reason){
			console.error('We have error' + reason);
		})
	},

	render: function(){
		return(
			<div id="container"></div>
		)
	}

})

export default PDFViewer
