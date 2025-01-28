import React, { useState } from 'react';
import { toast } from 'react-toastify';

function ChatInput({ serviceRequestId, onMessageSent }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    // try {
    //   const response = await axios.post(`/serviceProvider/textMessage/${serviceRequestId}`, { message: messageInput, sender: "client" });
    //   onMessageSent(response.data.chat);
    //   setMessageInput('');
    // } catch (error) {
    //   console.log(error);
    //   toast.error(error.response.data.message);
    // }
    onMessageSent(messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className='mt-4 flex'>
      <input
        type='text'
        className='flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none'
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder='Type your message...'
      />
      <button
        className='bg-black text-white px-4 py-2 rounded-r-md'
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
