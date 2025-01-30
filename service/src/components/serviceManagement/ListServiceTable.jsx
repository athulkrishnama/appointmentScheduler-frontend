import React, { useState } from 'react';
import EditService from './EditServices';

const ListServiceTable = ({ services, changeStatus, setUpdateData }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const editService = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
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

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedService(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedService(null);
    };

    return (
        <div className="w-full px-1 sm:px-4 my-5">
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800 text-left">
                            <th className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">Service Name</th>
                            <th className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">Description</th>
                            <th className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">Edit</th>
                            <th className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">List/Unlist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id} className="hover:bg-gray-100">
                                <td className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">{service.serviceName}</td>
                                <td className="py-2 px-2 sm:px-4 border-b border-r border-gray-300 text-sm sm:text-base">
                                    <div className="max-w-xs sm:max-w-md overflow-hidden text-ellipsis">
                                        {service.serviceDescription}
                                    </div>
                                </td>
                                <td className="py-2 px-2 sm:px-4 border-b border-r border-gray-300">
                                    <button
                                        onClick={() => editService(service)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-2 sm:px-4 py-1 rounded text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className="py-2 px-2 sm:px-4 border-b border-gray-300">
                                    <button
                                        onClick={() => openModal(service)}
                                        className={`px-2 sm:px-4 py-1 rounded text-sm sm:text-base w-full sm:w-auto ${
                                            service.isActive ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'
                                        } text-white`}
                                    >
                                        {service.isActive ? 'Unlist' : 'List'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <EditService
                    service={selectedService}
                    setEditModalClose={closeEditModal}
                    setUpdateData={setUpdateData}
                />
            )}

            {showModal && selectedService && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-sm mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Toggle Service Status</h2>
                        <p className="text-sm sm:text-base">
                            Are you sure you want to {selectedService.isActive ? 'block' : 'unblock'} the service "{selectedService.serviceName}"?
                        </p>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                            <button
                                onClick={closeModal}
                                className="text-black border border-gray-900 border-solid px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={toggleServiceStatus}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListServiceTable;
