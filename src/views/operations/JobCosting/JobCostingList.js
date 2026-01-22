import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/JobCosting/JobCostingList.json";
import searchConfigJson from "../../../formJsonData/Operations/Audit/AdvanceSearchJson/AuditAdvanceSearch.json"
const JobCostingList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.JobCosting}/>
    </div>
  )
}

export default JobCostingList