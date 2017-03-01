import React from 'react'
import PDFViewerTemplate from './PDFViewerTemplate.jsx'

const T = React.PropTypes

const PDFViewer = React.createClass({
  propTypes: {
    src: T.string
  },

  componentDidMount() {
    webViewerLoad(this.props.src)
  },

  render: function() {
    return (
      <div className="pdfjs">
        <PDFViewerTemplate/>
      </div>
    )
  }
})

export default PDFViewer
