import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import Quotation from './Quotation';
import ServiceRequestDetails from './ServiceRequestDetails';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router';
import ChatInput from './ChatInput';

function ServiceRequestChat() {
  const { id } = useParams();
  const [chat, setChat] = useState([]);
  const [serviceRequest, setServiceRequest] = useState({});
  const chatEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`/serviceProvider/getChat/${id}`);
      setChat(res.data.chat);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchServiceRequest = async () => {
    try {
      const res = await axios.get(`/serviceProvider/getServiceRequest/${id}`);
      setServiceRequest(res.data.serviceRequest);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleNewMessage = (newMessage) => {
    setChat([...chat, newMessage]);
  };

  useEffect(() => {
    fetchChat();
    fetchServiceRequest();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className='w-[90vw] md:w-[50vw] mx-auto px-5 py-16 flex-grow'>
      <ServiceRequestDetails serviceRequest={serviceRequest} />
      <div className='flex flex-col gap-5'>
        <AnimatePresence>
          {chat?.map((message, index) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, x: -20 * (index % 2 ? -1 : 1) }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 * (index % 2 ? -1 : 1) }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex ${message.sender === 'service provider' ? 'justify-start' : 'justify-end'}`}
            >
              <div className='w-[70%]'>
                {message.messageType === 'text' && <Message message={message} />}
                {message.messageType === 'quotation' && <Quotation message={message} />}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </AnimatePresence>
      </div>
      <ChatInput serviceRequestId={id} onMessageSent={handleNewMessage} />
    </div>
  );
}

export default ServiceRequestChat;
