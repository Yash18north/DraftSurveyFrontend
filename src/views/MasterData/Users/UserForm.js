import React from 'react'
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/MasterData/Users/UserForm.json"

const ItemsCreateForm = () => {
  return (
    <div>
      <Form formConfig={formConfig}/>
    </div>
  )
}

export default ItemsCreateForm
