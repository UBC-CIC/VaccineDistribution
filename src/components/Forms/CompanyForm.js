import React from "react";
import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';


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
    axios.post(`https://2fyx6aac6a.execute-api.ca-central-1.amazonaws.com/testMCG2/mcgcompany`, { Operation: "POST",
    Comp_ID: parseInt(this.state.Comp_ID),
    companyType: this.state.companyType,
    companyName: this.state.companyName,
    companyIC: this.state.companyIC,
    isCompanyRegistered: false })
      .then(res => {

        console.log(res);
        console.log(res.data);
      })
  }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
        <FormGroup>
            <label
              className="form-control-label"
              
            >
              Company ID
            </label>
            <Input
              defaultValue=""
              
              type="text"
              
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="Comp_ID_id"
            >
              Company ID
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
              Company Type
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
              Company Name
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
              Company Identification Code
            </label>
            <Input
              id="companyIC_id"
              type="text"
              name="companyIC" 
              onChange={this.handleCompanyICChange} 
            />
          </FormGroup>
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
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Message
                    </Button>
                    <br></br>
                    <Button className="btn-fill" color="primary" type="submit">
                    Create Company
                  </Button>
                  
        </Form>
      </>
    );
  }
}

export default CompanyForm;