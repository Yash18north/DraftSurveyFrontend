import React from 'react'
import { IncentiveCreateApi, IncentiveDeleteApi, IncentiveGetApi, IncentiveUpdateApi, jobCostingIncApi } from '../../../../services/api'
import { deleteDataFromApi, getDataFromApi, postDataFromApi, putDataFromApi } from '../../../../services/commonServices';
import { toast } from 'react-toastify';
import moment from 'moment';

const formatToISO = (dateStr) => {
    if (!dateStr.includes('/')) return dateStr; // Already in ISO
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const handleGetIncentive = async (incentivesId, setFormData, status, setIsOverlayLoader) => {
    try {

        const getIncentives = IncentiveGetApi(incentivesId);
        setIsOverlayLoader(true)
        const res = await getDataFromApi(getIncentives);

        if (res?.data?.status === 200) {

            setFormData((previousData) => {
                return {
                    ...previousData,
                    0: {
                        ...previousData[0],
                        ...res?.data?.data,
                        incentive_client_id: res?.data?.data?.incentive_client_id_details?.cust_name
                        ,
                        // status === "View" ? res?.data?.data?.incentive_client_id_details?.cust_name : res?.data?.data?.incentive_client_id_details?.cust_id
                        incentive_invoice_id: res?.data?.data?.incentive_invoice_details?.im_id,

                        incentive_mode: res?.data?.data?.incentive_mode,
                        incentive_price: res?.data?.data?.incentive_price,
                        // incentive_place_of_work: res?.data?.data?.incentive_place_of_work_details?.pow_name,
                        incentive_place_of_work: status === "View" ?  res?.data?.data?.incentive_place_of_work_details?.pow_name : res?.data?.data?.incentive_place_of_work_details?.pow_id,
                        incentive_vessel_quantity: res?.data?.data?.incentive_vessel_quantity,
                        incentive_work_completion_date: res?.data?.data?.incentive_work_completion_date,
                        incentive_billing_date: res?.data?.data?.incentive_billing_date,
                        incentive_delay_billing_days: res?.data?.data?.incentive_delay_billing_days + " days",
                        incentive_billing_amt_inr: res?.data?.data?.incentive_billing_amt_inr,

                        incentive_expense_amt: res?.data?.data?.incentive_expense_amt,
                        incentive_profit_against_work: res?.data?.data?.incentive_profit_against_work,

                        incentive_payment_collection_date: res?.data?.data?.incentive_payment_collection_date,
                        incentive_delay_payment_days: res?.data?.data?.incentive_delay_payment_days + " days",
                        incentive_bonus_amount: res?.data?.data?.incentive_bonus_amount,
                        incentive_total_delay_days: res?.data?.data?.incentive_total_delay_days + " days",

                        incentive_incentive_amount: res?.data?.data?.incentive_incentive_amount,
                        incentive_penalty_amount: res?.data?.data?.incentive_penalty_amount,
                        incentive_receivable_amount: res?.data?.data?.incentive_receivable_amount,
                        incentive_sales_lead_share: res?.data?.data?.incentive_sales_lead_share,
                        incentive_actual_sales_share: res?.data?.data?.incentive_actual_sales_share,
                        ncentive_operations_share: res?.data?.data?.ncentive_operations_share,
                        incentive_collections_share: res?.data?.data?.incentive_collections_share,
                        incentive_remarks: res?.data?.data?.incentive_remarks,
                        incentive_incentive_amount_perc: res?.data?.data?.incentive_incentive_amount_perc,
                        incentive_invoice_number: res?.data?.data?.incentive_invoice_details?.im_invoicenumber,
                    }
                }
            })

            if (status != "View") {
                setTimeout(() => {
                    setIsOverlayLoader(false);
                }, 2500);

            }
            else {
                setIsOverlayLoader(false);
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
    } catch (error) {
        // Handle error if needed
    }
};


export const handleIncentiveCreateAndUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status) => {
    try {
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }

        const payload = {
            incentive_client_id: formData[0]?.incentive_client,
            incentive_invoice_id: formData[0]?.incentive_invoice_id,
            incentive_mode: formData[0]?.incentive_mode,
            incentive_price: formData[0]?.incentive_price,
            incentive_place_of_work: formData[0]?.incentive_pow?.state_id,
            incentive_vessel_quantity: formData[0]?.incentive_vessel_quantity,
            incentive_work_completion_date: formatToISO(formData[0]?.incentive_work_completion_date),
            incentive_billing_date: formData[0]?.incentive_billing_date,
            incentive_delay_billing: formData[0]?.incentive_delay_billing,
            incentive_billing_amt_inr: formData[0]?.incentive_billing_amt_inr,

            incentive_expense_amt: formData[0]?.incentive_expense_amt,
            incentive_profit_against_work: formData[0]?.incentive_profit_against_work,

            incentive_payment_collection_date: formData[0]?.incentive_payment_collection_date,
            incentive_delay_payment_collection: formData[0]?.incentive_delay_payment_collection,
            incentive_bonus_advance_payment: formData[0]?.incentive_bonus_advance_payment,
            incentive_delay_payment_total: formData[0]?.incentive_delay_payment_total,

            incentive_incentive_amount: formData[0]?.incentive_incentive_amount,
            incentive_penalty: formData[0]?.incentive_penalty,
            incentive_receivable_amount: formData[0]?.incentive_receivable_amount,
            incentive_sales_lead: formData[0]?.incentive_sales_lead,
            incentive_actual_sales: formData[0]?.incentive_actual_sales,
            incentive_operations: formData[0]?.incentive_operations,
            incentive_collections: formData[0]?.incentive_collections,
            incentive_incentive_amount_perc: formData[0]?.incentive_incentive_amount_perc,

            incentive_remarks: formData[0]?.incentive_remarks,
            incentive_status: status

        }

        let res;
        if (formData[0].incentive_id) {

            let updateIncentive = IncentiveUpdateApi(formData[0]?.incentive_id)
            res = await putDataFromApi(updateIncentive, payload)

        } else {

            res = await postDataFromApi(IncentiveCreateApi, payload);

        }
        // setIsOverlayLoader(true)
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

            navigate("/incentivesList")

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
        // console.log('errrr', error)
    }
}

export const handleIncentiveDelete = async (
    incentiveId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let incentiveDelete = IncentiveDeleteApi(incentiveId)
        let res = await deleteDataFromApi(incentiveDelete);
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
            getAllListingData();
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
    catch (ex) { }
    finally {
        setIsDelete(false);
        setPopupIndex(-1);
    }


}

export const getJobCostingIncDataFunc = async (
    setFormData,
    formData,
    setIsOverlayLoader
) => {
    try {
        setIsOverlayLoader(true)
        let res = await postDataFromApi(jobCostingIncApi, {
            im_id: formData[0]?.incentive_invoice_id
        });
        if (res?.data?.status === 200) {
            if (!res?.data?.data?.jc_profit_loss) {
                // toast.error("Job costing has not been completed for this invoice; therefore, it cannot be processed.", {
                //     position: "top-right",
                //     autoClose: 2000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                // });
                setFormData((prevFormData) => {
                    return {
                        ...prevFormData,
                        0: {
                            ...prevFormData[0],
                            incentive_invoice_id: '',
                            im_total: '',
                            incentive_profit_against_work: '',
                            incentive_expense_amt: '',
                            incentive_receivable_amount: '',
                            incentive_client: '',
                            incentive_pow: '',
                            incentive_client_id: '',
                            incentive_mode: '',
                            incentive_price: '',
                            incentive_place_of_work: '',
                            incentive_billing_amt_inr: '',
                            incentive_work_completion_date: '',
                            incentive_vessel_quantity: ''
                        }
                    }
                })
            }
            else {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    0: {
                        ...prevFormData[0],
                        im_total: res?.data?.data?.im_total,
                        incentive_profit_against_work: res?.data?.data?.jc_profit_loss,
                        // jc_profit_perc: res?.data?.data?.jc_profit_perc,
                        incentive_expense_amt: res?.data?.data?.jc_total_exp,
                        incentive_receivable_amount: res?.data?.data?.incentive_receivable_amount,
                    }
                }
            })
            }
        } else {
            if (res?.data?.status === 400) {
                if (!res?.data?.data?.jc_profit_loss) {
                    toast.error("Job costing has not been completed for this invoice; therefore, it cannot be processed.", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setFormData((prevFormData) => {
                        return {
                            ...prevFormData,
                            0: {
                                ...prevFormData[0],
                                incentive_invoice_id: '',
                                im_total: '',
                                incentive_profit_against_work: '',
                                incentive_expense_amt: '',
                                incentive_receivable_amount: '',
                                incentive_client: '',
                                incentive_pow: '',
                                incentive_client_id: '',
                                incentive_mode: '',
                                incentive_price: '',
                                incentive_place_of_work: '',
                                incentive_billing_amt_inr: '',
                                incentive_work_completion_date: '',
                                incentive_vessel_quantity: ''
                            }
                        }
                    })
                }
            }
        }
    }
    finally {
        setIsOverlayLoader(false)
    }
}

