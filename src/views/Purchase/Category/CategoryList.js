import React from 'react'
import Form from '../../../components/common/Form';
import formConfig from "../../../formJsonData/Purchase/Category/CategoryList.json"
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
const CategoryList = () => {
  return (
    <div>
      <Form formConfig={formConfig} searchConfigJson={searchConfigJson.category}/>
    </div>
  )
}

export default CategoryList
