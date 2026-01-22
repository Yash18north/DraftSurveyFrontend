import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/SupplierList/SupplierList.json";
import searchConfig from "../../../formJsonData/LMS/searchFilterFields.json";
const SupplierList = () => {
  return (
    <div>
      
      <Forms formConfig={formConfig} searchConfigJson={searchConfig.supplier}/>
    </div>
  )
}

export default SupplierList