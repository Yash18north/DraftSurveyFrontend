import React from 'react'
import Forms from '../../../components/common/Form';
import formConfig from "../../../formJsonData/Operations/Audit/OutstandingForm.json"
const OutstandingForm = () => {
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default OutstandingForm