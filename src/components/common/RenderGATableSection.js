import React from "react";
import RenderFields from "./RenderFields";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import PropTypes from 'prop-types';


const RenderTableSection = ({
  section,
  sectionIndex,
  formData,
  handleFieldChange,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  formErrors,
}) => {

  return (
    <div key={sectionIndex} className="row my-2 mx-0 bg-white">
      <Card>
        <CardBody>
          <CardTitle tag="h5">{section.title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {/* Overview of the projects */}
          </CardSubtitle>
          <table className="table table-white responsive borderless no-wrap mt-3 align-middle">
            <thead>
              <tr className="border-top">
                {section.headers.slice(0, 5).map((header, headerIndex) => (
                  <th key={"headerIndex"+headerIndex}>
                    {header.label}
                    {!header.required && (
                      
                        <Button
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

              </tr>
            </thead>
            <tbody>
              {section?.rows?.map((row, rowIndex) => (
                <tr key={"rowIndex"+rowIndex} className="border-top">
                  {row.slice(0, 5).map((cell, cellIndex) => (
                    <td key={"cellIndex"+cellIndex}>
                      <RenderFields
                        field={cell}
                        sectionIndex={sectionIndex}
                        fieldIndex={rowIndex * 100 + cellIndex}
                        formData={formData}
                        handleFieldChange={handleFieldChange}
                        formErrors={formErrors} // Pass formErrors to RenderFields
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>

              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};


RenderTableSection.propTypes = {
  section: PropTypes.object.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  addColumn: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
};

export default RenderTableSection;
