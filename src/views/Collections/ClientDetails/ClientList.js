import React from 'react';
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Collections/ClientDetails/ClientList.json"
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const ClientList = () => {
  return (
    <div>
         <Form formConfig={formConfig} searchConfigJson={[]}/>
    </div>
  )
}

export default ClientList
