import { useCallback } from "react"

const TriCheckbox = ({state, onChange, reversed, ...props}) => {
  const _myref = useCallback(obj => {
    if (obj) obj.indeterminate = state === undefined;
  }, [state]);

  const _stateMap = {
    undefined: 0,
    true: 1,
    false: 2
  }
  const _unstateMap = {
    0: undefined,
    1: true,
    2: false
  }

  const _onChange = (e) => {
    const add = reversed ? 2 : 1
    e.target.state = _unstateMap[(_stateMap[state] + add)%3];
    onChange(e);
  }
  return <input type="checkbox"
                checked={state === true}
                ref={_myref}
                onChange={_onChange}
                {...props} />;
}

export default TriCheckbox;