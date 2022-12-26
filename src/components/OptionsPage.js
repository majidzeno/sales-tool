import { Component } from 'react';
import yamldata from '../data/load.yaml';
import yamldataDash10 from '../data/loadDash10.yaml';
import YAML from '../helpers/yaml-0.4';
import OptionsList from './OptionsList';
import Messages from './Messages';
import {
	explainObject,
	dig,
	mergeDeep,
	removeUndefined,
} from '../helpers/helpers';
import {
	Button,
	Container,
	Col,
	Row,
	InputGroup,
	FormControl,
	Form,
} from 'react-bootstrap';
class OptionsPage extends Component {
	state = {
		dash10: false,
		layoutD10: {},
		layoutLegacy: {},
		warns: {},
		stateD10: {},
		stateLegacy: {},
		msgs: [],
		high_msgs: [],
		copyText: 'Copy Command',
		values: {
			company_id: '',
			jira_ticket: '',
		},
	};

	initialState(layout, enabled = true) {
		return Object.entries(layout).reduce((obj, [key, value]) => {
			obj[key] =
				'_TYPE' in value
					? { _ENABLED: enabled, _VALUE: undefined }
					: this.initialState(value, enabled);
			return obj;
		}, {});
	}

	componentDidMount() {
			fetch(yamldata)
				.then((r) => r.text())
				.then((r) => {
					const { configs, warns } = YAML.parse(r);
					this.setState({
						layoutLegacy: configs,
						warns,
						stateLegacy: this.initialState(configs),
					});
				});
	
			fetch(yamldataDash10)
				.then((r) => r.text())
				.then((r) => {
					const { configs, warns } = YAML.parse(r);
					this.setState({
						layoutD10: configs,
						warns,
						stateD10: this.initialState(configs),
					});
				});
	}

	onChange = (changes) => {
		this.setState(({ state }) => ({ state: mergeDeep(state, changes) }));
	};

	togglePlan = () => {
		console.log('this.state.Dash10', this.state.dash10);
		this.setState({ dash10: !this.state.dash10 });
	};

	onCompanyIdChange = (value) => {
		value = value.replace(/[^\d]/g, '');
		this.setState(({ values }) => ({
			values: { ...values, company_id: value },
		}));
	};

	onJiraTicketChange = (value) => {
		value = value.replace(/\s/g, '');
		this.setState(({ values }) => ({
			values: { ...values, jira_ticket: value },
		}));
	};

	clearAll = () => {
		this.setState(({ layout }) => ({
			msgs: [],
			high_msgs: [],
			state: this.initialState(layout),
			values: {
				company_id: '',
				jira_ticket: '',
			},
		}));
	};

	removeOverrides = () => {
		this.setState(({ layout }) => ({
			msgs: [],
			high_msgs: [],
			state: this.initialState(layout, false),
		}));
	};

	generateCommand = () => {
		const obj = removeUndefined(this.state.state);
		const { group_warns, usage_warns } = this.state.warns;
		let high_msgs = [];
		this.setState({ copyText: 'Copy Command' });
		if (!Object.keys(obj).length) {
			high_msgs.push({
				content: 'Your request does not have any changes!',
				variant: 'danger',
			});
		}

		const { company_id, jira_ticket } = this.state.values;
		let legacy_output = false;

		if (company_id === '' && jira_ticket === '') {
			high_msgs.push({
				content:
					"You didn't provide a company id nor a jira_ticket, outputting just the overrides.",
				variant: 'warning',
			});

			legacy_output = true;
		} else if (company_id === '' || jira_ticket === '') {
			const missing = company_id === '' ? 'company_id' : 'jira_ticket';

			high_msgs.push({
				content: `You didn't provide a ${missing}.`,
				variant: 'danger',
			});
		}

		usage_warns.forEach((group) => {
			const options = group._OPTIONS;
			const message = group._MESSAGE;

			const matches = options.map((path) => {
				const value = dig(obj, ...path.split('.'));
				return value !== undefined && value !== null;
			});

			const any = matches.some((v) => v);
			if (any) {
				high_msgs.push({
					content: message,
					variant: 'warning',
				});
			}
		});

		group_warns.forEach((group) => {
			const matches = group.map(
				(path) => dig(obj, ...path.split('.')) !== undefined
			);
			const all = matches.every((v) => v);
			const any = matches.some((v) => v);
			if (any !== all) {
				high_msgs.push({
					content: `Some of the following elements are changed but not all of them: ${group.join(
						', '
					)}`,
					variant: 'warning',
				});
			}
		});

		let msgs = [];
		const explain = explainObject(obj);
		if (explain.length)
			msgs.push({
				title: 'Intention',
				content: explain,
				variant: 'light',
			});

		const overrides = JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');

		const output = legacy_output
			? overrides
			: `add_company_overrides ${company_id} ${overrides} ${jira_ticket}`;

		msgs.push({
			title: 'Output',
			content: output,
			variant: 'light',
			textarea: true,
		});
		this.setState({ msgs, high_msgs });
	};

	handleCopy = (command) => {
		if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(command);
		this.setState({ copyText: 'Copied ✅ !' });
	};

	render() {
		const { layout, state, high_msgs, msgs, values } = this.state;
		const commandCode = msgs[1]?.content;
    console.log('layout', layout);
    console.log('state', state);
		return (
			<Container className='full' fluid='sm'>
				<Form.Switch
					checked={this.state.dash10}
					onChange={this.togglePlan}
					label={this.state.dash10 ? 'Dash10' : 'Legacy'}
				/>

				<Row className='full'>
					<Col className='col-left'>
						<OptionsList
							className='MainList'
							title='Overrides'
							layout={this.state.dash10 ? this.state.layoutD10 : this.state.layoutLegacy }
							state= {this.state.dash10 ? this.state.stateD10 : this.state.stateLegacy }
							onChange={this.onChange}
						/>
					</Col>
					<Col className='col-right'>
						<Messages msgs={high_msgs} />

						<InputGroup className='mb-1'>
							<InputGroup.Text>
								<label htmlFor='company_id'>Company Id: </label>
							</InputGroup.Text>
							<FormControl
								value={values.company_id}
								onChange={(e) => this.onCompanyIdChange(e.target.value)}
								id='company_id'
								placeholder='company_id'
								className='stretched-input'
							/>
						</InputGroup>

						<InputGroup className='mb-1'>
							<InputGroup.Text>
								<label htmlFor='jira_ticket'>Jira Ticket: </label>
							</InputGroup.Text>
							<FormControl
								value={values.jira_ticket}
								onChange={(e) => this.onJiraTicketChange(e.target.value)}
								id='jira_ticket'
								placeholder='jira_ticket'
								className='stretched-input'
							/>
						</InputGroup>

						<div className='d-grid gap-2'>
							<Button
								size='lg'
								variant='primary'
								onClick={this.generateCommand}>
								Generate Command
							</Button>
						</div>
						<Messages msgs={msgs} />
						<br />
						{commandCode ? (
							<div className='d-grid gap-2'>
								<Button
									size='lg'
									variant={
										this.state.copyText === 'Copy Command'
											? 'primary'
											: 'success'
									}
									onClick={() => this.handleCopy(commandCode)}>
									{this.state.copyText}
								</Button>
							</div>
						) : null}
						<br />
						<div>
							<Button size='sm' variant='secondary' onClick={this.clearAll}>
								Clear All
							</Button>
						</div>
						{/*
              <div className="d-grid gap-2">
                <Button size="sm" variant="warning" onClick={this.removeOverrides}>Remove all overrides</Button>
              </div>
              */}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default OptionsPage;
