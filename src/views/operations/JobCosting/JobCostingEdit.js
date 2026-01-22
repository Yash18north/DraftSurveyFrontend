import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from '../../../formJsonData/Operations/JobCosting/JobCostingEdit.json';
const JobCostingEdit = () => {
  return (
    <div>
        <Forms formConfig={formConfig}/>
    </div>
  )
}

export default JobCostingEdit