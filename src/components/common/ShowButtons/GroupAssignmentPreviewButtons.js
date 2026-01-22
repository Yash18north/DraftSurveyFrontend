import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { encryptDataForURL } from "../../../utills/useCryptoUtils";

/*
Author: Yash
Date: 22-10-2021
Use: Added Props validation
*/

const GroupAssignmentPreviewButtons = ({ formData, jrfId }) => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const translate = t;
  return (
    <div className="submit_btns">
      <button
        type="button"
        className="saveBtn"
        id="submit_btn2"
        data-name="save"
        onClick={(e) =>
          navigate(
            "/inwardList/groupAssignment?status="+encryptDataForURL('assignment')+"&sampleInwardId=" +
            encryptDataForURL(formData[1]?.sampleInwardIdMain) +
              "&id=" +
              encryptDataForURL(jrfId)
          )
        }
      >
        {translate("common.backBtn")}
      </button>
    </div>
  );
};
GroupAssignmentPreviewButtons.propTypes = {
  formData: PropTypes.object.isRequired,
  jrfId: PropTypes.string.isRequired,
};

export default GroupAssignmentPreviewButtons;
