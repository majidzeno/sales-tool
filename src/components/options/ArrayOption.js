import Option from './Option';
import { Form } from 'react-bootstrap';
import { NO_CHANGE_PLACEHOLDER } from '../../helpers/helpers'

const ArrayOption = (props) => {

  const { label, value, state, onChange } = props

  return <Option tooltip={value._TOOLTIP} label={label} unit={value._UNIT} {...props}>
    <Form.Select disabled={!state._ENABLED} id={label}
      value={state._VALUE === undefined ? NO_CHANGE_PLACEHOLDER : state._VALUE}
      onChange={e => onChange({ [label]: { _ENABLED: true, _VALUE: e.target.value === '' ? undefined : e.target.value } })}>
      <option value=''>{NO_CHANGE_PLACEHOLDER}</option>
      {
        value._OPTIONS.map(key =>
          <option key={key} value={key}>
            {key}
          </option>
        )
      }
    </Form.Select>
  </Option>
}

export default ArrayOption;