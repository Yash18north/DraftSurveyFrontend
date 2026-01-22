import React from 'react'
import Form from '../../../components/common/Form';
import formConfig from "../../../formJsonData/Purchase/Category/CategoryForm.json"


const CategoryForm = () => {
  return (
    <div>
      <Form formConfig={formConfig} />
    </div>
  )
}

export default CategoryForm
