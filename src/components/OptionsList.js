import { InputGroup, FormControl, Form, Card } from 'react-bootstrap';
import TriCheckbox from './TriCheckbox';

const NO_CHANGE_PLACEHOLDER = 'no change'

const OptionsList = ({ layout, state, onChange, title, className }) => {
  return (<Card className={className}>
    <Card.Header>{title}</Card.Header>
    <Card.Body>
      {
        Object.entries(layout || {})
          .map(([key, value]) =>
            renderKeyValue(key, value, state[key], onChange)
          )
      }
    </Card.Body>
  </Card>);
}

const renderObject = (key, value, state, onChange) => (
  <OptionsList key={key} title={key} layout={value}
    state={state}
    onChange={(x) => onChange({ [key]: x })} />
)

const renderArray = (key, value, state, onChange) => (
  <InputGroup title={value._TOOLTIP} key={key} size="sm" className="mb-1">
    <InputGroup.Text><label htmlFor={key}>{key}:</label></InputGroup.Text>
    <Form.Select id={key}
      value={state}
      onChange={e => onChange({ [key]: e.target.value === '' ? undefined : e.target.value })}>
      <option value={''}>{NO_CHANGE_PLACEHOLDER}</option>
      {
        value.map(key =>
          <option key={key} value={key}>
            {key}
          </option>
        )
      }
    </Form.Select>
  </InputGroup>
)

const renderBool = (key, value, state, onChange) => (
  <InputGroup title={value._TOOLTIP} key={key} size="sm" className="mb-1">
    <InputGroup.Text><label htmlFor={key}>{key}: </label></InputGroup.Text>
    <InputGroup.Text bsPrefix="input-group-text check-box-bg">
      <TriCheckbox id={key} state={state} onChange={e => onChange({ [key]: e.target.state })} />
    </InputGroup.Text>
  </InputGroup>
)

const renderInt = (key, value, state, onChange) => (
  <InputGroup title={value._TOOLTIP} key={key} size="sm" className="mb-1">
    <InputGroup.Text><label htmlFor={key}>{key}: </label></InputGroup.Text>
    <FormControl key={key} id={key} value={state === undefined ? '' : state} onChange={e => onChange({ [key]: e.target.value === '' ? undefined : parseInt(e.target.value) })} type="number" min="-1" placeholder={NO_CHANGE_PLACEHOLDER} />
    {value._UNIT && <InputGroup.Text>{value._UNIT}</InputGroup.Text>}
  </InputGroup>
  // <div>
  //   <label htmlFor={key}>{key}: </label>
  //   <input key={key} id={key} value={state || ''} onChange={e => onChange({[key]: e.target.value === '' ? undefined : parseInt(e.target.value)})} type="number" min="-1" placeholder={NO_CHANGE_PLACEHOLDER} />
  //   {value._UNIT && <label>{value._UNIT}</label>}
  // </div>
)

const renderString = (key, value, state, onChange) => (
  <InputGroup title={value._TOOLTIP} key={key} size="sm" className="mb-1">
    <InputGroup.Text><label htmlFor={key}>{key}: </label></InputGroup.Text>
    <FormControl key={key} id={key} value={state || ''} onChange={e => onChange({ [key]: e.target.value === '' ? undefined : parseInt(e.target.value) })} placeholder={NO_CHANGE_PLACEHOLDER} />
    {value._UNIT && <InputGroup.Text>{value._UNIT}</InputGroup.Text>}
  </InputGroup>
)

const renderKeyValue = (key, value, state, onChange) => {
  if ('_TYPE' in value) {
    if (value._HIDDEN) return null;

    const type = value._TYPE
    switch (type) {
      case 'array':
        return renderArray(key, value._OPTIONS, state, onChange);
      case 'bool':
        return renderBool(key, value, state, onChange)
      case 'int':
        return renderInt(key, value, state, onChange)
      case 'string':
        return renderString(key, value, state, onChange)
      default:
          return null;
    }
  }
  else {
    return renderObject(key, value, state, onChange)
  }
}

export default OptionsList;