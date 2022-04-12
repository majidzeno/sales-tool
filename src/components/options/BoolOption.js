import Option from './Option';
import TriCheckbox from '../TriCheckbox';
import { InputGroup } from 'react-bootstrap';


const BoolOption = (props) => {

  const { label, value, state, onChange } = props

  return <Option tooltip={value._TOOLTIP} unit={value._UNIT} {...props}>
    <InputGroup.Text bsPrefix="input-group-text check-box-bg">
      <TriCheckbox
        id={label}
        state={state._VALUE}
        disabled={!state._ENABLED}
        onChange={e => onChange({ [label]: { _ENABLED: true, _VALUE: e.target.state } })}
      />
    </InputGroup.Text>
  </Option>
}

export default BoolOption;