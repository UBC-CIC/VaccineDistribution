import React from "react";
import "./modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class InitiateShipmentManufacturerModal extends React.Component {

    constructor(props) {
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
    PersonId: this.props.qldbPersonId,

    
    PurchaseOrderId: this.state.PurchaseOrderId,
    TransportType: parseInt(this. state.TransportType),
    CarrierCompanyId: this.props.manufacturerId
    
}
     )
      .then(res => {
          if(res.data.statusCode===200){
              this.showNotification("Initiated shipment for manufacturer", "success")
          }else{
              this.showNotification("Error: "+ res.data.body,"error")
          }

      })
        .catch((error) => {
            this.showNotification("Error: "+JSON.stringify(error.message),"error")
        })
  }
    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type,
            notificationOpen:true,
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:false,
            })
        }.bind(this),7000);
    }

    render(){
        const{PersonId,PurchaseOrderId,TransportType,CarrierCompanyId} = this.state
        const formNotCompleted = PersonId.length===0 || PurchaseOrderId.length===0
        ||CarrierCompanyId.length===0

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Initiate Shipment for Manufacturer</h2>
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
              type="select"
              name="TransportType"
              onChange={this.handleOnChange}              
            >
              <option value="1">Air</option>
              <option value="2">Ocean</option>
              <option value="3">ByRoad</option>
             
              </Input>
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
                    Initiate Shipment to Manufacturer
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