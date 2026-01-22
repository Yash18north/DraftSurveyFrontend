import React from 'react'
import formConfig from "../../../formJsonData/Purchase/PurchaseListing/PurchasingList.json"
import Forms from "../../../components/common/Form.js"; 
import searchConfig from "../../../formJsonData/LMS/searchFilterFields.json"
const PurchasingList = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={searchConfig.purchase} />
    </div>
  )
}

export default PurchasingList