import React, {Component, useEffect, useState } from 'react'
import { listContainers, listLinkUsers } from '../../graphql/queries';
//import awsExports from "../../aws-exports";




// reactstrap components
import {
  Badge,
  Button,
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
  ListGroupItem,
  ListGroup,
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import Amplify, {Auth, API, container, graphqlOperation } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react';
import ContainerTable from "components/Tables/ContainerTable.js";
import { Link } from 'react-router-dom';
import ConnectUserModal from "components/Modal/ConnectUserModal";
import JoiningRequestEntityModal from "components/Modal/JoiningRequestEntityModal";
import RequestJoinEntityModal from "components/Modal/RequestJoinEntityModal";
import RegisterProductModal from "components/Modal/RegisterProductModal";
import CreateBatchModal from "components/Modal/CreateBatchModal";
import CreateManufacturerOrderModal from "components/Modal/CreateManufacturerOrderModal"; 
import InitiateShipmentManufacturerModal from "components/Modal/InitiateShipmentManufacturerModal"; 
import InitiateShipmentDistributorModal from "components/Modal/InitiateShipmentDistributorModal"; 

import axios from 'axios';

import { createLinkUser } from './../../graphql/mutations';
import { parse } from 'uuid';
//Amplify.configure(awsExports)


let user;
let jwtToken;
let sub;

class SupplyChainFlow extends Component {

    constructor(props){
        super(props);
        this.state = {
          showRegisterEntity: false,
          showRequestJoinEntity: false,
          showConnectUser: false,
          showRegisterProduct: false,
          showCreateBatch: false,
          showCreateManufacturerOrder: false,
          showInitiateShipmentManufacturer: false,
          showInitiateShipmentDistributor: false,

          userEmail: '',
          userPhone: '',
          userSub: '',
          qldbPersonId:'',
          ScEntityId:'',
          entity: [],
          filterEntityData: [],
          cognitoUserId: '',
          qldbPersonId: '',

          cognitoUserId: '',
      
       allMcgRequest:[],
       currentScEntity:{}
          
        };
        
        
        this.showRegisterEntityModal = this.showRegisterEntityModal.bind(this);
        this.showRequestJoinModal = this.showRequestJoinModal.bind(this);
        this.showConnectUserModal = this.showConnectUserModal.bind(this);
        this.showRegisterProductModal = this.showRegisterProductModal.bind(this);
        this.showCreateBatchModal = this.showCreateBatchModal.bind(this);
        this.showCreateManufacturerOrderModal = this.showCreateManufacturerOrderModal.bind(this);
        this.showInitiateShipmentManufacturerModal = this.showInitiateShipmentManufacturerModal.bind(this);
        this.showInitiateShipmentDistributorModal = this.showInitiateShipmentDistributorModal.bind(this);


        this.hideRegisterEntityModal = this.hideRegisterEntityModal.bind(this);
        this.hideRequestJoinModal = this.hideRequestJoinModal.bind(this);
        this.hideConnectUserModal = this.hideConnectUserModal.bind(this);
        this.hideRegisterProductModal = this.hideRegisterProductModal.bind(this);
        this.hideCreateBatchModal = this.hideCreateBatchModal.bind(this);
        this.hideCreateManufacturerOrderModal = this.hideCreateManufacturerOrderModal.bind(this);
        this.hideInitiateShipmentManufacturerModal = this.hideInitiateShipmentManufacturerModal.bind(this);
        this.hideInitiateShipmentDistributorModal = this.hideInitiateShipmentDistributorModal.bind(this);
       
      }


      async componentDidMount(){
        console.log("Loading Auth token")
        user = await Auth.currentAuthenticatedUser();
         jwtToken = user.signInUserSession.idToken.jwtToken; 
         this.setState({userEmail: user.attributes.email});
         this.setState({userPhone: user.attributes.phone_number});
         this.setState({userSub: user.attributes.sub});
         console.log(user.attributes.email);
         console.log(user)   
         console.log('user attributes: ', user.attributes);
         localStorage.setItem('cognitoUserId', this.state.userSub); 

         this.getEntityData();

         this.getCognitoUserId()
         this.getQldbPersonId()
        // this.getAllMCGRequest()
         this.getYourScEntityId()
        
         

      }

      //Display Modal form for user register in QLDB
  showRegisterEntityModal = () => {
    this.setState({ showRegisterEntity: true });
  };
  showRequestJoinModal = () => {
    this.setState({ showRequestJoinEntity: true });
  };
  showConnectUserModal = () => {
    this.setState({ showConnectUser: true });
  };
  showRegisterProductModal = () => {
    this.setState({ showRegisterProduct: true });
  };

  showCreateBatchModal = () => {
    this.setState({ showCreateBatch: true });
  };

  showCreateManufacturerOrderModal = () => {
    this.setState({ showCreateManufacturerOrder: true });
  };

  showInitiateShipmentManufacturerModal = () => {
    this.setState({ showInitiateShipmentManufacturer: true });
  };

  showInitiateShipmentDistributorModal = () => {
    this.setState({ showInitiateShipmentDistributor: true });
  };



  hideRegisterEntityModal = () => {
    this.setState({ showRegisterEntity: false });
  };
  hideRequestJoinModal = () => {
    this.setState({ showRequestJoinEntity: false });
  };

  hideConnectUserModal = () => {
    this.setState({ showConnectUser: false });
  };
  hideRegisterProductModal = () => {
    this.setState({ showRegisterProduct: false });
  };

  hideCreateBatchModal = () => {
    this.setState({ showCreateBatch: false });
  };

  hideCreateManufacturerOrderModal = () => {
    this.setState({ showCreateManufacturerOrder: false });
  };

  hideInitiateShipmentManufacturerModal = () => {
    this.setState({ showInitiateShipmentManufacturer: false });
  };
  hideInitiateShipmentDistributorModal = () => {
    this.setState({ showInitiateShipmentDistributor: false });
  };


//Get all the Entities from "GET_ALL_ENTITIES" operation
  async getEntityData() {
    
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_SCENTITIES"} ,
    {
      headers: {
        //'Authorization': jwtToken
      }})
    .then(res => {
        console.log(res.data);
        console.log(res.data.body);
        this.setState({entity:res.data.body});
/*
        const entityData = this.state.entity.map( function(entity) {
          if( entity.isApprovedBySuperAdmin === true ){
              var info = { "text": entity.ScEntityName,
                           "id": entity.ScEntityIdentificationCode
                          }
              return info;
                        }           
          
         })
         */
         const entityData = this.state.entity.filter( entity => entity.isApprovedBySuperAdmin === true).map(entity => 
         {
              var info = { "text": entity.ScEntityName,
                           "id": entity.ScEntityIdentificationCode
                          }
              return info;
                        }         
          
         )
         console.log("EntityData", entityData)
         this.setState({filterEntityData: entityData})
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
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
        localStorage.setItem('qldbPersonId', this. state.qldbPersonId);
      } catch (err) {
        console.log('error fetching LinkUser...', err)
      }
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
        this.setState({ScEntityId:this.state.currentScEntity[0].id});
        localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);
      //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
    })
  
  
    //this.setState({entity: response.data})
  }

  
