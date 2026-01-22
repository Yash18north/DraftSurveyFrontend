import { Card, CardBody } from "react-bootstrap";
import { Row, Col, CardTitle } from "reactstrap";

const Support = () => {
  return (
    <div
      className="my-2 bg-white"
    >
      <Card className="section_card">
        <CardBody className="section_card_body">
          <CardTitle tag="h5" className="section_title section_title_support">
            <div className="list_breadcrumb">
              {[
                {
                  "title": "#",
                  "redirect": "#"
                },
                {
                  "title": "Support",
                  "redirect": "#"
                }
              ].map((title, i) => (
                <div key={"Form-breadcom" + i}>
                  {i === 0 ? null : (
                    <i className="bi bi-chevron-right card-title-icon"></i>
                  )}{" "}
                  <button
                    className="breadcrumb_button"
                    type="button"
                  >
                    {title.title}
                  </button>
                </div>
              ))}
            </div>
          </CardTitle>
          <Row className="mb-12 support-main-content">
            <Col sm="12" md="4">
              <div className="support-page">
                <div className="contact-info">
                  <h2>East Region</h2>
                  <p><strong>Contact Person:</strong> Ms. Akhila Priya</p>
                  <p><strong>Phone:</strong> 8942873459</p>
                  <br />
                  <p><strong>Contact Person:</strong> Mr. Biswajit Panda</p>
                  <p><strong>Phone:</strong> 9658167818</p>
                </div>
              </div>
            </Col>
            <Col sm="12" md="4">
              <div className="support-page">
                <div className="contact-info">
                  <h2>West Region</h2>
                  <p><strong>Contact Person:</strong> Ms. Runali Malhar</p>
                  <p><strong>Phone:</strong> 8412884694</p>
                </div>
              </div>
            </Col>
            <Col sm="12" md="4">
              <div className="support-page">
                <div className="contact-info">
                  <h2>Email</h2>
                  <p><a href="mailto:support@tcrcgroup.com">
                    <strong>support@tcrcgroup.com</strong>
                  </a></p>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default Support;
