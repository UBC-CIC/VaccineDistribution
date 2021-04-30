import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class CreateLocalTransportModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "EXPORT_PICKUP",
        PersonId: this.props.qldbPersonId,
        PickUpRequestId: [],
        PickUpRequestIdFinal:'',

        notificationOpen: false,
        notificationType: "success",
        message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
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


    static getDerivedStateFromProps(props, state) {
        return {PickUpRequestId: props.pickUpRequestIds };
      }


    //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
 async componentDidMount(){

    const selectedEntity = this.props.entity.filter(entity => entity.PersonIds[0] === this.props.qldbPersonId)
    if(selectedEntity.length > 0)
    {

    this.setState({ PickUpRequestId : selectedEntity[0].PickUpRequests });
  }
     
  }

  handleSubmit = event => {
    event.preventDefault();

    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "LOCAL_EXPORT",
            PersonId: this.props.qldbPersonId,
            PickUpRequestId: this.state.PickUpRequestIdFinal

        }
    )
      .then(res => {

        console.log(res);
        console.log(res.data);
        console.log("Local Export",res.data.body);
        if(res.data.statusCode === 200){
        this.showNotification("Initiated Export Pickup", "success")
        }
        else{
            this.showNotification("Error: "+res.data.body, "error")
        }

      })
      
  }
    render(){
        const{PickUpRequestId} = this.state
        const formNotCompleted = false

        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Create Local Transport</h2>
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
                    Create Local Transport
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

export default CreateLocalTransportModal;