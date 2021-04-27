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
import Header from "components/Headers/Header.js";
import CreateIndexesAndAdmin from "components/AdminPanel/CreateIndexesAndAdmin.js";
import JoinRequest_Entity from "components/AdminPanel/JoinRequest_Entity";
import ApprovalProductTable from "components/AdminPanel/ApprovalProductTable.js";
import ApprovalEntityTable from "components/AdminPanel/ApprovalEntityTable.js";
import axios from 'axios';
import NotificationMessage from "../components/Notification/NotificationMessage";


//Amplify.configure(awsExports)

let user;
let jwtToken;
const URL = 'https://jsonplaceholder.typicode.com/users'

class AdminPanel extends Component {

  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = { //state is by default an object
        employees: [{id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com'},
            {id: 2, name: 'Ali', age: 19, email: 'ali@email.com'},
            {id: 3, name: 'Saad', age: 16, email: 'saad@email.com'},
            {id: 4, name: 'Asad', age: 25, email: 'asad@email.com'}],
        entity: [],
        products: [],
        cognitoUserId: '',
        qldbPersonId: '',
        allMcgRequest: [],
        currentScEntity: {},
        notificationOpen: false,
        notificationType: "success",
        message: "",

    }
 }
  async componentDidMount(){
    console.log('componentDidMount runs')
      await this.getEmployeeData();
      await this.getEntityData();
      await this.getCognitoUserId()
      await this.getQldbPersonId()
      await this.getAllMCGRequest()
    await this.getYourScEntityId()


    this.getProductData();
}

  async getEmployeeData() {
    const response = await axios.get(URL)
    this.setState({employees: response.data})
}

async getEntityData() {
  const response = await axios.get(URL)
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_SCENTITIES"} ,
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


  //this.setState({entity: response.data})
}

async getProductData() {
  const response = await axios.get(URL)
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_PRODUCTS"} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      console.log(res.data.body);
      this.setState({products:res.data.body});
    
  })

}

async getCognitoUserId() {
  console.log("Loading Auth token")
  user = await Auth.currentAuthenticatedUser();
   jwtToken = user.signInUserSession.idToken.jwtToken; 
   //this.setState({Email: user.attributes.email});
   //console.log(user.attributes.email);
   this.setState({cognitoUserId: user.attributes.sub})

   console.log(this.state.cognitoUserId) 
   localStorage.setItem('cognitoUserId', this. state.cognitoUserId); 
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
      localStorage.setItem('qldbPersonId', this.state.qldbPersonId);
    } catch (err) {
      console.log('error fetching LinkUser...', err)
    }
}

async getAllMCGRequest(){

  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_MCG_REQUESTS",

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
        this.setState({allMcgRequest:res.data.body});
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
    })
  console.log("AllMCGRequest", this.state.allMcgRequest)


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
      if(this.state.currentScEntity[0]){
          localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);
      }
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

removeEntityData = (ScEntityIdentificationCode, personId) => {
console.log(personId)
  axios.delete(`${URL}/${ScEntityIdentificationCode}`).then(res => {
      const del = this.state.entity.filter(entity => ScEntityIdentificationCode !== entity.ScEntityIdentificationCode)
      this.setState({entity:del})
  })

  

}

removeProductData = (productId) => {
  console.log(productId)
    axios.delete(`${URL}/${productId}`).then(res => {
        const del = this.state.products.filter(product => productId !== product.productId)
        this.setState({products:del})
    })
  
  }

approveEntityData = (ScEntityIdentificationCode, personId) => {

  console.log("personId", personId)


const mcgRequest = this.state.allMcgRequest.filter(requests => requests.SenderPersonId === personId)
console.log("McgRequest filter", mcgRequest)
console.log("McgRequestId filter", mcgRequest[0].RequestId)
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "ACCEPT_MCG_REQUEST",

PersonId: localStorage.getItem("qldbPersonId"),
RequestId: mcgRequest[0].RequestId
} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      if(res.data.statusCode === 200) {
          console.log(res.data.body);
          this.showNotification("Entity is approved", "success")


          const del = this.state.entity.filter(entity => ScEntityIdentificationCode !== entity.ScEntityIdentificationCode)
          this.setState({entity: del})
      }
    else{
          this.showNotification("Approval failed", "error")
    }

    //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
  })



}

approveProductData = (productId) => {

  console.log("productId", productId)

  
const mcgRequest = this.state.allMcgRequest.filter(requests => requests.DocumentId === productId)
console.log("McgRequest filter", mcgRequest)
console.log("McgRequestId filter", mcgRequest[0].RequestId)
  axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "ACCEPT_MCG_REQUEST",

PersonId: localStorage.getItem("qldbPersonId"),
RequestId: mcgRequest[0].RequestId
} ,
  {
    headers: {
      //'Authorization': jwtToken
    }})
  .then(res => {
      console.log(res);
      console.log(res.data);
      if (res.data.statusCode === 200) {
          console.log(res.data.body);
          const del = this.state.products.filter(product => productId !== product.ProductId)
          this.setState({products: del})
          this.showNotification("Product is approved", "success")

      }
  })
      .catch(err => {
          this.showNotification(err.message, "error")
          console.log(err)
      });

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
                <Header title={"Admin Panel"}/>
                <NotificationMessage notificationOpen={this.state.notificationOpen}
                                     message={this.state.message} type={this.state.notificationType}/>

                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>

                        <Col className="order-xl-1" xl="12">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                      <h1 className="mb-0">Approve MCG-Request</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <JoinRequest_Entity/>
                <ApprovalEntityTable entity={this.state.entity} removeEntityData={this.removeEntityData} approveEntityData={this.approveEntityData}/>
          </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
          <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h1 className="mb-0">Approve Product Request</h1>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                <ApprovalProductTable employees={this.state.employees} products={this.state.products} removeProductData={this.removeProductData} approveProductData={this.approveProductData}/>
          </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h1 className="mb-0">Create Table Indexes and MCG Admin</h1>
                    </Col>
                    <Col className="text-right" xs="4">
                      
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                <CreateIndexesAndAdmin cognitoUserId = {this.state.cognitoUserId}/>
          </CardBody>
              </Card>
            </Col>
          </Row>


        </Container>
       
          
      </>
    );
  }
}

export default (AdminPanel) ;