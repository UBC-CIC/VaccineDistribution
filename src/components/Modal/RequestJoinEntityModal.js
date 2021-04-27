import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class RegisterEntityModal extends React.Component {

    constructor(props) {
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
        ScEntityIdentificationCodeType: '',
        notificationOpen: false,
        notificationType: "success",
        message: ""
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

  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleSubmit = event => {
    event.preventDefault();
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
          if(res.data.statusCode===200){
              this.showNotification("User created in Ledger", "success")
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
      const {ScEntityContact_Email,ScEntityContact_Address} = this.state
      const formNotCompleted = ScEntityContact_Email.length===0||ScEntityContact_Address.length===0
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Request to Join Supply Chain Entity</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
              <FormGroup>
                  <Row>
                      <Col>
            <label
              className="form-control-label"
            >
             Send Request Join ScEntity
            </label>
                      </Col>
                  </Row>
                  <Row>
                      <Col>

                  <label className="custom-toggle">
          <input  defaultChecked type="checkbox" />
          <span
            className="custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          />
        </label>
                      </Col>
                  </Row>

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
                    Request Join Entity
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

export default RegisterEntityModal;