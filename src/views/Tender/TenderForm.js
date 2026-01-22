import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from "../../formJsonData/Tender/TenderForm.json"
const TenderForm = () => {
  return (
    <div>
        <Forms formConfig={formConfig}/>
    </div>
  )
}

export default TenderForm