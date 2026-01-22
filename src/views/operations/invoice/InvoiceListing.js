import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/Invoice/InvoiceListing.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";

const InvoiceList = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.invoiceList}/>
    </div>
  )
}

export default InvoiceList