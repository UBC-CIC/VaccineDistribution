import React from "react";
import "./modal.css";
import PropTypes from "prop-types";

import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input,Container, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 



let user;
let jwtToken;

class RegisterProductModal extends React.Component {
  
  constructor(props){
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
        BatchTableId: ""
    };
    
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
    isApprovedBySuperAdmin: this.state.isApprovedBySuperAdmin
    }
      
  }
     )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("Product Registered in ledger")
        console.log("MCGRequestId",res.data.body.McgRequestId);
        alert("MCGRequestId",res.data.body.McgRequestId);
        //this.setState({ qldbPersonId: res.data.body.PersonId });
        //this.props.LinkCognito_QLDBUser(this.state.qldbPersonId);

      })
  }
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
        <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
              <h2>Register Product to Ledger</h2>
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
        
          
          {/*
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-search-input"
            >
              Search
            </label>
            <Input
              defaultValue="Tell me your secret ..."
              id="example-search-input"
              type="search"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-email-input"
            >
              Email
            </label>
            <Input
              defaultValue="argon@example.com"
              id="example-email-input"
              type="email"
            />
          </FormGroup>
          <FormGroup>
            <label className="form-control-label" htmlFor="example-url-input">
              URL
            </label>
            <Input
              defaultValue="https://www.creative-tim.com"
              id="example-url-input"
              type="url"
            />
          </FormGroup>
          <FormGroup>
            <label className="form-control-label" htmlFor="example-tel-input">
              Phone
            </label>
            <Input
              defaultValue="40-(770)-888-444"
              id="example-tel-input"
              type="tel"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-password-input"
            >
              Password
            </label>
            <Input
              defaultValue="password"
              id="example-password-input"
              type="password"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-number-input"
            >
              Number
            </label>
            <Input
              defaultValue="23"
              id="example-number-input"
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-datetime-local-input"
            >
              Datetime
            </label>
            <Input
              defaultValue="2018-11-23T10:30:00"
              id="example-datetime-local-input"
              type="datetime-local"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-date-input"
            >
              Date
            </label>
            <Input
              defaultValue="2018-11-23"
              id="example-date-input"
              type="date"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-month-input"
            >
              Month
            </label>
            <Input
              defaultValue="2018-11"
              id="example-month-input"
              type="month"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-week-input"
            >
              Week
            </label>
            <Input
              defaultValue="2018-W23"
              id="example-week-input"
              type="week"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-time-input"
            >
              Time
            </label>
            <Input
              defaultValue="10:30:00"
              id="example-time-input"
              type="time"
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="example-color-input"
            >
              Color
            </label>
            <Input
              defaultValue="#5e72e4"
              id="example-color-input"
              type="color"
            />
          </FormGroup>
          */}
          <Button
                      className="float-right"
                      color="default"
                      
                      onClick={this.props.handleClose}
                      size="xl"
                    >
                      Close
                    </Button>
                    <br></br>
                    <Button className="btn-fill" color="primary" type="submit">
                    Register Product
                  </Button>
                  
        </Form>
          
        </section>
      </div>
    );
  }
}

export default RegisterProductModal;