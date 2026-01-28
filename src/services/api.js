export const LoginApi = "/login/";
export const SwitchRoleLoginApi = "/login/";
export const LogOutApi = "/logout/";
export const forgotPasswordApi = "/users/forgot-password/";
export const verifyOtpApi = "/verify-otp/";
export const resendOtpApi = "/users/resend-otp/";
export const forgotPassOTPcheckApi = "/forgotpassotpcheck/";
export const resetPasswordApi = "/users/reset-password-confirm/";

export const jrfSearchApi = "/jrf/search/";
export const referenceDataApi = "/referenceData/";
export const JRFDeleteApi = "/jrf/delete";
export const JRFPDFDownloadApi = "/jrf_pdf/get";
export const JRFGetApi = "/jrf/get";
export const pdfDetailsApi = "/pdfdetails/get";

export const MasterListApi = "/masters/list";

export const HistoryApi = "/users/object-history/";
export const sampleDetailsAPI = "/sampleinward/create";
export const sampleInwardDetailsDeleteAPI = "sampleinward/delete";
export const sampleInwardDetailsGetAPI = "/sampleinward/get";
export const sampleInwardDetailsUpdateAPI = "/sampleinward/update";
export const sampleInwardUpdate = "/sampleinward/update";
export const sampleIdsApi = "/sampleids/";
export const checkSampleIdAvailable = "/checksampleidexists/get/";

export const allotmentCreateApi = "/allotment/create";
export const allotmentUpdateApi = "/allotment/update";
export const allotmentDeleteApi = "/allotment/delete";
export const getSimgleAllotmentDetailsApi = "/allotment/get";

export const sampleverificationdetailCreateApi =
  "/sampleverificationdetail/create";
export const sampleverificationdetailDeleteApi =
  "/sampleverificationdetail/delete/";
export const sampleverificationdetailUpdateApi =
  "/sampleverificationdetail/update";
export const getsamplelabcodeApi = "/samplelabcode/get";

export const sampleverificationCreateApi = "/sampleverification/create";
export const sampleverificationUpdateApi = "/sampleverification/update";
export const sampleverificationDeleteApi = "/sampleverification/delete";
export const sampleverificationSingleApi = "/sampleverification/get";
export const labparametersApi = "/labparameters/get";
export const labGrouoparametersApi = "/lmsgrouporparam/get";
export const OPESGrouoparametersApi = "/opsgrouporparam/get";
export const labGroupsStdBasisApi = "/groupstdbasis/get";
export const labOPEGroupsStdBasisApi = "/opsstdbasis/get";
export const labparambasisApi = "/parambasis/get/";
export const labOPEparambasisApi = "/opsparambasis/get/";
export const labdropdownApi = "/labdropdown/get/";
export const statuscountApi = "/statuscount/";

export const testMemoGetApi = "/testmemo/get";
export const testReportGetApi = "/testreport/get";
export const testMemoGetSamplesetsApi = "/samplesets/get";
export const testMemoGetParambasisstdApi = "/parambasisstd/get";
export const testMemoCreateasyncApi = "/testmemo/create";
export const testMemoDeleteApi = "/testmemo/delete";
export const testMemoUpdateApi = "/testmemo/update";
export const geChemistUserApi = "/chemistuser/get";
export const scopenonscopecountApi = "/scopenonscopecount/get/";

export const SFMCreateApi = "/sfm/create";
export const SFMUpdateApi = "/sfm/update";
export const SFMDeleteApi = "/sfm/delete";
export const SFMGetApi = "/sfm/get";
export const SFMSetCountApi = "/sfmstatuscount/get";
export const SFMbasisupdateApi = "/sfmbasisupdate/update";
export const SFMRejectFlowApi = "/sfmrejectflow/";

export const InternalCertificateCreateApi = "/internalcertificate/create";
export const InternalCertificateUpdateApi = "/internalcertificate/update";
export const InternalCertificateDeleteApi = "/internalcertificate/delete";
export const InternalCertificateGetApi = "/internalcertificate/get";
export const testReportDetailsApi = "/testreportdetails/get";
export const checkexistingulrnoApi = "/checkexistingulrno/get/";
export const SFMUnitUpdateApi = "/sfm_unit/update/"

