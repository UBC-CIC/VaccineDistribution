import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class ConnectUserModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        Operation: "REGISTER_NEW_USER_AND_SCENTITY",
        EmployeeId: '',
        FirstName: '',
        LastName: '',
        isSuperAdmin: false,
        isAdmin: false,
        Email: '',
        Phone: '',
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


      notificationOpen: false,
      notificationType: "success",
      message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmployeeIdChange = this.handleEmployeeIdChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);


    this.handleScEntityNameChange = this.handleScEntityNameChange.bind(this);
    this.handleScEntityContact_EmailChange = this.handleScEntityContact_EmailChange.bind(this);
    this.handleScEntityContact_AddressChange = this.handleScEntityContact_AddressChange.bind(this);
    this.handleScEntityContact_PhoneChange = this.handleScEntityContact_PhoneChange.bind(this);
    this.handleScEntityTypeCodeChange = this.handleScEntityTypeCodeChange.bind(this);
    this.handleScEntityIdentificationCodeChange = this.handleScEntityIdentificationCodeChange.bind(this);
    this.handleScEntityIdentificationCodeTypeChange = this.handleScEntityIdentificationCodeTypeChange.bind(this);


  }

  handleEmployeeIdChange = event => {
    this.setState({ EmployeeId: event.target.value });
  }


  handleFirstNameChange = event => {
    this.setState({ FirstName: event.target.value });
  }
  handleLastNameChange = event => {
    this.setState({ LastName: event.target.value });
  }
  handleEmailChange = event => {
    this.setState({ Email: event.target.value });
  }
  handlePhoneChange = event => {
    this.setState({ Phone: event.target.value });
  }
  handleAddressChange = event => {
    this.setState({ Address: event.target.value });
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
     //this.setState({Email: user.attributes.email});
     //console.log(user.attributes.email);
     console.log(user)   
     this.setState({Email: this.props.userEmail})
     this.setState({Phone: this.props.userPhone})
  }

  handleSubmit = event => {
    event.preventDefault()

    axios.post(process.env.REACT_APP_API_URL, {
          Operation: "REGISTER_NEW_USER_AND_SCENTITY",
          Person: {
            EmployeeId: this.state.EmployeeId,
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            isSuperAdmin: this.state.isSuperAdmin,

            PersonContact: {
              Email: this.props.userEmail,
              Phone: this.props.userPhone,
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
        this.setState({ qldbPersonId: res.data.body.PersonId });
        this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);
        if(res.data.statusCode===200){
          this.showNotification("User connected in Ledger", "success")
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
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    const{EmployeeId, FirstName, LastName, Email, Phone,Address,
      ScEntityName,ScEntityContact_Email,ScEntityContact_Address, ScEntityContact_Phone,
        ScEntityTypeCode,ScEntityIdentificationCode,ScEntityIdentificationCodeType} = this.state
    const formNotCompleted = EmployeeId.length===0||FirstName.length===0||LastName.length===0||Address.length===0||ScEntityName.length===0||ScEntityContact_Email.length===0||
        ScEntityContact_Address.length===0||ScEntityContact_Phone.length===0||ScEntityTypeCode.length===0||
        ScEntityIdentificationCode.length===0||ScEntityIdentificationCodeType.length===0
    return (
      <div className={showHideClassName}>
        <NotificationMessage notificationOpen={this.state.notificationOpen}
                             message={this.state.message} type={this.state.notificationType}/>

        <div className="modal-dialog modal-dialog-scrollable modal-lg" >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="exampleModalLabel">Register User and Entity</h2>
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
              htmlFor="EmployeeId_id"
            >
              Employee Id
            </label>
            <Input
              id="EmployeeId_id"
              type="text"
              name="EmployeeId"
              onChange={this.handleEmployeeIdChange}
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
              onChange={this.handleFirstNameChange}
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
              onChange={this.handleLastNameChange}
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
              value={this.props.userEmail}
              onChange={this.handleEmailChange}              
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
              value={this.props.userPhone}
              onChange={this.handlePhoneChange}              
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
              onChange={this.handleAddressChange}
            />
          </FormGroup>

              </Col>

              <Col>
              <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityName_id"
            >
              Entity Name
            </label>
            <Input
              id="ScEntityName_id"
              type="text"
              name="ScEntityName"
              onChange={this.handleScEntityNameChange}
            />
          </FormGroup>


          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityContact_Email_id"
            >
              Entity Email
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
              Entity Address
            </label>
            <Input
              id="ScEntityContact_Address_id"
              type="text"
              name="ScEntityContact_Address"
              onChange={this.handleScEntityContact_AddressChange}              
            />
          </FormGroup>

          
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityContact_Phone_id"
            >
              Entity Phone
            </label>
            <Input
              id="ScEntityContact_Phone_id"
              type="text"
              name="ScEntityContact_Phone"
              onChange={this.handleScEntityContact_PhoneChange}              
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityTypeCode_id"
            >
              Entity Type Code
            </label>
            <Input
              id="ScEntityTypeCode_id"
              type="select"
              name="ScEntityTypeCode"
              onChange={this.handleScEntityTypeCodeChange}              
            >
              <option value="1">Supply Chain Owner</option>
              <option value="2">Manufacturer</option>
              <option value="3">Airports</option>
              <option value="4">Seaports</option>
              <option value="5">Hospitals</option>

              </Input>
          </FormGroup>


          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityIdentificationCode_id"
            >
              Entity Identification Code
            </label>
            <Input
              id="ScEntityIdentificationCode_id"
              type="text"
              name="ScEntityIdentificationCode"
              onChange={this.handleScEntityIdentificationCodeChange}              
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ScEntityIdentificationCodeType_id"
            >
              Entity Identification Code Type
            </label>
            <Input
              id="ScEntityIdentificationCodeType_id"
              type="text"
              name="ScEntityIdentificationCodeType"
              onChange={this.handleScEntityIdentificationCodeTypeChange}              
            />
          </FormGroup>

              </Col>
            </Row>
          </Container>
          <div className="modal-footer">
            <Row>
            <Col className={'align-items-center'}>
              <Button
                  color="default"

                  onClick={this.props.handleClose}
                  size="xl"
              >
                Close
              </Button>
              <Button className="btn-fill" color="primary" type="submit" disabled={formNotCompleted}>
                Connect User
              </Button>
            </Col>
          </Row>
          </div>

      </Form>
        </div>
        </div>
      </div>
    )
  }
}

export default ConnectUserModal;