import React from "react";
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';


class VaccineForm extends React.Component {
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
      Vac_ID: uuidv4(),
      vaccineType: '',
      vaccineName: '',
      isVaccineSafe: true
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleVaccineIDChange = this.handleVaccineIDChange.bind(this);
    this.handleVaccineTypeChange = this.handleVaccineTypeChange.bind(this);
    this.handleVaccineNameChange = this.handleVaccineNameChange.bind(this);
  }
/*
  handleVaccineIDChange = event => {
    this.setState({ Vac_ID: event.target.value });
  }
  */
  handleVaccineTypeChange = event => {
    this.setState({ vaccineType: event.target.value });
  }

  handleVaccineNameChange = event => {
    this.setState({ vaccineName: event.target.value });
  }

  //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}


  handleSubmit = event => {
    event.preventDefault();

    const vaccine = {
    Operation: "POST",
    Vac_ID: this.state.Vac_ID,
    vaccineType: this.state.vaccineType,
    vaccineName: this.state.vaccineName,
    isVaccineSafe: true
    };
    /*
    res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    */
    axios.post(`https://2fyx6aac6a.execute-api.ca-central-1.amazonaws.com/testMCG2/mcgvaccine`, { Operation: "POST",
    Vac_ID: this.state.Vac_ID,
    vaccineType: this.state.vaccineType,
    vaccineName: this.state.vaccineName,
    isVaccineSafe: true })
      .then(res => {

        console.log(res);
        console.log(res.data);
      })
  }

  render() {
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
        {/* 
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="Vac_ID_id"
            >
              Vaccine ID
            </label>
            <Input
              
              id="Vac_ID_id"
              type="text"
              name="Vac_ID"
              onChange={this.handleVaccineIDChange}
            />
          </FormGroup>
          */}
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="vaccineType_id"
            >
              Vaccine Type
            </label>
            <Input
              id="vaccineType_id"
              type="text"
              name="vaccineType" 
              onChange={this.handleVaccineTypeChange} 
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="vaccineName_id"
            >
              Vaccine Name
            </label>
            <Input
              id="vaccineName_id"
              type="text"
              name="vaccineName" 
              onChange={this.handleVaccineNameChange} 
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
                    Create Vaccine
                  </Button>
                  
        </Form>
      </>
    );
  }
}

export default VaccineForm;