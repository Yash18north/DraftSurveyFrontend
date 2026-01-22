import { toast } from "react-toastify";
import {
    getDataFromApi,
    GetTenantDetails,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { getSingleSalesRegister, monthlySalesRegister, salesregisterCreateApi, SalesRegisterUpdateApi, yearlySalesRegister } from "../../../../../services/api";

// const updateFormfigAfterUpdationAndCreation = (formConfig) => {
//     return {
//         ...formConfig,
//         sections:formConfig.sections.map(section => ({
//             ...section,
//             fields: section.fields.filter(field => !field.name.includes('_amount')) 
//         }))
//     };
// }
export const handleCreateUpdateSalesRegister = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status
) => {

    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        const sales_details_branches = [];
        const credit_note_branches = [];
        formData[0]?.branch_name?.map((branch) => {
            sales_details_branches?.push({
                "branch": branch,
                "amount": formData[0]?.[branch + '_amount'],
            })
        })
        if(formData[1]?.credit_note_branch_name?.length > 0){
        formData[1]?.credit_note_branch_name?.map((branch) => {
            credit_note_branches.push({
                "branch": branch,
                "amount": formData[1]?.[branch + '_credit_note_amount'],
            })
        })
    }
        let payloadData = {
            "sr_data": {
                "company": formData[0]?.company,
                "branch": formData[0]?.branch,
                "month": formData[0]?.month,
                "year": formData[0]?.year,
                "total_sales_amt": formData[0]?.total_sales_amt,
                "credit_note_total": formData[1]?.credit_note_total || 0,
                "final_sales": formData[2]?.final_sales,
                "sales_details_branches": sales_details_branches || [],
                "credit_note_branches": credit_note_branches || [],
                "status": `${status}`,
                tenant: GetTenantDetails(1),

            }
        }
        let res
        

        if (formData[0].id) {
            payloadData.sr_id = formData[0].id
            // payloadData.sr_data.status = "posted"

            res = await putDataFromApi(SalesRegisterUpdateApi, payloadData)

        } else {
            res = await postDataFromApi(salesregisterCreateApi, payloadData);
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
            navigate("/audit/sales-register-list")
           
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
    catch (ex) {

    } finally {
        // setIsOverlayLoader(false)
    }
}
export const getTotalBranchAmountValueForSalesRegister = (formData, fieldName, amountFiledName, sectionIndex) => {
    if (!formData[sectionIndex]?.[fieldName] || !formData[sectionIndex]?.[fieldName]?.length) return 0;

    let totalAmount = 0;

    formData[sectionIndex]?.[fieldName].forEach(branchInputName => {
        totalAmount += parseFloat(formData[sectionIndex]?.[branchInputName + '_' + amountFiledName] || 0);
    });

    return Math.round(totalAmount * 100) / 100; 
};


export const handleGetSingleSalesRegister = async (EditRecordId, setFormData, status) => {
    let payload = {
        sr_id: EditRecordId,
    };
    let res = await postDataFromApi(getSingleSalesRegister, payload);
    if (res.data.status === 200) {
        
        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                    company: status === "View"
                        ? res?.data?.data?.company?.cmp_name || ""
                        : res?.data?.data?.company?.cmp_id || "",
                    branch: status === "View"
                        ? res?.data?.data?.branch?.br_name || ""
                        : res?.data?.data?.branch?.br_id || ""


                },
                1: {
                    ...prevFormData[1],
                    ...res?.data?.data,
                    credit_note_total: res?.data?.data.credit_note_total,

                },
                2: {
                    ...prevFormData[2],
                    ...res?.data?.data,
                    final_sales: res?.data?.data.final_sales,
                }
            };
            updatedData[0]['branch_name'] = []
            updatedData[0]['exists_branch_name'] = []
            if (res?.data?.data.sales_details_branches)
                res?.data?.data.sales_details_branches.map((branch) => {
                    updatedData[0]['branch_name'].push(branch.branch)
                    updatedData[0]['exists_branch_name'].push(branch.branch)
                    updatedData[0][branch.branch + '_amount'] = branch.amount
                })
            updatedData[1]['credit_note_branch_name'] = []
            updatedData[1]['exists_credit_note_branch_name'] = []
            if (res?.data?.data.credit_note_branches)
                res?.data?.data.credit_note_branches.map((branch) => {
                    updatedData[1]['credit_note_branch_name'].push(branch.branch)
                    updatedData[1]['exists_credit_note_branch_name'].push(branch.branch)
                    updatedData[1][branch.branch + '_credit_note_amount'] = branch.amount
                })
            return updatedData;
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
}

export const auditSalesRegisterExtraFields = [
  {
    "width": 25,
    "label": "Add Sales Registration",
    "name": "section_heading",
    "type": "label",
    "required": true,
    "color": "$danger",
    "textDecoration": "none",
    "styleName": "section_heading",
    "fontSize": "16px"
  },
  {
    "width": 6,
    "name": "company",
    "label": "Select Company",
    "placeholder": "Select Company",
    "type": "select",
    "required": true
  },
  {
    "width": 6,
    "name": "branch",
    "label": "Select Branch",
    "placeholder": "Select Branch",
    "type": "DropDownWithLoadMore",
    "apiendpoint": "/company-branches/get/",
    "apimethod": "POST",
    "isSearchable": "true",
    "optionData": {
      "id": "branch_id",
      "label": "branch_name"
    },
    "customPayload": {
      "name": "company_id",
      "value": "company"
    },
    "isCustomPayload": true,
    "required": true
  },
  {
    "width": 6,
    "name": "month",
    "label": "Select Month",
    "placeholder": "Select Month",
    "styleName": "custom_status",
    "type": "select",
    "required": true
  },
  {
    "width": 6,
    "name": "year",
    "label": "Select Year",
    "placeholder": "Select Year",
    "styleName": "custom_status",
    "type": "select",
    "required": true
  },
  {
    "width": 25,
    "label": "Registration Details",
    "name": "section_heading",
    "type": "label",
    "required": true,
    "color": "$danger",
    "textDecoration": "none",
    "styleName": "section_heading",
    "fontSize": "16px"
  },
  {
    "width": 6,
    "name": "branch_name",
    "label": "Select Branch",
    "type": "select",
    "multiple": true,

    "placeholder": "Select Branch"
  },
  { "type": "hr" },
  {

  },

  {
    "width": 25,
    "label": "Total",
    "name": "section_heading",
    "type": "label",
    "required": true,
    "color": "$danger",
    "textDecoration": "none",
    "styleName": "section_heading",
    "fontSize": "16px",
    "errorMsgs": {
      "required": "This field is required"
    }
  },
  {
    "width": 6,
    "label": "Total Outstanding",
    "name": "total_sales_amt",
    "type": "text",
    "readOnly": true,
    "placeholder": "Auto Generated",
    "errorMsgs": {
      "required": "This field is required"
    },
    "defaultValue": 0
  }
]