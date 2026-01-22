import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from '../../formJsonData/Feedbacks/FeedbackForm.json';

const FeedbackForm = () => {
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default FeedbackForm
