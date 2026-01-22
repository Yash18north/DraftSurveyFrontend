import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from '../../formJsonData/Feedbacks/Incentive.json';
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json"
const Incentive = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.incentives}/>
    </div>
  )
}

export default Incentive
