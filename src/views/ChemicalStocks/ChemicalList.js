import React from 'react'
import Forms from '../../components/common/Form';
import formConfig from "../../formJsonData/ChemicalStocks/ChemicalList";
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json"
const ChemicalList = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.checmicalStocks}/>
    </div>
  )
}

export default ChemicalList
