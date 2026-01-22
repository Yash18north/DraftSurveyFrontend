import { toast } from "react-toastify";
import { createQualityAnalysisApi, createQualityAssesmentApi, documentCreateApi, folderCreateApi, getQualityAnalysisApi, getQualityAssesmentApi, masterUploadApi, opsRakeSVCreateApi, opsRakeSVDeleteApi, opsRakeSVGetApi, opsRakeSVPDFApi, opsRakeSVUpdateApi, rakeAssessPdfApi, updateQualityAnalysisApi, updateQualityAssesmentApi } from "../../../../services/api";
import { deleteDataFromApi, GetTenantDetails, postDataFromApi, putDataFromApi } from "../../../../services/commonServices";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";
import { OperationCreateDataFunction } from "./TMLOperations";
import { getOperationActivityUrl } from "../../../../services/commonFunction";

export const getSingleQualityAssesmentData = async (
  OperationTypeID,
  formData,
  setTableData,
  setIsOverlayLoader,
  setFormData,
  section
) => {
  try {
    let res = await postDataFromApi(getQualityAssesmentApi, {
      ji_id: formData[1]?.ji_id,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      updatedFormData[1] = {
        ...updatedFormData[1], // Retain any existing values if needed
        ...res.data.data.rake_qas_rake_details // Overwrite with values from res.data
      };
      res.data.data.rake_qas_quality_assessment.map((singleValue, index) => {
        section.headers.map((singleField) => {
          const fieldName = singleField.name;
          updatedFormData[1][fieldName + "_" + index] = singleValue[fieldName];
        });
      });
      updatedFormData[0]["rake_qas_id"] = res.data.data.rake_qas_id;
      setFormData(updatedFormData);
      setTableData(res.data.data.rake_qas_quality_assessment);
    }
  } catch (error) {
    console.error(error);
  }
};


export const OperationQualityAssesmentCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  subTableData,
  submitType,
  operationMode,
  operationStepNo,
  isForMainSection,
  section,
  setSubTableData,
  setFormData,
  formConfig,
  setActiveTab,
  activeTab,
  isForSendDailyReport
) => {
  try {
    let res;
    setIsOverlayLoader(true);
    let rake_quality_assessment = {
      fk_jiid: formData[0].ji_id,
      fk_jisid: OperationTypeID,
      rake_qas_quality_assessment: subTableData,
      status: submitType === "post" ? "posted" : "in-process",
    };
    rake_quality_assessment.rake_qas_rake_details = {
      wagon: formData[1]?.wagon,
      no_of_wagons: formData[1]?.no_of_wagons,
      indent_no: formData[1]?.indent_no,
      indent_datetime: formData[1]?.indent_datetime,
      placement_datetime: formData[1]?.placement_datetime,
      commenced_datetime: formData[1]?.commenced_datetime,
      completed_datetime: formData[1]?.completed_datetime,
      r_r_number: formData[1]?.r_r_number,
      r_r_datetime: formData[1]?.r_r_datetime,
      r_r_qty: formData[1]?.r_r_qty,
      r_r_qty_unit: formData[1]?.r_r_qty ? formData[1]?.r_r_qty_unit : '',
      assessment_qty: formData[1]?.assessment_qty,
      assessment_qty_unit: formData[1]?.assessment_qty_unit,
      rot_number: formData[1]?.rot_number,
      density: formData[1]?.density,
      r_r_wgn_typ: formData[1]?.r_r_wgn_typ,
      r_r_sft_qty: formData[1]?.r_r_sft_qty,
      r_r_cll_nam: formData[1]?.r_r_cll_nam,
      r_r_tp_qty: formData[1]?.r_r_tp_qty,
      tenant: GetTenantDetails(1)
    }
    let hasError = false;
    const notRequired = ['no_of_wagons', 'assessment_qty', 'assessment_qty_unit',]
    // for (let obj in rake_quality_assessment.rake_qas_rake_details) {
    //   if (
    //     (rake_quality_assessment.rake_qas_rake_details[obj] === undefined ||
    //       rake_quality_assessment.rake_qas_rake_details[obj] === "") && !notRequired.includes(obj)
    //   ) {

    //     // const field = section.subSections[1].fields.filter((field, index) => {
    //     const field = section.fields.filter((field, index) => {
    //       if (field.name === obj) {
    //         return true;
    //       }
    //       return false;
    //     });


    //     let errLabel = field.length ? field[0].label : obj;

    //     toast.error(errLabel + " is required", {
    //       position: "top-right",
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });

    //     // setIsBtnClicked(false);
    //     hasError = true;
    //     setIsOverlayLoader(false);
    //     return;
    //   }
    // }
    if (parseInt(formData[0].ji_totalqty) < parseInt(formData[0].r_r_qty)) {
      toast.error("Rake quantity must be less than the total quantity.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    else {
      if (formData[0].rake_qas_id) {
        let MainData = {
          rake_qas_id: formData[0].rake_qas_id,
          rake_quality_assessment: rake_quality_assessment,
        };
        res = await putDataFromApi(updateQualityAssesmentApi, MainData);
      } else {
        let MainData = {
          rake_quality_assessment: rake_quality_assessment,
        };
        res = await postDataFromApi(createQualityAssesmentApi, MainData);
      }
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsOverlayLoader(false);
        setIsPopupOpen(false);
        OperationCreateDataFunction(
          formData,
          setIsOverlayLoader,
          setIsPopupOpen,
          OperationType,
          OperationTypeID,
          navigate,
          submitType === "post" ? "posted" : "in-process",
          "",
          [],
          "",
          1,
          "",
          operationMode
        );
        if (isForMainSection) {
          getSingleQualityAssesmentData(
            OperationTypeID,
            formData,
            setSubTableData,
            setIsOverlayLoader,
            setFormData,
            formConfig.sections?.[1]?.tabs?.[1]
          );
          if (activeTab === "1-0") {
            setActiveTab('1-1')
          }
          else {
            navigate(
              `${getOperationActivityUrl(operationMode)}${encryptDataForURL(
                formData[0].ji_id
              )}`
            );
          }
          return;
        }
        else {
          if (isForSendDailyReport) {
            sendDailyReportHanleFunction(res.data.data.rake_qas_id, navigate, formData, OperationTypeID)
          }
          else {
            if (activeTab === "1-0") {
              getSingleQualityAssesmentData(
                OperationTypeID,
                formData,
                setSubTableData,
                setIsOverlayLoader,
                setFormData,
                formConfig.sections?.[1]?.tabs?.[1]
              );
              setActiveTab('1-1')
            }
            else {
              navigate(
                `${getOperationActivityUrl(operationMode)}${encryptDataForURL(
                  formData[0].ji_id
                )}`
              );
            }
          }
          return;
        }

      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }
  finally {
    setIsPopupOpen(false);
    setIsOverlayLoader(false);
  }
};



