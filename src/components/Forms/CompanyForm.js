import React from "react";
import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 


let user;
let jwtToken;
class CompanyForm extends React.Component {
/*
  state = {
    Operation: "POST",
    Vac_ID: '',
    vaccineType: '',
    vaccineName: '',
    isVaccineSafe: true

  }
  */

  constructor(props){
    super(props);
    this.state = {
        Operation: "POST",
        Comp_ID: '',
        companyType: '',
        companyName: '',
        companyIC: '',
        isCompanyRegistered: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCompanyIDChange = this.handleCompanyIDChange.bind(this);
    this.handleCompanyTypeChange = this.handleCompanyTypeChange.bind(this);
    this.handleCompanyNameChange = this.handleCompanyNameChange.bind(this);
    this.handleCompanyICChange = this.handleCompanyICChange.bind(this);

  }

  handleCompanyIDChange = event => {
    this.setState({ Comp_ID: event.target.value });
  }
  handleCompanyTypeChange = event => {
    this.setState({ companyType: event.target.value });
  }

  handleCompanyNameChange = event => {
    this.setState({ companyName: event.target.value });
  }
  handleCompanyICChange = event => {
    this.setState({ companyIC: event.target.value });
  }

  //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;
  }

  handleSubmit = event => {
    event.preventDefault();

    const company = {
    Operation: "POST",
    Comp_ID: this.state.Comp_ID,
    companyType: this.state.companyType,
    companyName: this.state.companyName,
    companyIC: this .state.companyIC,
    isCompanyRegistered: false
    };
    /*
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    */
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgcompany`,
        { Operation: "POST",
    Comp_ID: parseInt(this.state.Comp_ID),
    companyType: this.state.companyType,
    companyName: this.state.companyName,
    companyIC: this.state.companyIC,
    isCompanyRegistered: false },{
      headers: {
        'Authorization': jwtToken
      }} )
      .then(res => {

        console.log(res);
        console.log(res.data);
      })
  }

  render() {
      const {Comp_ID, companyType,companyName,companyIC} = this.state
    return (
        <Form onSubmit={this.handleSubmit}>
          <h5>* indicates a required field</h5>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="Comp_ID_id"
            >
              Company ID *
            </label>
            <Input
              
              id="Comp_ID_id"
              type="text"
              name="Comp_ID"
              onChange={this.handleCompanyIDChange}
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="companyType_id"
            >
              Company Type *
            </label>
            <Input
              id="companyType_id"
              type="text"
              name="companyType" 
              onChange={this.handleCompanyTypeChange} 
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="companyName_id"
            >
              Company Name *
            </label>
            <Input
              id="companyName_id"
              type="text"
              name="companyName" 
              onChange={this.handleCompanyNameChange} 
            />
            </FormGroup>
            <FormGroup>
            <label
              className="form-control-label"
              htmlFor="companyIC_id"
            >
              Company Identification Code *
            </label>
            <Input
              id="companyIC_id"
              type="text"
              name="companyIC" 
              onChange={this.handleCompanyICChange} 
            />
          </FormGroup>
          <Row>
            <Col >
              <label
                  className="form-control-label step"
              >
                Form Completed?
              </label>
              {!(Comp_ID.length===0||companyName.length===0
              ||companyType.length===0||companyIC.length===0)?
                  <i className={"far fa-check-circle"} style={{color: "green"}}/>
                  :
                  <i className={"far fa-times-circle"} style={{color: "red"}}/>
              }
            </Col>
          </Row>
          <Row>
            <Col className={"d-flex justify-content-center"}>

          <Button className="btn-fill" color="primary" type="submit"
            disabled={Comp_ID.length===0||companyName.length===0
            ||companyType.length===0||companyIC.length===0}>
                Create Company
            </Button>
            </Col>
          </Row>
        </Form>
    );
  }
}

export default CompanyForm;