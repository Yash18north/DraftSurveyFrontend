import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/Audit/SalesRegisterForm.json"
const SalesRegisterForm = () => {
  return (
    <div>
        <Forms formConfig={formConfig}/>
    </div>
  )
}

export default SalesRegisterForm