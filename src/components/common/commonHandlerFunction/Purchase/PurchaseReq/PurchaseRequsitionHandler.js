import React from "react";
import { toast } from "react-toastify";
import { postDataFromApi, getDataFromApi, deleteDataFromApi, putDataFromApi } from "../../../../../services/commonServices";
import { purchaseRequistionUpdateApi, purchaseRequistionCreateApi, purchaseRequistionDeleteApi, purchaseRequistionGetApi, purchaseRequistionDownload } from "../../../../../services/api";
import { handlePurchaseOrderCreateUpdate } from "../PurchaseOrder/PurchaseOrderHandler";
import { getFormatedDate } from "../../../../../services/commonFunction";

// const departmentMap = {
//   1: "Field Sampling",
//   2: "Chemical Analysis",
//   3: "Quality Assurance",
//   4: "Instrumentation & Calibration",
//   5: "Reporting",
//   6: "Field Instrumentation & Survey"
// };

const typeDev = {
  1: "Consumable",
  2: "Non-Consumable"
}

const branchMap = {
  1: "Mumbai",
  2: "Delhi",
  3: "Bengaluru",
  4: "Hyderabad",
  5: "Chennai",
  6: "Kolkata",
  7: "Pune",
  8: "Ahmedabad",
  9: "Jaipur",
  10: "Lucknow"
}


export const handleGetPurchaseReq = async (EditRecordId, setFormData, setTableData, viewOnly, status) => {


  let purchaseGetApi = purchaseRequistionGetApi(EditRecordId)

  let res = await getDataFromApi(purchaseGetApi);

  if (res.data.status === 200) {

    setFormData((prevFormData) => {
      const data = res?.data?.data || {};
      let updatedFormData = {};
      res.data.data.items.map((item, i) => {
        updatedFormData["prd_item_code_" + i] = item.fk_item_id;
        updatedFormData["prd_item_code_text_" + i] = item?.item_details?.item_rm_code;
        updatedFormData["prd_id_" + i] = item.prd_id;
        updatedFormData["prd_item_description_" + i] = item.prd_item_description;
        updatedFormData["prd_quantity_" + i] = item.prd_quantity;
        updatedFormData["prd_uom_" + i] = item.prd_uom;
        updatedFormData["prd_manufacture_time_" + i] = item.prd_manufacture_time;
        updatedFormData["prd_tech_specification_" + i] = item.prd_tech_specification;
        updatedFormData["prd_avg_monthly_consumption_" + i] = item.prd_avg_monthly_consumption;
        updatedFormData["prd_buffer_stock_" + i] = item.prd_buffer_stock;
        updatedFormData["prd_closing_stock_" + i] = item.prd_closing_stock;
        updatedFormData["prd_consumption_per_day_" + i] = item.prd_consumption_per_day;
        updatedFormData["prd_available_stock_days_" + i] = item.prd_available_stock_days;
        updatedFormData["prd_requested_delivery_date_" + i] = item.prd_requested_delivery_date;
        updatedFormData["prd_remark_" + i] = item.prd_remark;
        updatedFormData["prd_unit_price_" + i] = item.prd_unit_price;
        updatedFormData["prd_price_" + i] = item.prd_price;
        updatedFormData["prd_discount_" + i] = item.prd_discount;
        updatedFormData["prd_total_" + i] = item.prd_total;
        updatedFormData["prd_additional_remark_" + i] = item?.prd_addtional_remark;
        updatedFormData["prd_specification_" + i] = item?.prd_item_specifications;
      })

      return {
        ...prevFormData,
        0: {
          ...prevFormData[0],
          ...data,
          req_id: data.req_id,
          req_status: data.req_status,
          fk_pr_companyid: status === "View" ? data?.branch_details?.company?.cmp_name : data?.branch_details?.company?.cmp_id,
          fk_branchid: status === "View" ? data?.branch_details?.br_name : data?.branch_details?.br_id,
          fk_departmentid: data.fk_departmentid,
          req_no: data.req_no,
          req_date: data.req_date,
          req_type: data.req_type,
          req_remark: data.req_remark,
          request_no: data.req_no,
          type: typeDev[data.req_type],


          items: data.items || []
        },
        1: {
          ...prevFormData[1],
          ...updatedFormData
        }
      };
    });
    setTableData(res.data.data.items)

  }

}

