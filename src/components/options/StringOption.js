import Option from './Option';
import { FormControl } from 'react-bootstrap';
import { NO_CHANGE_PLACEHOLDER } from '../../helpers/helpers'

const StringOption = (props) => {

  const { label, value, state, onChange } = props

  return <Option tooltip={value._TOOLTIP} unit={value._UNIT} {...props}>
    <FormControl
      id={label}
      value={state._VALUE || ''}
      disabled={!state._ENABLED}
      onChange={e => onChange({ [label]: {_ENABLED: true, _VALUE: e.target.value === '' ? undefined : e.target.value } })}
      placeholder={NO_CHANGE_PLACEHOLDER}
    />
  </Option>
}

export default StringOption;