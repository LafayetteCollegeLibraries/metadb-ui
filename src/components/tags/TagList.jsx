import React from 'react'
import Tag from './Tag.jsx'

const T = React.PropTypes

const TagList = React.createClass({
  propTypes: {
    tags: T.arrayOf(T.string).isRequired,

    className: T.string,
    tagClassName: T.string,

    onClickTag: T.func,
    onRemoveTag: T.func,
    readOnly: T.bool,
  },

  getDefaultProps: function () {
    return {
      className: '',
      tagClassName: '',
      readOnly: false,
    }
  },

  handleTagClick: function (/* tag, index */) {
    this.props.onClickTag && this.props.onClickTag.apply(null, arguments)
  },

  handleTagRemove: function (/* tag, index */) {
    this.props.onRemoveTag && this.props.onRemoveTag.apply(null, arguments)
  },

  mapTags: function () {
    return this.props.tags.map((tag, index) => {
      const props = {
        key: tag + index,
        readOnly: this.props.readOnly,
        value: tag,
      }

      if (this.props.tagClassName)
        props.className = this.props.tagClassName

      if (this.props.onRemoveTag)
        props.onRemove = this.handleTagRemove.bind(null, tag, index)

      if (this.props.onClickTag)
        props.onClick = this.handleTagClick.bind(null, tag, index)

      return (
        <li className="tag-list-item" key={tag+index}>
          <Tag {...props} />
        </li>
      )
    })
  },

  render: function () {
    return (
      <ul className={[].concat('tag-list', this.props.className).join(' ')}>
        {this.mapTags()}
      </ul>
    )
  }
})

export default TagList
