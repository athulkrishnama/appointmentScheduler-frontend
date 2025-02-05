import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import Quotation from './Quotation';
import ServiceRequestDetails from './ServiceRequestDetails';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import ChatInput from './ChatInput';
import { MdClose } from 'react-icons/md';
import { MdAttachMoney, MdCreditCard } from 'react-icons/md';
import ConfirmationModal from './ConfirmationModal';

import socket from '../../services/socket'

function ServiceRequestChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chat, setChat] = useState([]);
  const [serviceRequest, setServiceRequest] = useState({});
  const [lastQuotation, setLastQuotation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const chatEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await axios.get(`/serviceProvider/getChat/${id}`);
      setChat(res.data.chat);
    } catch (error) {
      navigate('/serviceRequests', { replace: true });
      // toast.error(error.response.data.message);
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
      // toast.error(error.response.data.message);

    }
  };

  const handleNewMessage = (message) => {
    try {
      socket.emit('sendMessage', {
        message: message,
        room: id,
        sender: "client"
      }, (data) => {
        if(data.success){
          setChat([...chat, data.chat]);
        }
      })
    } catch (err) {
      console.log(err);
    }
    // setChat([...chat, newMessage]);
  };

  const handleAcceptClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async (paymentMethod) => {
    try {
      if(!paymentMethod) return toast.error("Please select a payment method");
      const response = await axios.post(`/serviceProvider/acceptQuotation/${id}`, { quotation: lastQuotation.message._id, paymentMethod });
      toast.success(response.data.message, {autoClose: 1000, onClose: () => navigate('/yourAppointments',{replace:true}) });
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
    if(!socket.connected)socket.connect();
    socket.emit("joinRoom", { room: id, name: "client" });

    socket.on('receiveMessage', (data) => {
      setChat(prev => [...prev, data]);
    })

    return () => {
      // socket.emit('disconnect', {room:id})
      
      socket.off('receiveMessage');
      socket.disconnect({ room: id });
    };
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

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </div>
  );
}

export default ServiceRequestChat;
