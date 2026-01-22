import React, { useState } from 'react'
import formConfig from "../../../formJsonData/Operations/Invoice/AdvanceInvoice.json";
import Forms from '../../../components/common/Form';

const AdvanceInvoice = () => {
  const [masterResponse, setMasterResponse] = useState([]);


  return (
    <div>
      <Forms formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} />
    </div>
  )
}

export default AdvanceInvoice