export const refreshApi = "/api/token/refresh/";
export const formulaListapi = "/formula/list/";
export const formulagetapi = "/formula/get/";
export const formulaCreateapi = "/formula/create/";
export const InternalCertificateGetPDFApi = "/testreportpdf/create"
//Operations Apis
export const getClientListDataApi = "/masters/customer/list/";
export const getPlaceDataApi = "masters/placeofwork/list/";
export const getSubplierDataApi = "masters/supplier/list/";
export const getSubCommodityDataApi = "/ji-commodity/get/";
export const getClientDataApi = "/ji-client/get/";
export const getOperationTypeDataApi = "/masters/opmaster/list/";
export const getActivityDataApi = "/masters/activitymaster/list/";
export const getActivityDatabyOperationApi = "/activitydropdown/list/";
// export const getscopeofworkDataApi="/masters/scopeofwork/list/"
export const getscopeofworkDataApi = "/scopeofworkdropdown/get/";
export const getAllPortDataApi = "/masters/port/list/";
export const getScopeworkCreateApi = "/ji-scopeofwork/create/";
export const getScopeworkUpdateApi = "/ji-scopeofwork/update/";
export const getScopeworkDeleteApi = "/ji-scopeofwork/delete/";
export const getScopeworkSingleDataApi = "/ji-scopeofwork/get/";
export const getJIQualityAnalysisCreateApi = "/ji-quality-analysis/create/";
export const getJIQualityAnalysisUpdateApi = "/ji-quality-analysis/update/";
export const getJIQualityAnalysisDeleteApi = "/ji-quality-analysis/delete/";

export const getBranchDetailsApi = "/ji-branch/get/";
export const getJIsowandactivityApi = "/ji-sowandactivity/list/";
export const getReportConfigApi = "/report-config/list/";
export const getCommercialCertificateListApi = "/commercial-cert/list/";

export const TMLDataCreateApi = "/ji-samplemarks/create/";
export const TMLDataUpdateApi = "/ji-samplemarks/update/";
export const TMLDatagetAllApi = "/ji-samplemarks/list/";
export const TMLDataDeleteApi = "/ji-samplemarks/delete/";
export const TMLAnalysisDataCreateApi = "/ji-lms-assignment/create/";
export const TMLAnalysisDataListApi = "/ji-lms-assignment/list/";
export const sampleMarkOptionsApi = "ops-samplemarks/get/";
export const sampleMarkOptionsLotWiseApi = "/lotwise-samplemark/get/";
export const getJRFOperationDataApi = "/ops_lms_data/get/";
export const deleteTMLAnalysisDeleteApi = "/ji-lms-assignment/delete/";

export const jobinstructionUpdateApi = "/jobinstruction/update/";
export const jobinstructionDeleteApi = "/jobinstruction/delete/";
export const createOtherTpiApi = "/tpi-async-task/create/";
export const updateOtherTpiApi = "/tpi-main/update/";
export const getTpiSetApi = "/tpi-set/get/";
export const getTpiParamBasistApi = "/tpi-paramstdbasis/get/";
export const getTpibasisvalueUpdateApi = "/tpi-basisvalue/update/";
export const TPISetCountApi = "/tpi-markcount/get/";
export const notificationListApi = "/notifications/list/";
export const createHHApi = "/ops-vessel-hh/create/";
export const updateHHApi = "/ops-vessel-hh/update/";
export const getHHApi = "/ops-vessel-hh/get/"
export const createSVApi = "/ops-vessel-sv/create/";
export const updateSVApi = "/ops-vessel-sv/update/";
export const getSVApi = "/ops-vessel-sv/get/";
export const createDSApi = "/ops-vessel-ds/create/";
export const updateDSApi = "/ops-vessel-ds/update/";
export const getDSApi = "/ops-vessel-ds/get/";
export const getSalesPersonApi = "/sales-user/list/";
export const createOPSExecApi = "/opsexec-grpparam/create/";
export const getOPSExecApi = "/opsexec-grpparam/list/";
export const deleteOPSExecApi = "/opsexec-grpparam/delete/";
export const getlotnodropdownApi = "lotnodropdown/get/";
export const getAssignemtnLabDropdownApi = "/lab-dropdown/list/"
export const opsSizeAnalysisCreateApi = "/ops-sizeanalysis/create/"
export const opsSizeAnalysisUpdateApi = "/ops-sizeanalysis/update/"
export const opsSizeAnalysisGetApi = "/ops-sizeanalysis/get/"
export const getLastStepAssignmentData = "/lab-dropdown-lmsassignment/get/"
export const getLabWiseSetAssignmentData = "/labwise-set/get/"
export const getfirstrefnumberApi = "/firstrefnumber/list/"
export const getConsortiumOrderApi = "/consortium-order/list/"
export const getOperationTypeApi = "/masters/opmaster/list/"
export const getJIForPreviewApi = "/jobinstruction/preview/"
export const getActivityListDatabyjiApi = "/activity-dropdown/list/";
export const createManPowerApi = "/vessel-manpower/create/";
export const updateManPowerApi = "/vessel-manpower/update/";
export const getManPowerApi = "/vessel-manpower/list/";
export const getInvoiceDetailsApi = "/invoice-details/list/";
export const getInvoiceRetriveApi = "/invoices/get/";
export const InvoiceDeleteApi = "/invoices/delete/";
export const deleteManPowerApi = "/vessel-manpower/delete/";
export const documentShareCreate = "/document_shares/create/";
export const documentShareUpdate = "/document_shares/update/";
export const documentShareDelete = "/document_shares/delete/";
export const documentUpdate = "/documents/update/";
export const checkexistingCertinoApi = "/unique-cert-number/get/";



