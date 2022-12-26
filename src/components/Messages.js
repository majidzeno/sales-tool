/** @format */

import { Alert, Form } from 'react-bootstrap';

const Messages = ({ msgs }) => {
	return (
		<div>
			{msgs.map((msg, i) => {
				return (
					<Alert variant={msg.variant} key={i}>
						{msg.title && <b>{msg.title}: </b>}
						{msg.textarea ? (
							<Form.Control
								className='output-area'
								as='textarea'
                key={i}
								value={msg.content}
								readOnly
							/>
						) : (
							<div key={i}> {renderMsg(msg, i)} </div>
						)}
					</Alert>
				);
			})}
		</div>
	);
};

const renderMsg = (msg, i) =>
	Array.isArray(msg.content) ? (
		msg.content.map((c, i) => <p className='msg-p' key={i}>{c}</p>)
	) : (
		<p className='msg-p' key={i}>
			{msg.content}
		</p>
	);
export default Messages;
