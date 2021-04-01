import React from "react";
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import QRCodeScanner from "components/Features/QRCodeScanner";
import QrReader from 'react-qr-scanner'
import { Auth } from "aws-amplify"; 

let user;
let jwtToken;

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
      isVaccineSafe: true,
      delay: 5000,
      scan: false,
      scanResult: false,
      scanResultData: null
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
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleSubmit = event => {
    //event.preventDefault();

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
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgvaccine`, { Operation: "POST",
    Vac_ID: this.state.Vac_ID,
    vaccineType: this.state.vaccineType,
    vaccineName: this.state.vaccineName,
    isVaccineSafe: true },{
      headers: {
        'Authorization': jwtToken
      }} )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("Vaccine saved successfully");
      })
  }
  
  activeQR = () => {
    this.setState({
        scan: true
    })
    console.log(this.state.scan)
}

handleScan = (e) => {
  
  this.setState({
    scanResultData: e,
      scan: false,
      scanResult: true
  })
  let testScan = JSON.parse(e)
  console.log( this.state.scanResultData)
  console.log( testScan)
  if(testScan != null)
  {
  this.setState({
    vaccineType: testScan.vaccineType,
    vaccineName: testScan.vaccineName
  })
  console.log(this.state.vaccineName,this.state.vaccineType)
  this.handleSubmit();
}
else
{
 
    alert("Scan not successful");
 
}
}

scanAgain = () => {
  this.setState({
      scan: true,
      ScanResult: false
  })
}
handleError(err){
  console.error(err)
}

  render() {
    const previewStyle = {
      height: 700,
      width: 1000,
      display: 'flex',
      justifyContent: "center"
    }
    const camStyle = {
      display: 'flex',
      justifyContent: "center",
      marginTop: '-50px'
    }
    const {vaccineName,vaccineType} = this.state
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h5>* indicates a required field</h5>
            <label
              className="form-control-label"
              htmlFor="vaccineType_id"
            >
              Vaccine Type *
            </label>
            <Input
              id="vaccineType_id"
              type="text"
              name="vaccineType" 
              //value={this.state.vaccineType}
              onChange={this.handleVaccineTypeChange} 
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="vaccineName_id"
            >
              Vaccine Name *
            </label>
            <Input
              id="vaccineName_id"
              type="text"
              name="vaccineName" 
              //value={this.state.vaccineName}
              onChange={this.handleVaccineNameChange} 
            />
          </FormGroup>
          <FormGroup>
            <Row>
              <Col>
              <label
              className="form-control-label"
              
            >
              QRCode Scanner
            </label>
              </Col>
            </Row>
            <Row className={"d-flex justify-content-center"}>

            {!this.state.scan && !this.state.scanResult && <Button color="primary" type="button" onClick={this.activeQR}>
          Activate QRScanner {' '}
         </Button>
         }
         {
           this.state.scanResult && <p>VaccineDetails: {this.state.scanResultData} <Button color="primary"  type="button" onClick={this.scanAgain}>Scan again</Button></p>
           
         }
         <div style = {camStyle}>
            {this.state.scan && <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          //onRead={this.onSuccess}
          />}
          </div>
            </Row>
          </FormGroup>
          <Row>
            <Col>
            <label
              className="form-control-label step"
          >
            Form Completed?
          </label>
              {!(vaccineName.length===0||vaccineType.length===0)?
                  <i className={"far fa-check-circle"} style={{color: "green"}}/>
                  :
                  <i className={"far fa-times-circle"} style={{color: "red"}}/>
              }
            </Col>
          </Row>

          <Row>
            <Col className={"d-flex justify-content-center"}>
              <Button className="btn-fill" color="primary" type="submit"
                      disabled={(vaccineName.length===0||vaccineType.length===0)}>
                Create Vaccine
              </Button>
            </Col>
          </Row>

        </Form>
    
      </>
    );
  }
}

export default VaccineForm;