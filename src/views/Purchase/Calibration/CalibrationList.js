import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Purchase/Calibration/CalibrationList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";
const CalibrationList = () => {
  return (
    <div>
      
      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.calibration}/>
    </div>
  )
}

export default CalibrationList