export const incentivesCalculationData = (fieldName, fieldValue, setFormData, formData) => {

    setFormData((prevFormData) => {
        let calcData = 0
        let extraData = {}
        if (fieldName === "incentive_incentive_amount") {
            const perValue = (formData?.[0]?.incentive_incentive_amount_perc || 1) / 100 //0.01
            calcData = parseFloat((fieldValue * perValue) || 0).toFixed(2); //11310
            extraData = {
                incentive_receivable_amount: calcData,
            }
        }
        else if (fieldName === "incentive_sales_lead_share") {
            calcData = parseFloat(fieldValue * 0.2 || 0).toFixed(2);
            extraData = {
                incentive_actual_sales_share: parseFloat(fieldValue * 0.4 || 0).toFixed(2),
                incentive_operations_share: parseFloat(fieldValue * 0.25 || 0).toFixed(2),
                incentive_collections_share: parseFloat(fieldValue * 0.15 || 0).toFixed(2),
            }
        }
        return {
            ...prevFormData,
            0: {
                ...prevFormData[0],
                ...extraData,
                [fieldName]: calcData
            }
        };
    });
}

export const getBillingDelayDayCount = (billingdueDate, daysCount) => {
    daysCount = daysCount || 0
    const billingDate = moment(billingdueDate, 'YYYY-MM-DD');
    const dueDate = billingDate.clone().add(daysCount, 'days');
    const today = moment().startOf('day');
    let delayDays = 0;

    if (today.isAfter(dueDate)) {
        delayDays = today.diff(dueDate, 'days');
    }
    return delayDays || 'NA';
}