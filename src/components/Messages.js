import { Alert } from "react-bootstrap";

const Messages = ({ msgs }) => {
  return (<div>
    {
      msgs.map((msg, i) => {
        return <Alert variant={msg.variant} key={i}>
          {msg.title && <b>{msg.title}: </b>}
          {
            Array.isArray(msg.content) ?
              msg.content.map(c => <p className="msg-p">{c}</p>) :
              <p className="msg-p">{msg.content}</p>
          }
        </Alert>
      })
    }
  </div>)
}

export default Messages;