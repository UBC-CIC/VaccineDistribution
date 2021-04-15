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

class CreateManufacturerOrderModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "CREATE_MANUFACTURER_PURCHASE_ORDER",
        PersonId: this.props.qldbPersonId,
        PurchaseOrderNumber: '',
        ProductId: '',
        OrderQuantity: 2,
        OrdererScEntityId: '',
        OrdererPersonId: '',
        isOrderShipped: false,//this.props.userEmail,
        OrderType: '',
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
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "CREATE_MANUFACTURER_PURCHASE_ORDER",
    PersonId: this.state.PersonId,

    PurchaseOrder:{
    PurchaseOrderNumber: this.state.PurchaseOrderNumber,
    ProductId: this. state.ProductId,
    OrderQuantity: this.state.OrderQuantity,
    Orderer:{
            OrdererScEntityId: this.state.OrdererScEntityId,
            OrdererPersonId: this.state.OrdererPersonId
    },
    isOrderShipped: this.state.isOrderShipped,
    OrderType: this.state.OrderType
    }
}
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        console.log("MCGRequestId",res.data.body.McgRequestId);
        this.showNotification("Created manufacturer order", "success")

          //this.setState({ qldbPersonId: res.data.body.PersonId });
        //this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
      this.showNotification("Error! Cannot create manufacturer order", "error")
  }
    
  render(){
      const{PersonId,PurchaseOrderNumber,ProductId,OrderQuantity,OrdererScEntityId,OrdererPersonId,isOrderShipped,
              OrderType} = this.state

      const formNotCompleted = PersonId.length===0||ProductId.length===0||PurchaseOrderNumber.length===0||OrderQuantity.length===0||
          OrdererScEntityId.length===0||OrdererPersonId.length===0 || isOrderShipped.length===0||OrderType.length===0

          const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>

          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Create Batch to Ledger</h2>
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
              htmlFor="PurchaseOrderNumber_id"
            >
              Purchase Order Number
            </label>
            <Input
              id="PurchaseOrderNumber_id"
              type="text"
              name="PurchaseOrderNumber"
              value={this.state.PurchaseOrderNumber}
              onChange={this.handleOnChange}              
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductId_id"
            >
              Product Id
            </label>
            <Input
              id="ProductId_id"
              type="text"
              name="ProductId"
              value={this.state.ProductId}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="OrderQuantity_id"
            >
              Order Quantity
            </label>
            <Input
              id="OrderQuantity_id"
              type="text"
              name="OrderQuantity"
              value={this.state.OrderQuantity}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="OrdererScEntityId_id"
            >
              Orderer ScEntityId
            </label>
            <Input
              id="OrdererScEntityId_id"
              type="text"
              name="OrdererScEntityId"
              value={this.state.OrdererScEntityId}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="OrdererPersonId_id"
            >
             Orderer PersonId
            </label>
            <Input
              id="OrdererPersonId_id"
              type="text"
              name="OrdererPersonId"
              value={this.state.OrdererPersonId}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="isOrderShipped_id"
            >
             is Order Shipped
            </label>
            <Input
              id="isOrderShipped_id"
              type="text"
              name="isOrderShipped"
              value={this.state.isOrderShipped}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="OrderType_id"
            >
             Order Type
            </label>
            <Input
              id="OrderType_id"
              type="text"
              name="OrderType"
              value={this.state.OrderType}
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
                    Create Manufacturer Order
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

export default CreateManufacturerOrderModal;