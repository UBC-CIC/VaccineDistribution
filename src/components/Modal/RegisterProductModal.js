import React from "react";
import "../../assets/css/modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";


let user;
let jwtToken;

class RegisterProductModal extends React.Component {

    constructor(props) {
        super(props);
    this.state = {
        Operation: "REGISTER_NEW_PRODUCT",
        PersonId: '',
        ProductCode: '',
        ProductName: '',
        ProductPrice: 0,
        MinimumSellingAmount: 2,
        ProductsPerContainer: 100,//this.props.userEmail,
        ProductExpiry: 120,//this.props.userPhone,
        LowThreshTemp: 0,

        HighThreshTemp: 10,
        HighThreshHumidity: 40,
        ProductHSTarriffNumber:'',
        ManufacturerId: '',

        isApprovedBySuperAdmin: false,
        BatchTableId: "",
        notificationOpen: false,
        notificationType: "success",
        message: ""

    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }


    handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
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
    event.preventDefault();
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "REGISTER_NEW_PRODUCT",
    PersonId: this.props.qldbPersonId,
    Product:{
    ProductCode: this.state.ProductCode,
    ProductName: this. state.ProductName,
    ProductPrice: parseInt(this.state.ProductPrice),
    MinimumSellingAmount: parseInt(this.state.MinimumSellingAmount),
    ProductsPerContainer: parseInt(this.state.ProductsPerContainer),
    ProductExpiry: parseInt(this.state.ProductExpiry),
    ProductStorage:{
      LowThreshTemp: parseInt(this.state.LowThreshTemp),
      HighThreshTemp: parseInt(this.state.HighThreshTemp),
      HighThreshHumidity: parseInt(this.state.HighThreshHumidity)
    },
    ProductHSTarriffNumber: this.state.ProductHSTarriffNumber,
    ManufacturerId: this.props.manufacturerId,
    isApprovedBySuperAdmin: this.state.isApprovedBySuperAdmin,
    BatchTableId: this.state.BatchTableId

    }
      
  }
     )
      .then(res => {
        console.log(res);
          if(res.data.statusCode===200){
              this.showNotification("Product registered in Ledger", "success")
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
      const {PersonId,ProductName,ProductCode, ProductPrice,MinimumSellingAmount,ProductsPerContainer,ProductExpiry,
          LowThreshTemp,HighThreshTemp,HighThreshHumidity,
          ProductHSTarriffNumber,ManufacturerId} = this.state;
      const formNotCompleted = ProductName.length===0||ProductCode.length===0||ProductPrice.length===0
          ||MinimumSellingAmount.length===0|| ProductsPerContainer.length===0||LowThreshTemp.length===0||ProductExpiry.length===0
          ||HighThreshHumidity.length===0||ProductHSTarriffNumber.length===0||HighThreshTemp.length===0

      return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Register Product to Ledger</h2>
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
              value={this.props.qldbPersonId}
              onChange={this.handleOnChange} 
                            
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductCode_id"
            >
              Product Code
            </label>
            <Input
              id="ProductCode_id"
              type="text"
              name="ProductCode"
              placeholder="Product Code as GS1 number"
              value={this.state.ProductCode}
              onChange={this.handleOnChange}              
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductName_id"
            >
              Product Name
            </label>
            <Input
              id="ProductName_id"
              type="text"
              name="ProductName"
              value={this.state.ProductName}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductPrice_id"
            >
              Product Price
            </label>
            <Input
              id="ProductPrice_id"
              type="text"
              name="ProductPrice"
              value={this.state.ProductPrice}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="MinimumSellingAmount_id"
            >
              Minimum Selling Amount
            </label>
            <Input
              id="MinimumSellingAmount_id"
              type="text"
              name="MinimumSellingAmount"
              value={this.state.MinimumSellingAmount}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductsPerContainer_id"
            >
              Products Per Container
            </label>
            <Input
              id="ProductsPerContainer_id"
              type="text"
              name="ProductsPerContainer"
              value={this.state.ProductsPerContainer}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductExpiry_id"
            >
              Product Expiry
            </label>
            <Input
              id="ProductExpiry_id"
              type="text"
              name="ProductExpiry"
              value={this.state.ProductExpiry}
              onChange={this.handleOnChange}               
            />
          </FormGroup>
              </Col>

              <Col>

              <FormGroup>
            <label
              className="form-control-label"
              htmlFor="LowThreshTemp_id"
            >
              Low Thresh Temp (C)
            </label>
            <Input
              id="LowThreshTemp_id"
              type="text"
              name="LowThreshTemp"
              value={this.state.LowThreshTemp}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="HighThreshTemp_id"
            >
              High Thresh Temp (C)
            </label>
            <Input
              id="HighThreshTemp_id"
              type="text"
              name="HighThreshTemp"
              value={this.state.HighThreshTemp}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="HighThreshHumnidity_id"
            >
              High Thresh Humidity
            </label>
            <Input
              id="HighThreshHumidity_id"
              type="text"
              name="HighThreshHumidity"
              value={this.state.HighThreshHumidity}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ProductHSTarriffNumber_id"
            >
              Product HS Tarriff Number
            </label>
            <Input
              id="ProductHSTarriffNumber_id"
              type="text"
             
              name="ProductHSTarriffNumber"
              value={this.state.ProductHSTarriffNumber}
              onChange={this.handleOnChange}               
            />
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ManufacturerId_id"
            >
              Manufacturer Id
            </label>
            <Input
              id="ManufacturerId_id"
              type="text"
              name="ManufacturerId"
              value={this.props.manufacturerId}
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
                    Register Product
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

export default RegisterProductModal;