// export const handleMultiFile = (e, doc) => {
//     const docIndex = doc.dl_id;
//     setSelectedRow((prev) => {
//         if (prev.includes(docIndex)) {
//             return prev.filter((index) => index !== docIndex);
//         } else {
//             return [...prev, docIndex];
//         }
//     });


//     setSelectedMultiDocs((prev) => {
//         // Check if doc with this ID is already in selectedMultiDocs
//         const exists = prev.some((item) => item.dl_id === docIndex);

//         if (exists) {
//             // If it exists, filter it out (remove from the array)
//             return prev.filter((item) => item.dl_id !== docIndex);
//         } else {
//             // If it doesn't exist, add it to the array
//             return [...prev, doc];
//         }
//     });


// };


// export const handleMergeFiles = async () => {

//     let selectedUrls = subTableData
//         .filter(doc => selectedRow.includes(doc.dl_id))  // Filter the documents based on selected dl_id
//         .map(doc => doc.dl_s3_url);                      // Extract the dl_s3_url for the matched docs

//     // Create the payload with the s3 URLs
//     let payload = {
//         "s3_files": selectedUrls
//     };


//     // Send the payload to the API

//     let res = await postDataFromApi(mergeFilesApi, payload, "", true, "", "");

//     if (res && res.data && res.data.status) {

//         const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
//         let Imagepayload = new FormData();
//         Imagepayload.append('document', pdfBlob, 'certificate.pdf');
//         let uploadResponse = await postDataFromApi(masterUploadApi, Imagepayload, "TRUE");

//         if (uploadResponse.status === 200) {
//             let payload = {
//                 "data": {
//                     "dl_folder": 1,
//                     "dl_module": "commercial_certificate",
//                     "dl_document_name": formData[1].dl_document_name,
//                     "dl_discription": formData[1].dl_discription,
//                     "dl_document_reference": EditRecordId,
//                     "dl_type": "Document Type",
//                     "dl_show_to_all": false,
//                     "dl_s3_url": "https://18northawsbucket.s3.ap-south-1.amazonaws.com/LLP_STAMP.png",
//                     "dl_version": "1.0",
//                     "dl_date_uploaded": "2023-04-01T12:00:00Z",
//                     "dl_status": "Active",
//                     "dl_assigned_to": "Assigned User"
//                 }
//             }

//             let DocResonse = await postDataFromApi(documentCreateApi, payload);
//             if (DocResonse.status === 201) {
//                 getAllSubListingdata();
//             }

//         } else {
//             toast.error(uploadResponse?.message || uploadResponse?.data?.message || translate("loginPage.unExpectedError"), {
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
//     }


// };
// export const handleDescriptionOrNameChange = async (docType) => {
//     let payload = {
//         "id": selectedDoc?.dl_id,

//     }
//     if (docType === "Rename") {
//         payload.data = { "dl_document_name": formData[1].dl_document_name }

//     }
//     else {
//         payload.data = { "dl_discription": formData[1].dl_discription }

//     }

//     let res = await putDataFromApi(documentUpdate, payload);
//     if (res.status === 200) {
//         setUploadPopup(false);
//         getAllSubListingdata()
//     }
//     else {
//         toast.error(res?.data?.message || translate("loginPage.unExpectedError"), {
//             position: "top-right",
//             autoClose: 2000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//         });
//     }
// };

// export const handleUploadDocument = async () => {
//     if (popupType === "Merge") {
//         handleMergeFiles();
//     }
//     else if (popupType === "Description") {
//         handleDescriptionOrNameChange("Description");
//     }
//     else if (popupType === "Rename") {
//         handleDescriptionOrNameChange("Rename");
//     }
//     else if (popupType === "Share") {
//         handleSharedFile();
//     }

// }
// export const handleSharedFile = async () => {
//     const sharePayload = {
//         document_id: selectedDoc.dl_id,
//         data: [
//             {
//                 ds_document: selectedDoc.dl_id,
//                 ds_shared_with: formData[1]?.ds_shared_with,
//                 ds_share_date: "2023-04-01T12:00:00Z",
//                 ds_restriction_dwonload: "true",
//                 ds_download_limit: 10,
//                 ds_download_count: 0,
//                 ds_restriction_view: false,
//                 ds_restriction_print: false,
//                 ds_expiry_date: "2023-12-31T23:59:59Z",
//             },
//         ],
//     };
//     try {
//         let res = await postDataFromApi(documentShareCreate, sharePayload);
//         if (res?.data?.status === 200 || res?.data?.status === 201) {
//             setUploadPopup(false);
//             setTimeout(() => {
//                 toast.success(res.data?.message || "Document Shared Successfully");
//             }, 250);
//         }
//     }
//     finally {
//         // setIsLoading(false);
//     }


// };

// export const deleteDocument = async () => {
//     let payload = {
//         "id": subTableData[popupIndex].dl_id
//     }
//     let res = await deleteDataFromApi(documentDeleteApi, payload);
//     if (res.status === 204) {
//         toast.success(res?.data?.message || "SuccessFully Deleted Document", {
//             position: "top-right",
//             autoClose: 2000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//         });
//         getAllSubListingdata();
//     }
// }



