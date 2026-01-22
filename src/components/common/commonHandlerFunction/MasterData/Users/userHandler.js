import { toast } from "react-toastify";
import { clientGetApi, clientUpdateApi, usersGetApi } from "../../../../../services/api";
import { getDataFromApi, postDataFromApi, putDataFromApi } from "../../../../../services/commonServices";
import { decryptDataForURL } from "../../../../../utills/useCryptoUtils";

export const handleGetUserMAsterData = async (id, setFormData, setIsOverlayLoaders) => {
    try {
        setIsOverlayLoaders(true)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split("?")[1]);
        const action = decryptDataForURL(params.get("status"));
        let res = await postDataFromApi(usersGetApi, { id: id })

        if (res.data.status === 200) {
            setFormData((prevFormData) => {
                return {
                    0: {
                        ...prevFormData[0],
                        ...res?.data?.data
                    },
                };
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
    }
    finally {
        setIsOverlayLoaders(false)
    }
}

export const handleGetclientMAsterData = async (id, setFormData, setIsOverlayLoaders) => {
    try {
        setIsOverlayLoaders(true)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split("?")[1]);
        const action = decryptDataForURL(params.get("status"));
        let res = await postDataFromApi(clientGetApi, { cust_id: id })

        if (res.data.status === 200) {
            setFormData((prevFormData) => {
                return {
                    0: {
                        ...prevFormData[0],
                        ...res?.data?.data
                    },
                };
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
    }
    finally {
        setIsOverlayLoaders(false)
    }
}

export const handleClientCreateUpdate = async (
    formData,
    handleSubmit,
    setIsOverlayLoader,
    navigate
) => {
    try {
        setIsOverlayLoader(true)
        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        let payloadData = {
            cust_id: formData[0]?.cust_id,
            customer_data: {
                cust_remark: formData[0]?.cust_remark
            }
        }
        let res
        res = await putDataFromApi(clientUpdateApi, payloadData)
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
            navigate("/collections/client-list")

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
    finally {
        setIsOverlayLoader(false)
    }
}