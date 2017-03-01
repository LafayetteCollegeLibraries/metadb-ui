import React from 'react'

const T = React.PropTypes

const SearchBreadcrumb = React.createClass({
  propTypes: {
    onRemove: T.func.isRequired,
    value: T.string,
    group: T.string,
  },

  getInitialState: function () {
    return {}
  },

  handleButtonClick: function (ev) {
    ev.preventDefault()

    this.props.onRemove()
  },

  maybeRenderGroup: function (style) {
    if (this.props.group)
      return (
        <span style={style}>
          {this.props.group + ' > '}
        </span>
      )
  },

  render: function () {
    const btnHover = this.state.buttonHover

    const borderRadiusVal = 10
    const btnHoverColor = '#cc092f'
    const borderColor = '#ccc'

    const styles = {
      container: {
        backgroundColor: '#fff',
        borderColor: (btnHover ? '#cc092f' : '#ccc'),
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: borderRadiusVal + 'px',
        display: 'inline-block',
        fontSize: '.9em',
        margin: '5px 10px',
        padding: '6px 8px',
        paddingRight: '35px',
        position: 'relative',
      },

      group: {
        color: '#999',
      },

      value: {
        fontWeight: 'bold',
      },

      closeBtn: {
        appearance: 'none',
        backgroundColor: (btnHover ? btnHoverColor : '#fff'),
        border: (btnHover ? '1px solid ' + btnHoverColor : 'none'),
        borderLeft: (btnHover ? 'inherit' : '1px solid #ccc'),
        borderBottomRightRadius: (borderRadiusVal - 1) + 'px',
        borderTopRightRadius: (borderRadiusVal - 1) + 'px',
        color: (btnHover ? '#fff' : '#222'),
        cursor: 'pointer',
        fontWeight: 'bold',
        height: '100%',
        margin: '0',
        outline: 'none',
        position: 'absolute',
        right: '0',
        top: '0',
        WebkitAppearance: 'none',
        width: '25px',
      },
    }

    return (
      <div style={styles.container}>
        {this.maybeRenderGroup(styles.group)}

        <span style={styles.value}>
          {this.props.value}
        </span>

        <button
          children="X"
          onClick={this.handleButtonClick}
          onMouseOut={() => this.setState({buttonHover: false})}
          onMouseOver={() => this.setState({buttonHover: true})}
          style={styles.closeBtn}
        />
      </div>
    )
  }
})

export default SearchBreadcrumb
