import React from 'react';
import Forms from '../../components/common/Form';
import formConfig from '../../formJsonData/Feedbacks/Feedback.json'
const Feedback = () => {
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default Feedback
