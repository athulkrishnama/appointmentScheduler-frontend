import React from 'react'
import { motion } from 'framer-motion';

function ServiceTable({services}) {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
                <motion.div key={service._id} className="bg-white shadow-lg rounded-lg overflow-hidden" whileHover={{ scale: 1.02 }}>
                    <img src={service.image} alt={service.serviceName} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{service.serviceName}</h2>
                        <p className="text-gray-700 overflow-hidden line-clamp-6 md:line-clamp-4">{service.serviceDescription}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default ServiceTable
