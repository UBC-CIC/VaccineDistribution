import React from "react";
import "./modal.css";
import PropTypes from "prop-types";
 // react plugin used to create DropdownMenu for selecting items

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";



import Select from 'react-select';

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
      entity: [{value:"Moderna", label:"Moderna"}]
    };
    //todo Entity????

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
     console.log(this.state.entity)

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

    onSelect=selectedOption =>{
      console.log(selectedOption);
      this.setState({ScEntityName:selectedOption})

  }
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    const {ScEntityName,EmployeeId, FirstName,LastName,Email,Phone,Address} = this.state;
      const formNotCompleted = EmployeeId.length===0||FirstName.length===0||LastName.length===0||Email.length===0||
          Phone.length===0||Address.length===0||ScEntityName.length===0
    const{entity}=this.props
    return (
      <div className={showHideClassName}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Joining Request to Entity</h2>
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
            htmlFor="ScEntitySelect_id"
          > Select the Entity </label>

            <Select
             options={this.state.entity}
             onChange={this.onSelect}
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
                     Joining Request
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

export default JoiningRequestEntityModal;