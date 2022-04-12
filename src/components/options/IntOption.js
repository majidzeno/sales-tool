import Option from './Option';
import { FormControl } from 'react-bootstrap';
import { NO_CHANGE_PLACEHOLDER } from '../../helpers/helpers'

const processValue = (value) => (
  value === '' ? undefined : parseInt(value)
)

const IntOption = (props) => {

  const {label, value, state, onChange} = props

  return <Option tooltip={value._TOOLTIP} unit={value._UNIT} {...props}>
    <FormControl
      id={label}
      value={state._VALUE === undefined ? '' : state._VALUE}
      onChange={e => onChange({ [label]: {_ENABLED: true, _VALUE: processValue(e.target.value)} })}
      type="number"
      min="0"
      disabled={!state._ENABLED}
      placeholder={NO_CHANGE_PLACEHOLDER}
    />
  </Option>
}

export default IntOption;