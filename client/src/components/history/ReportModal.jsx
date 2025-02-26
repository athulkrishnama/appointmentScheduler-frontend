import React, {useState} from 'react'
import {motion , AnimatePresence} from 'framer-motion'
import reportingReason from '../../constants/reportReasons'

function ReportModal({onClose, onConfirm}) {
    const [reason, setReason] = useState(Object.keys(reportingReason)[0])
    const [text, setText] = useState('')
    const confirmSubmit = ()=>{
        const reasonText = reason === 'other' ? text : reportingReason[reason];
        onConfirm(reasonText)
    }
  return (
    <div className='fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-30 z-50 flex justify-center items-center'>
        <motion.div
            initial={{
                scale:0,
            }}
            animate={{
                scale:1
            }}

            className='bg-white p-5 rounded-3xl flex flex-col gap-3'
        >
            <h1 className='text-3xl text-red-600 font-bold my-2'>Report this appointment</h1>
            <p className='text-lg'>Please explain the reason for reporting this appointment.</p>
            <select name="" id="" value={reason} onChange={(e)=>setReason(e.target.value)} className='focus-visible:outline-none px-2 py-1 text-lg rounded-lg hover:bg-gray-200 duration-300'>
                {
                    Object.entries(reportingReason).map(([value, text])=>(
                        <option value={value}>{text}</option>
                    ))
                }
            </select>
            <AnimatePresence>
                {
                    reason == "other" && (
                        <motion.textarea
                         name="" id="" 
                         initial={{height:0}}
                         animate={{height:50}}
                         exit={{height:0}}
                         value={text}
                         onChange={(e)=>setText(e.target.value)}
                         className='border rounded-lg border-gray-500 focus-visible:outline-none py-1 px-2'
                         ></motion.textarea>
                    )
                }
            </AnimatePresence>
            <div className='flex justify-between'>
                <button className='py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300 duration-300' onClick={onClose}>Cancel</button>
                <button className='py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 text-white' onClick={confirmSubmit}>Report</button>
            </div>
        </motion.div>
    </div>
  )
}

export default ReportModal
