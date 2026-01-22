import React from 'react'
import Forms from "../../../components/common/Form";
import formConfig from "../../../formJsonData/Operations/Audit/Outstanding.json";
import searchConfigJson from "../../../formJsonData/Operations/Audit//AdvanceSearchJson/AuditAdvanceSearch.json"

const OutstandingList = () => {
  return (
    <div>
   <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.Outstanding}/>  
    </div>
  )
}

export default OutstandingList