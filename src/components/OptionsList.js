import TriCheckbox from './TriCheckbox';
import { isObject } from '../helpers/helpers';

const OptionsList = ({ layout, state, onChange }) => {
  return (<ul>
    {
      Object.entries(layout || {}).map(([key, value]) => {
        return <li key={key}>{
          renderKeyValue(key, value, state[key], onChange)
        }</li>;
      })
    }
  </ul>);
}

const renderObject = (key, value, state, onChange) => (
  <div>
    {key}
    <OptionsList layout={value}
      state={state}
      onChange={(x) => onChange({ [key]: x })} />
  </div>
)

const renderArray = (key, value, state, onChange) => (
  <div>
    <label htmlFor={key}>{key}: </label>
    <select id={key}
      value={state}
      onChange={e => onChange({ [key]: e.target.value === '_no_change' ? undefined : e.target.value })}>
      <option value={'_no_change'}>-</option>
      {
        value.map(key =>
          <option key={key} value={key}>
            {key}
          </option>
        )
      }
    </select>
  </div>
)

const renderBool = (key, state, onChange) => (
  <div>
    <label htmlFor={key}>{key}: </label>
    <TriCheckbox id={key} state={state} onChange={e => onChange({ [key]: e.target.state })} />
  </div>
)

const renderInt = (key, state, onChange) => (
  <div>
    <label htmlFor={key}>{key}: </label>
    <input key={key} id={key} value={state || ''} onChange={e => onChange({ [key]: e.target.value })} type="number" placeholder='-' />
  </div>
)

const renderString = (key, state, onChange) => (
  <div>
    <label htmlFor={key}>{key}: </label>
    <input key={key} id={key} value={state || ''} onChange={e => onChange({ [key]: e.target.value })} />
  </div>
)

const renderKeyValue = (key, value, state, onChange) => {
  if (isObject(value)) {
    return renderObject(key, value, state, onChange)
  } else if (Array.isArray(value)) {
    return renderArray(key, value, state, onChange);
  } else if (typeof value === 'string') {
    switch (value) {
      case 'bool':
        return renderBool(key, state, onChange)
      case 'int':
        return renderInt(key, state, onChange)
      case 'string':
        return renderString(key, state, onChange)
    }
  }
}

export default OptionsList;