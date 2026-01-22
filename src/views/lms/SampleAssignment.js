import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import formConfig from "../../formJsonData/LMS/SampleAssignment.json";
import Form from "../../components/common/Form";
import { postDataFromApi } from "../../services/commonServices";
import { labGrouoparametersApi, sampleIdsApi } from "../../services/api";
import { toast } from "react-toastify";
const SampleAssignment = () => {
  const [masterResponse, setMasterResponse] = useState([]);
  const [totalSamples, setTotalSamples] = useState([]);
  const getSampleIdsMasterData = async (sampleId) => {
    try {
      let tempBody = {
        smpl_inwrd_id: sampleId,
      };
      let res = await postDataFromApi(sampleIdsApi, tempBody);
      if (res.data && res.data.status === 200 && res.data.data) {
        setTotalSamples(res.data.data)
        const transformedData = res.data.data.map((value) => ({
          id: value,
          name: value,
        }));
        const bodyToPass = {
          model: "smpl_set_smpljson",
          data: transformedData,
        };
        let isExists = false;
        let filterData = masterResponse.filter((model) => {
          if (model.model === "smpl_set_smpljson") {
            model.data = transformedData;
            isExists = true;
          }
          return true;
        });
        if (isExists) {
          setMasterResponse(filterData);
        } else {
          setMasterResponse((prev) => [...prev, bodyToPass]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAssignmentMasterData = async (commodity_id, lab_id, context, operationAssignmentData, jrf_is_ops,setUpdatedMasterOptions) => {
    try {
      let tempBody = {
        lab_id: lab_id,
        commodity_id: commodity_id,
        context: context,
      };
      let res = await postDataFromApi(labGrouoparametersApi, tempBody);
      if (res.data && res.data.status === 200) {
        const actualResponse = res.data.data;
        if (actualResponse.length === 0) {
          toast.error(
            "Parameters not found under this lab for commodity please check with admin",
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        }
        let parameters = actualResponse.parameters || [];
        let groups = actualResponse.groups || [];
        let assignmentArr = [];
        if(jrf_is_ops){
          operationAssignmentData.map((singleData) => {
            if (context === "parameter") {
              singleData.jila_set_paramjson.map((paramdata) => {
                if (!assignmentArr.includes(paramdata.param_id)) {
                  assignmentArr.push(paramdata.param_id)
                }
              })
            }
            else {
              singleData.jila_set_groupjson.map((paramdata) => {
                if (!assignmentArr.includes(paramdata.group_id)) {
                  assignmentArr.push(paramdata.group_id)
                }
              })
            }
          })
        }
        
        groups = groups.filter((group) => {
          if (jrf_is_ops && !assignmentArr.includes(group.group_id.toString())) {
            return false
          }
          group.name = group.group_name;
          group.id = group.group_id;
          return true;
        });
        parameters = parameters.filter((group) => {
          if (jrf_is_ops && !assignmentArr.includes(group.param_id)) {
            return false
          }
          group.name = group.param_name;
          group.id = group.param_id;
          group.value = group.param_id;
          group.label = group.param_name;
          return true;
        })
        parameters.sort((a, b) => a.param_name.localeCompare(b.param_name));

        const groupsData = {
          model: "smpl_set_groupjson",
          data: groups,
        };
        const parametersdata = {
          model: "smpl_set_paramjson",
          data: parameters,
        };
        if(jrf_is_ops){
          setUpdatedMasterOptions((prev) => [...prev, groupsData, parametersdata]);
        }
        else{
          setMasterResponse((prev) => [...prev, groupsData, parametersdata]);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return true;
  };
  return (
    <Row>
      <Col>
        <Form
          formConfig={formConfig}
          masterResponse={masterResponse}
          getSampleIdsMasterData={getSampleIdsMasterData}
          setMasterResponse={setMasterResponse}
          getAssignmentMasterData={getAssignmentMasterData}
          totalSamples={totalSamples}
        />
      </Col>
    </Row>
  );
};

export default SampleAssignment;
