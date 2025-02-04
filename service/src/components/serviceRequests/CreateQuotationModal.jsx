import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import COMMISION_PERCENTAGE from '../../constants/commision';

function CreateQuotationModal({ setCreateQuotationModalOpen , handleSubmit}) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const handleAddOrEdit = () => {
        if (!description || !amount) return;

        if (isEditing) {
            const updatedItems = [...items];
            updatedItems[editIndex] = { description, amount: parseFloat(amount) };
            setItems(updatedItems);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            if (items.some(item => item.description === description)) {
                toast.error('Duplicate description!');
                return;
            }
            setItems([...items, { description, amount: parseFloat(amount) }]);
        }

        setDescription('');
        setAmount('');
    };

    const handleEdit = index => {
        setDescription(items[index].description);
        setAmount(items[index].amount);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleDelete = index => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className='bg-white rounded-lg p-5 w-[90vw] md:w-[40vw] max-h-[80vh] md:max-h-[65vh]  flex flex-col gap-4 overflow-x-hidden quotation'
            >
                <h1 className='text-black text-2xl'>Create Quotation</h1>
                <div className='flex gap-2 flex-wrap'>
                    <input
                        type='text'
                        placeholder='Description'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className='border p-2 rounded'
                    />
                    <input
                        type='number'
                        placeholder='amount'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className='border p-2 rounded'
                    />
                    <button onClick={handleAddOrEdit} className='bg-black text-white px-4 py-2 rounded'>
                        {isEditing ? 'Edit' : 'Add'}
                    </button>
                </div>
                <table className='w-full mt-4 border border-gray-300 rounded-md'>
                    <thead>
                        <tr className='border-b'>
                            <th className='text-left p-2 w-1/3'>Description</th>
                            <th className='text-left p-2 w-1/4'>amount</th>
                            <th className='text-left p-2 w-1/4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className='border-b'
                            >
                                <td className='p-2'>{item.description}</td>
                                <td className='p-2'>{item.amount.toFixed(2)}</td>
                                <td className='p-2'>
                                    <button onClick={() => handleEdit(index)} className='text-black mr-2'><FaEdit /></button>
                                    <button onClick={() => handleDelete(index)} className='text-black'><FaTrash /></button>
                                </td>
                            </motion.tr>
                        ))}
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className='border-b bg-gray-100'
                            >
                                <td className='p-2 font-medium text-gray-700'>Commision</td>
                                <td className='p-2 font-medium text-gray-700'>{(totalAmount * COMMISION_PERCENTAGE).toFixed(2)}</td>
                                <td className='p-2'></td>
                            </motion.tr>
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className='border-b bg-gray-100'
                            >
                                <td className='p-2 font-medium text-gray-700'>You Earning After Commision</td>
                                <td className='p-2 font-medium text-gray-700'>{(totalAmount * (1 - COMMISION_PERCENTAGE)).toFixed(2)}</td>
                                <td className='p-2'></td>
                            </motion.tr>
                    </tbody>

                </table>
                <div className='mt-4 text-black'>
                    <strong>Total:</strong> {totalAmount.toFixed(2)}
                </div>
                <div className='flex gap-2 w-full'>
                    <button onClick={() => setCreateQuotationModalOpen(false)} className='mt-auto bg-gray-500 text-white px-4 py-2 rounded w-full'>Close</button>
                    <button onClick={() => handleSubmit(items)} className='mt-auto bg-gray-900 text-white px-4 py-2 rounded w-full'>Add</button>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateQuotationModal;
