import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from '../../formJsonData/Feedbacks/IncentivesForm.json';

const IncentiveForm = () => {
  return (
    <div>
      <Forms formConfig={formConfig} />
    </div>
  )
}

export default IncentiveForm
