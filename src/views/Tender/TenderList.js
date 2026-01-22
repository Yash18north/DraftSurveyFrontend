import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from "../../formJsonData/Tender/TenderList.json"
import searchConfigJson from "../../formJsonData/LMS/searchFilterFields.json" ;

const TenderList = () => {
  return (
    <div>
        <Forms formConfig={formConfig} searchConfigJson={searchConfigJson?.tender}/>
    </div>
  )
}

export default TenderList