import React from 'react'
import Forms from "../../../components/common/Form.js";
import formConfig from "../../../formJsonData/Audit/BranchExpense/BranchExpenseList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const BranchExpenseList = () => {
  return (
    <div>
        <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.BranchExpense}/>
    </div>
  )
}

export default BranchExpenseList