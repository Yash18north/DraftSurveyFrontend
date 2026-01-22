import React from 'react'
import Forms from "../../../components/common/Form";
import formConfig from "../../../formJsonData/Audit/SalesRegister/SalesRegisterList.json"
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";

const SalesRegisterList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.SalesRegister}/>
    </div>
  )
}

export default SalesRegisterList