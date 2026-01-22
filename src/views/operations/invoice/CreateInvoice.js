import React, { useEffect, useState } from 'react'
import formConfig from "../../../formJsonData/Operations/Invoice/CreateInvoice.json";
import Forms from '../../../components/common/Form';
import { getDataFromApi, postDataFromApi } from "../../../services/commonServices";
import { useSelector, useDispatch } from "react-redux";
import { getReferenceWiseDataApi } from "../../../services/api";
import { getUniqueData } from "../../../services/commonFunction";


const CreateInvoice = () => {
  const [masterResponse, setMasterResponse] = useState([]);

  return (
    <div>
      <Forms formConfig={formConfig} masterResponse={masterResponse} setMasterResponse={setMasterResponse} />
    </div>
  )
}

export default CreateInvoice