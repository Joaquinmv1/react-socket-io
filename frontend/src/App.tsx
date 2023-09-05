import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Message {
  id:string;
  message:string;
}

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = {
      id: 'Me',
      message
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    socket.emit('chat message', newMessage.message);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }

  const sendMessage = (message: Message) => {
    setMessages((prevState) => [...prevState, message]);
  }

  useEffect(() => {
    socket.on('chat message', sendMessage);

    return () => {
      socket.off('chat message', sendMessage);
    }
  }, []);

  return (
    <>
      <h1>My chat</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleChange} value={message}/>
        </form>
        <ul>
          {messages.map((message, i) => {
            return (
              <li key={i}>
                <strong>{message.id}:</strong> {message.message}
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

export default App;
