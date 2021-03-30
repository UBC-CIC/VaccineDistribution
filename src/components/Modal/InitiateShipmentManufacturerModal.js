import React from "react";
import "./modal.css";
import PropTypes from "prop-types";

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 



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
        CarrierCompanyId: ''
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
    PersonId: this.state.PersonId,

    
    PurchaseOrderId: this.state.PurchaseOrderId,
    TransportType: this. state.TransportType,
    CarrierCompanyId: this.state.CarrierCompanyId
    
}
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("INITIATE SHIPMENT FOR MANUFACTURER successful")
        console.log("MCGRequestId",res.data.body.McgRequestId);
        alert("MCGRequestId",res.data.body.McgRequestId);
        //this.setState({ qldbPersonId: res.data.body.PersonId });
        //this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
  }
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
        <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
              <h2>INITIATE SHIPMENT FOR MANUFACTURER</h2>
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
        
          
          {/*
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-search-input"
            >
              Search
            </label>
            <Input
              defaultValue="Tell me your secret ..."
              id="example-search-input"
              type="search"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-email-input"
            >
              Email
            </label>
            <Input
              defaultValue="argon@example.com"
              id="example-email-input"
              type="email"
            />
          </FormGroup>
          <FormGroup>
            <label className="form-control-label" htmlFor="example-url-input">
              URL
            </label>
            <Input
              defaultValue="https://www.creative-tim.com"
              id="example-url-input"
              type="url"
            />
          </FormGroup>
          <FormGroup>
            <label className="form-control-label" htmlFor="example-tel-input">
              Phone
            </label>
            <Input
              defaultValue="40-(770)-888-444"
              id="example-tel-input"
              type="tel"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-password-input"
            >
              Password
            </label>
            <Input
              defaultValue="password"
              id="example-password-input"
              type="password"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-number-input"
            >
              Number
            </label>
            <Input
              defaultValue="23"
              id="example-number-input"
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-datetime-local-input"
            >
              Datetime
            </label>
            <Input
              defaultValue="2018-11-23T10:30:00"
              id="example-datetime-local-input"
              type="datetime-local"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-date-input"
            >
              Date
            </label>
            <Input
              defaultValue="2018-11-23"
              id="example-date-input"
              type="date"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-month-input"
            >
              Month
            </label>
            <Input
              defaultValue="2018-11"
              id="example-month-input"
              type="month"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-week-input"
            >
              Week
            </label>
            <Input
              defaultValue="2018-W23"
              id="example-week-input"
              type="week"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-time-input"
            >
              Time
            </label>
            <Input
              defaultValue="10:30:00"
              id="example-time-input"
              type="time"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-color-input"
            >
              Color
            </label>
            <Input
              defaultValue="#5e72e4"
              id="example-color-input"
              type="color"
            />
          </FormGroup>
          */}
          <Button
                      className="float-right"
                      color="default"
                      
                      onClick={this.props.handleClose}
                      size="xl"
                    >
                      Close
                    </Button>
                    <br></br>
                    <Button className="btn-fill" color="primary" type="submit">
                    Initiate Shipment Manufacturer
                  </Button>
                  
        </Form>
          
        </section>
      </div>
    );
  }
}

export default InitiateShipmentManufacturerModal;