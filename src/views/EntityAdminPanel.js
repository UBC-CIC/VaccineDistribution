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
import React, {Component} from 'react'
import {API, Auth, graphqlOperation} from 'aws-amplify'
import {listLinkUsers} from '../graphql/queries';
//import awsExports from "../../aws-exports";
// reactstrap components
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
// core components
import JoinRequest_Entity from "components/AdminPanel/JoinRequest_Entity";
import ApprovalJoinRequestEntityTable from "components/EntityAdminPanel/ApprovalJoinRequestEntityTable.js";
import ApprovalPurchaseOrderTable from "components/EntityAdminPanel/ApprovalPurchaseOrderTable.js";
import InventoryTable from "components/EntityAdminPanel/InventoryTable.js";
import ApproveExport from "components/EntityAdminPanel/ApproveExport.js";
import ApproveLadingBill from "components/EntityAdminPanel/ApproveLadingBill.js";
import ApproveImport from "components/EntityAdminPanel/ApproveImport.js";


import axios from 'axios';
import Header from "../components/Headers/Header";
import NotificationMessage from "../components/Notification/NotificationMessage";


//Amplify.configure(awsExports)

let user;
let jwtToken;
//const URL = 'https://jsonplaceholder.typicode.com/users'

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
       purchaseOrderIds:[],
       inventoryTable: [],
        notificationOpen: false,
        notificationType: "success",
        message: "",

    }
 }
  async componentDidMount(){
    console.log('componentDidMount runs')
    //this.getEmployeeData();
    await this.getEntityData();
    await this.getCognitoUserId()
    await this.getQldbPersonId()
    await this.getAllJoiningRequest()
    await this.getYourScEntityId()

    await this.getPurchaseOrder()
    await this.getInventoryTable()
}

/*
  async getEmployeeData() {
    const response = await axios.get(URL)
    this.setState({employees: response.data})
}
*/

