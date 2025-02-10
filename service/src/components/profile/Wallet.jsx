import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../../axios/axios';
import transactionTypes from '../../constants/transactionType';
import {FaMoneyCheck} from 'react-icons/fa'

function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const fetchWallet = async () => {
    const response = await axios.get("/serviceProvider/wallet");
    setTransactions(response.data.wallet.transactions);
    setBalance(response.data.wallet.balance);
  };

  const getTransactionType = (type) => {
    switch (type) {
      case transactionTypes.COMMISSION_DEDUCTION:
        return "Commission Deduction";
      case transactionTypes.SERVICE_PAYMENT:
        return "Service Payment";
      case transactionTypes.REFUND:
        return "Refund";
      case transactionTypes.WITHDRAWAL:
        return "Withdrawal";
      case transactionTypes.DEPOSIT:
        return "Deposit";
      default:
        return "Unknown";
    }
  };

  const getAmountColor = (type) => {
    return type === 'credit' 
      ? 'text-emerald-600 bg-emerald-50' 
      : 'text-rose-600 bg-rose-50';
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <motion.div
      key="wallet"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      className="absolute bg-gray-50 w-full h-full p-4 md:p-8 rounded-2xl flex flex-col overflow-x-hidden wallet"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Balance: <span className={balance > 0 ? 'text-green-600' : 'text-rose-600'}>₹{balance.toFixed(2)}</span>
        </h1>
      </div>
      
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((transaction, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
            >
              <div className="p-4 space-y-3">
                {/* Priority Information */}
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {transaction.appointment.client.fullname}
                  </h4>
                  <p className="text-base text-gray-700 font-medium truncate">
                    {transaction.appointment.service.serviceName}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-lg text-gray-500">Amount</p>
                    <div className={`inline-block px-2 py-1 rounded-md text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                    ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-500">Date</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-500">Type</p>
                    <p className={`text-lg font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'} flex items-center gap-3`}>
                      <FaMoneyCheck/>
                      {transaction.type === 'credit' ? 'Credited' : 'Debited'}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg text-gray-500">Transaction</p>
                    <p className="text-lg font-medium text-gray-700 truncate">
                      {getTransactionType(transaction.transactionType)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Wallet;