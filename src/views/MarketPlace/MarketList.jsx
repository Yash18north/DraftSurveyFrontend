import { FormikProvider } from 'formik'
import React from 'react'
import Forms from '../../components/common/Form'
import formConfig from "../../formJsonData/Marketplace/MarketList.json"
const MarketList = () => {
  return (
    <div>
       <Forms formConfig={formConfig} />
    </div>
  )
}

export default MarketList
