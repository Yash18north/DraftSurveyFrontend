import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Audit/JobCosting/JobCostingList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const JobCostingList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfigJson.JobCosting}/>
    </div>
  )
}

export default JobCostingList