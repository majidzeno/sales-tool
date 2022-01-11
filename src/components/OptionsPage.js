import { Component } from 'react';
import yamldata from '../data/load.yaml';
import YAML from '../helpers/yaml-0.4';
import OptionsList from './OptionsList';
import { isObject, mergeDeep } from '../helpers/helpers';

class OptionsPage extends Component {
  state = {
    layout: {},
    state: {},
  }

  initialState(layout) {
    return Object.entries(layout).reduce((obj, [key, value]) => {
      obj[key] = isObject(value) ? this.initialState(value) : undefined;
      return obj;
    }, {});
  }

  componentDidMount() {
    fetch(yamldata)
      .then(r => r.text())
      .then(r => {
        const layout = YAML.parse(r);
        this.setState({ layout, state: this.initialState(layout.configs) });
      });
  }

  onChange = (changes) => {
    this.setState(({state})=>({state: mergeDeep(state, changes)}));
    console.log(mergeDeep(this.state.state, changes));
  }

  render() {
    const { layout, state } = this.state;
    return (
      <OptionsList layout={layout.configs} state={state} onChange={this.onChange}/>
    );
  }
}

export default OptionsPage;