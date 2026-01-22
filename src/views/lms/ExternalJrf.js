import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";

import formConfig from "../../formJsonData/LMS/ExternalJrf.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import { MasterListApi } from "../../services/api";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useSelector } from "react-redux";
import { decryptDataForURL, encryptDataForURL } from "../../utills/useCryptoUtils";
import { useNavigate } from "react-router-dom";

const ExternalJrf = () => {
  const session = useSelector((state) => state.session);

  const user = session.user;
  const [masterResponse, setMasterResponse] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegularJRF, setIsRegularJRF] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    getLabMasterData();
    geStandardMethodMasterData()
  }, []);
  useEffect(() => {
    if (user?.all_roles?.main_role_id && user?.all_roles?.other_roles?.length > 0) {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      const id = decryptDataForURL(params.get("id"));
      if (!id) {
        // setIsOpen(true)
      }
    }
  }, [])
  const getLabMasterData = async () => {
    try {
      let tempBody = {
        model_name: "lab",
        is_dropdown: true,
      };
      let res = await postDataFromApi(MasterListApi, tempBody);
      if (res?.data?.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((labDetail) => ({
          id: labDetail[0],
          name: labDetail[2] ? labDetail[2] + ` (${labDetail[1]})` : "",
        }));

        const bodyToPass = {
          model: "jrf_lab",
          data: transformedData,
        };

        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const geStandardMethodMasterData = async () => {
    try {
      let tempBody = {
        model_name: "standard_type",
        is_dropdown: true,
      };
      let res = await postDataFromApi(MasterListApi, tempBody);
      if (res?.data?.status === 200 && res.data.data) {
        const transformedData = res.data.data.map((labDetail) => ({
          id: labDetail[1] ? labDetail[1] : "",
          name: labDetail[1] ? labDetail[1] : "",
        }));

        const bodyToPass = {
          model: "jrf_test_method",
          data: transformedData,
        };

        setMasterResponse((prev) => [...prev, bodyToPass]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setIsOpen(false)
  }
  const handleConfirm = () => {
    setIsOpen(false)
    navigate("/jrfListing/jrf?jrfType=" + encryptDataForURL('isRegularJRF'));
  }
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          masterResponse={masterResponse}
          isExternalJRF="1"
          isRegularJRF={isRegularJRF}
        />
        <ConfirmationModal isOpen={isOpen} handleClose={handleClose} handleConfirm={handleConfirm} popupMessage={"Which type of JRF you want to create?"} popupHeading={"JRF Confirmation"} popbuttons={{ no: "Extenal", yes: "Regular" }} />
      </Col>
    </Row>
  );
};
export default ExternalJrf;
