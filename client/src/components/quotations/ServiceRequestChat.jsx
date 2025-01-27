import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import Quotation from './Quotation';
import ServiceRequestDetails from './ServiceRequestDetails';
import axios from '../../axios/axios';
import {  toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams , useNavigate} from 'react-router';
import ChatInput from './ChatInput';
import { MdClose } from 'react-icons/md';

function ServiceRequestChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chat, setChat] = useState([]);
  const [serviceRequest, setServiceRequest] = useState({});
  const [lastQuotation, setLastQuotation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chatEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`/serviceProvider/getChat/${id}`);
      setChat(res.data.chat);
    } catch (error) {
      navigate('/serviceRequests')
      console.log(error);
      // toast.error(error.response.data.message);
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

  const handleAcceptClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm =async () => {
    try {
      const response = await axios.post(`/serviceProvider/acceptQuotation/${id}`, { quotation: lastQuotation.message._id });
      toast.success(response.data.message,{onClose: () => navigate('/yourServices')});
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchChat();
    fetchServiceRequest();
  }, []);

  useEffect(() => {
    const lastQuotation = chat.findLast((message) => message.messageType === 'quotation');
    setLastQuotation(lastQuotation);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className='w-[90vw] md:w-[50vw] mx-auto px-5 py-16 flex-grow'>
      <ServiceRequestDetails serviceRequest={serviceRequest} />
      <div className='flex flex-col gap-5'>
        <AnimatePresence>
          {chat?.map((message, index, arr) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, x: -20 * (index % 2 ? -1 : 1) }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 * (index % 2 ? -1 : 1) }}
              transition={{ duration: 0.5, delay: (arr.length - 1 - index) * 0.1 }}
              className={`flex ${message.sender === 'service provider' ? 'justify-start' : 'justify-end'}`}
            >
              <div className='w-[70%]'>
                {message.messageType === 'text' && <Message message={message} />}
                {message.messageType === 'quotation' && (
                  <>
                    <Quotation message={message} />
                    {lastQuotation?.message?._id === message.message._id && (
                      <button 
                        className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleAcceptClick}
                      >
                        Accept
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </AnimatePresence>
      </div>
      <ChatInput serviceRequestId={id} onMessageSent={handleNewMessage} />

      {isModalOpen && (
        <motion.div 
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='bg-white rounded-lg p-5 w-96 shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Confirmation</h2>
              <MdClose className='cursor-pointer' onClick={handleCancel} />
            </div>
            <p className='mb-4'>Are you sure you want to confirm? <br />Once confirmed, you will no longer have access to this chat and <br /> cannot request changes to the quotation.</p>
            <div className='flex justify-end gap-3'>
              <button 
                className='bg-gray-800 text-white py-2 px-4 rounded'
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button 
                className='bg-gray-300 text-black py-2 px-4 rounded'
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ServiceRequestChat;
