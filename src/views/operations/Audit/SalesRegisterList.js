import React from 'react'
import Forms from "../../../components/common/Form";
import formConfig from "../../../formJsonData/Operations/Audit/SalesRegister.json";
import searchConfigJson from "../../../formJsonData/Operations/Audit//AdvanceSearchJson/AuditAdvanceSearch.json"

const SalesRegisterList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.SalesRegister}/>
    </div>
  )
}

export default SalesRegisterList