import { Card } from 'react-bootstrap';
import ArrayOption from './options/ArrayOption';
import BoolOption from './options/BoolOption';
import IntOption from './options/IntOption';
import StringOption from './options/StringOption';

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
  <OptionsList
    key={key}
    title={key}
    layout={value}
    state={state}
    onChange={(x) => onChange({ [key]: x })}
  />
)

const renderer = {
  'array': ArrayOption,
  'int': IntOption,
  'bool': BoolOption,
  'string': StringOption
}

const renderKeyValue = (key, value, state, onChange) => {
  if ('_TYPE' in value === false)
    return renderObject(key, value, state, onChange);

  if (value._HIDDEN) return null;

  const Render = renderer[value._TYPE]

  if (Render === null)
    return null;

  return <Render
    key={key}
    label={key}
    value={value}
    state={state}
    onChange={onChange}
  />
}

export default OptionsList;