import React from 'react';
import Form from '../../../components/common/Form'
import formConfig from "../../../formJsonData/MasterData/Users/UserList.json"
import searchConfigJson from "../../../formJsonData/LMS/searchFilterFields.json"
const ItemList = () => {
  return (
    <div>
         <Form formConfig={formConfig} searchConfigJson={searchConfigJson.purchaseItems}/>
    </div>
  )
}

export default ItemList