export const documentListApi = "/documents/list/";
export const documentCreateApi = "/documents/create/";
export const documentDeleteApi = "/documents/delete/";
export const documentGetApi = "/documents/get/";
export const folderCreateApi = "/folder/create/";
export const ccUpdateApi = "/commercial-cert/update/";
export const bulk_cc_update_to_trans_userAPI = "/bulk_cc_update_to_trans_user/update/";
export const bulk_ic_update_to_trans_userAPI = "bulk_ic_update_to_trans_user/update/";
export const dsSurveyPdfApi = "/draft-survey-pdf/";
export const ccCertPdfApi = "/comercial-certificate-pdf/";
export const ccCertGetApi = "/commercial-cert/get/";
export const ccCertCreateApi = "/commercial-cert/create/";
export const mergeFilesApi = "/merge_files/";
export const masterUploadApi = "/masters/upload/";
export const setwiseDataGetApi = "/setwise-data/get/";
export const certConfigCreateApi = "/certificate-config/create/";
export const certConfigUpdateApi = "/certificate-config/update/";
export const certConfigGetApi = "/certificate-config/get/";
export const reportConfigGetApi = "/report-config/get/";
export const reportConfigUpdateApi = "/report-config/update/";
export const reportConfigCreateApi = "/report-config/create/";
export const reportConfigDeleteApi = "/report-config/delete/";
export const reportHeaderFooterCreateApi = "/report-header-footer/get/";
export const emailSuggestionApi = "/email_suggestions/";
export const JRFGetPDFApi = "/generate-jrf-pdf/"
export const H_H_PdfApi = "/hatch-hold-pdf/";
export const supervisionPdfApi = "/supervision-pdf/";
export const getQualityAssesmentApi = "/rake-quality-assessment/get/"
export const createQualityAssesmentApi = "/rake-quality-assessment/create/"
export const updateQualityAssesmentApi = "/rake-quality-assessment/update/"

export const getQualityAnalysisApi = "/rake-quality-analysis/get/"
export const createQualityAnalysisApi = "/rake-quality-analysis/create/"
export const updateQualityAnalysisApi = "/rake-quality-analysis/update/"

export const updateTruckSealingApi = "/truck-sealing/update/";
export const createTruckSealingApi = "/truck-sealing/create/";
export const getTruckSealingApi = "/truck-sealing/get/";
export const updateCargoSupervisionApi = "/truck-cargo-sup/update/";
export const createCargoSupervisionApi = "/truck-cargo-sup/create/";
export const getCargoSupervisionApi = "/truck-cargo-sup/get/";
export const testMemoPDFDownloadApi = "/testmemosfmpdf/get/";
export const getSupervissionVesselInfoApi = "/supervision-vessel-info/";
export const getSamplingMethodsApi = "/samplingmethods/get/";
export const getCompanyBranchApi = "/company-branches/get/";
export const getLoadingPortDataApi = "/countrywise-port/get/";

