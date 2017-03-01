import React from 'react'
import MetadataForm from '../metadata/MetadataForm.jsx'
import FormField from '../metadata/FormField.jsx'
import StringInput from '../metadata/StringInput.jsx'
import Select from '../metadata/Select.jsx'

const T = React.PropTypes

const PREF_LABEL_BLACKLIST = [
  'pref_label',
  'term_count',
  'terms',
  'uri',
]

const GenericTerm = React.createClass({
  propTypes: {
    data: T.object.isRequired,

    onAddValueField: T.func.isRequired,
    onChange: T.func.isRequired,
    onRemoveValueField: T.func.isRequired,
    onSubmit: T.func.isRequired,
  },

  getArrayOfValues: function () {
    const data = this.props.data
    const dataKeys = Object.keys(data)

    let out = []
    let i = 0
    let key

    for (; i < dataKeys.length; i++) {
      key = dataKeys[i]

      if (!Object.prototype.hasOwnProperty.call(data, key))
        continue

      if (this.keyIsInBlacklist(key))
        continue

      out = out.concat(data[key])
    }

    return out
  },

  getPrefLabelValue: function () {
    const pref = this.props.data.pref_label
    return pref || ['']
  },

  keyIsInBlacklist: function (key) {
    return PREF_LABEL_BLACKLIST.indexOf(key) > -1
  },

  render: function () {
    const formProps = {
      ...this.props,
      defaultProps: {
        multiple: true,
        renderer: StringInput,
      }
    }

    const prefLabelProps = {
      multiple: false,
      options: this.getArrayOfValues(),
      renderer: Select,
      value: this.getPrefLabelValue(),
    }

    return (
      <MetadataForm {...formProps}>
        <FormField name="uri" label="URI" multiple={false} />
        <FormField name="label" label="Label" />
        <FormField name="alt_label" label="Alternate Label" />
        <FormField name="hidden_label" label="Hidden Label" />
        <FormField name="pref_label" label="Preferred Label" {...prefLabelProps} />
      </MetadataForm>
    )
  }
})

export default GenericTerm
