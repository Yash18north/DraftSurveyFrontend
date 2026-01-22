import React from 'react'
import { chemicalStocksCreateApi, chemicalStocksDeleteApi, chemicalStocksGetApi, chemicalStocksUpdateApi } from '../../../../services/api'
import { deleteDataFromApi, getDataFromApi, postDataFromApi } from '../../../../services/commonServices';
import { toast } from 'react-toastify';

export const getChemicalStock = async (chemicalStockId, setformData, status, setIsOverlayLoader) => {
    try {
        const getChemicalStocks = chemicalStocksGetApi(chemicalStockId)
        let res;
        res = await getDataFromApi(getChemicalStocks)
        if (res.data.status === 200) {


            setformData((previousData) => {
                return {
                    0: {
                        ...previousData,
                        ...res?.data?.data,
                        fk_item_id: status === "View" ? res?.data?.data?.item_details?.item_rm_code : res?.data?.data.fk_item_id,
                        stock_fk_lab_id: status === "View" ? res?.data?.data?.lab_details ? res?.data?.data?.lab_details?.lab_name + `(${res?.data?.data?.lab_details?.lab_code})` : '' : res?.data?.data.fk_lab_id,
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

export const handleChemicalStocksCreateAndUpdate = async (formData, handleSubmit, setIsOverlayLoader,
    navigate,
    status) => {
    try {

        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }

        const payload = {
            fk_item_id: formData[0]?.fk_item_id,
            stock_name_of_chemical: formData[0]?.stock_name_of_chemical,
            stock_opening_qty: formData[0]?.stock_opening_qty,
            stock_purchase_qty: formData[0]?.stock_purchase_qty,
            stock_consumed_qty: formData[0]?.stock_consumed_qty,
            stock_closing_qty: formData[0]?.stock_closing_qty,
            stock_remark: formData[0]?.stock_remark,
            stock_services: formData[0]?.stock_services,
            fk_stock_calibration_id: formData[0]?.fk_calibration_id,
            stock_expiry_date: formData[0]?.stock_expiry_date,
            stock_notify_expiry_date: formData[0]?.stock_notify_expiry_date,
            fk_lab_id: formData[0]?.stock_fk_lab_id,
            stock_buffer_value: formData[0]?.stock_buffer_value,
            stock_is_show_notification: formData[0]?.stock_is_show_notification,
            stock_status: status
        }

        let res;
        if (formData[0]?.chemist_stock_id) {
            let updateChemicalStock = chemicalStocksUpdateApi(formData[0]?.chemist_stock_id)
            res = await postDataFromApi(updateChemicalStock, payload)

        } else {

            res = await postDataFromApi(chemicalStocksCreateApi, payload);

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

            navigate("/chemicalStocks")

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

export const handleChemicalStocksDelete = async (
    tenderId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let tenderDelete = chemicalStocksDeleteApi(tenderId)
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