export const OperationQualityAnalysisCreateDataFunction = async (
  formData,
  setIsOverlayLoader,
  setIsPopupOpen,
  OperationType,
  OperationTypeID,
  navigate,
  submitType,
  operationMode,
  isForMainSection,
  section,
  setSubTableData,
  setFormData,
  formConfig,
  operationStepNo,
  OpsConfigID,
  isUseForPhysical,
  RPCID
) => {
  try {
    let res;
    // setIsOverlayLoader(true);
    let rake_quality_analysis = {
      fk_jiid: formData[0].ji_id || formData[0].fk_jiid,
      fk_jisid: OperationTypeID,
      status: submitType === "post" ? "posted" : "in-process",
    };

    if (!formData[0]?.rake_qan_id) {
      let res = await postDataFromApi(getQualityAnalysisApi, {
        ji_id: formData[0]?.ji_id,
        jis_id: OperationTypeID,
      });
      if (res?.data?.status === 200 && res.data.data) {
        let updatedFormData = { ...formData };
        let rakedetailsobject = {}
        if (!Array.isArray(res.data.data.rake_qan_rake_details)) {
          res.data.data.rake_qan_rake_details = res.data.data.rake_qan_rake_details ? [res.data.data.rake_qan_rake_details] : []
        }
        updatedFormData[0] = {
          ...updatedFormData[0],
          ...rakedetailsobject,
          rake_qan_id: res.data.data.rake_qan_id,
          rake_qan_rake_details: res.data.data.rake_qan_rake_details
        };
        updatedFormData[1] = {
          ...updatedFormData[1],
          ...rakedetailsobject,
          rake_qan_rake_details: res.data.data.rake_qan_rake_details
        };
        updatedFormData[0]["rake_qan_id"] = res.data.data.rake_qan_id;
        formData = updatedFormData
      }
    }
    let actualRakeDetails = formData[0]?.rake_qan_rake_details || [];
    let rakedetailsobject = {
      wagon: formData[1]?.wagon,
      no_of_wagons: formData[1]?.no_of_wagons || '',
      indent_no: formData[1]?.indent_no || '',
      indent_datetime: formData[1]?.indent_datetime || '',
      placement_datetime: formData[1]?.placement_datetime || '',
      commenced_datetime: formData[1]?.commenced_datetime || '',
      completed_datetime: formData[1]?.completed_datetime || '',
      r_r_number: formData[1]?.r_r_number || '',
      r_r_datetime: formData[1]?.r_r_datetime || '',
      r_r_qty: formData[1]?.r_r_qty || '',
      r_r_qty_unit: formData[1]?.r_r_qty ? formData[1]?.r_r_qty_unit : '',
      assessment_qty: formData[1]?.assessment_qty || '',
      assessment_qty_unit: formData[1]?.assessment_qty_unit || '',
      rot_number: formData[1]?.rot_number || '',
      density: formData[1]?.density || '',
      r_r_wgn_typ: formData[1]?.r_r_wgn_typ || '',
      r_r_sft_qty: formData[1]?.r_r_sft_qty || '',
      r_r_cll_nam: formData[1]?.r_r_cll_nam || '',
      r_r_tp_qty: formData[1]?.r_r_tp_qty || '',
      config_id: isUseForPhysical ? RPCID : (OpsConfigID || formData[0]?.fk_cert_config_id || ''),
      isUseForPhysical: isUseForPhysical,
      // config_id: OpsConfigID || formData[0]?.fk_cert_config_id,
      tenant: GetTenantDetails(1)
    }

    if (actualRakeDetails.length > 0 && actualRakeDetails.find((singleData) => singleData.config_id == (isUseForPhysical ? RPCID : formData[0]?.fk_cert_config_id))) {
      actualRakeDetails = actualRakeDetails.map((singleData) => {
        if (singleData.config_id == (isUseForPhysical ? RPCID : formData[0]?.fk_cert_config_id)) {
          singleData = rakedetailsobject
        }
        return singleData
      })
    }
    else {
      actualRakeDetails.push(rakedetailsobject)
    }
    // actualRakeDetails = rakedetailsobject
    rake_quality_analysis.rake_qan_rake_details = actualRakeDetails;
    let hasError = false;
    const notRequired = ['no_of_wagons', 'assessment_qty', 'assessment_qty_unit', 'indent_no', 'indent_datetime', 'density', 'rot_number']
    // for (let obj in rake_quality_analysis.rake_qan_rake_details) {
    //   if (
    //     (rake_quality_analysis.rake_qan_rake_details[obj] === undefined ||
    //       rake_quality_analysis.rake_qan_rake_details[obj] === "") && !notRequired.includes(obj)
    //   ) {
    //     // const field = section.subSections[1].fields.filter((field, index) => {
    //     const field = section.filter((field, index) => {
    //       if (field.name === obj) {
    //         return true;
    //       }
    //       return false;
    //     });
    //     let errLabel = field.length ? field[0].label : obj;
    //     toast.error(errLabel + " is required", {
    //       position: "top-right",
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     // setIsBtnClicked(false);
    //     hasError = true;
    //     setIsOverlayLoader(false);
    //     return;
    //   }
    // }
    if (parseInt(formData[0].ji_totalqty) < parseInt(formData[0].r_r_qty)) {
      toast.error("Rake quantity must be less than the total quantity.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    }
    else {
      if (formData[0].rake_qan_id) {
        let MainData = {
          rake_qan_id: formData[0].rake_qan_id,
          rake_quality_analysis: rake_quality_analysis,
        };
        res = await putDataFromApi(updateQualityAnalysisApi, MainData);
      } else {
        let MainData = {
          rake_quality_analysis: rake_quality_analysis,
        };
        res = await postDataFromApi(createQualityAnalysisApi, MainData);
      }
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // setIsOverlayLoader(false);
        setIsPopupOpen(false);
        // OperationCreateDataFunction(
        //   formData,
        //   setIsOverlayLoader,
        //   setIsPopupOpen,
        //   OperationType,
        //   OperationTypeID,
        //   navigate,
        //   "in-process",
        //   1,
        //   null,
        //   operationStepNo,
        //   1,
        //   "",
        //   operationMode
        // );
        // OperationCreateDataFunction(
        //   formData,
        //   setIsOverlayLoader,
        //   setIsPopupOpen,
        //   OperationType,
        //   OperationTypeID,
        //   navigate,
        //   submitType === "post" ? "posted" : "in-process",
        //   !isForMainSection,
        //   [],
        //   operationStepNo,
        //   1,
        //   "",
        //   operationMode
        // );
        // if (isForMainSection) {
        //   getSingleQualityAnalysisData(
        //     OperationTypeID,
        //     formData,
        //     setIsOverlayLoader,
        //     setFormData,
        //     formConfig.sections?.[1]?.tabs?.[0]
        //   );
        // }
        // navigate(
        //   `${getOperationActivityUrl(operationMode)}${encryptDataForURL(
        //     formData[0].ji_id
        //   )}`
        // );
        return;
      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }
  finally {
    setIsPopupOpen(false);
    // setIsOverlayLoader(false);
  }
};


export const getSingleQualityAnalysisData = async (
  OperationTypeID,
  formData,
  setIsOverlayLoader,
  setFormData,
  section,
  EditRecordId,
  configID,
  isUseForPhysical,
  RPCID
) => {
  try {
    let res = await postDataFromApi(getQualityAnalysisApi, {
      ji_id: formData[1]?.ji_id || EditRecordId,
      jis_id: OperationTypeID,
    });
    if (res?.data?.status === 200 && res.data.data) {
      const updatedFormData = { ...formData };
      if (!updatedFormData[1]) {
        updatedFormData[1] = {};
      }
      let rakedetailsobject = {}
      if (!Array.isArray(res.data.data.rake_qan_rake_details)) {
        res.data.data.rake_qan_rake_details = res.data.data.rake_qan_rake_details ? [res.data.data.rake_qan_rake_details] : []
      }
      if (res.data.data.rake_qan_rake_details.length > 0) {
        rakedetailsobject = res.data.data.rake_qan_rake_details.find((singleData) => {
          if (isUseForPhysical) {
            return singleData.config_id == RPCID
          }
          return singleData.config_id == configID
        })
      }
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          0: {
            ...prevFormData[0],
            rake_qan_id: res.data.data.rake_qan_id,
            rake_qan_rake_details: res.data.data.rake_qan_rake_details
          },
          1: {
            ...prevFormData[1],
            ...rakedetailsobject,
            rake_qan_rake_details: res.data.data.rake_qan_rake_details
          },
        };
      });

      updatedFormData[1] = {
        ...updatedFormData[1],
        ...rakedetailsobject,
        rake_qan_rake_details: res.data.data.rake_qan_rake_details
      };
      updatedFormData[0]["rake_qan_id"] = res.data.data.rake_qan_id;
      setFormData(updatedFormData);

    }
  } catch (error) {
    console.error(error);
  }
};


export const sendDailyReportHanleFunction = async (rake_qas_id, navigate, formData, OperationTypeID) => {
  try {
    if (rake_qas_id) {
      let payload = {
        "rake_qas_id": rake_qas_id,
      }
      let generateCertificateResponse = await postDataFromApi(
        rakeAssessPdfApi,
        payload,
        "",
        true,
        "",
        ""
      );
      if (
        generateCertificateResponse?.data?.status === 200
      ) {
        const pdfBlob = new Blob([generateCertificateResponse.data], {
          type: "application/pdf",
        });
        let payload = new FormData();
        payload.append("document", pdfBlob, ("Daily Report" + ".pdf") || "certificate.pdf");
        payload.append("model_type ", "commercial_certificate");
        payload.append("bypass_file_size_check ", true);
        payload.append("sub_folder", 6);
        let uploadResponse = await postDataFromApi(
          masterUploadApi,
          payload,
          "TRUE"
        );
        if (uploadResponse.data.status === 200) {
          let folderPayload = {
            data: {
              fd_name: formData[0]?.ji_reference_number,
            },
            parent_folder: "commercial_certificate",
          };
          let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
          let FolderID;
          // setLoadingTable(true);

          if (folderRes.data.status === 201 || folderRes.data.status === 200) {
            FolderID = folderRes?.data?.data.fd_id;
          } else {
            FolderID = folderRes?.data?.message?.existing_folder_id;
          }
          if (FolderID) {
            let payload = {
              data: {
                dl_folder: FolderID,
                // dl_sub_folder: 6,
                dl_module: "commercial_certificate",
                dl_document_name:
                  formData[0]?.ji_reference_number || "Daily Report",
                dl_document_reference: formData[0]?.ji_id,
                dl_document_jisid: OperationTypeID,
                dl_type: "Document Type",
                dl_show_to_all: true,
                dl_s3_url: uploadResponse.data?.data?.document,
                dl_version: "1.0",
                dl_file_type: "Rake Assesment Daily Report",
                dl_date_uploaded: new Date(),
                dl_status: "Active",
                // dl_assigned_to: "Assigned User",
                dl_discription: "Rake Assesment",
                // document_type: "daily_report",
                // doc_ref_id: OperationTypeID
              },
            };
            let documentResponse = await postDataFromApi(
              documentCreateApi,
              payload
            );

            if (documentResponse.data.status === 200) {
              toast.success(
                documentResponse?.message ||
                documentResponse?.data?.message ||
                "Daily Report Successfully Shared",
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
              setTimeout(() => {
                navigate("/operation/JI-commercial-certificate-list/" + encryptDataForURL(formData[0]?.ji_id))

              }, 2000);

            } else {
              // setLoading(false);
            }
          }
        } else {
          toast.error(
            uploadResponse?.message ||
            uploadResponse?.data?.message,
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
          // setLoading(false);
        }
      } else {
        toast.error(
          generateCertificateResponse?.message ||
          generateCertificateResponse?.data?.message,
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
        // setLoading(false);
      }
    }
  }
  catch (ex) {
    // console.log('eee', ex)
  }
  finally {

  }
}

export const RakeSupervissionCreateDataFunction = async (
  actionSelected,
  editableIndex,
  tableData,
  formData,
  section,
  setSaveClicked,
  setEditableIndex,
  setPopupIndex,
  popupIndex,
  setPopupOpenAssignment,
  setIsBtnClicked,
  setIsOverlayLoader,
  setTableData,
  setFormData,
  activityID,
  setIsCustomPopup
) => {
  try {
    if (actionSelected === "Save" || actionSelected === "customSave") {
      setIsBtnClicked(true);
      let newRowIndex = editableIndex;
      if (actionSelected === "customSave") {
        newRowIndex = tableData.length;
      }
      // let payload = {
      //     opsssv_jsonb_front: {}
      // };
      let payload = {
        "ops_rake_sv": {
          "fk_jisid": activityID,
          "fk_jiid": formData[0]?.ji_id,
          // opsssv_created_by: 97,
          // opsssv_updated_by: 97,
          "opsrsv_rake_no": formData[1]?.['rk_sv_rake_no_' + newRowIndex],
          "opsrsv_jsonb_front": {
          },
          "tenant": 1
        }
      }

      if (section.rows[0]) {
        section.rows[0].forEach((field) => {
          const key = field.name;
          const value = formData?.[1]?.[`${field.name}_` + newRowIndex] != null ? formData?.[1]?.[`${field.name}_` + newRowIndex] : '';
          payload.ops_rake_sv.opsrsv_jsonb_front[key] = value;
        });
      }
      let nonRequiredFields = [];

      for (let obj in payload.ops_rake_sv.opsrsv_jsonb_front) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
        if (
          (payload['ops_rake_sv']["opsrsv_jsonb_front"][obj] === undefined ||
            payload['ops_rake_sv']["opsrsv_jsonb_front"][obj] === "") &&
          !nonRequiredFields.includes(obj) && field?.[0]?.required
        ) {
          if (field.length > 0) {
            let errLabel = field ? field[0].label : "";
            toast.error(errLabel + " is required", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setIsBtnClicked(false);
            return;
          }
        }
      }

      let res;
      if (actionSelected !== "customSave") {
        payload.opsrsv_id = tableData[editableIndex].opsrsv_id;
        res = await putDataFromApi(opsRakeSVUpdateApi, payload);
      } else {
        res = await postDataFromApi(opsRakeSVCreateApi, payload);
      }
      if (res.data.status === 200) {
        if (tableData.length === 0) {
          OperationCreateDataFunction(
            formData,
            setIsOverlayLoader,
            setIsBtnClicked,
            '',
            activityID,
            null,
            "in-process",
            "",
            [],
            "",
            1,
            "",
            ''
          );
        }
        getAllRakeSupervissionData(
          formData[0]?.ji_id,
          setTableData,
          formData,
          setFormData,
          section,
          activityID
        );
        setPopupOpenAssignment(false);
        setPopupIndex("");
        setEditableIndex("");
        setIsBtnClicked(false);
        setIsOverlayLoader(false);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setIsBtnClicked(false);
        setIsOverlayLoader(false);
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setSaveClicked(false);
      setIsOverlayLoader(false);
      setIsCustomPopup(false)
    } else if (actionSelected === "Delete") {
      setSaveClicked(true);
      let payload = {
        opsrsv_id: tableData[popupIndex]?.opsrsv_id,
      };
      setIsOverlayLoader(true);
      let res = await deleteDataFromApi(opsRakeSVDeleteApi, payload);
      if (res.data.status === 200) {
        getAllRakeSupervissionData(
          formData[0]?.ji_id,
          setTableData,
          formData,
          setFormData,
          section,
          activityID
        );
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setIsOverlayLoader(false);
      setSaveClicked(false);
      setIsCustomPopup(false)
    } else if (actionSelected === "Cancel") {
      setEditableIndex("");
    }
  }
  catch (ex) {
    // console.log('ex',ex)
  }
  finally {

  }
};

export const getAllRakeSupervissionData = async (
  ji_id,
  setTableData,
  formData,
  setFormData,
  section,
  OperationTypeID
) => {
  try {
    const bodyData = {
      "ji_id": formData[0]?.ji_id,
      "jis_id": OperationTypeID,
    };
    let res = await postDataFromApi(opsRakeSVGetApi, bodyData);
    if (res?.data?.status === 200 && res.data.data) {
      const responseData = res.data.data;
      let updatedFormData = { ...formData };
      if (!updatedFormData) {
        updatedFormData = { ...formData };
      }
      let i = 0;
      const actualResponseData = responseData.filter((singleInwardData) => {
        if (!updatedFormData[1]) {
          updatedFormData[1] = {};
        }
        for (let obj in singleInwardData.opsrsv_jsonb_front) {
          singleInwardData[obj] = singleInwardData.opsrsv_jsonb_front[obj];
        }
        section.rows.forEach((row) => {
          row.forEach((columnName) => {
            const fieldName = `${columnName.name}_${i}`;
            const value = singleInwardData[columnName.name];
            updatedFormData[1][fieldName] = value;
          });
        });

        updatedFormData[1]["opsrsv_id_" + i] =
          singleInwardData["opsrsv_id"];
        i++;
        return true;
      });
      section.rows.forEach((row) => {
        row.forEach((columnName) => {
          const fieldName = `${columnName.name}_${responseData.length}`;
          updatedFormData[1][fieldName] = '';
        });
      });
      setFormData(updatedFormData);
      setTableData(actualResponseData);
    }
  } catch (error) {
    console.error(error);
  }
};

export const RakeSupervissionDailyReport = async (formData, navigate, OperationTypeID) => {
  let payload = {
    "ji_id": formData[0]?.ji_id,
    "jis_id": OperationTypeID,
  }
  let generateCertificateResponse = await postDataFromApi(
    opsRakeSVPDFApi,
    payload,
    "",
    true,
    "",
    ""
  );
  if (
    generateCertificateResponse?.data?.status === 200
  ) {
    const pdfBlob = new Blob([generateCertificateResponse.data], {
      type: "application/pdf",
    });
    let payload = new FormData();
    payload.append("document", pdfBlob, ("Daily Report" + ".pdf") || "certificate.pdf");
    payload.append("model_type ", "commercial_certificate");
    payload.append("bypass_file_size_check ", true);
    payload.append("sub_folder", 6);
    let uploadResponse = await postDataFromApi(
      masterUploadApi,
      payload,
      "TRUE"
    );

    if (uploadResponse.data.status === 200) {
      let folderPayload = {
        data: {
          fd_name: formData[0]?.ji_reference_number,
        },
        parent_folder: "commercial_certificate",
      };
      let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
      let FolderID;
      // setLoadingTable(true);

      if (folderRes.data.status === 201 || folderRes.data.status === 200) {
        FolderID = folderRes?.data?.data.fd_id;
      } else {
        FolderID = folderRes?.data?.message?.existing_folder_id;
      }
      if (FolderID) {
        let payload = {
          data: {
            dl_folder: FolderID,
            // dl_sub_folder: 6,
            dl_module: "commercial_certificate",
            dl_document_name:
              formData[0]?.ji_reference_number || "Daily Report",
            dl_document_reference: formData[0]?.ji_id,
            dl_document_jisid: OperationTypeID,
            dl_type: "Document Type",
            dl_show_to_all: true,
            dl_s3_url: uploadResponse.data?.data?.document,
            dl_version: "1.0",
            dl_file_type: "Rake Supervission Daily Report",
            dl_date_uploaded: new Date(),
            dl_status: "Active",
            // dl_assigned_to: "Assigned User",
            dl_discription: "Rake Supervission",
            // document_type: "daily_report",
            // doc_ref_id: OperationTypeID
          },
        };
        let documentResponse = await postDataFromApi(
          documentCreateApi,
          payload
        );

        if (documentResponse.data.status === 200) {
          toast.success(
            documentResponse?.message ||
            documentResponse?.data?.message ||
            "Daily Report Successfully Shared",
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
          setTimeout(() => {
            navigate("/operation/JI-commercial-certificate-list/" + encryptDataForURL(formData[0]?.ji_id))

          }, 2000);

        } else {
          // setLoading(false);
        }
      }
    } else {
      toast.error(
        uploadResponse?.message ||
        uploadResponse?.data?.message,
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
      // setLoading(false);
    }
  } else {
    toast.error(
      generateCertificateResponse?.message ||
      generateCertificateResponse?.data?.message,
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
    // setLoading(false);
  }
}