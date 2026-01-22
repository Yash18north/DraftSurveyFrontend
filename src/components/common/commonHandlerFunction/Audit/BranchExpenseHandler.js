import { toast } from "react-toastify";
import { GetTenantDetails, postDataFromApi, putDataFromApi } from "../../../../services/commonServices";
import { useNavigate } from "react-router-dom";
import { getSingleBranchExpense as onGetSingleBranchExpense } from "../../../../services/api";

export const handleCreationOfBranchExpense = async (formData, formConfig, setFormData, navigate, status, handleSubmit, setIsOverlayLoader) => {
    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        let expenses = ['salary_payroll', 'salary_casual', 'salary_contract', 'rent', 'ot', 'shipment_and_sampling', 'analysis_charges', 'lab_exp_and_sampl_material', 'business_promotion', 'guest_house_exp', 'other'];
        let commentJson = {}
        expenses.forEach(expense => {
            commentJson[`${expense}_comment`] = formData?.[0]?.[`${expense}_comment`] || null;
        });
        let payload = {
            "ex_data": {
                ...formData[0],
                salary_payroll: parseFloat((formData[0]?.salary_payroll || "0").replace(/,/g, "").trim()) || 0,
                salary_casual: parseFloat((formData[0]?.salary_casual || "0").replace(/,/g, "").trim()) || 0,
                salary_contract: parseFloat((formData[0]?.salary_contract || "0").replace(/,/g, "").trim()) || 0,
                rent: parseFloat((formData[0]?.rent || "0").replace(/,/g, "").trim()) || 0,
                shipment_and_sampling: parseFloat((formData[0]?.shipment_and_sampling || "0").replace(/,/g, "").trim()) || 0,
                lab_exp_and_sampl_material: parseFloat((formData[0]?.lab_exp_and_sampl_material || "0").replace(/,/g, "").trim()) || 0,
                other: parseFloat((formData[0]?.other || "0").replace(/,/g, "").trim()) || 0,
                ot: parseFloat((formData[0]?.ot || "0").replace(/,/g, "").trim()) || 0,
                business_promotion: parseFloat((formData[0]?.business_promotion || "0").replace(/,/g, "").trim()) || 0,
                guest_house_exp: parseFloat((formData[0]?.guest_house_exp || "0").replace(/,/g, "").trim()) || 0,
                total: parseFloat((formData[0]?.total || "0").replace(/,/g, "").trim()) || 0,
                analysis_charges: parseFloat((formData[0]?.analysis_charges || "0").replace(/,/g, "").trim()) || 0,
                ho_overhead: parseFloat((formData[0]?.ho_overhead || "0").replace(/,/g, "").trim()) || 0,
                status: `${status}`,
                expense_comment_json: commentJson,
                tenant: GetTenantDetails(1),

            }
        };
        let res

        if (formData[0].id) {
            payload.ex_id = formData[0].id


            res = await putDataFromApi(formConfig.apiEndpoints.update, payload);
        } else {
            res = await postDataFromApi(formConfig.apiEndpoints.create, payload);
        }


        if (res.data.status === 200) {
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
            navigate("/audit/branch-expense-list");
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
    } catch (error) {

    }
    finally { }

};

export const getSingleBranchExpense = async (EditRecordId, setFormData, status) => {

    let payload = { "ex_id": EditRecordId }
    let res = await postDataFromApi(onGetSingleBranchExpense, payload)

    if (res.data.status === 200) {
        setFormData((prevFormData) => {
            const updatedData = {
                ...prevFormData,
                0: {
                    ...prevFormData[0],
                    ...res?.data?.data,

                    company: status === "View"
                        ? res?.data?.data?.company?.cmp_name
                        : res?.data?.data?.company?.cmp_id,
                    branch: status === "View"
                        ? res?.data?.data?.branch?.br_name
                        : res?.data?.data?.branch?.br_id,
                    ...res?.data?.data?.expense_comment_json

                },
            };
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

export const getCalculationForBranchExpense = (formData,setFormData) => {
    let total_branch_exp = [
      formData?.salary_payroll,
      formData?.salary_casual,
      formData?.salary_contract,
      formData?.rent,
      formData?.ot,
      formData?.shipment_and_sampling,
      formData?.analysis_charges,
      formData?.lab_exp_and_sampl_material,
      formData?.business_promotion,
      formData?.guest_house_exp,
      formData?.other,
      formData?.ho_overhead
    ]
      .map(val => Number(String(val || "0").replace(/,/g, "")))
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);

    setFormData(prevFormData => ({
      ...prevFormData,
      0: {
        ...prevFormData[0],
        total: total_branch_exp
      }
    }));
  };