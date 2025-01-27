import React from 'react'
import { useParams } from 'react-router'
import ServiceRequestChat from '../components/serviceRequests/ServiceRequestChat'
function ServiceRequestDetails() {
    const { id } = useParams();
    return (
        <ServiceRequestChat requestId={id} />
    )
}

export default ServiceRequestDetails
