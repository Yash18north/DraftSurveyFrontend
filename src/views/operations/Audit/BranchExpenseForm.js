import React from 'react'
import Forms from '../../../components/common/Form';
import formConfig from "../../../formJsonData/Operations/Audit/BranchExpenseForm.json"
const BranchExpenseForm = () => {
  return (
    <div>
      <Forms formConfig={formConfig}/>
    </div>
  )
}

export default BranchExpenseForm