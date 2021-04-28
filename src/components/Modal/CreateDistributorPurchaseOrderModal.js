import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class CreateDistributorPurchaseOrderModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        Operation: "CREATE_DISTRIBUTOR_PURCHASE_ORDER",
        PersonId: this.props.qldbPersonId,
        PurchaseOrderNumber: '',
        ProductId: '',
        OrderQuantity: 1,
        OrdererScEntityId: '',
        OrdererPersonId: '',
        isOrderShipped: false,
        OrderType: '',
        DistributorId: '',
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

    const selectedProduct = this.props.products.filter(product => product.ProductId === event.target.value)

    //this.setState({ ProductName : selectedProduct[0].ProductName});
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
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "CREATE_DISTRIBUTOR_PURCHASE_ORDER",
    PersonId: this.props.qldbPersonId,
    DistributorId: this.state.DistributorId,
    PurchaseOrder:{
    PurchaseOrderNumber: this.state.PurchaseOrderNumber,
    ProductId: this. state.ProductId,
    OrderQuantity: parseInt(this.state.OrderQuantity),
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
        if(res.data.body.statusCode===200){
            this.showNotification("Created manufacturer order", "success")

        }else{
            this.showNotification("Error: "+res.data.body, "error")

        }

          //this.setState({ qldbPersonId: res.data.body.PersonId });
        //this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
  }
    
  render(){
      const{PersonId,PurchaseOrderNumber,ProductId,OrderQuantity,OrdererScEntityId,OrdererPersonId,isOrderShipped,
              OrderType} = this.state

      const formNotCompleted = ProductId.length===0||OrderQuantity.length===0

          const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>

          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Create Distributor Purchase Order</h2>
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
              htmlFor="ProductIdSelect_id"
            >
              Select Product
            </label>
            <Input
              id="ProductIdSelect_id"
              type="select"
              name="ProductId"
              onChange={this.handleOnChangeSelect}
            >
              <option value={1}>-select-</option>

              {/*{this.props.filterProductData.map((result) => (<option value={result.id}>{result.text}</option>))}*/}
                {this.props.filterProductData ? this.props.filterProductData.map((result) => (<option value={result.id}>{result.text}</option>)) : null}


              </Input>
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
                    Create Distributor Order
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

export default CreateDistributorPurchaseOrderModal;