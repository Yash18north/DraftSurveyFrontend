import React from 'react'
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Collections/ClientDetails/ClientForm.json"

const ClientForm = () => {
  return (
    <div>
      <Form formConfig={formConfig}/>
    </div>
  )
}

export default ClientForm
