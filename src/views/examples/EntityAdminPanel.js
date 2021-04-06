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
import { listContainers, listLinkUsers } from '../../graphql/queries';
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
  Col,
  Button,
  CardBody,
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { withAuthenticator } from '@aws-amplify/ui-react';
import InitializeQLDB from "components/AdminPanel/InitializeQLDB.js";
import JoinRequest_Entity from "components/AdminPanel/JoinRequest_Entity";
import ApprovalProductTable from "components/AdminPanel/ApprovalProductTable.js";
import ApprovalJoinRequestEntityTable from "components/EntityAdminPanel/ApprovalJoinRequestEntityTable.js";

import axios from 'axios';
import { Auth } from "aws-amplify"; 



//Amplify.configure(awsExports)

let user;
let jwtToken;
const URL = 'https://jsonplaceholder.typicode.com/users'

class EntityAdminPanel extends Component {

  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = { //state is by default an object
       employees: [{ id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
       { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
       { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
       { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }],
       entity: [],
       cognitoUserId: '',
       qldbPersonId: ''
    }
 }
  async componentDidMount(){
    console.log('componentDidMount runs')
    this.getEmployeeData();
    this.getEntityData();
    this.getCognitoUserId()
    this.getQldbPersonId()
}

  async getEmployeeData() {
    const response = await axios.get(URL)
    this.setState({employees: response.data})
}

async getEntityData() {
  const response = await axios.get(URL)
  /*
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_JOINING_REQUESTS",
PersonId: localStorage.getItem("qldbPersonId"),
ScEntityId: localStorage.getItem("ScEntityId")
} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      this.setState({entity:res.data.body});
    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })

*/
  //this.setState({entity: response.data})
}

async getCognitoUserId() {
  console.log("Loading Auth token")
  user = await Auth.currentAuthenticatedUser();
   jwtToken = user.signInUserSession.idToken.jwtToken; 
   //this.setState({Email: user.attributes.email});
   //console.log(user.attributes.email);
   this.setState({cognitoUserId: user.attributes.sub})

   console.log(this.state.cognitoUserId)  
}

async getQldbPersonId() {
  console.log(this.state.qldbPersonId)
    try {
      console.log("Loading Auth token")
      user = await Auth.currentAuthenticatedUser();
       jwtToken = user.signInUserSession.idToken.jwtToken; 
       //this.setState({Email: user.attributes.email});
       //console.log(user.attributes.email);
       this.setState({cognitoUserId: user.attributes.sub})

      const currentReadings = await API.graphql(graphqlOperation(listLinkUsers, {filter:{cognitoUserId: {eq: this.state.cognitoUserId}}}))
      
      console.log('current readings: ', currentReadings)
      this.setState({
         qldbPersonId: currentReadings.data.listLinkUsers.items[0].qldbPersonId
      })
    } catch (err) {
      console.log('error fetching LinkUser...', err)
    }
}

removeData = (id) => {

  axios.delete(`${URL}/${id}`).then(res => {
      const del = this.state.employees.filter(employee => id !== employee.id)
      this.setState({employees:del})
  })
}

removeEntityData = (ScEntityIdentificationCode) => {

  axios.delete(`${URL}/${ScEntityIdentificationCode}`).then(res => {
      const del = this.state.entity.filter(entity => ScEntityIdentificationCode !== entity.ScEntityIdentificationCode)
      this.setState({entity:del})
  })
}


  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        <Row>
            
            

            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h1 className="mb-0">Approve Join Request of Entity</h1>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApprovalJoinRequestEntityTable entity={this.state.entity} removeEntityData={this.removeEntityData}/>
          </CardBody>
              </Card>
            </Col>
          </Row>

       



        </Container>
       
          
      </>
    );
  }
}

export default withAuthenticator(EntityAdminPanel) ;