import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import transactionTypes from '../../constants/transactionType';
import { FaMoneyCheck } from 'react-icons/fa'
import axios from '../../axios/axios'

const WalletComponent = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchWallet = async () => {
    const response = await axios.get("/admin/wallet");
    setTransactions(response.data.wallet.transactions);
    setBalance(response.data.wallet.balance);
  };

  const getAmountColor = (type) => {
    return type === 'credit'
      ? 'text-emerald-600 bg-emerald-50'
      : 'text-rose-600 bg-rose-50';
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
      case transactionTypes.PLATFORM_FEE:
        return "Platform Fee";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="flex-grow h-screen bg-gray-50 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-2/3 h-5/6 flex flex-col overflow-y-scroll noScrollBar"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 items-center justify-center p-5 rounded-2xl shadow-xl sticky top-0 right-0 bg-white z-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 text-center">Wallet</h1>
          <h1 className="text-2xl font-bold text-gray-900">Balance: <span>₹{balance.toFixed(2)}</span></h1>
        </motion.div>
        
        <div className="p-5 rounded-2xl shadow-xl">
          <h1 className="text-2xl my-8 font-bold text-gray-800">Transactions</h1>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {transactions.map((transaction) => (
              <motion.div
                key={transaction._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-4 space-y-3">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">
                      {transaction.appointment.client.fullname}
                    </h4>
                    <p className="text-base text-gray-700 font-medium truncate">
                      {transaction.appointment.service.serviceName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-lg text-gray-500">Amount</p>
                      <div className={`inline-block px-2 py-1 rounded-md text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                        ₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg text-gray-500">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg text-gray-500">Type</p>
                      <p className={`text-lg font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'} flex items-center gap-3`}>
                        <FaMoneyCheck />
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
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletComponent;