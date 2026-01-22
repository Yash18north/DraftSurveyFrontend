import { toast } from "react-toastify";
import {
  sampleverificationCreateApi,
  sampleverificationSingleApi,
  sampleverificationUpdateApi,
  sampleverificationdetailCreateApi,
  sampleverificationdetailDeleteApi,
  sampleverificationdetailUpdateApi,
} from "../../../services/api";
import {
  deleteDataFromApi,
  GetTenantDetails,
  postDataFromApi,
  putDataFromApi,
} from "../../../services/commonServices";
import { handleSFMCreate } from "./sfmHandlerFunctions";
import { decryptDataForURL, encryptDataForURL } from "../../../utills/useCryptoUtils";

export const sampleVerificationHandler = async (
  actionSelected,
  editableIndex,
  tableData,
  testMemoId,
  formData,
  section,
  setSaveClicked,
  setPopupIndex,
  setEditableIndex,
  popupIndex,
  newpopupIndex = "",
  setIsOverlayLoader
) => {
  if (actionSelected === "Save" || actionSelected === "customSave") {
    let newRowIndex =
      editableIndex === 0 || editableIndex ? editableIndex : tableData.length;
    if (actionSelected === "customSave") {
      newRowIndex = tableData.length;
    }
    let payload = {
      sv_id: formData[0].sv_id,
      sample_verification_detail: {
        svd_smpllabcode: formData["1"]?.["sp_lab_smplcode_" + newRowIndex],
        svd_smplweight: formData["1"]?.["sample_quantity_" + newRowIndex],
        svd_stdsizeofsmpl:
          formData["1"]?.["svd_stdsizeofsmpl_" + newRowIndex] +
          " " +
          (formData["1"]?.["svd_stdsizeofsmpl_unit_" + newRowIndex]
            ? formData["1"]?.["svd_stdsizeofsmpl_unit_" + newRowIndex]
            : "mm"),
        svd_abovesize:
          formData["1"]?.["svd_abovesize_" + newRowIndex] +
          " " +
          (formData["1"]?.["svd_abovesize_unit_" + newRowIndex]
            ? formData["1"]?.["svd_abovesize_unit_" + newRowIndex]
            : "%"),
        svd_belowsize:
          formData["1"]?.["svd_belowsize_" + newRowIndex] +
          " " +
          (formData["1"]?.["svd_belowsize_unit_" + newRowIndex]
            ? formData["1"]?.["svd_belowsize_unit_" + newRowIndex]
            : "%"),
        svd_remark: formData["1"]?.["svd_remark_" + newRowIndex],
        svd_is_raw_and_powdered: formData["1"]?.["smpl_detail_is_raw_and_powdered_" + newRowIndex],
        svd_is_physical_raw_and_powdered: formData["1"]?.["smpl_detail_is_physical_raw_and_powdered_" + newRowIndex],
        svd_sample_condition: formData["1"]?.["sv_smpl_detail_smpl_condtion_" + newRowIndex],
        tenant: GetTenantDetails(1),
      },
    };
    let res;
    let notRequiredFields = ['svd_is_raw_and_powdered', 'svd_sample_condition', 'svd_is_physical_raw_and_powdered']
    for (let obj in payload.sample_verification_detail) {
      if (
        !notRequiredFields.includes(obj) && (payload["sample_verification_detail"][obj] === undefined ||
          !payload["sample_verification_detail"][obj])
      ) {
        const field = section.rows[0].filter((field, index) => {
          if (field.name === obj) {
            field.label = section.headers[index].label;
            return true;
          }
          return false;
        });
        let errLabel = field.length ? field[0].label : obj;
        toast.error(errLabel + "  required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
        // }
      } else if (
        ["svd_stdsizeofsmpl", "svd_abovesize", "svd_belowsize"].includes(obj)
      ) {
        let spName = payload["sample_verification_detail"][obj].split(" ");
        if (spName[0] === "") {
          const field = section.rows[0].filter((field, index) => {
            if (field.name === obj) {
              field.label = section.headers[index].label;
              return true;
            }
            return false;
          });
          let errLabel = field.length ? field[0].label : obj;
          toast.error(errLabel + "  required", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }
      }
    }
    const isNotPhysical = formData[1]['sv_smpl_detail_smpl_condtion_' + newRowIndex] !== "Physical Sample"
    if (isNotPhysical) {
      const totalValue = parseFloat(formData["1"]?.["svd_abovesize_" + newRowIndex]) + parseFloat(formData["1"]?.["svd_belowsize_" + newRowIndex]);
      if (totalValue !== 100) {
        toast.error(
          "The total of 'above' and 'below' quantities exceeds 100%. Please verify the values.",
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
        return;
      }
    }
    setIsOverlayLoader(true);
    if (formData["1"]?.["svd_id_" + newRowIndex]) {
      payload.svd_id = formData["1"]?.["svd_id_" + newRowIndex];
      res = await putDataFromApi(sampleverificationdetailUpdateApi, payload);
    } else {
      res = await postDataFromApi(sampleverificationdetailCreateApi, payload);
    }
    if (res?.data && res.data.status === 200) {
      setPopupIndex("");
      setEditableIndex("");
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
  } else if (actionSelected === "Edit") {
    setEditableIndex(newpopupIndex || popupIndex);
  } else if (actionSelected === "Delete") {
    setSaveClicked(true);
    let payload = {
      svd_id: tableData[popupIndex]?.svd_id,
    };
    let res = await deleteDataFromApi(
      sampleverificationdetailDeleteApi,
      payload
    );
    if (res.data && res.data.status === 200) {
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
    setSaveClicked(false);
  } else if (actionSelected === "Cancel") {
    setEditableIndex("");
  }
};

export const handleVerificationFormPost = async (
  e,
  handleSubmit,
  setJRFCreationType,
  setIsPopupOpen
) => {
  e.preventDefault();
  setJRFCreationType("post");
  setIsPopupOpen(true);
};

export const handleVerificationMain = async (
  formData,
  navigate,
  testMemoId,
  setSaveClicked,
  setIsOverlayLoader
) => {
  let payload = {
    sv_id: formData[0].sv_id,
    sample_verification: {
      status: "verified",
      tenant: GetTenantDetails(1),
    },
  };
  setIsOverlayLoader(true);
  let res = await putDataFromApi(sampleverificationUpdateApi, payload);
  if (res?.data?.status === 200) {
    setSaveClicked(true);
    if (GetTenantDetails(1, 1, formData[0]?.jrf_is_petro) !== "TPBPL") {
      handleSFMCreate(
        res.data.data,
        navigate,
        res.data.message,
        testMemoId,
        setSaveClicked
      );
    }
  } else {
    setSaveClicked(false);
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
};

export const sampleVarificationDetailsBulkCreate = async (SVData, formData, setIsOverlayLoader, getVerificationDetails, getSampleLabCodeDetails, testMemoId) => {
  try {
    setIsOverlayLoader(true)
    let sample_verification_detail = []
    SVData.map((data, index) => {
      const payload = {
        svd_smpllabcode: formData["1"]?.["sp_lab_smplcode_" + index],
        svd_smplweight: formData["1"]?.["sample_quantity_" + index],
        svd_is_raw_and_powdered: formData["1"]?.["smpl_detail_is_raw_and_powdered_" + index],
        svd_is_physical_raw_and_powdered: formData["1"]?.["smpl_detail_is_physical_raw_and_powdered_" + index],
        svd_sample_condition: formData["1"]?.["sv_smpl_detail_smpl_condtion_" + index],
      }
      sample_verification_detail.push(payload)
    })
    const actualPayload = {
      sv_id: formData[0].sv_id,
      sample_verification_detail: sample_verification_detail
    }

    const res = await postDataFromApi(sampleverificationdetailCreateApi, actualPayload);
    if (res?.data && res.data.status === 200) {
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
      getVerificationDetails(formData[0].sv_id, 1);
      setTimeout(() => {
        getSampleLabCodeDetails(testMemoId);
      }, 1000);
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
  catch (ex) { } finally {
    setIsOverlayLoader(false)
  }
}

export const getVerificationDetailsHandler = async (id = "", from = "", setFormData, formData, setTestMemoId, setTabOpen, setIstavSaveClicked, setIsOverlayLoader) => {
  try {
    setIsOverlayLoader(true)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1]);
    if (!id) {
      id = decryptDataForURL(params.get("sampleVarificationId"));
    }
    let bodyToPass = {
      sv_id: id,
    };

    let res = await postDataFromApi(sampleverificationSingleApi, bodyToPass);

    if (res?.data?.status === 200) {
      let actulaResponse = res.data.data;
      actulaResponse.jrf_commodity =
        actulaResponse?.commodity_detail?.cmd_name;
      actulaResponse.jrf_sub_commodity_name =
        actulaResponse?.sub_commodity?.sub_commodity_name;
      actulaResponse.sv_verifiedName = actulaResponse?.sv_verifiedby_name;
      actulaResponse.sa_remarks =
        actulaResponse?.allotment_detail?.sa_remarks;
      actulaResponse.sv_dateofverification =
        actulaResponse?.sv_dateofverification
          ? actulaResponse?.sv_dateofverification
          : actulaResponse?.allotment_detail?.sa_actualdateofreporting;
      // actulaResponse.sv_dateofverification = actulaResponse?.allotment_detail?.sa_actualdateofreporting;
      const svDetailsfilter = actulaResponse.sv_detail.filter((svLab) => {
        svLab.svd_smplweight = svLab.svd_smplweight.replace("/", "");
        // svLab.svd_smplweight = svLab.svd_smplweight.replace(" ", "");
        return true;
      });
      actulaResponse.sv_detail = svDetailsfilter;
      setTestMemoId(actulaResponse?.allotment_detail?.fk_testmemo_id);
      setTabOpen(true);
      setIstavSaveClicked(true);
      if (from) {
        const updatedFormData = { ...formData };
        updatedFormData[0]["sv_detail"] = svDetailsfilter;
        updatedFormData[0]["remaining_count"] = actulaResponse.remaining_count;
        updatedFormData[0]["filled_count"] = actulaResponse.filled_count;
        setFormData(updatedFormData);
      } else {
        setFormData({
          0: actulaResponse,
        });
      }
    }
  } catch (error) { }
  finally {
    setIsOverlayLoader(false)
  }
};

export const handleSampleVerificationMainSubmit = async (formData, setIsOverlayLoader, getVerificationDetails) => {
  let payload;
  payload = {
    sample_verification: {
      sv_dateofverification: formData[0].sv_dateofverification,
      fk_commodity_id: formData[0].fkey_commodity,
      sv_verifiedby: formData[0].sv_verifiedby,
      fk_allotmentid: formData[0].sa_id,
      status: "pending",
      tenant: GetTenantDetails(1),
    },
  };
  for (let obj in payload.sample_verification_detail) {
    if (
      payload["sample_verification_detail"][obj] === undefined ||
      !payload["sample_verification_detail"][obj]
    ) {
      let errLabel = "";
      toast.error("Date of Verification" + "  required", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
      // }
    }
  }
  setIsOverlayLoader(true);
  let res = await postDataFromApi(sampleverificationCreateApi, payload);
  if (res.data && res.data.status === 200) {
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
    getVerificationDetails(res.data.data.sv_id);
    const currentURL = window.location.href;
    const newQueryString =
      "?status=" +
      encryptDataForURL("verification") +
      "&sampleVarificationId=" +
      encryptDataForURL(res.data.data.sv_id);
    const spbaseUrl = currentURL.split("?");
    let baseUrl = spbaseUrl[0];
    if (spbaseUrl.length > 2) {
      baseUrl = spbaseUrl[0] + spbaseUrl[1];
    }
    const newURL = baseUrl + newQueryString;
    window.history.replaceState({}, "", newURL);
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
};