export const truckSealingPdfApi = "/truck-sealing-pdf/";
export const truckQAPdfApi = "/truck-daily-tm-pdf/";
export const truckQA2PdfApi = "/truck-quality-sampling-pdf/";
export const rakeAssessPdfApi = "/qty-assess-pdf/";
export const rakeQAPdfApi = "/rake-quality-analysis-pdf/";
// export const stackQAPdfApi = "/quality-analysis-pdf/";
export const stackQAPdfApi = "/stack-quality-analysis-pdf/";
export const truckCSPdfApi = "/cargo-sup-pdf/";
export const consortiumDeleteApi = "/consortium-order/delete/";
export const plantQAPdfApi = "/plant-quality-analysis-pdf/";


export const createInvoiceApi = "/invoice-details/create/";
export const updateInvoiceApi = "/invoice-details/update/";
export const deleteInvoiceApi = "/invoice-details/delete/";

// Srushti
export const getSingleJobCosting = "/job-costing/get/"
export const getSingleBranchExpense = "/expense/get/"
export const getSingleOutstanding = "/outstanding/get/"

// ----------------------------------------------------------------
export const getReferenceWiseDataApi = "/reference-wise-data/";

export const dailyReportPDFApi = "/daily-report-pdf/";
export const OPSJRFDeleteApi = "/ops-jrf/delete/";

export const oustandingCreateApi = "/outstanding/create/";
export const oustandingUpdateApi = "/outstanding/updates/";
export const monthlyOutstanding="/outstanding/monthly-sale";
export const yearlyOutstanding="/outstanding/yearly-sale";

export const getSingleSalesRegister = "/saleregister/get/"
export const salesregisterCreateApi ="/saleregister/create/";
export const SalesRegisterUpdateApi = "/saleregister/update/";
export const monthlySalesRegister= "/saleregister/monthly-sale/";
export const yearlySalesRegister= "/saleregister/monthly-sale/";

export const purchaseRequistionUpdateApi=(requestNo) =>`/purchase-requisitions/update/?req_no=${requestNo}`;
export const purchaseRequistionDeleteApi=(requestNo) =>`/purchase-requisitions/delete/?req_no=${requestNo}`;
export const purchaseRequistionCreateApi="/purchase-requisitions/create/";
export const purchaseRequistionGetApi = (requestNo) => `/purchase-requisitions/get/?req_no=${requestNo}`;
export const purchaseRequistionDownload ="/purchase-requistion-pdf/"

export const purchaseRequistionTableDataUpdateApi=(prId) =>`/purchase-requisition-details/update/${prId}/`;
export const purchaseRequistionTableDataDeleteApi= (prId) =>`/purchase-requisition-details/delete/${prId}/`;
export const purchaseRequistionTableDataCreateApi="/purchase-requisition-details/create/";  
export const purchaseOrderGetApi= (prId) =>`/purchase-requisition-details/get/${prId}/`;

export const purchaseOrderUpdateApi=(poId)=> `/purchase-order/update/${poId}/`;
export const purchaseOrderDeleteApi=(poId)=>`/purchase-order/delete/${poId}/`;
export const purchaseOrderCreateApi="/purchase-order/create/";  
export const purchaseOrderGet_Api=(poId)=> `/purchase-order/get/${poId}/`;
export const purchaseOrderDownload ="/purchase-order-pdf/"
export const purchaseOrderInsuranceDownload ="/insurance_excel/create/"
export const purchaseOrderVenRatingDownload ="/vendor_rating_excel/create/"



export const SupplierUpdateApi = (id) => `/suppliers/update/${id}/`;
export const SupplierDeleteApi=(id)=>`/suppliers/delete/${id}/`;
export const SupplierCreateApi="/suppliers/create/";
export const SupplierGetApi = (id) => `/suppliers/get/${id}/`;

export const calibrationUpdateApi="/calibration/update/";
export const calibrationDeleteApi="/calibration/delete/";
export const calibrationCreateApi="/calibration/create/";
export const calibrationGetApi="/calibration/get/";

export const createBulkCargoApi = "/bulk-cargo/create/";
export const updateBulkCargoApi = "/bulk-cargo/update/";
export const getBulkCargoApi = "/bulk-cargo/get/"
export const createBulkInvoices = "/invoice-details/create/"

