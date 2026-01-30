import React from 'react'
import { FeedbackCreateApi, FeedbackDeleteApi, FeedbackGetApi, FeedbackUpdateApi } from '../../../../services/api'
import { deleteDataFromApi, getDataFromApi, postDataFromApi } from '../../../../services/commonServices';
import { toast } from 'react-toastify';

export const handleGetFeedback = async (feedbackId, setformData, status, setIsOverlayLoader) => {
    try {
        const getFeedback = FeedbackGetApi(feedbackId)
        let res;
        res = await getDataFromApi(getFeedback)
        if (res.data.status === 200) {
            setIsOverlayLoader(true)
            setformData((previousData) => {
                return {
                    0: {
                        previousData,

                    }
                }
            })
            setIsOverlayLoader(false)
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
        // // console.log('errrr', error)
    }
}

export const handleFeedbackCreateAndUpdate = async (
    formData,
    handleSubmit,
    setFormData,
    setActionClicked
) => {
    try {

        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        const payload = {
            feedback_company_name: formData[0]?.feedback_company_name,
            feedback_contact_person: formData[0]?.feedback_contact_person,
            feedback_email: formData[0]?.feedback_email,
            feedback_phone: formData[0]?.feedback_phone,
            feedback_fax: formData[0]?.feedback_fax,
            feedback_rating_knowledge: formData[0]?.feedback_rating_knowledge,
            feedback_rating_quality: formData[0]?.feedback_rating_quality,
            feedback_rating_response: formData[0]?.feedback_rating_response,
            feedback_rating_complaint: formData[0]?.feedback_rating_complaint,
            feedback_rating_competitiveness: formData[0]?.feedback_rating_competitiveness,
            feedback_opinion_charges: formData[0]?.feedback_opinion_charges,
            feedback_improve_facilities: formData[0]?.feedback_improve_facilities,
            feedback_improve_system: formData[0]?.feedback_improve_system,
            feedback_improve_others: formData[0]?.feedback_improve_others,
            feedback_type: formData[0]?.fromType,
            feedback_status: 1,
        };
        let res;
        if (formData[0].feedback_id) {

            let updateFeedback = FeedbackUpdateApi(formData[0]?.feedback_id)
            res = await postDataFromApi(updateFeedback, payload)

        } else {

            res = await postDataFromApi(FeedbackCreateApi, payload);

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
            setFormData((prevData) => {
                return {
                    0: {}
                }
            })
            setActionClicked(false)
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
        // // console.log('errrr', error)
    }
}

export const handleFeedbackDelete = async (
    feebackId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let feedbackDelete = FeedbackDeleteApi(feebackId)
        let res = await deleteDataFromApi(feedbackDelete);
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

