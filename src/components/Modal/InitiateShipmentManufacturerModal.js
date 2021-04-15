import React from "react";
import "./modal.css";
import PropTypes from "prop-types";

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";



let user;
let jwtToken;

class InitiateShipmentManufacturerModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "INITIATE_SHIPMENT_FOR_MANUFACTURER",
        PersonId: this.props.qldbPersonId,
        PurchaseOrderId: '',
        TransportType: 1,
        CarrierCompanyId: '',
        notificationOpen: false,
        notificationType: "success",
        message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }


    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:true,
            })
        }.bind(this),5000);
    }





    //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken; 
     //this.setState({Email: user.attributes.email});
     //console.log(user.attributes.email);
     console.log(user)   
  }

  handleSubmit = event => {
    event.preventDefault();

    /*
    const company = {
    Operation: "POST",
    Comp_ID: this.state.Comp_ID,
    companyType: this.state.companyType,
    companyName: this.state.companyName,
    companyIC: this .state.companyIC,
    isCompanyRegistered: false
    };
    */

    /*
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    */
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "INITIATE_SHIPMENT_FOR_MANUFACTURER",
    PersonId: this.state.PersonId,

    
    PurchaseOrderId: this.state.PurchaseOrderId,
    TransportType: this. state.TransportType,
    CarrierCompanyId: this.state.CarrierCompanyId
    
}
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        console.log("MCGRequestId",res.data.body.McgRequestId);
        this.showNotification("Initiated shipment for manufacturer", "success")
        //this.setState({ qldbPersonId: res.data.body.PersonId });
        //this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
      this.showNotification("Error! Cannot initiate shipment for manufacturer", "error")
  }
    render(){
        const{PersonId,PurchaseOrderId,TransportType,CarrierCompanyId} = this.state
        const formNotCompleted = PersonId.length===0||PurchaseOrderId.length===0||
            TransportType.length===0||CarrierCompanyId.length===0

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">INITIATE SHIPMENT FOR MANUFACTURER</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
              <FormGroup>
            <label
              className="form-control-label"
              htmlFor="PersonId_id"
            >
              Person Id
            </label>
            <Input
              id="PersonId_id"
              type="text"
              name="PersonId"
              value={this.state.PersonId}
              onChange={this.handleOnChange}              
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="PurchaseOrderId_id"
            >
              Purchase Order Id
            </label>
            <Input
              id="PurchaseOrderId_id"
              type="text"
              name="PurchaseOrderId"
              value={this.state.PurchaseOrderId}
              onChange={this.handleOnChange}              
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="TransportType_id"
            >
              Transport Type
            </label>
            <Input
              id="TransportType_id"
              type="text"
              name="TransportType"
              value={this.state.TransportType}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="CarrierCompanyId_id"
            >
              Carrier CompanyId
            </label>
            <Input
              id="CarrierCompanyId_id"
              type="text"
              name="CarrierCompanyId"
              value={this.state.CarrierCompanyId}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

              </Col>          
            </Row>
          </Container>
            <div className={"modal-footer"}>
                <Row>
                    <Col className={"align-items-center"}>

                    <Button
                      className="float-right"
                      color="default"
                      
                      onClick={this.props.handleClose}
                      size="xl"
                    >
                      Close
                    </Button>
                    </Col>
                    <Col>

                    <Button className="btn-fill" color="primary" type="submit" disabled={formNotCompleted}>
                    Initiate Shipment Manufacturer
                  </Button>
                    </Col>

                </Row>
            </div>

        </Form>
          
        </div>
          </div>
      </div>
    );
  }
}

export default InitiateShipmentManufacturerModal;