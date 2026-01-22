import React, { useState } from 'react'
import formConfig from "../../../formJsonData/Operations/Invoice/UpdateInvoice.json";
import Forms from '../../../components/common/Form';

const UpdateInvoice = () => {
  const [masterResponse, setMasterResponse] = useState([]);


  return (
    <div>
      <Forms formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} />
    </div>
  )
}

export default UpdateInvoice