import React from 'react'
import Forms from "../../../components/common/Form";
import formConfig from "../../../formJsonData/Audit/Outstanding/OutstandingList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"

const OutstandingList = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.Outstanding} />
    </div>
  )
}

export default OutstandingList