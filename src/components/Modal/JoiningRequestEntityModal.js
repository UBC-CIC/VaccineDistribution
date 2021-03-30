import React from "react";
import "./modal.css";
import PropTypes from "prop-types";
 // react plugin used to create DropdownMenu for selecting items
 import Select2 from "react-select2-wrapper";

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 




let user;
let jwtToken;

class JoiningRequestEntityModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      Operation: "REGISTER_NEW_USER_AND_SCENTITY",
      EmployeeId: '',
      FirstName: '',
      LastName: '',
      isSuperAdmin: false,
      isAdmin: false,
      Email: '',//this.props.userEmail,
      Phone: '',//this.props.userPhone,
      Address: '',

      ScEntityName: '',
      ScEntityContact_Email: '',
      ScEntityContact_Address:'',
      ScEntityContact_Phone: '',

      isApprovedBySuperAdmin: true,
      ScEntityTypeCode: "2",
      PersonIds:[],
      JoiningRequests:[],
      PickUpRequests:[],
      ScEntityIdentificationCode: '',
      ScEntityIdentificationCodeType: '',
      qldbPersonId: '',
      entity: [{text:"Moderna", id:1}]
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
    Person:{
      EmployeeId: this.state.EmployeeId,
      FirstName: this.state.FirstName,
      LastName: this.state.LastName,
      isSuperAdmin: this.state.isSuperAdmin,

      PersonContact:{
        Email: this.state.Email,
        Phone: this.state.Phone,
        Address: this.state.Address
      }

    },
    ScEntity:{
      ScEntityName: this.state.ScEntityName,
      ScEntityContact:{
        Email: this.state.ScEntityContact_Email,
        Address: this.state.ScEntityContact_Address,
        Phone: this.state.ScEntityContact_Phone
      },
      isApprovedBySuperAdmin: this.state.isApprovedBySuperAdmin,
      ScEntityTypeCode: this.state.ScEntityTypeCode,
      PersonIds: this.state.PersonIds,
      JoiningRequests: this.state.JoiningRequests,
      PickUpRequests: this.state.PickUpRequests,
      ScEntityIdentificationCode: this.state.ScEntityIdentificationCode,
      ScEntityIdentificationCodeType: this.state.ScEntityIdentificationCodeType
    }
  }
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("User Created in ledger")
        console.log("QLDBUser ID",res.data.body.PersonId);
        this.setState({ qldbPersonId: res.data.body.PersonId });
        this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
  }
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    const entityData = this.props.entity;

    return (
      <div className={showHideClassName}>
      <section className="modal-main">
      <Form onSubmit={this.handleSubmit}>
        <Container>
          <Row>
            <Col>
            <h2>Joining Request to Entity</h2>
            <FormGroup>

            <label
            className="form-control-label"
            htmlFor="ScEntitySelect_id"
          > Select the Entity </label>

            <Select2
             className="form-control"
             defaultValue=""
             options={{
               placeholder: ""
             }}
             data={this.state.entity}
           />

</FormGroup>
   <FormGroup>
          <label
            className="form-control-label"
            htmlFor="EmployeeId_id"
          >
            Employee Id
          </label>
          <Input
            id="EmployeeId_id"
            type="text"
            name="EmployeeId"
            value={this.state.EmployeeId}
            onChange={this.handleOnChange}              
          />
        </FormGroup>
        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="FirstName_id"
          >
            First Name
          </label>
          <Input
            id="FirstName_id"
            type="text"
            name="FirstName"
            value={this.state.FirstName}
            onChange={this.handleOnChange}                
          />
        </FormGroup>
        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="LastName_id"
          >
            Last Name
          </label>
          <Input
            id="LastName_id"
            type="text"
            name="LastName"
            value={this.state.LastName}
            onChange={this.handleOnChange}               
          />
        </FormGroup>
        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="Email_id"
          >
            Email
          </label>
          <Input
            id="Email_id"
            type="text"
            name="Email"
            //value={this.props.userEmail}
            value={this.state.Email}
            onChange={this.handleOnChange}               
          />
        </FormGroup>
        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="Phone_id"
          >
            Phone
          </label>
          <Input
            id="Phone_id"
            type="text"
            name="Phone"
            //value={this.props.userPhone}
            value={this.state.Phone}
            onChange={this.handleOnChange}               
          />
        </FormGroup>

        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="Address_id"
          >
            Address
          </label>
          <Input
            id="Address_id"
            type="text"
            name="Address"
            value={this.state.Address}
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
                    Joining Request
                  </Button>
                  
        </Form>
          
        </section>
      </div>
    );
  }
}

export default JoiningRequestEntityModal;