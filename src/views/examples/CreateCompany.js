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

import axios from 'axios';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import GeneralHeader from "components/Headers/GeneralHeader.js";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import Header from "components/Headers/Header";
import CompanyForm from "components/Forms/CompanyForm";
import VaccineForm from "../../components/Forms/VaccineForm";

class CreateCompany extends React.Component {

  render() {
    return (
        <>
          <GeneralHeader title={"Add a New Company"}/>
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

export default withAuthenticator(CreateCompany)