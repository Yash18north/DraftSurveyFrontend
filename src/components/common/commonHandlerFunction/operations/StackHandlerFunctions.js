import { toast } from "react-toastify";
import { documentCreateApi, folderCreateApi, masterUploadApi, opsStackSVCreateApi, opsStackSVDeleteApi, opsStackSVGetApi, opsStackSVPDFApi, opsStackSVUpdateApi } from "../../../../services/api";
import { deleteDataFromApi, postDataFromApi, putDataFromApi } from "../../../../services/commonServices";
import { encryptDataForURL } from "../../../../utills/useCryptoUtils";
import { OperationCreateDataFunction } from "./TMLOperations";

export const StackSupervissionCreateDataFunction = async (
    actionSelected,
    editableIndex,
    tableData,
    formData,
    section,
    setSaveClicked,
    setEditableIndex,
    setPopupIndex,
    popupIndex,
    setPopupOpenAssignment,
    setIsBtnClicked,
    setIsOverlayLoader,
    setTableData,
    setFormData,
    activityID
) => {
    try {
        if (actionSelected === "Save" || actionSelected === "customSave") {
            setIsBtnClicked(true);
            let newRowIndex = editableIndex;
            if (actionSelected === "customSave") {
                newRowIndex = tableData.length;
            }
            // let payload = {
            //     opsssv_jsonb_front: {}
            // };
            let payload = {
                "ops_stack_sv": {
                    "fk_jisid": activityID,
                    "fk_jiid": formData[0]?.ji_id,
                    // opsssv_created_by: 97,
                    // opsssv_updated_by: 97,
                    "opsssv_stack_no": formData[1]?.['st_sv_stack_no_' + newRowIndex],
                    "opsssv_jsonb_front": {
                    },
                    "tenant": 1
                }
            }

            if (section.rows[0]) {
                section.rows[0].forEach((field) => {
                    const key = field.name;
                    const value = formData[1][`${field.name}_` + newRowIndex] != null ? formData[1][`${field.name}_` + newRowIndex] : '';
                    payload.ops_stack_sv.opsssv_jsonb_front[key] = value;
                });
            }
            let nonRequiredFields = [];

            for (let obj in payload.ops_stack_sv.opsssv_jsonb_front) {
                const field = section.rows[0].filter((field, index) => {
                    if (field.name === obj) {
                        field.label = section.headers[index].label;
                        return true;
                    }
                    return false;
                });
                if (
                    (payload['ops_stack_sv']["opsssv_jsonb_front"][obj] === undefined ||
                        payload['ops_stack_sv']["opsssv_jsonb_front"][obj] === "") &&
                    !nonRequiredFields.includes(obj) && field?.[0]?.required
                ) {


                    if (field.length > 0) {
                        let errLabel = field ? field[0].label : "";
                        toast.error(errLabel + " is required", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setIsBtnClicked(false);
                        return;
                    }
                }
            }

            let res;
            if (actionSelected !== "customSave") {
                payload.opsssv_id = tableData[editableIndex].opsssv_id;
                res = await putDataFromApi(opsStackSVUpdateApi, payload);
            } else {
                res = await postDataFromApi(opsStackSVCreateApi, payload);
            }
            if (res.data.status === 200) {
                if (tableData.length === 0) {
                    OperationCreateDataFunction(
                        formData,
                        setIsOverlayLoader,
                        setIsBtnClicked,
                        '',
                        activityID,
                        null,
                        "in-process",
                        "",
                        [],
                        "",
                        1,
                        "",
                        ''
                    );
                }
                getAllStackSupervissionData(
                    formData[0]?.ji_id,
                    setTableData,
                    formData,
                    setFormData,
                    section,
                    activityID
                );
                setPopupOpenAssignment(false);
                setPopupIndex("");
                setEditableIndex("");
                setIsBtnClicked(false);
                setIsOverlayLoader(false);
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
            } else {
                setIsBtnClicked(false);
                setIsOverlayLoader(false);
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
            setSaveClicked(false);
            setIsOverlayLoader(false);
        } else if (actionSelected === "Delete") {
            setSaveClicked(true);
            let payload = {
                opsssv_id: tableData[popupIndex]?.opsssv_id,
            };
            setIsOverlayLoader(true);
            let res = await deleteDataFromApi(opsStackSVDeleteApi, payload);
            if (res.data.status === 200) {
                getAllStackSupervissionData(
                    formData[0]?.ji_id,
                    setTableData,
                    formData,
                    setFormData,
                    section,
                    activityID
                );
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
            setIsOverlayLoader(false);
            setSaveClicked(false);
        } else if (actionSelected === "Cancel") {
            setEditableIndex("");
        }
    }
    catch (ex) {

    }
    finally {

    }
};

export const getAllStackSupervissionData = async (
    ji_id,
    setTableData,
    formData,
    setFormData,
    section,
    OperationTypeID
) => {
    try {
        const bodyData = {
            "ji_id": formData[0]?.ji_id,
            "jis_id": OperationTypeID,
        };
        let res = await postDataFromApi(opsStackSVGetApi, bodyData);
        if (res?.data?.status === 200 && res.data.data) {
            const responseData = res.data.data;
            let updatedFormData = { ...formData };
            if (!updatedFormData) {
                updatedFormData = { ...formData };
            }
            let i = 0;
            const actualResponseData = responseData.filter((singleInwardData) => {
                if (!updatedFormData[1]) {
                    updatedFormData[1] = {};
                }
                for (let obj in singleInwardData.opsssv_jsonb_front) {
                    singleInwardData[obj] = singleInwardData.opsssv_jsonb_front[obj];
                }
                section.rows.forEach((row) => {
                    row.forEach((columnName) => {
                        const fieldName = `${columnName.name}_${i}`;
                        const value = singleInwardData[columnName.name];
                        updatedFormData[1][fieldName] = value;
                    });
                });

                updatedFormData[1]["opsssv_id_" + i] =
                    singleInwardData["opsssv_id"];
                i++;
                return true;
            });
            section.rows.forEach((row) => {
                row.forEach((columnName) => {
                    const fieldName = `${columnName.name}_${responseData.length}`;
                    updatedFormData[1][fieldName] = '';
                });
            });
            setFormData(updatedFormData);
            setTableData(actualResponseData);
        }
    } catch (error) {
        console.error(error);
    }
};

export const stackSupervissionDailyReport = async (formData, navigate, OperationTypeID) => {
    let payload = {
        "ji_id": formData[0]?.ji_id,
        "jis_id": OperationTypeID,
    }
    let generateCertificateResponse = await postDataFromApi(
        opsStackSVPDFApi,
        payload,
        "",
        true,
        "",
        ""
    );
    if (
        generateCertificateResponse?.data?.status === 200
    ) {
        const pdfBlob = new Blob([generateCertificateResponse.data], {
            type: "application/pdf",
        });
        let payload = new FormData();
        payload.append("document", pdfBlob, ("Daily Report" + ".pdf") || "certificate.pdf");
        payload.append("model_type ", "commercial_certificate");
        payload.append("bypass_file_size_check ", true);
        payload.append("sub_folder", 6);
        let uploadResponse = await postDataFromApi(
            masterUploadApi,
            payload,
            "TRUE"
        );

        if (uploadResponse.data.status === 200) {
            let folderPayload = {
                data: {
                    fd_name: formData[0]?.ji_reference_number,
                },
                parent_folder: "commercial_certificate",
            };
            let folderRes = await postDataFromApi(folderCreateApi, folderPayload);
            let FolderID;
            // setLoadingTable(true);

            if (folderRes.data.status === 201 || folderRes.data.status === 200) {
                FolderID = folderRes?.data?.data.fd_id;
            } else {
                FolderID = folderRes?.data?.message?.existing_folder_id;
            }
            if (FolderID) {
                let payload = {
                    data: {
                        dl_folder: FolderID,
                        // dl_sub_folder: 6,
                        dl_module: "commercial_certificate",
                        dl_document_name:
                            formData[0]?.ji_reference_number || "Daily Report",
                        dl_document_reference: formData[0]?.ji_id,
                        dl_document_jisid: OperationTypeID,
                        dl_type: "Document Type",
                        dl_show_to_all: true,
                        dl_s3_url: uploadResponse.data?.data?.document,
                        dl_version: "1.0",
                        dl_file_type: "Stack Supervission Daily Report",
                        dl_date_uploaded: new Date(),
                        dl_status: "Active",
                        // dl_assigned_to: "Assigned User",
                        dl_discription: "Stack Supervission",
                        // document_type: "daily_report",
                        // doc_ref_id: OperationTypeID
                    },
                };
                let documentResponse = await postDataFromApi(
                    documentCreateApi,
                    payload
                );

                if (documentResponse.data.status === 200) {
                    toast.success(
                        documentResponse?.message ||
                        documentResponse?.data?.message ||
                        "Daily Report Successfully Shared",
                        {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    );
                    setTimeout(() => {
                        navigate("/operation/JI-commercial-certificate-list/" + encryptDataForURL(formData[0]?.ji_id))

                    }, 2000);

                } else {
                    // setLoading(false);
                }
            }
        } else {
            toast.error(
                uploadResponse?.message ||
                uploadResponse?.data?.message,
                {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
            // setLoading(false);
        }
    } else {
        toast.error(
            generateCertificateResponse?.message ||
            generateCertificateResponse?.data?.message,
            {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }
        );
        // setLoading(false);
    }
}