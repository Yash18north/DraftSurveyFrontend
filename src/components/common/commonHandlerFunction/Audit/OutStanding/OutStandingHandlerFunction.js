import { toast } from "react-toastify";
import {
    getDataFromApi,
    GetTenantDetails,
    postDataFromApi,
    putDataFromApi,
} from "../../../../../services/commonServices";
import { getSingleOutstanding, oustandingCreateApi, oustandingUpdateApi, monthlyOutstanding, yearlyOutstanding } from "../../../../../services/api";
import { useNavigate } from "react-router-dom";


export const handleCreateUpdateOutstanding = async (
    formData,
    handleSubmit,
    navigate,
    status

) => {
    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        const outstanding_details_branches =
            formData[0]?.branch_name?.map((branch) => ({
                "branch": branch,
                "amount": formData[0]?.[branch + '_amount'] || 0,
                "comment": formData[0]?.[branch + '_amount_comment'] || null,
            })) || [];


        let payloadData = {
            "oc_data": {
                "company": formData[0]?.company,
                "branch": formData[0]?.branch,
                "month": formData[0]?.month,
                "year": formData[0]?.year,
                "total_outstanding_amt": formData[0]?.total_outstanding_amt,
                "outstanding_details_branches": outstanding_details_branches,
                "status": `${status}`,
                tenant: GetTenantDetails(1),
            }
        }

        let res
        if (formData[0].id) {
            payloadData.oc_id = formData[0].id
            payloadData.oc_data.status = "posted"

            res = await postDataFromApi(oustandingUpdateApi, payloadData);
        } else {
            payloadData.status = "saved"
            res = await postDataFromApi(oustandingCreateApi, payloadData);
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
            navigate("/audit/outstanding-list")

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
export const getTotalBranchAmountValue = (formData, fieldName, amountFiledName, sectionIndex) => {
    if (!formData[sectionIndex]?.[fieldName] || !formData[sectionIndex]?.[fieldName]?.length) return 0;
    let totalAmount = 0

    formData[sectionIndex]?.[fieldName].map(branchInputName => {
        totalAmount = totalAmount + parseFloat(formData[sectionIndex]?.[branchInputName + '_' + amountFiledName] || 0)

    })
    return Math.round(totalAmount * 100) / 100;
}

export const handleGetSingleOutstanding = async (EditRecordId, setFormData, status) => {
    let payload = {
        oc_id: EditRecordId,
    };
    let res = await postDataFromApi(getSingleOutstanding, payload);
    if (res.data.status === 200) {

        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,
                    //  branch_name:res?.data?.data.outstanding_details_branches,
                    company: status === "View"
                        ? res?.data?.data?.company?.cmp_name || ""
                        : res?.data?.data?.company?.cmp_id || "",
                    branch: status === "View"
                        ? res?.data?.data?.branch?.br_name || ""
                        : res?.data?.data?.branch?.br_id || ""

                },
            };
            updatedData[0]['branch_name'] = []
            updatedData[0]['exists_branch_name'] = []
            res?.data?.data.outstanding_details_branches.map((branch) => {
                updatedData[0]['branch_name'].push(branch.branch)
                updatedData[0]['exists_branch_name'].push(branch.branch)
                updatedData[0][branch.branch + '_amount'] = branch.amount
                updatedData[0][branch.branch + '_amount_comment'] = branch.comment
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

export const OutStandingExtraFields = [
    {
        "width": 25,
        "label": "Add Outstanding",
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
        "type": "select",
        "required": true
    },
    {
        "width": 6,
        "name": "branch",
        "label": "Select Branch",
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
        "styleName": "custom_status",
        "type": "select",
        "required": true
    },
    {
        "width": 6,
        "name": "year",
        "label": "Select Year",
        "styleName": "custom_status",
        "type": "select",
        "required": true
    },
    {
        "width": 25,
        "label": "Outstanding Details",
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
        "options": [],
        "placeholder": "Select Branch"
    },
    {
        "type": "hr"
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
        "name": "total_outstanding_amt",
        "type": "text",
        "readOnly": true,
        "placeholder": "Auto Generated",
        "errorMsgs": {
            "required": "This field is required"
        },
        "defaultValue": 0
    }
]
