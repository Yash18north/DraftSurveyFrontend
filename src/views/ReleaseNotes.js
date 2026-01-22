import { Card, CardBody } from "react-bootstrap";
import { Row, Col, CardTitle } from "reactstrap";

const releases = [
  {
    title: "Release v1.2.0",
    date: "09/09/2025",
    description: [
      "New dashboard layout for easier navigation",
      "Fixed bugs in the reporting module",
    ],
  },
  {
    title: "Release v1.1.5",
    date: "08/09/2025",
    description: [
      "Invoice module now supports multi-currency",
      "Auto tax calculation added",
    ],
  },
  {
    title: "Release v1.1.0",
    date: "01/09/2025",
    description: [
      "Improved performance in data sync",
      "Enhanced security for login sessions",
    ],
  },
];

const ReleaseNotes = () => {
  return (
    <div className="my-2 bg-white">
      <Card className="section_card">
        <CardBody className="section_card_body">
          {/* Breadcrumb */}
          <CardTitle tag="h5" className="section_title section_title_support">
            <div className="list_breadcrumb">
              {[
                { title: "#", redirect: "#" },
                { title: "Release Notes", redirect: "#" },
              ].map((title, i) => (
                <div key={"Form-breadcom" + i}>
                  {i === 0 ? null : (
                    <i className="bi bi-chevron-right card-title-icon"></i>
                  )}{" "}
                  <button className="breadcrumb_button" type="button">
                    {title.title}
                  </button>
                </div>
              ))}
            </div>
          </CardTitle>
          <Row className="mb-12 support-main-content">
            <Col sm="12" md="12">
              <div className="release-page">
                {releases.map((release, index) => (
                  <div key={index} className="release-card">
                    <h6 className="release-title">
                      <i className="bi bi-rocket-takeoff-fill me-2 text-danger"></i>
                      {release.title}
                    </h6>
                    <div className="release-date">{release.date}</div>
                    <ul className="release-desc">
                      {release.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReleaseNotes;
