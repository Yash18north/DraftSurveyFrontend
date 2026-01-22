import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Collections/PaymentDetails/PaymentList.json";
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json";

const PaymentDetailList = () => {
  return (
    <div>
      <Forms formConfig={formConfig} searchConfigJson={[]}/>
    </div>
  )
}

export default PaymentDetailList