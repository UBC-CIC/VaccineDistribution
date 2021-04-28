/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// reactstrap components
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import CompanyForm from "components/Forms/CompanyForm";

class CreateCompany extends React.Component {

  render() {
    return (
        <>
          <Header title={"Add a New Company"}/>
          {/* Page content */}
          <Container className="mt--7" fluid>
            <Row>
              <Col>
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">Company Information</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="pl-lg-1">
                    <CompanyForm/>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

          </Container>
        </>

    );
  }
}

export default (CreateCompany)