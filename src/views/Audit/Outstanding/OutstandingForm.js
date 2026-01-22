import React, { useEffect, useState } from 'react'
import Forms from '../../../components/common/Form';
import formConfig from "../../../formJsonData/Audit/Outstanding/OutstandingForm.json"
import { getCompanyData } from '../../../components/common/commonHandlerFunction/jobinstructionHandlerFunctions';
import { getAllYearsOptions, getMonthOptions } from '../../../services/commonFunction';
const OutstandingForm = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  useEffect(() => {
    getCompanyData(setMasterResponse,'company');
    getMonthOptions(setMasterResponse,'month')
    getAllYearsOptions(setMasterResponse,'year')
  }, []);
  return (
    <div>
      <Forms formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse}/>
    </div>
  )
}

export default OutstandingForm