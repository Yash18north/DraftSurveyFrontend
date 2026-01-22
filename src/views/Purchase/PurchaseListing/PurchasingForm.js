import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/PurchaseListing/PurchasingForm.json";

const PurchasingForm = () => {
  return (
    <div>
      
      <Forms formConfig={formConfig} />
    </div>
  )
}

export default PurchasingForm