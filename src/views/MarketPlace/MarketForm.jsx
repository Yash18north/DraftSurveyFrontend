import React from 'react'
import Form from '../../components/common/Form'
import formConfig from "../../formJsonData/Marketplace/MarketForm.json"

const MarketForm = () => {
  return (
    <div>
      <Form formConfig={formConfig} />
    </div>
  )
}

export default MarketForm