export const tenderUpdateApi=(tenderId) => `/tender/update/?tender_id=${tenderId}`;
export const tenderDeleteApi=(tenderId) => `/tender/delete/?tender_id=${tenderId}`;;
export const tenderCreateApi="/tender/create/";
export const tenderGetApi= (tenderId) => `/tender/get/?tender_id=${tenderId}`;

export const chemicalStocksUpdateApi=(chemicalStockId)=>`/chemist-stock/update/${chemicalStockId}/`;
export const chemicalStocksDeleteApi=(chemicalStockId)=>`/chemist-stock/delete/${chemicalStockId}/`;
export const chemicalStocksCreateApi="/chemist-stock/create/";
export const chemicalStocksGetApi=(chemicalStockId)=>`/chemist-stock/get/${chemicalStockId}/`;

// --- ${incentiveId}
export const IncentiveUpdateApi=(incentiveId)=>`/incentive/update/${incentiveId}/`;
export const IncentiveDeleteApi=(incentiveId)=>`/incentive/delete/${incentiveId}/`;
export const IncentiveCreateApi="/incentive/create/";
export const IncentiveGetApi=(incentiveId)=>`/incentive/get/${incentiveId}/`;

export const FeedbackUpdateApi=(feedbackId)=>`/feedback/update/${feedbackId}`;
export const FeedbackDeleteApi=(feedbackId)=>`/feedback/delete/${feedbackId}`;
export const FeedbackCreateApi="feedback/create/";
export const FeedbackGetApi=(feedbackId)=>`/feedback/get/${feedbackId}`;

// Category
export const CategoryUpdateApi=(categoryId)=>`/category-master/update/${categoryId}/`;
export const CategoryCreateApi="/category-master/create/";
export const CategoryGetApi=(categoryId)=>`/category-master/get/${categoryId}/`;
export const CategoryDeleteApi=(categoryId)=>`/category-master/delete/${categoryId}/`;

export const bulkCargoPDF = "/bulk-cargo-pdf/"
export const physicalAnalysisPDF = "/vessel-size-analysis/get/"
export const tmlMoisturePDFApi = "tml-moisture-pdf/"


export const opsStackSVCreateApi = "/ops-stack-sv/create/"
export const opsStackSVUpdateApi = "/ops-stack-sv/update/"
export const opsStackSVDeleteApi = "/ops-stack-sv/delete/"
export const opsStackSVGetApi = "/ops-stack-sv/list/"
export const opsStackSVPDFApi = "/stack-supervision-pdf/"

export const getSampleAnalyzedDataApi = "/samples-analysis-per-client-commodity/"
export const getUserSampleHeatMapApi = "/user-samples-heatmap/"
export const getClientRevenueChartApi = "/client-revenue-chart/"

export const opsRakeSVCreateApi = "/ops-rake-sv/create/"
export const opsRakeSVUpdateApi = "/ops-rake-sv/update/"
export const opsRakeSVDeleteApi = "/ops-rake-sv/delete/"
export const opsRakeSVGetApi = "/ops-rake-sv/list/"
export const opsRakeSVPDFApi = "/rake-supervision-pdf/"

export const ccCertDeleteApi = "/cc-and-config/delete/"
export const invoiceUpdateApi = "/invoices/update/"
export const getJiForCCApi = "/jobinstructioninfo/get/"
export const getStatisticsDataApi = "/metrics/"
export const getConfigDetailsByTenant = "/system-config/get/"


export const announementListApi = "/announcement/list/";

export const itemsnUpdateApi="/item-master/update/";
export const itemsDeleteApi="/item-master/delete/";
export const itemsCreateApi="/item-master/create/";
export const itemsGetApi="/item-master/retrieve/";

export const jobCostingIncApi="/job-costing-details/get/";
export const getWorkAnniversary ="/work-anniversary-notifications/list/"
export const getBirthday ="/birthday-notifications/list/"

export const getSliderListApi ="/slider/list/"

export const usersUpdateApi="/users/update/";
export const usersDeleteApi="/users/delete/";
export const usersCreateApi="/users/create/";
export const usersGetApi="/users/get/";


export const clientUpdateApi="/masters/customer/update/";
export const clientGetApi="/masters/customer/get/";