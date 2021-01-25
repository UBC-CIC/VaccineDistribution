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
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { withAuthenticator } from '@aws-amplify/ui-react';
import ContainerTable from "components/Tables/ContainerTable.js";
//Amplify.configure(awsExports)




class ViewContainer extends Component {

  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <ContainerTable/>

        </Container>
      </>
    );
  }
}

export default withAuthenticator(ViewContainer) ;