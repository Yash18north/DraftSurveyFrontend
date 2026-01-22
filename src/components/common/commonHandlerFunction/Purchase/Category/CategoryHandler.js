import React from 'react'
import { CategoryDeleteApi, CategoryCreateApi, CategoryUpdateApi, CategoryGetApi } from '../../../../../services/api'
import { deleteDataFromApi, getDataFromApi, postDataFromApi } from '../../../../../services/commonServices';
import { toast } from 'react-toastify';

export const handleCategoryCreateAndUpdate = async (
    formData,
    handleSubmit,
    setFormData,
    setActionClicked,
    navigate
) => {
    try {

        let isValidate = handleSubmit();
        if (!isValidate) {
            return false;
        }
        const payload = {
            category_name: formData[0]?.category_name,
            category_description: formData[0]?.category_description
        };
        let res;
        if (formData[0].category_id) {

            let updateCategory = CategoryUpdateApi(formData[0]?.category_id)
            res = await postDataFromApi(updateCategory, payload)

        } else {

            res = await postDataFromApi(CategoryCreateApi, payload);

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
            navigate("/categorieslist")
            setFormData((prevData) => {
                return {
                    0: {
                        // category_name: res?.data?.data?.category_name,
                        // category_description: res?.data?.data?.category_description
                    }
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
        console.log('errrr', error)
    }
}

export const handleGetCategory = async (
    categoryId,
    setFormData,
    setIsOverlayLoader
) => {
    try {
        setIsOverlayLoader(true);

        const getCategory = CategoryGetApi(categoryId);
        const res = await getDataFromApi(getCategory);

        if (res?.data?.status === 200) {
            const categoryData = res.data.data || {};

            setFormData((prevData) => ({
                ...prevData,
                0: {
                    ...prevData[0], 
                    ...categoryData, 
                },
            }));
        } else {
            toast.error(res?.message || "Failed to fetch category", {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            });
        }
    } catch (error) {
        console.error("Error fetching category:", error);
    } finally {
        setIsOverlayLoader(false);
    }
};




export const handleCategoryDelete = async (
    categoryId,
    setIsDelete,
    getAllListingData,
    setPopupIndex

) => {
    try {
        let categoryDelete = CategoryDeleteApi(categoryId)
        let res = await deleteDataFromApi(categoryDelete);
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