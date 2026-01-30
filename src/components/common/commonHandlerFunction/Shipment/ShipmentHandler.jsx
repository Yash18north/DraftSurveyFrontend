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

            setformData((previousData = []) => {
                const updatedFirstItem = {
                    ...(previousData[0] || {}),
                    ...res?.data?.data,
                    ship_commodity: res?.data?.data?.ship_commodity,
                    // res?.data?.data?.ship_commodity?.commodity_details,
                    ship_sub_commodity: res?.data?.data?.ship_sub_commodity,
                    // res?.data?.data?.ship_sub_commodity?.sub_commodity_details,
                    ship_place_of_work: parseInt(res?.data?.data?.ship_place_of_work, 10),
                    // res?.data?.data?.ship_place_of_work?.ship_place_of_work_details,
                    ji_is_loading: res?.data?.data?.ship_loading_unloading === "loading" ? "Loading" :
                        res?.data?.data?.ship_loading_unloading === "unloading" ?
                            "Unloading" : "",
                    ship_doc_url: res?.data?.data?.ship_doc_url,
                };

                return [updatedFirstItem];
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
        // console.log('errrr', error)
    }
}

// export const handleShipmentCreateAndUpdate = async (formData, handleSubmit, setIsOverlayLoader, navigate, status) => {
//     try {

//         let isValidate = handleSubmit();
//         if (!isValidate) {
//             return false;
//         }
//         const formDataPayload = formData()



//         const payload = {

//             shipment: {
//                 // formData[0]?.ship_commodity 
//                 //formData[0]?.ship_sub_commodity,
//                 // ship_vessel_name: formData[0]?.ship_vessel_name,
//                 // ship_commodity: formData[0]?.ship_commodity,
//                 // ship_sub_commodity: formData[0]?.ship_sub_commodity,
//                 // ship_total_quantity: formData[0]?.ship_total_quantity,
//                 // ship_appointed_quantity: formData[0]?.ship_appointed_quantity,
//                 // ship_place_of_work: formData[0]?.ship_place_of_work,
//                 // ship_loading_unloading: formData[0]?.ji_is_loading?.toLowerCase(),
//                 // ship_loading_unloading_port_name: formData[0]?.loading_unloading_port_name,
//                 // ship_doc_url: formData[0]?.ship_doc_url,
//                 // ship_status: status

//             }


//         }

//         let res;
//         if (formData[0]?.ship_id) {
//             let updateShipment = shipmentUpdateApi(formData[0]?.ship_id)
//             res = await putDataFromApi(updateShipment, payload)

//         } else {

//             res = await postDataFromApi(shipmentCreateApi, payload);

//         }

//         if (res?.data?.status === 200) {

//             toast.success(res?.data?.message, {
//                 position: "top-right",
//                 autoClose: 2000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//             });

//             navigate("/shipment ")

//         } else {
//             setIsOverlayLoader(false)
//             toast.error(res.message, {
//                 position: "top-right",
//                 autoClose: 2000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//             });
//         }

//     } catch (error) {
//         // console.log('errrr', error)
//     }
// }   

// export const handleShipmentCreateAndUpdate = async (
//     formData,
//     handleSubmit,
//     setIsOverlayLoader,
//     navigate,
//     status
// ) => {
//     try {
//         // 1️⃣ Validate form
//         const isValidate = handleSubmit();
//         if (!isValidate) return false;

//         setIsOverlayLoader(true);

//         // 2️⃣ Use formData directly (it's an array, not a function)
//         const data = formData;

//         // 3️⃣ Build shipment object (text / number fields)
//         const shipmentObj = {
//             ship_vessel_name: data[0]?.ship_vessel_name,
//             ship_commodity: data[0]?.ship_commodity,
//             ship_sub_commodity: data[0]?.ship_sub_commodity,
//             ship_total_quantity: data[0]?.ship_total_quantity,
//             ship_appointed_quantity: data[0]?.ship_appointed_quantity,
//             ship_place_of_work: data[0]?.ship_place_of_work,
//             ship_loading_unloading: data[0]?.ji_is_loading?.toLowerCase(),
//             ship_loading_unloading_port_name: data[0]?.loading_unloading_port_name,
//             ship_status: status
//         };

//         // 4️⃣ Create FormData
//         const formPayload = new FormData();

//         // 5️⃣ Append shipment object as JSON string
//         formPayload.append("shipment", JSON.stringify(shipmentObj));

//         // 6️⃣ Append file (if exists)
//         if (data[0]?.ship_doc_url instanceof File) {
//             formPayload.append("shipment[ship_doc_url]", data[0].ship_doc_url);
//         }

//         // 7️⃣ Append tenant
//         formPayload.append("tenant", 1);

//         // 8️⃣ API call
//         let res;
//         if (data[0]?.ship_id) {
//             const updateShipment = shipmentUpdateApi(data[0].ship_id);
//             res = await putDataFromApi(updateShipment, formPayload);
//         } else {
//             res = await postDataFromApi(shipmentCreateApi, formPayload);
//         }

//         // 9️⃣ Success handling
//         if (res?.data?.status === 200) {
//             toast.success(res?.data?.message, {
//                 position: "top-right",
//                 autoClose: 2000,
//                 theme: "light",
//             });
//             navigate("/shipment");
//         } else {
//             throw new Error(res?.message || "Something went wrong");
//         }
//     } catch (error) {
//         toast.error(error?.message || "Request failed", {
//             position: "top-right",
//             autoClose: 2000,
//             theme: "light",
//         });
//     } finally {
//         setIsOverlayLoader(false);
//     }
// };


export const handleShipmentCreateAndUpdate = async (
    formData, 
    handleSubmit,
    setIsOverlayLoader,
    navigate,
    status
) => {
    try {
       
        const isValidate = handleSubmit();
        if (!isValidate) return false;

        setIsOverlayLoader(true);

        const data = formData[0]; 

        
        const getBase64 = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        let shipDocBase64 = null;
        if (data.ship_doc_url) {
            shipDocBase64 = await getBase64(data.ship_doc_url);
        }

     
        const payload = {
            shipment: {
                ship_vessel_name: data.ship_vessel_name,
                ship_commodity: data.ship_commodity,
                ship_sub_commodity: data.ship_sub_commodity,
                ship_total_quantity: data.ship_total_quantity,
                ship_appointed_quantity: data.ship_appointed_quantity,
                ship_place_of_work: data.ship_place_of_work,
                ship_loading_unloading: data.ji_is_loading?.toLowerCase(),
                ...(shipDocBase64 && { ship_doc_url: shipDocBase64 }), 
                ship_status: status,
            },
        };

        let res;

        if (data?.ship_id) {
            // Update shipment
            const updateShipment = shipmentUpdateApi(data.ship_id);
            res = await putDataFromApi(updateShipment, payload);
        } else {
            // Create new shipment
            res = await postDataFromApi(shipmentCreateApi, payload);
        }

        if (res?.data?.status === 200) {
            toast.success(res?.data?.message, { position: "top-right", autoClose: 2000 });
            navigate("/shipment");
        } else {
            toast.error(res?.data?.message || "Something went wrong!", { position: "top-right", autoClose: 2000 });
        }

    } catch (error) {
        console.error("Error creating/updating shipment:", error);
        toast.error(error.message || "Server error occurred!", { position: "top-right", autoClose: 2000 });
    } finally {
        setIsOverlayLoader(false);
    }
};




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