async getEntityData() {

  /*
  axios.post(process.env.REACT_APP_API_URL, { Operation: "GET_JOINING_REQUESTS",
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

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "GET_JOINING_REQUESTS",

            PersonId: localStorage.getItem("qldbPersonId"),
            ScEntityId: localStorage.getItem("ScEntityId")
        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        if(res.data.statusCode === 200)
        {
        this.setState({allJoiningRequest:res.data.body});
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
        }
        else{
          console.log("No Joining request found")
        }
    })
  console.log("AllJoiningRequest", this.state.allJoiningRequest)

}


async getYourScEntityId() {

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "GET_YOUR_SCENTITY",

            PersonId: localStorage.getItem("qldbPersonId")

        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      this.setState({currentScEntity:res.data.body});
      //console.log("EntityId", this.state.currentScEntity[0].id)
      if(this.state.currentScEntity[0]){
          localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);

      }
  })

}



async getPurchaseOrder() {

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "GET_PURCHASE_ORDER_IDS",

            PersonId: localStorage.getItem("qldbPersonId"),
            FetchType: "Recieved"

        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      if(res.data.statusCode === 200){
      this.setState({purchaseOrderIds: res.data.body.PurchaseOrderIds});
      //console.log("EntityId", this.state.currentScEntity[0].id)
    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
      }
  })


  //this.setState({entity: response.data})
}

async getInventoryTable(){

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "GET_INVENTORY_TABLE",

            PersonId: localStorage.getItem("qldbPersonId")
        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        if(res.data.statusCode === 200)
        {
        this.setState({inventoryTable: res.data.body});
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
        }
        else{
          console.log("No Joining request found")
        }
    })

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


const joiningRequest = this.state.allJoiningRequest.filter(requests => requests.SenderPersonId === personId)
console.log("McgRequest filter", joiningRequest)
console.log("McgRequestId filter", joiningRequest[0].JoiningRequestId)
    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "ACCEPT_JOINING_REQUEST",

            PersonId: localStorage.getItem("qldbPersonId"),
            JoiningRequestId: joiningRequest[0].JoiningRequestId
        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
      .then(res => {
          console.log(res);
          console.log(res.data);
          if (res.data.statusCode === 200) {
              console.log(res.data.body);
              this.showNotification("Joining Request is approved", "success")
              const del = this.state.allJoiningRequest.filter(request => personId !== request.SenderPersonId)
              this.setState({allJoiningRequest: del})
          }
      }).catch(err => {
      this.showNotification(err.message, "error")
      console.log(err)
  });




}


approvePurchaseOrder = (purchaseOrderId) => {

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "ACCEPT_PURCHASE_ORDER",

            PersonId: localStorage.getItem("qldbPersonId"),
            PurchaseOrderId: purchaseOrderId
        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
  .then(res => {
      console.log(res);
      console.log(res.data);
      if (res.data.statusCode === 200) {
          console.log(res.data.body);
          this.showNotification("PurchaseOrder is approved", "success")

      } else {
          this.showNotification("PurchaseOrder approval failed", "error")

      }

    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })

}

approveExport = (containerId) => {

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "APPROVE_EXPORT",

            PersonId: localStorage.getItem("qldbPersonId"),
            ContainerId: containerId
        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
    .then(res => {
        console.log(res);
        console.log(res.data);
        if(res.data.statusCode === 200){
        console.log(res.data.body);
       alert("Export is approved")
      }
      else{
        alert("Export approval failed")
      }
    })



  }
  approveImport = (containerId) => {

    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "APPROVE_EXPORT",
  
    PersonId: localStorage.getItem("qldbPersonId"),
    ContainerId: containerId
    } ,
      {
        headers: {
          //'Authorization': jwtToken
        }})
      .then(res => {
          console.log(res);
          console.log(res.data);
          if(res.data.statusCode === 200){
          console.log(res.data.body);
         alert("Export is approved")
        }
        else{
          alert("Export approval failed")
        }
      })
    }

    approveLadingBill = (containerId) => {

      axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "APPROVE_EXPORT",
    
      PersonId: localStorage.getItem("qldbPersonId"),
      ContainerId: containerId
      } ,
        {
          headers: {
            //'Authorization': jwtToken
          }})
        .then(res => {
            console.log(res);
            console.log(res.data);
            if(res.data.statusCode === 200){
            console.log(res.data.body);
           alert("Export is approved")
          }
          else{
            alert("Export approval failed")
          }
        })
    
      }

    denyEntityData = (joiningRequestId, personId) => {
        this.showNotification("Denied Joining Request", "error")

    }

    denyPurchaseOrder = (purchaseOrderId) => {
        this.showNotification("Denied Purchase Order", "error")

    }
    denyExport = ( purchaseOrderId) => {

        alert("Denied Export")
    }
    denyLadingBill = (purchaseOrderId) => {

      alert("Denied LadingBill")
  }

    denyImport = (purchaseOrderId) => {

      alert("Denied Import")
  }



    showNotification(message, type) {
        this.setState({
            message: message,
            notificationType: type,
            notificationOpen: true,
        })
        setTimeout(function () {
            this.setState({
                notificationOpen: false,
            })
        }.bind(this), 7000);
    }


    render() {
        return (
            <>
                <NotificationMessage notificationOpen={this.state.notificationOpen}
                                     message={this.state.message} type={this.state.notificationType}/>

                <Header title={"Entity Admin Panel"}/>
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
                      <h1 className="mb-0">Approve Purchase Order Table</h1>
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

          <Row>



            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h1 className="mb-0">View Inventory Table</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <InventoryTable inventoryTable={this.state.inventoryTable} />

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
                      <h1 className="mb-0">Approve Export</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApproveExport purchaseOrderIds={this.state.purchaseOrderIds} approveExport={this.approveExport} denyExport={this.denyExport} />

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
                      <h1 className="mb-0">Approve LadingBill</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApproveLadingBill purchaseOrderIds={this.state.purchaseOrderIds} approveLadingBill={this.approveLadingBill} denyLadingBill={this.denyLadingBill} />

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
                      <h1 className="mb-0">Approve Import</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApproveImport purchaseOrderIds={this.state.purchaseOrderIds} approveImport={this.approveImport} denyImport={this.denyImport} />

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