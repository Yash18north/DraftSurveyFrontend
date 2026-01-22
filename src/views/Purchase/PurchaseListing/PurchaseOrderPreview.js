import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/PurchaseListing/PurchaseOrderPreview.json"
const PurchaseOrderPreview = () => {
  return (
    <div>
      <Forms  formConfig={formConfig}/>
    </div>
  )
}

export default PurchaseOrderPreview