export const handlePurchaseReqUpdateCreate = async (
  formData,
  handleSubmit,
  setIsOverlayLoader,
  navigate,
  status,
  setFormData,
  setSubTableData,
  isNavigate,
  moduleType,
  rejectRemark
) => {

  try {
    let isValidate = handleSubmit();
    if (!isValidate) {
      return false
    }

    let payload = {
      fk_pr_companyid: formData[0]?.fk_pr_companyid,
      fk_branchid: formData[0]?.fk_branchid,
      req_date: formData[0]?.req_date,
      fk_departmentid: formData[0]?.fk_departmentid,
      req_type: formData[0]?.req_type,
      req_status: status === 0 ? "Saved" : "",
      req_remark: formData[0]?.req_remark || '-'
    };

    let res;
    if (status === 2) {
      payload.req_fk_approval_id = formData[0]?.req_fk_approval_id
      if (!payload.req_fk_approval_id) {
        toast.error("Please select approval user", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return
      }

    }
    if (formData[0]?.req_no) {
      const statuses = ["Saved", "Posted", "Sent for Approval", "Approved", "Reject"]
      // payload.req_status = status === 1 ? "Posted" : status === 2 ? "Sent for Approval" : status === 0 ? "Saved" : status === 3 ? "Approved" : "";
      payload.req_status = statuses[status]
      if (status === 4) {
        payload.req_remark = rejectRemark;
      }

      let updatePurchase = purchaseRequistionUpdateApi(formData[0].req_no);
      res = await postDataFromApi(updatePurchase, payload);

    } else {
      res = await postDataFromApi(purchaseRequistionCreateApi, payload);
    }

    if (res?.data?.status === 200 && moduleType != "purchase") {
      handleGetPurchaseReq(res.data.data.req_no, setFormData, setSubTableData, "")
      if (status === 3) {
        let po_Payload = {
          fk_req_id: res?.data?.data?.req_id,
          "po_status": "Approved"
        }
        setIsOverlayLoader(true)
        handlePurchaseOrderCreateUpdate(
          po_Payload,
          handleSubmit,
          setIsOverlayLoader,
          navigate,
          "Approved",
          setFormData,
          "",
          setSubTableData,
          isNavigate)
        setIsOverlayLoader(false)
      }
      toast.success(res?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      }
      );

      if (isNavigate) {
        navigate("/PurchRequistion");
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
        theme: "light"
      });
    }
  } catch (err) {

    toast.error("Something went wrong", {
      position: "top-right",
      autoClose: 2000
    });
  }
};


export const handlePurchaseReqDelete = async (
  reqNo,
  setIsDelete,
  getAllListingData,
  setPopupIndex

) => {
  let purchaseReqDelete = purchaseRequistionDeleteApi(reqNo)
  let res = await deleteDataFromApi(purchaseReqDelete);
  if (res?.data?.status === 200) {
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
  setIsDelete(false);
  setPopupIndex(-1);
  getAllListingData();
}

export const handleDownloadPR = async (prreq_id) => {
  try {
    let res;
    let payload = {
      "req_id": prreq_id
    }
    res = await postDataFromApi(purchaseRequistionDownload, payload, "", 1)
    if (res.data.status === 200) {
      let pdfDate = "PR" + prreq_id + "_" + getFormatedDate(new Date(), "", 1);
      const blob = new Blob([res.data], { type: "application/pdf" })
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = pdfDate + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

    }
    else {
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
  } catch (err) {
    console.log("err", err)
  }
}