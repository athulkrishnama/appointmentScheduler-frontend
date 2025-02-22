import React, { useEffect, useState } from 'react'
import axios from '../../axios/axios'
import { motion } from 'framer-motion'
import Pagination from '../pagination/Pagination'
import SalesReportPDF from './SalesReportPDF'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

function SalesReport() {
    const [salesReport, setSalesReport] = useState([])
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: '',
        status: '',
        period: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(0)

    const fetchSalesReport = async () => {
        try {
            const res = await axios.get(`/serviceProvider/salesReport?page=${currentPage}&limit=${itemsPerPage}&status=${filter.status}&period=${filter.period}${filter.period === 'custom' ? `&startDate=${filter.startDate}&endDate=${filter.endDate}` : ''}`)
            setSalesReport(res.data.sales)
            setTotalPages(res.data.totalPages)
            if (currentPage > res.data.totalPages) {
                setCurrentPage(res.data.totalPages)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchSalesReport()
    }, [currentPage, itemsPerPage])

    const downloadSalesReport = async () => {
        try {
            const res = await axios.get(`/serviceProvider/salesReport?page=${currentPage}&limit=all&status=${filter.status}&period=${filter.period}${filter.period === 'custom' ? `&startDate=${filter.startDate}&endDate=${filter.endDate}` : ''}`)
            const doc = <SalesReportPDF salesReport={res.data.sales} />
            const blob = await pdf(doc).toBlob();
            saveAs(blob, 'salesReport.pdf');
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='w-[90vw] mx-auto '>
            <div className='py-3 flex justify-start gap-10 px-20 w-full'>
                <div className="flex items-center gap-2">
                    <label htmlFor="itemsPerPage " className="mr-2 text-xl">Items per page:</label>
                    <select
                        id="itemsPerPage"
                        className="bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        onChange={(e) => setItemsPerPage(e.target.value)}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div className='flex items-center gap-2'>
                    <label htmlFor="">Status</label>
                    <select
                        id="status"
                        className="bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className='flex items-center gap-2'>
                    <label htmlFor="">Period</label>
                    <select
                        id="period"
                        className="bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        onChange={(e) => setFilter({ ...filter, period: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                {
                    filter.period === 'custom' && (
                        <div className='flex items-center gap-5'>
                            <div>
                                <label htmlFor="">Start Date</label>
                                <input 
                                value={filter.startDate}
                                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                                type="date"
                                 className='ms-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500'/>
                            </div>
                            <div>
                                <label htmlFor="">End Date</label>
                                <input 
                                value={filter.endDate}
                                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                                type="date" 
                                className='ms-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500'/>
                            </div>
                        </div>
                    )
                }
                <button className='bg-black text-white px-4 py-2 rounded-md justify-self-end' onClick={fetchSalesReport}>Apply</button>
                <button className='bg-black text-white px-4 py-2 rounded-md justify-self-end' onClick={downloadSalesReport}>Download Sales Report</button>
            </div>
            <motion.table
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="shadow-lg rounded-lg  mx-auto"
            >
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Id
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Client Name
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Discount
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Final Amount
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                            Payment Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {salesReport.map((sale, index) => (
                        <motion.tr
                            key={sale._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white hover:bg-gray-50"
                        >
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale._id}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.client.fullname}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.service.serviceName}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.amount}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.couponDiscount}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.finalAmount ?? sale.amount}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{new Date(sale.date).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.status}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.paymentMethod}</div>
                            </td>
                            <td className="px-6 py-5 whitespace-no-wrap border-b border-gray-200">
                                <div className="text-base leading-5 font-medium text-gray-900">{sale.paymentStatus}</div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </motion.table>
            {totalPages > 1 && <div className='flex items-center justify-center my-4'>
                <Pagination
                    current={currentPage}
                    setPage={setCurrentPage}
                    total={totalPages}
                />
            </div>}
        </div>
    )
}

export default SalesReport
