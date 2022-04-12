import { InputGroup } from 'react-bootstrap';

const trashHandler = (state, label, onChange) => {
  onChange({ [label]: {_ENABLED: !state._ENABLED, _VALUE: undefined} })
}

const Option = ({tooltip, label, unit, state, onChange, children}) => {
  return (
    <InputGroup title={tooltip} size="sm" className="mb-1">
      {
        //<InputGroup.Text><a className={state._ENABLED ? "trash-button" : "trash-button-x"} onClick={() => trashHandler(state, label, onChange)}></a></InputGroup.Text>
      }
      <InputGroup.Text><label className={state._ENABLED ? "enabled-text" : "disabled-text"} htmlFor={label}>{label}: </label></InputGroup.Text>
      {children}
      {unit && <InputGroup.Text>{unit}</InputGroup.Text>}
    </InputGroup>
  )
}

export default Option;