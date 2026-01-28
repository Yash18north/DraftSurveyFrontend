import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/JobCosting/JobCostingList.json";
import searchConfigJson from "../../../formJsonData/Operations/JobCosting/AdvanceSearchJson/JobCostingAdvanceSearch.json"
const JobCostingList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.JobCosting}/>
    </div>
  )
}

export default JobCostingList