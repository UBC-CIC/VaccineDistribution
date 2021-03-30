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

class RegisterEntityModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "REGISTER_NEW_USER_AND_SCENTITY",
        
        ScEntityName: '',
        ScEntityContact_Email: '',
        ScEntityContact_Address:'',
        ScEntityContact_Phone: '',

        isApprovedBySuperAdmin: true,
        ScEntityTypeCode: "2",
        PersonIds:[],
        JoiningRequests:[],
        ScEntityIdentificationCode: '',
        ScEntityIdentificationCodeType: ''
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  


    this.handleScEntityNameChange = this.handleScEntityNameChange.bind(this);
    this.handleScEntityContact_EmailChange = this.handleScEntityContact_EmailChange.bind(this);
    this.handleScEntityContact_AddressChange = this.handleScEntityContact_AddressChange.bind(this);
    this.handleScEntityContact_PhoneChange = this.handleScEntityContact_PhoneChange.bind(this);
    this.handleScEntityTypeCodeChange = this.handleScEntityTypeCodeChange.bind(this);
    this.handleScEntityIdentificationCodeChange = this.handleScEntityIdentificationCodeChange.bind(this);
    this.handleScEntityIdentificationCodeTypeChange = this.handleScEntityIdentificationCodeTypeChange.bind(this);


  }





  handleScEntityNameChange = event => {
    this.setState({ ScEntityName: event.target.value });
  }
  handleScEntityContact_EmailChange = event => {
    this.setState({ ScEntityContact_Email: event.target.value });
  }
  handleScEntityContact_AddressChange = event => {
    this.setState({ ScEntityContact_Address: event.target.value });
  }
  handleScEntityContact_PhoneChange = event => {
    this.setState({ ScEntityContact_Phone: event.target.value });
  }
  handleScEntityTypeCodeChange = event => {
    this.setState({ ScEntityTypeCode: event.target.value });
  }
  handleScEntityIdentificationCodeChange = event => {
    this.setState({ ScEntityIdentificationCode: event.target.value });
  }
  handleScEntityIdentificationCodeTypeChange = event => {
    this.setState({ ScEntityIdentificationCodeType: event.target.value });
  }
 




  

  //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
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
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "REGISTER_NEW_USER_AND_SCENTITY",
    ScEntity:{
      ScEntityName: this.state.ScEntityName,
      ScEntityContact:{
        ScEntityContact_Email: this.state.ScEntityContact_Email,
        ScEntityContact_Address: this.state.ScEntityContact_Address,
        ScEntityContact_Phone: this.state.ScEntityContact_Phone
      },
      isApprovedBySuperAdmin: this.state.isApprovedBySuperAdmin,
      ScEntityTypeCode: this.state.ScEntityTypeCode,
      PersonIds: this.state.PersonIds,
      JoiningRequests: this.state.JoiningRequests,
      ScEntityIdentificationCode: this.state.ScEntityIdentificationCode,
      ScEntityIdentificationCodeType: this.state.ScEntityIdentificationCodeType
    }
  }
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("User Created in ledger");
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
              <h2>Request to Join Supply Chain Entity</h2>
              <FormGroup>
              
            <label
              className="form-control-label"
            >
             Send Request Join ScEntity
            </label>

            <label className="custom-toggle">
          <input  defaultChecked type="checkbox" />
          <span
            className="custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          />
        </label>
            
          </FormGroup>

          
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityContact_Email_id"
            >
              ScEntity Email
            </label>
            <Input
              id="ScEntityContact_Email_id"
              type="text"
              name="ScEntityContact_Email"
              onChange={this.handleScEntityContact_EmailChange}              
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityContact_Address_id"
            >
              ScEntity Address
            </label>
            <Input
              id="ScEntityContact_Address_id"
              type="text"
              name="ScEntityContact_Address"
              onChange={this.handleScEntityContact_AddressChange}              
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
                    Request Join Entity
                  </Button>
                  
        </Form>
          
        </section>
      </div>
    );
  }
}

export default RegisterEntityModal;