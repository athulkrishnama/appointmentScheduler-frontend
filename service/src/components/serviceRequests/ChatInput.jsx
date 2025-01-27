import React,{useState} from 'react'

function ChatInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        onSend(message);
        setMessage('');
    }
  return (
    <div className='w-full flex gap-2'>
      <input type="text" className='w-full rounded-2xl bg-gray-200 p-2 focus-visible:outline-none px-5' value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend} className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>Send</button>
    </div>
  )
}

export default ChatInput
