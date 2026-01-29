import React from 'react';
import Form from '../../components/common/Form'
import formConfig from "../../formJsonData/Shipment/ShipmentList.json"
// import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const ShipmentList = () => {
  return (
    <div>
      {/* searchConfigJson={searchConfigJson.purchaseItems} */}
         <Form formConfig={formConfig} />
    </div>
  )
}

export default ShipmentList
