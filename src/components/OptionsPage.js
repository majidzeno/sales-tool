import { Component } from 'react';
import yamldata from '../data/load.yaml';
import YAML from '../helpers/yaml-0.4';
import OptionsList from './OptionsList';
import Messages from './Messages';
import { explainObject, dig, mergeDeep, removeUndefined } from '../helpers/helpers';
import { Button, Container, Col, Row } from 'react-bootstrap';
class OptionsPage extends Component {
  state = {
    layout: {},
    warns: {},
    state: {},
    msgs: [],
    high_msgs: [],
  }

  initialState(layout) {
    return Object.entries(layout).reduce((obj, [key, value]) => {
      obj[key] = ('_TYPE' in value) ? undefined : this.initialState(value);
      return obj;
    }, {});
  }

  componentDidMount() {
    fetch(yamldata)
      .then(r => r.text())
      .then(r => {
        const { configs, warns } = YAML.parse(r);
        this.setState({ layout: configs, warns, state: this.initialState(configs) });
      });
  }

  onChange = (changes) => {
    this.setState(({ state }) => ({ state: mergeDeep(state, changes) }));
    //console.log(mergeDeep(this.state.state, changes));
  }

  clearAll = () => {
    this.setState(({ layout }) => ({ msgs: [], high_msgs: [], state: this.initialState(layout) }));
  }

  onClick = () => {
    const obj = removeUndefined(this.state.state);
    const { group_warns, usage_warns } = this.state.warns;
    let high_msgs = []
    if (!Object.keys(obj).length) {
      high_msgs.push({
        content: 'Your request does not have any changes!',
        variant: 'danger'
      });
    }

    usage_warns.forEach(group => {
      const options = group._OPTIONS
      const message = group._MESSAGE

      const matches = options.map(path => dig(obj, ...path.split('.')) !== undefined)
      const any = matches.some(v => v)
      if (any) {
        high_msgs.push({
          content: message,
          variant: 'warning'
        })
      }
    })

    group_warns.forEach(group => {
      const matches = group.map(path => dig(obj, ...path.split('.')) !== undefined)
      const all = matches.every(v => v)
      const any = matches.some(v => v)
      if (any !== all) {
        high_msgs.push({
          content: `Some of the following elements are changed but not all of them: ${group.join(', ')}`,
          variant: 'warning'
        })
      }
    })

    let msgs = []
    const explain = explainObject(obj);
    if (explain.length)
      msgs.push({
        title: 'Intention',
        content: explain,
        variant: 'light'
      })
    msgs.push({
      title: 'Output',
      content: JSON.stringify(obj),
      variant: 'light',
      textarea: true
    })
    this.setState({ msgs, high_msgs });
  }

  render() {
    const { layout, state, high_msgs, msgs } = this.state;
    return (
      <Container className="full" fluid="sm">
        <Row className='full'>
          <Col className='col-left'>
            <OptionsList className="MainList" title="Overrides" layout={layout} state={state} onChange={this.onChange} />
          </Col>
          <Col className='col-right'>
            <Messages msgs={high_msgs} />

            <div className="d-grid gap-2">
              <Button size="lg" variant="primary" onClick={this.onClick}>Generate Command</Button>
            </div>
            <Messages msgs={msgs} />
            <br />
            <div className="d-grid gap-2">
              <Button size="sm" variant="secondary" onClick={this.clearAll}>Clear All</Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default OptionsPage;