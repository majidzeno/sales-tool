import { Alert } from "react-bootstrap";

const Messages = ({ msgs }) => {
  return (<div>
    {
      msgs.map((msg, i) => {
        return <Alert className="msg-box" variant={msg.variant} key={i}>{msg.content}</Alert>
      })
    }
  </div>)
}

export default Messages;