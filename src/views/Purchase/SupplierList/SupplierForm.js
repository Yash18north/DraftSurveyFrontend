import React from 'react'
import formConfig from "../../../formJsonData/Purchase/SupplierList/SupplierForm.json"
import Forms from '../../../components/common/Form'
const SupplierForm = () => {
  
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default SupplierForm