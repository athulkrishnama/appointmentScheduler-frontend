import React,{useState} from 'react'

function ChatInput({ onSend, handleCreateQuotationModalOpen }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSend();
        }
      };
  return (
    <div className='w-full flex gap-2'>
      <input type="text" className='w-full rounded-2xl bg-gray-200 p-2 focus-visible:outline-none px-5' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
      <button onClick={handleSend} className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>Send</button>
      <button onClick={handleCreateQuotationModalOpen} className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>Create Quotation</button>
    </div>
  )
}

export default ChatInput
