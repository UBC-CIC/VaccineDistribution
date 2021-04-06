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
import React, {Component, useEffect, useState } from 'react'
import Amplify, { API, container, graphqlOperation } from 'aws-amplify'
import { listContainers } from '../../graphql/queries';
//import awsExports from "../../aws-exports";




// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  Button,
  CardBody,
  Col,
  UncontrolledTooltip
} from "reactstrap";
// core components
import GeneralHeader from "components/Headers/GeneralHeader.js";
import { withAuthenticator } from '@aws-amplify/ui-react';
import ContainerForm from "components/Forms/ContainerForm.js";
//Amplify.configure(awsExports)




class CreateContainer extends Component {

  render() {
    return (
      <>
       <GeneralHeader title={"Add a New Container"} />
        {/* Page content */}
        <Container className="mt--7" fluid>
        <Row>
            <Col>
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Container Information</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="pl-lg-1">

                    <ContainerForm/>
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

export default withAuthenticator (CreateContainer) ;