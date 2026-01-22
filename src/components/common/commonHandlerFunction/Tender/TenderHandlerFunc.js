import { toast } from "react-toastify";
import {
    deleteDataFromApi,
    getDataFromApi,
    postDataFromApi,
    putDataFromApi,
} from "../../../../services/commonServices";
import { calibrationDeleteApi, calibrationUpdateApi, calibrationCreateApi, calibrationGetApi, tenderDeleteApi, tenderUpdateApi, tenderGetApi } from "../../../../services/api";
import { tenderCreateApi } from "../../../../services/api";

export const handleGetTender = async (EditRecordId, setFormData, status, setParticipantFields) => {

    try {
        let tenderGet = tenderGetApi(EditRecordId)
        let res = await getDataFromApi(tenderGet)

        if (res.data.status === 200) {
            const participants = res?.data?.tender?.tender_participants
            const participantcount = Array.isArray(participants)
                ? participants.length
                : (typeof participants === "object" && participants !== null
                    ? Object.keys(participants).length
                    : 0);
            setParticipantFields(participantcount)
            setFormData((prevFormData) => {
                return {
                    0: {
                        ...prevFormData[0],
                        tender_client_bid_no:res?.data?.tender?.tender_client_bid_no,
                        tender_no: res?.data?.tender?.tender_number,
                        tender_id: res?.data?.tender?.tender_id,
                        tender_client_name: status === "View" ?
                            res?.data?.tender?.tender_client_name_details?.cust_name
                            :
                            res?.data?.tender?.tender_client_name || prevFormData[0]?.tender_client_name,

                        tender_work_location: status === "View" ?
                            res?.data?.tender?.tender_work_location_details?.pow_name
                            :
                            res?.data?.tender?.tender_work_location || prevFormData[0]?.tender_work_location,

                        tender_scope_of_work: status === "View" ?
                            res?.data?.tender?.tender_scope_of_work_details?.am_name
                            :
                            res?.data?.tender?.tender_scope_of_work || prevFormData[0]?.tender_scope_of_work,
                        tender_commodity: status === "View" ?
                            res?.data?.tender?.tender_commodity_details?.cmd_name
                            :
                            res?.data?.tender?.tender_commodity || prevFormData[0]?.tender_commodity,

                        tender_contract_period_to: res?.data?.tender?.tender_contract_period_to,
                        tender_contract_period_from: res?.data?.tender?.tender_contract_period_from,
                        tender_quantity: res?.data?.tender?.tender_quantity,
                        tender_issue_date: res?.data?.tender?.tender_issue_date || prevFormData[0]?.tender_issue_date,
                        tender_pre_bidding_meeting_date: res?.data?.tender?.tender_pre_bid_meeting_datetime,
                        tender_submission_date: res?.data?.tender?.tender_submission_date || prevFormData[0]?.tender_submission_date,
                        tender_opening_date: res?.data?.tender?.tender_tender_opening_datetime,
                        tender_estimated_bid_value: res?.data?.tender?.tender_estimated_bid_value,
                        // tender_work_location: res?.data?.tender?.tender_work_location || prevFormData[0]?.tender_work_location,
                        tender_nsic_msme: res?.data?.tender?.tender_nsic_msme,
                        tender_scope_of_work_additional_details: res?.data?.tender?.tender_scope_of_work_additional_details,
                    },

                    1: {
                        ...prevFormData[1],
                        tender_emd_amount: res?.data?.tender?.tender_emd_amount || prevFormData[1]?.tender_emd_amount,
                        tender_emd_additional_fees: res?.data?.tender?.tender_emd_additional_fees || prevFormData[1]?.tender_emd_additional_fees,
                        tender_emd_transfer_details: res?.data?.tender?.tender_emd_transfer_details || prevFormData[1]?.tender_emd_transfer_details,
                        tender_emd_transfer_mode: res?.data?.tender?.tender_emd_transfer_mode || prevFormData[1]?.tender_emd_transfer_mode,
                        tender_emd_refund_details: res?.data?.tender?.tender_emd_refund_details || prevFormData[1]?.tender_emd_refund_details,
                        tender_emd_approved_by: res?.data?.tender?.tender_emd_approved_by || prevFormData[1]?.tender_emd_approved_by,
                        // tender_emd_refund_date: res?.data?.tender?.tender_emd_refund_date,
                        tender_actual_emd_refund_reciept_date: res?.data?.tender?.tender_actual_emd_refund_receipt_date,
                        tender_additional_fees: res?.data?.tender?.tender_additional_fees,
                        tender_additional_fees_details: res?.data?.tender?.tender_additional_fees_details,
                        tender_expected_refund_date: res.data?.tender?.tender_expected_refund_date
                    },

                    2: {
                        ...prevFormData[2],
                        tender_security_approved_by: res?.data?.tender?.tender_security_approved_by || prevFormData[2]?.tender_security_approved_by,
                        tender_security_deposit_details: res?.data?.tender?.tender_security_deposit_details || prevFormData[2]?.tender_security_deposit_details,
                        tender_security_total_amount: res?.data?.tender?.tender_security_total_amount || prevFormData[2]?.tender_security_total_amount,
                        tender_security_in_form_of: res?.data?.tender?.tender_security_in_form_of || prevFormData[2]?.tender_security_in_form_of,
                        tender_security_valid_till: res?.data?.tender?.tender_security_valid_till || prevFormData[2]?.tender_security_valid_till,
                        tender_security_refund_details: res?.data?.tender?.tender_security_refund_details || prevFormData[2]?.tender_security_refund_details,
                    },

                    3: {
                        ...prevFormData[3],
                        tender_bid_amount: res?.data?.tender?.tender_bid_amount || prevFormData[3]?.tender_bid_amount,
                        tender_final_status:
                            res?.data?.tender?.tender_final_status === 0 ? "Retendered" :
                                res?.data?.tender?.tender_final_status === 1 ? "Awarded" :
                                    res?.data?.tender?.tender_final_status === 2 ? "Not Awarded" :
                                        res?.data?.tender?.tender_final_status === 3 ? "Under Evaluation" :
                                            res?.data?.tender?.tender_final_status === 4 ? "Cancelled" :
                                                res?.data?.tender?.tender_final_status === 5 ? "In Process" : "",
                        tender_winner: res?.data?.tender?.tender_winner || prevFormData[3]?.tender_winner,
                        tender_winner_amount: res?.data?.tender?.tender_winner_amount || prevFormData[3]?.tender_winner_amount,
                        tender_tenure: res?.data?.tender?.tender_tenure || prevFormData[3]?.tender_tenure,
                        ...res?.data?.tender?.tender_participants
                    },
                    4: {
                        ...prevFormData[4],
                        tender_auction_date: res?.data?.tender?.tender_auction_date || prevFormData[3]?.tender_auction_date,
                        tender_auction_mode: res?.data?.tender?.tender_auction_mode,
                          tender_rank: res?.data?.tender?.tender_rank
                    }
                };;
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
    } catch (error) {
        console.log('errrr', error)
    }
    finally {
        // setIsOverlayLoaders(false)
    }
}

export const handlTenderCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status,
    participantFields
) => {

    try {
        setIsOverlayLoader(true)
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;

        }
        let participantDeta = {}
        Array.from({ length: participantFields }).forEach((_, index) => {
            participantDeta[`participant_${index}`] = formData?.[3]?.[`participant_${index}`]
        });
        let payloadData = {
            tender_client_bid_no:formData[0]?.tender_client_bid_no,
            tender_number: formData[0]?.tender_no,
            tender_client_name: formData[0]?.tender_client_name,
            tender_scope_of_work: formData[0]?.tender_scope_of_work,
            tender_scope_of_work_additional_details: formData[0]?.tender_scope_of_work_additional_details,
            tender_commodity: formData[0]?.tender_commodity,
            tender_contract_period_to: formData[0]?.tender_contract_period_to,
            tender_contract_period_from: formData[0]?.tender_contract_period_from,
            tender_issue_date: formData[0]?.tender_issue_date,
            tender_submission_date: formData[0]?.tender_submission_date,
            tender_work_location: formData[0]?.tender_work_location,
            tender_nsic_msme: formData[0]?.tender_nsic_msme,
            tender_estimated_bid_value: formData[0]?.tender_estimated_bid_value,

            // new fields
            tender_quantity: formData[0]?.tender_quantity,
            tender_pre_bid_meeting_datetime: formData[0]?.tender_pre_bidding_meeting_date,
            tender_tender_opening_datetime: formData[0]?.tender_opening_date,


            tender_emd_amount: formData[1]?.tender_emd_amount,
            tender_emd_additional_fees: formData[1]?.tender_emd_additional_fees,
            tender_emd_transfer_details: formData[1]?.tender_emd_transfer_details,
            tender_emd_transfer_mode: formData[1]?.tender_emd_transfer_mode,
            tender_emd_refund_details: formData[1]?.tender_emd_refund_details,
            tender_emd_approved_by: formData[1]?.tender_emd_approved_by,
            // tender_emd_refund_date: formData[1]?.tender_emd_refund_date,

            // new fields
            tender_actual_emd_refund_receipt_date: formData[1]?.tender_actual_emd_refund_reciept_date,
            tender_additional_fees: formData[1]?.tender_additional_fees,
            tender_additional_fees_details: formData[1]?.tender_additional_fees_details,
            tender_expected_refund_date: formData[1]?.tender_expected_refund_date,

            tender_security_approved_by: formData[2]?.tender_security_approved_by,
             tender_security_deposit_details: formData[2]?.tender_security_deposit_details,
            tender_security_total_amount: formData[2]?.tender_security_total_amount,
            tender_security_in_form_of: formData[2]?.tender_security_in_form_of,
            tender_security_valid_till: formData[2]?.tender_security_valid_till,
            tender_security_refund_details: formData[2]?.tender_security_refund_details,


            tender_bid_amount: formData[3]?.tender_bid_amount,
            tender_final_status: formData[3]?.tender_final_status === "Retendered" ? 0 : formData[3]?.tender_final_status === "Awarded" ? 1 : formData[3]?.tender_final_status === "Not Awarded" ? 2 : formData[3]?.tender_final_status === "Under Evaluation" ? 3 : formData[3]?.tender_final_status === "Cancelled" ? 4 : formData[3]?.tender_final_status === "In Process" ? 5 : "",
            tender_winner: formData[3]?.tender_winner,
            tender_winner_amount: formData[3]?.tender_winner_amount,
            tender_tenure: formData[3]?.tender_tenure,
            tender_participants: participantDeta,

            // new fields
            tender_auction_date: formData[4]?.tender_auction_date,
            tender_auction_mode: formData[4]?.tender_auction_mode,
             tender_rank: formData[4]?.tender_rank,

            // // Your extra field
            //  tender_tender_final_status: status,
        };
        // return
        let res
        if (formData[0].tender_id) {

            let updateTender = tenderUpdateApi(formData[0].tender_id)
            res = await postDataFromApi(updateTender, payloadData)

        } else {
            res = await postDataFromApi(tenderCreateApi, payloadData);
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
            navigate("/tenderList")

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

    }
    finally {
        setIsOverlayLoader(false)
    }
}

export const handleTenderDelete = async (
    tenderId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let tenderDelete = tenderDeleteApi(tenderId)
        let res = await deleteDataFromApi(tenderDelete);
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


// [{
        //   "width": 6,
        //   "name": "tender_emd_refund_date",
        //   "label": "EMD Refund Date",
        //   "type": "date",
        //   "required": true,
        //   "pastDate": true,
        //   "pastdays": 97
        // }]  