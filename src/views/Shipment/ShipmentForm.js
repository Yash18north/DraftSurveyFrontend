import React from 'react'
import Form from '../../components/common/Form'
import formConfig from "../../formJsonData/Shipment/ShipmentForm.json"


const ShipmentForm = () => {
    return (
        <div>
            <Form formConfig={formConfig} />
        </div>
    )
}

export default ShipmentForm

