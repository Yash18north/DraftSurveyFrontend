import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { deleteDataFromApi, postDataFromApi, getDataFromApi } from "../../services/commonServices";
import { useNavigate, useParams } from "react-router-dom";
import { encryptDataForURL } from "../../utills/useCryptoUtils";

const RenderTallyListSection = () => {

  const [listData, setListData] = useState({});
  const [aclistData, setAcListData] = useState({});
  let navigate = useNavigate();
  const handleGetPosted = async () => {
    let res = await getDataFromApi("/invoice/getPostedList/", "", 1);
    let res2 = await getDataFromApi("/invoice/get-dump-data/");
    if (res.data.status == 200 && res2.data.status == 200) {
      setListData(res.data);
      // if (res.data.data.length == res2.data.data.length || res.data.data.length + 1 == res2.data.data.length) {
        setAcListData([...res2.data.data].reverse());
        setOpen(true);
      // }
    }
  }
  useEffect(() => {
    handleGetPosted()
  }, []);
  const [open, setOpen] = useState(false);
  const handleDumpTallyData = async () => {
    let res = await postDataFromApi("/invoice/dump_or_update_data/", listData?.data);
    if (res.data.status == 200) {
      let res2 = await getDataFromApi("/invoice/get-dump-data/");
      if ([200, "success"].includes(res2.data.status)) {
        setAcListData([...res2.data.data].reverse());
        setOpen(true);
      }
    }
  }

  return <div className="row my-2 mx-0 renderList_header_table">
    {/* <button></button> */}
    <div className="jrf_container_btns">
      <button
        type="button"
        className="create_button"
        onClick={() => handleDumpTallyData()}
      >
        Dump Data to Tally
      </button>
    </div>
    <br />
    <br />
    <br />
    {open && <div className="renderList_table_container">
      <div className="renderList_table">

        <div className="tableContainer">
          <table className="table table-white responsive borderless no-wrap align-middle list mainRenderList">
            <thead>
              <tr>
                <th> Invoice Number</th>
                <th>Tax Classification</th>
                <th>Tax Type</th>
                <th>Narration Number</th>
                <th>Bill to Place</th>

                <th className="actioncol list_th_action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {aclistData?.map((row, rowIndex) => (
                <tr
                // key={"rowIndex-" + rowIndex}
                >
                  <td>
                    {row?.im_invoicenumber}
                  </td>
                  <td>{row?.im_tax_classification}</td>
                  <td>{row?.im_tax_type}</td>
                  <td>{row?.im_naration_no}</td>
                  <td>{row?.im_billtoplace}</td>
                  <td>
                    <button
                      type="button"
                      // key={"listing-action" + actionIndex}
                      className="iconBtn"
                      onClick={() => {
                        localStorage.setItem("row", JSON.stringify(row));
                        navigate("/operation/tallyForm/" + encryptDataForURL(row?.im_id))

                      }}
                    >Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="previous_next_btns">
        {/* <TablePagination
          totalPages={totalPage}
          currentPage={currentPage}
          onPageChange={handlePaginationButton} /> */}
      </div>
    </div>}

  </div>

};

RenderTallyListSection.propTypes = {
  section: PropTypes.string,
  sectionIndex: PropTypes.number,
  actions: PropTypes.arrayOf(PropTypes.object),
  responseData: PropTypes.object,
  getAllListingData: PropTypes.func,
  formConfig: PropTypes.object,
  statusCounts: PropTypes.array,
  setIsRejectPopupOpen: PropTypes.func,
  setJRFCreationType: PropTypes.func,
  setIsPopupOpen: PropTypes.func,
  loadingTable: PropTypes.bool,
  setIsOverlayLoader: PropTypes.func,
};

export default RenderTallyListSection;
