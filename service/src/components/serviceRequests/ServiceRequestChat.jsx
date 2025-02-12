import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import Quotation from './Quotation';
import ServiceRequestDetails from './ServiceRequestDetails';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CreateQuotationModal from './CreateQuotationModal';
import ChatInput from './ChatInput.jsx';
import { useNavigate } from 'react-router'

import socket from '../../services/chat'

function ServiceRequestChat({ requestId }) {
    const [createQuotationModalOpen, setCreateQuotationModalOpen] = useState(false);
    const [chat, setChat] = useState([]);
    const [serviceRequest, setServiceRequest] = useState({});

    const chatEndRef = useRef(null);

    const navigate = useNavigate()

    const fetchChat = async () => {
        try {
            const res = await axios.get(`/serviceProvider/getChat/${requestId}`);
            setChat(res.data.chat);
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
            navigate('/serviceRequests')
        }
    };
    const fetchServiceRequest = async () => {
        try {
            const res = await axios.get(`/serviceProvider/getServiceRequest/${requestId}`);
            setServiceRequest(res.data.serviceRequest);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleQuotationCreate = async (data) => {
        try {
            if (data.length === 0) {
                toast.error("Add some data");
                return;
            }
            const total = data.reduce((acc, curr) => acc + curr.amount, 0);
            if (total <= 0) {
                toast.error("Total amount should be greater than 0");
                return;
            }
            // const res = await axios.post(`/serviceProvider/createQuotation/${requestId}`, data);
            socket.emit('quotationCreate', {
                room: requestId,
                amountBreakdown: data,
                sender: "service provider",
                senderId: serviceRequest.service.serviceProvider._id,
                receiverId: serviceRequest.client._id
            }, (data) => {
                if (data.success) {
                    setChat([...chat, data.chat]);
                }
            });
            toast.success("Quotation created");
            // fetchChat();
            setCreateQuotationModalOpen(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleCreateQuotationModalOpen = () => {
        const lastChat = chat[chat.length - 1];
        if (lastChat?.messageType === "quotation") return toast.error("Quotation already created \n You can create a new one after client replies");
        setCreateQuotationModalOpen(true);
    };

    const handleMessageSend = async (message) => {
        try {
            // const response = await axios.post(`/serviceProvider/textMessage/${requestId}`, { message , sender: "service provider" });
            // setChat([...chat, response.data.chat]);
            socket.emit('sendMessage', {
                room: requestId,
                message,
                sender: 'service provider',
                receiverId: serviceRequest.client._id,
                senderId: serviceRequest.service.serviceProvider._id
            }, (data) => {
                if (data.success) {
                    setChat([...chat, data.chat]);
                }
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        fetchChat();
        fetchServiceRequest();

        if (!socket.connected) socket.connect();

        socket.emit('joinRoom', { room: requestId, name: 'service provider' });

        socket.on('receiveMessage', (message) => {
            console.log("received message", message)
            setChat(prev => [...prev, message]);
        })

        return () => {
            socket.off('quotationCreate');
            socket.off('sendMessage');
            socket.off('receiveMessage');
            socket.disconnect({ room: requestId });
        }
    }, [requestId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    return (
        <div className='w-[90vw] md:w-[50vw] mx-auto px-5 py-16 flex-grow' id='chat'>
            <button onClick={handleCreateQuotationModalOpen} className='mb-5 bg-black text-white px-5 py-2 rounded-md hover:bg-gray-700 absolute top-30 right-20'>Create Quotation</button>
            <ServiceRequestDetails serviceRequest={serviceRequest} />
            <div className='flex flex-col gap-5'>
                <AnimatePresence>
                    {chat?.map((message, index, array) => (
                        <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: (array - index) * 0.1 }}
                            className={`flex ${message.sender === 'service provider' ? 'justify-end' : 'justify-start'}`}>
                            <div className='w-[70%]'>
                                {message.messageType === "text" && <Message message={message} />}
                                {message.messageType === "quotation" && <Quotation message={message} />}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </AnimatePresence>
            </div>
            {/* chat typing area */}
            <ChatInput onSend={handleMessageSend} />
            {createQuotationModalOpen && <CreateQuotationModal setCreateQuotationModalOpen={setCreateQuotationModalOpen} handleSubmit={handleQuotationCreate} />}
        </div>
    );
}

export default ServiceRequestChat;
