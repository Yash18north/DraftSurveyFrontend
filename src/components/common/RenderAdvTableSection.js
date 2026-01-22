import React, { useState } from "react";
import RenderFields from "./RenderFields";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import PropTypes from "prop-types";

const RenderAdvTableSection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,

  deleteColumn,
  formErrors,
  groupAssignment,
  GAData,
  setGAData,
  showModalGA,
  setShowModalGA,
  setIsOverlayLoader
}) => {
  const Section = section;

  const [rangeSet, setRangeSet] = useState(0);
  const [range, setRange] = useState([5, 5, 5, 5]);

  const newOptions = [
    "2324C27SS01681",
    "2324C27SS01682",
    "2324C27SS01683",
    "2324C27SS01684",
  ];
  const newGroupOptions = [
    "Ultimate Analysis",
    "Ash Analysis",
    "Proxy Analysis",
  ];

  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card>
        <CardBody>
          <CardTitle tag="h5">{Section.title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6"></CardSubtitle>
          <div className="test_memo_selections">
            <div className="form-group my-2">
              <label style={{ width: `${25}%` }} htmlFor="Sample Id List">
                Sample Id List
              </label>
              <div className={"w-50 d-inline-block mx-2 sample_code_list"}>
                <select className="form-control rounded-2">
                  <option value="" disabled>
                    {"select"}
                  </option>

                  {newOptions.length > 0 &&
                    newOptions?.map((option, optionIndex) => (
                      <option
                        key={"newoptions" + optionIndex}
                        value={parseInt(option?.id, 10)}
                      >
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="form-group my-2 test_memo_group">
              <label style={{ width: `${15}%` }} htmlFor="group">
                Group 
              </label>
              <div className={"w-50 d-inline-block mx-2 sample_code_list"}>
                <select>
                  <option value="" disabled>
                    {"select"}
                  </option>

                  {newGroupOptions.length > 0 &&
                    newGroupOptions?.map((option, optionIndex) => (
                      <option
                        key={"optionIndex" + optionIndex}
                        value={parseInt(option?.id, 10)}
                      >
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <table className="table table-white responsive borderless no-wrap mt-3 align-middle advTable">
            <thead className="head_of_table">
              <tr className="border-top">
                {Section.headers
                  .slice(0, range[rangeSet])
                  .map((header, headerIndex) => (
                    <th
                      key={"header-table" + headerIndex}
                      colSpan={header.colSpan ?? 1}
                      rowSpan={header.rowSpan ?? 1}
                    >
                      {header.label}
                      {!header.required && (
                        <Button
                          // variant="danger"
                          // size="sm"
                          className="trash_btn"
                          onClick={() =>
                            deleteColumn(sectionIndex, headerIndex)
                          }
                        >
                          <Trash />
                        </Button>
                      )}
                    </th>
                  ))}
                {groupAssignment ? <th>Action</th> : null}
              </tr>
            </thead>

            <tbody>
              {Section.rows.map((row, rowIndex) => (
                <tr key={"rowIndex" + rowIndex} className="border-top">
                  {row.slice(0, range[rangeSet]).map((cell, cellIndex) => (
                    <td
                      key={"cellINDEX" + cellIndex}
                      colSpan={cell.name === "group" ? range[rangeSet] : 1}
                    >
                      <RenderFields
                        field={cell}
                        sectionIndex={sectionIndex}
                        fieldIndex={rowIndex * 100 + cellIndex}
                        formData={formData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors}
                        GAData={GAData}
                        setGAData={setGAData}
                        showModalGA={showModalGA}
                        setShowModalGA={setShowModalGA}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {section.label === "Test Memo and Certification Details" ? (
            <div className="submit_btns">
              <button
                className="submitBtn"
                onClick={() =>
                  setRange((prev) => ({
                    ...prev,
                    [rangeSet]: prev[rangeSet] + 3,
                  }))
                }
                type="button"
              >
                Add Sample
              </button>
              {rangeSet === 0 ? null : (
                <button
                  className="submitBtn"
                  onClick={() => setRangeSet((prev) => prev - 1)}
                  type="button"
                >
                  Previous Page
                </button>
              )}

              <button
                className="submitBtn"
                onClick={() => setRangeSet((prev) => prev + 1)}
                type="button"
              >
                Save & Next Page
              </button>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
};
RenderAdvTableSection.propTypes = {
  section: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  groupAssignment: PropTypes.object.isRequired,
  GAData: PropTypes.array.isRequired,
  setGAData: PropTypes.func.isRequired,
  showModalGA: PropTypes.bool.isRequired,
  setShowModalGA: PropTypes.func.isRequired,
};
export default RenderAdvTableSection;
