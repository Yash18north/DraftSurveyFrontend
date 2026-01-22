import React from 'react'
import formConfig from "../../../formJsonData/Purchase/Calibration/CalibrationForm.json"
import Forms from '../../../components/common/Form';
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const CalibrationForm = () => {
  return (
    <div>

      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.calibration}/>

    </div>
  )
}

export default CalibrationForm