import React from 'react'
import { getShipmentDetail, shipmentCreateApi, shipmentDeleteApi, shipmentUpdateApi } from '../../../../services/api'
import { deleteDataFromApi, getDataFromApi, postDataFromApi, putDataFromApi } from '../../../../services/commonServices';
import { toast } from 'react-toastify';

export const handleGetAShipmet = async (shipmentId, setformData, status, setIsOverlayLoader) => {
    try {
        const getShipment = getShipmentDetail(shipmentId)
        let res;
        res = await getDataFromApi(getShipment)
        if (res.data.status === 200) {


            setformData((previousData) => {
                return {
                    0: {
                        ...previousData,
                        ...res?.data?.data
                    }
                }
            })

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
        // console.log('errrr', error)
    }
}

export const handleShipmentCreateAndUpdate = async (formData, handleSubmit, setIsOverlayLoader,navigate,status) => {
    try {

        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }

        const payload = {

            shipment: {
                // formData[0]?.ship_commodity 
                //formData[0]?.ship_sub_commodity,
                ship_vessel_name: formData[0]?.vessel_name,
                ship_commodity:formData[0]?.ship_commodity  ,
                 ship_sub_commodity:formData[0]?.ship_sub_commodity, 
                ship_total_quantity: formData[0]?.ship_total_quantity,
                ship_appointed_quantity: formData[0]?.ship_appointed_quantity,
                ship_place_of_work: formData[0]?.ship_place_of_work,
                ship_loading_unloading: formData[0]?.ji_is_loading?.toLowerCase(),
                ship_loading_unloading_port_name:formData[0]?.loading_unloading_port_name,
                ship_status:status
            }


        }

        let res;
        if (formData[0]?.shipment_id) {
            let updateShipment = shipmentUpdateApi(formData[0]?.shipment_id)
            res = await putDataFromApi(updateShipment, payload)

        } else {

            res = await postDataFromApi(shipmentCreateApi, payload);

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

            navigate("/shipment ")

        } else {
            setIsOverlayLoader(false)
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

export const handleIShipmentRecordDelete = async (
   shipmentId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let shipDelete = shipmentDeleteApi(shipmentId)
        let res = await deleteDataFromApi(shipDelete);
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

