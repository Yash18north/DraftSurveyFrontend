import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/Invoice/InvoiceList.json"
const InvoiceList = () => {
 
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default InvoiceList