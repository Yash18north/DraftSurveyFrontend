import React from 'react'
import Forms from "../../../components/common/Form.js";
import formConfig from "../../../formJsonData/Operations/Audit/BranchExpenseList.json";
import searchConfigJson from "../../../formJsonData/Operations/Audit//AdvanceSearchJson/AuditAdvanceSearch.json"
const BranchExpenseList = () => {
  return (
    <div>
        <Forms formConfig={formConfig} searchConfigJson={searchConfigJson.BranchExpense}/>
    </div>
  )
}

export default BranchExpenseList