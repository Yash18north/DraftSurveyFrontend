import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { handleInward } from "../commonHandlerFunction/sampleInwardHandlerFunctions";
import PropTypes from "prop-types";
import { encryptDataForURL } from "../../../utills/useCryptoUtils";

/*
Author  Yash Added PropsTypes as a props validation
Date: 01/09/2021
Use: To validate the props passed to the component
*/
const GroupAssignmentButtons = ({
  setIsPopupOpen,
  setJRFCreationType,
  setInwardBtnchange,
  subTableData,
  formData,
  jrfId,
  handleBackButtonFunction,
  isDisplayNewAddOption,
}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const translate = t;
  return (
    <div className="submit_btns">
      <Button
        type="button"
        className="cancelBtn"
        id="submit_btn3"
        onClick={() => {
          handleBackButtonFunction();
        }}
      >
        {translate("common.backBtn")}
      </Button>
      <button
        type="button"
        className="saveBtn"
        id="submit_btn2"
        data-name="save"
        disabled={
          subTableData.length === 0 ||
          (formData[0]?.smpl_status !== "inwarded" &&
            formData[0]?.smpl_status !== "assigning")
        }
        onClick={(e) =>
          handleInward(
            "save",
            formData,
            navigate,
            setIsPopupOpen,
            setInwardBtnchange,
            jrfId,
            "assignment"
          )
        }
      >
        {translate("common.saveBtn")}
      </button>
      <button
        type="button"
        className="saveBtn"
        id="submit_btn2"
        data-name="save"
        disabled={subTableData.length === 0}
        onClick={() =>
          navigate(
            "/inwardList/groupAssignmentPreview?status="+encryptDataForURL('assignment')+"&sampleInwardId=" +
            encryptDataForURL(formData[1]?.sampleInwardIdMain) +
              "&id=" +
              encryptDataForURL(jrfId)
          )
        }
      >
        {translate("common.previewBtn")}
      </button>
      <Button
        type="button"
        className="submitBtn"
        id="submit_btn1"
        disabled={subTableData.length === 0 || isDisplayNewAddOption || (formData[0].jrf_is_ops && !formData[0]?.sample_set_data?.length)}
        onClick={(e) =>
          handleInward(
            "assign",
            formData,
            navigate,
            setIsPopupOpen,
            setInwardBtnchange,
            jrfId,
            "assignment"
          )
        }
      >
        {translate("common.assignBtn")}
      </Button>
    </div>
  );
};
GroupAssignmentButtons.propTypes = {
  jrfId: PropTypes.string,
  setIsPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setInwardBtnchange: PropTypes.func,
  handleBackButtonFunction: PropTypes.func,
  isDisplayNewAddOption: PropTypes.func,
  subTableData: PropTypes.array,
  formData: PropTypes.object,
};
export default GroupAssignmentButtons;