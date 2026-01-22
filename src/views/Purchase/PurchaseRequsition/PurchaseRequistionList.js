import React from 'react';
import formConfig from "../../../formJsonData/Purchase/PurchaseRequsition/PurchaseRequistionList.json"
import Forms from "../../../components/common/Form.js";
import searchConfig from "../../../formJsonData/LMS/searchFilterFields.json"
const PurchaseRequistionList = () => {
  return (
    <div>
      <Forms formConfig={formConfig}  searchConfigJson={searchConfig.purchaseReq}  />
    </div>
  )
}

export default PurchaseRequistionList