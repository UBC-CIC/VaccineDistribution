import React from "react";
import "./modal.css";
import PropTypes from "prop-types";

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";



let user;
let jwtToken;

class CreateApproveDeliveryModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "APPROVE_DELIVERY",
        PersonId: this.props.qldbPersonId,
        PurchaseOrderId: '',
        
        notificationOpen: false,
        notificationType: "success",
        message: ""
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }


    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:true,
            })
        }.bind(this),5000);
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

    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "APPROVE_DELIVERY",
    PersonId: this.props.qldbPersonId,
    PurchaseOrderNumber: this.state.PurchaseOrderId
  }).then(res => {

        console.log(res);
        console.log(res.data);
        if(res.data.statusCode == 200){
        this.showNotification("Approved Delivery", "success")
        }
        else{
            this.showNotification("Error! Cannot create manufacturer order", "error")

        }

      })
  }
    
  render(){
      const{PersonId,PurchaseOrderId} = this.state

      const formNotCompleted = PurchaseOrderId.length===0

          const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>

          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Create Approve Delivery</h2>
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
              htmlFor="PurchaseOrderId_id"
            >
              Select Purchase Order
            </label>
            <Input
              id="PurchaseOrderId_id"
              type="select"
              name="PurchaseOrderId"
              onChange={this.handleOnChange}
            >
              <option value="0">-Select-</option>

              {this.props.purchaseOrderIds.map((result) => (<option value={result}>{result}</option>))}

              {/*{this.props.filterProductData.map((result) => (<option value={result.id}>{result.text}</option>))}
                {this.props.filterProductData ? this.props.filterProductData.map((result) => (<option value={result.id}>{result.text}</option>)) : null}
                    */}

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
                    Approve Delivery
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

export default CreateApproveDeliveryModal;