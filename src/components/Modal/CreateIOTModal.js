import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class CreateIOTModal extends React.Component {

    constructor(props) {
        super(props);
    this.state = {
        PersonId: this.props.qldbPersonId,
        IOTName: '',
        IOTType: 1,
        CarrierCompanyId: '',

        notificationOpen: false,
        notificationType: "success",
        message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
    console.log(event.target.name, event.target.value)
  }

  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken; 
     //this.setState({Email: user.attributes.email});
     //console.log(user.attributes.email);
     console.log(user)   
  }

  handleSubmit = event => {
      console.log(this.state)
    event.preventDefault();
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`,
        { Operation: "CREATE_IOT",
    PersonId: this.props.qldbPersonId,
        IoT:{
            IoTNumber:"",
            IoTType:parseInt(this.state.IOTType),
            IoTName: "",
            ContainerId:""
        }
    }
     )
      .then(res => {
          console.log(res)
          if(res.data.statusCode===200){
              this.showNotification("IOT device registered", "success")
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
      const formNotCompleted = this.state.IOTType.length===0

      const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Create IOT in Ledger</h2>
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
              htmlFor="IOTType_id"
            >
              IOT Type
            </label>
            <Input
              id="IOTType_id"
              type="select"
              name="IOTType"
              onChange={this.handleOnChange}              
            >
              <option value="1">Temperature</option>
              <option value="2">Humidity</option>
              <option value="3">Location</option>
             
              </Input>
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
                    Create IOT Device
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

export default CreateIOTModal;