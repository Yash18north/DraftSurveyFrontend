import React from 'react'
import Forms from '../../components/common/Form';
import formConfig from "../../formJsonData/ChemicalStocks/ChemicalForm"
import formConfig2 from "../../formJsonData/Purchase/Calibration/CalibrationForm.json"
formConfig['sections'][0]['customField']['fields']=formConfig2['sections'][0]['fields']
formConfig['sections'][0]['customField']['isFullform']=true
formConfig['sections'][0]['customField']['title']=formConfig2['sections'][0]['title']
const ChemicalList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default ChemicalList
