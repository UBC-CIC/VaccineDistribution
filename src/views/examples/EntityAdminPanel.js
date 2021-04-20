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
import ApprovalPurchaseOrderTable from "components/EntityAdminPanel/ApprovalPurchaseOrderTable.js";

import axios from 'axios';
import { Auth } from "aws-amplify";
import GeneralHeader from "../../components/Headers/GeneralHeader";



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
       qldbPersonId: '',
       allJoiningRequest:[],
       currentScEntity:{},
       purchaseOrderIds:[]
    }
 }
  async componentDidMount(){
    console.log('componentDidMount runs')
    this.getEmployeeData();
    this.getEntityData();
    this.getCognitoUserId()
    this.getQldbPersonId()
    this.getAllJoiningRequest()
    this.getYourScEntityId()

    this.getPurchaseOrder()
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

async getAllJoiningRequest(){

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
        this.setState({allJoiningRequest:res.data.body});
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
    })
  console.log("AllJoiningRequest", this.state.allJoiningRequest)

}


async getYourScEntityId() {

  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_YOUR_SCENTITY",

  PersonId: localStorage.getItem("qldbPersonId")

} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      this.setState({currentScEntity:res.data.body});
      //console.log("EntityId", this.state.currentScEntity[0].id)
      localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);
    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })


  //this.setState({entity: response.data})
}



async getPurchaseOrder() {

  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_PURCHASE_ORDER_IDS",

  PersonId: localStorage.getItem("qldbPersonId"),
  FetchType: "Recieved"

} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      this.setState({purchaseOrderIds: res.data.body.PurchaseOrderIds});
      //console.log("EntityId", this.state.currentScEntity[0].id)
    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })


  //this.setState({entity: response.data})
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

approveEntityData = (joiningRequestId, personId) => {

  console.log("personId", personId)


const joiningRequest = this.state.allJoiningRequest.filter(requests => requests.SenderPersonId == personId)
console.log("McgRequest filter", joiningRequest)
console.log("McgRequestId filter", joiningRequest[0].JoiningRequestId)
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "ACCEPT_JOINING_REQUEST",

PersonId: localStorage.getItem("qldbPersonId"),
JoiningRequestId: joiningRequest[0].JoiningRequestId
} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      if(res.data.statusCode == 200){
      console.log(res.data.body);
     alert("Joining Request is approved")

      const del = this.state.allJoiningRequest.filter(request => personId !== request.SenderPersonId)
      this.setState({allJoiningRequest:del})
    }
    else{
      alert("Entity approval failed")
    }

    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })



}


approvePurchaseOrder = (purchaseOrderId) => {

axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "ACCEPT_PURCHASE_ORDER",

PersonId: localStorage.getItem("qldbPersonId"),
PurchaseOrderId: purchaseOrderId
} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      if(res.data.statusCode == 200){
      console.log(res.data.body);
     alert("PurchaseOrder is approved")
    }
    else{
      alert("PurchaseOrder approval failed")
    }

    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })



}

denyEntityData = (joiningRequestId, personId) => {

  alert("Denied Joining Request")
}

denyPurchaseOrder = ( purchaseOrderId) => {

  alert("Denied Purchase Order")
}


  render() {
    return (
      <>
        <GeneralHeader title={"Entity Admin Panel"} />
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
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApprovalJoinRequestEntityTable allJoiningRequest={this.state.allJoiningRequest} approveEntityData={this.approveEntityData} denyEntityData={this.denyEntityData}/>

          </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            
            

            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h1 className="mb-0">Approve Join Request of Entity</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApprovalPurchaseOrderTable purchaseOrderIds={this.state.purchaseOrderIds} approvePurchaseOrder={this.approvePurchaseOrder} denyPurchaseOrder={this.denyPurchaseOrder}/>

          </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
       
          
      </>
    );
  }
}

export default (EntityAdminPanel) ;