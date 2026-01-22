import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/PurchaseRequsition/PurchaseRequsitionForm.json"
const PurchaseRequsitionForm = () => {
  return (
    <div>
      <Forms formConfig = {formConfig}/>
    </div>
  )
}

export default PurchaseRequsitionForm