LinkCognito_QLDBUser = (qldbPersonId) => {

  this.setState({qldbPersonId: qldbPersonId});

  let linkUser = {
    cognitoUserId: this.state.userSub,
    qldbPersonId: qldbPersonId 
  }
  console.log(linkUser)
  
  try {
     API.graphql(graphqlOperation(createLinkUser, {input: linkUser}));
    console.log('Created Link User!')
    alert('Created Link User!')
  }
  catch(err){
      console.log("Error creating Link User", err);
  }

  this.hideConnectUserModal();

}

async createUserLink(){
  
}


  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        <ListGroup data-toggle="checklist" flush>
        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 1. Register User and Entity</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showConnectUserModal}> Register User and Entity </Button>


<ConnectUserModal show={this.state.showConnectUser} handleClose={this.hideConnectUserModal} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser} >
          <p>Register User and Entity Modal</p>
        </ConnectUserModal>
                

                
                
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>

          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 2. Joining Request to Entity</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showRegisterEntityModal}> Joining Request  </Button>

                <JoiningRequestEntityModal show={this.state.showRegisterEntity} handleClose={this.hideRegisterEntityModal} entity={this.state.entity} filterEntityData={this.state.filterEntityData} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser}>
          
               </JoiningRequestEntityModal>
                
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>

          {/*
          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-warning">
              <div className="checklist-info">
              
                <h5 className="checklist-title mb-0">Step 3. Request to join the entity</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showRequestJoinModal}> Request join </Button>
                <RequestJoinEntityModal show={this.state.showRequestJoinEntity} handleClose={this.hideRequestJoinModal}>
          
        </RequestJoinEntityModal>
        
                <small>10:30 AM</small>
              </div>
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-warning">
                  <input
                    className="custom-control-input"
                    id="chk-todo-task-2"
                    defaultChecked
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-2"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>
          */}




          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 3. Register a Product</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showRegisterProductModal}> Register Product </Button>


          <RegisterProductModal show={this.state.showRegisterProduct} handleClose={this.hideRegisterProductModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.ScEntityId} >
          <p>Register Product Modal</p>
        </ RegisterProductModal>
                
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>


          

          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 4. Create a Product Batch</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showCreateBatchModal}> Create Batch </Button>


          <CreateBatchModal show={this.state.showCreateBatch} handleClose={this.hideCreateBatchModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Create Batch Modal</p>
        </ CreateBatchModal>
                

                
                
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>




          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 5. Create Manufacturer Order Modal</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showCreateManufacturerOrderModal}> Create Manufacturer Order </Button>


          <CreateManufacturerOrderModal show={this.state.showCreateManufacturerOrder} handleClose={this.hideCreateManufacturerOrderModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Create Manufacturer Order Modal</p>
        </ CreateManufacturerOrderModal>
        
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>




          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 6. Initiate Shipment for Manufacturer</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showInitiateShipmentManufacturerModal}> Initiate Shipment Manufacturer </Button>


          <InitiateShipmentManufacturerModal show={this.state.showInitiateShipmentManufacturer} handleClose={this.hideInitiateShipmentManufacturerModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Initiate Shipment Manufacturer Modal</p>
        </ InitiateShipmentManufacturerModal>
        
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>


          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 7. Initiate Shipment for Distributor</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showInitiateShipmentDistributorModal}> Initiate Shipment Distributor </Button>


          <InitiateShipmentDistributorModal show={this.state.showInitiateShipmentDistributor} handleClose={this.hideInitiateShipmentDistributorModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Initiate Shipment Distributor Modal</p>
        </ InitiateShipmentDistributorModal>
        
               
                <small>10:30 AM</small>
              </div>
              
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-1"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-1"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>

          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-info">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">
                Step 8. Request the vaccine container
                </h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showRequestVaccineContainerModal}> Request Container </Button>
                <small>10:30 AM</small>
              </div>
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-info">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-3"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-3"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-danger">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">Step 9. Accept the request</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showAcceptRequestModal}> Accept Request </Button>
                <small>10:30 AM</small>
              </div>
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-danger">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-4"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-4"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">Step 10. Receive the Vaccine order</h5>
                <Button className="float-right"
                        color="default"
                       onClick={this.showReceiveVaccineOrderModal}> Receive Vaccine Order </Button>
                <small>10:30 AM</small>
              </div>
              <div>
                <div className="custom-control custom-checkbox custom-checkbox-success">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="chk-todo-task-5"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="chk-todo-task-5"
                  />
                </div>
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>

        </Container>
      </>
    );
  }
}

export default withAuthenticator(SupplyChainFlow) ;