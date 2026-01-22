import React from 'react'
import Forms from '../../../components/common/Form'
import formConfig from "../../../formJsonData/Operations/Dashboard/DashboardListing.json";
import JRF_DashboardListing from "../../../formJsonData/Operations/Dashboard/JRF_DashboardListing.json";
import { useSelector } from 'react-redux';

const DashboardList = () => {
  const session = useSelector((state) => state.session);
  const user = session.user;
  let newFormConfig = formConfig
  if (["LR"].includes(user?.role)) {
    newFormConfig = JRF_DashboardListing;
  }
  return (
    <div>
      <Forms formConfig={newFormConfig} />
    </div>
  )
}

export default DashboardList