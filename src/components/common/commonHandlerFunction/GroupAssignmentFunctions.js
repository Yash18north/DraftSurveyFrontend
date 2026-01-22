import {
  sampleInwardDetailsDeleteAPI,
} from "../../../services/api";
import {
  deleteDataFromApi,
} from "../../../services/commonServices";
import {  toast } from "react-toastify";
export const assignmentPageHandleAction = async (
  actionSelected,
  tableData,
  simpleInwardId,
  setSaveClicked,
  getInwardTabledata,
  setEditableIndex,
  popupIndex,
  getSampleIdsMasterData,
  setIsOverlayLoader
) => {
  if (actionSelected == "Delete") {
    setSaveClicked(true);
    setIsOverlayLoader(true)
    let payload = {
      smpl_set_id: tableData[popupIndex]?.smpl_set_id,
    };
    let res = await deleteDataFromApi(sampleInwardDetailsDeleteAPI, payload);
    if (res.data.status === 200) {
      getSampleIdsMasterData(simpleInwardId)
      getInwardTabledata(simpleInwardId)
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
    setSaveClicked(false);
    setIsOverlayLoader(false)
  } else if (actionSelected === "Cancel") {
    setEditableIndex("");
  }
};
