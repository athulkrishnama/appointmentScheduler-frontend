import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import { FaUsers, FaUserTie } from 'react-icons/fa';
import { MdMiscellaneousServices } from 'react-icons/md';
import { BsCalendarCheck } from 'react-icons/bs';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/admin/dashboard');
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if ( !dashboardData) {
        return (
            <div className="w-full min-h-screen bg-white p-8 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen bg-white p-8'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-black text-gray-900 mb-10 text-center'>
                    Dashboard Overview
                </h1>

                {/* First Row - Single Pill */}
                <div className='flex justify-center mb-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-full py-6 px-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]  max-w-3xl'
                    >
                        <div className='flex items-center gap-12'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-gray-100 p-4 rounded-full'>
                                    <FaUserTie className='text-4xl text-gray-900' />
                                </div>
                                <div>
                                    <p className='text-base font-medium text-gray-500'>Service Providers</p>
                                    <p className='text-3xl font-bold text-gray-900'>{dashboardData.activeServiceProviders}</p>
                                </div>
                            </div>
                            <div className='w-px h-16 bg-gray-200'></div>
                            <div className='flex items-center gap-4'>
                                <div className='bg-gray-100 p-4 rounded-full'>
                                    <FaUsers className='text-4xl text-gray-900' />
                                </div>
                                <div>
                                    <p className='text-base font-medium text-gray-500'>Active Clients</p>
                                    <p className='text-3xl font-bold text-gray-900'>{dashboardData.activeClients}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Second Row */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className='bg-white rounded-3xl py-6 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]'
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <h2 className='text-base font-medium text-gray-500'>Total Services</h2>
                                <p className='text-3xl font-bold text-gray-900'>{dashboardData.totalServices}</p>
                            </div>
                            <div className='bg-gray-100 p-4 rounded-full'>
                                <MdMiscellaneousServices className='text-4xl text-gray-900' />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                        className='bg-white rounded-3xl py-6 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]'
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <h2 className='text-base font-medium text-gray-500'>Total Appointments</h2>
                                <p className='text-3xl font-bold text-gray-900'>{dashboardData.totalAppointments}</p>
                            </div>
                            <div className='bg-gray-100 p-4 rounded-full'>
                                <BsCalendarCheck className='text-4xl text-gray-900' />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
