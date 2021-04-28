import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class CreateExportPickupModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "EXPORT_PICKUP",
        PersonId: this.props.qldbPersonId,
        PickUpRequestId: '',
        PickUpRequestIdFinal: '',
        FreightCarrierId: '',
        ExportAirportId: '',
        ImportAirportId: '',
        notificationOpen: false,
        notificationType: "success",
        message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  handleOnChangeSelect = event => {
    this.setState({ [event.target.name] : event.target.value });

    const selectedEntity = this.props.entity.filter(entity => entity.id === event.target.value)

    this.setState({ PickUpRequestId : selectedEntity[0].PickUpRequests });
  }

  handleOnChangePickup = event => {
    this.setState({ PickUpRequestIdFinal : event.target.value });
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

    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "EXPORT_PICKUP",
    PersonId: this.props.qldbPersonId,
    PickUpRequestId: this.state.PickUpRequestIdFinal,
    FreightCarrierId: this.state.FreightCarrierId,
    ExportAirportId: this.state.ExportAirportId,
    ImportAirportId: this.state.ImportAirportId
    
}
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        console.log("Export Pickup",res.data.body);
        if(res.data.statusCode === 200){
        this.showNotification("Initiated Export Pickup", "success")
        }
        else{
            this.showNotification("Error: "+res.data.body, "error")
        }

      })
      
  }
    render(){
        const{PersonId,PickUpRequestId, FreightCarrierId, ExportAirportId, ImportAirportId} = this.state
        const formNotCompleted = FreightCarrierId.length===0||ExportAirportId.length===0||ImportAirportId.length===0

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Export PickUp</h2>
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
              htmlFor="PickUpRequestId_id"
            >
              PickUp Request Id
            </label>
            <Input
              id="PickUpRequestId_id"
              type="select"
              name="PickUpRequestId"
              
              onChange={this.handleOnChangePickup}              
            >
                {/*
               <option value="0">-Select-</option>
              {this.state.PickUpRequestId.map((result) => (<option value={result}>{result}</option>))}
                */}
                

              <option value="0">-Select-</option>
                {this.state.PickUpRequestId ? this.state.PickUpRequestId.map((result) => (<option value={result}>{result}</option>)) : null}
            


              </Input>
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="FreightCarrierId_id"
            >
              Freight Carrier
            </label>
            <Input
              id="FreightCarrierId_id"
              type="select"
              name="FreightCarrierId"
              
              onChange={this.handleOnChangeSelect}              
            >
               <option value="0">-Select-</option>
              {this.props.filterCarrierEntityData.map((result) => (<option value={result.id}>{result.text}</option>))}

              </Input>
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ExportAirportId_id"
            >
              Export Airport
            </label>
            <Input
              id="ExportAirportId_id"
              type="select"
              name="ExportAirportId"
              
              onChange={this.handleOnChange}              
            >
               <option value="0">-Select-</option>
              {this.props.filterCarrierEntityData.map((result) => (<option value={result.id}>{result.text}</option>))}

              </Input>
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ImportAirportId_id"
            >
              Import Airport
            </label>
            <Input
              id="ImportAirportId_id"
              type="select"
              name="ImportAirportId"
              
              onChange={this.handleOnChange}              
            >
               <option value="0">-Select-</option>
              {this.props.filterCarrierEntityData.map((result) => (<option value={result.id}>{result.text}</option>))}

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
                    Export Pickup
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

export default CreateExportPickupModal;