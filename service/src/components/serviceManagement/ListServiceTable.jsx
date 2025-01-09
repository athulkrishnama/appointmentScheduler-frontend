import React, { useState } from 'react';
import EditService from './EditServices';
const ListServiceTable = ({ services, changeStatus, setUpdateData }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const editService = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
        // Implement edit functionality
    };


    const toggleServiceStatus = async () => {
        try {
            changeStatus(selectedService._id, selectedService.isActive ? 'unlist' : 'list');
        } catch (error) {
            console.error('Error updating service status:', error);
        } finally {
            setShowModal(false);
        }
    };

    const openModal = (service) => {
        changeStatus(service);
        setSelectedService(service);
        setShowModal(true);
    };

    const closeEditModal = ()=>{
        setShowEditModal(false)
        setSelectedService(null)
    }
    const closeModal = () => {
        setShowModal(false);
        setSelectedService(null);
    };

    return (
        <div className="overflow-x-auto my-5">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-800 text-left">
                        <th className="py-2 px-4 border-b border-r border-gray-300">Service Name</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Description</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">Edit</th>
                        <th className="py-2 px-4 border-b border-r border-gray-300">List/Unlist</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b border-r border-gray-300">{service.serviceName}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300">{service.serviceDescription}</td>
                            <td className="py-2 px-4 border-b border-r border-gray-300">
                                <button
                                    onClick={() => editService(service)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                                >
                                    Edit
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300">
                                <button
                                    onClick={() => openModal(service)}
                                    className={`px-4 py-1 rounded ${service.isActive ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
                                >
                                    {service.isActive ? 'Unlist' : 'List'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    {
                        showEditModal && <EditService service={selectedService} setEditModalClose={closeEditModal} setUpdateData={setUpdateData}/>
                    }
            {showModal && selectedService && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Toggle Service Status</h2>
                        <p>Are you sure you want to {selectedService.isActive ? 'block' : 'unblock'} the service "{selectedService.serviceName}"?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeModal} className="text-black  border border-gray-900 border-solid px-4 py-2 rounded mr-2">Cancel</button>
                            <button onClick={toggleServiceStatus} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListServiceTable;
