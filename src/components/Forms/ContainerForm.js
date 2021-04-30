import React from "react";
import axios from 'axios';
import {v4 as uuidv4} from "uuid";
// reactstrap components
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";
import QrReader from 'react-qr-scanner'
import {Auth} from "aws-amplify";

let user;
let jwtToken;

class ContainerForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      Operation: "POST",
      Cont_ID: uuidv4(),
      containerType: '',
      containerName: '',
      isContainerSafe: true,
      delay: 5000,
      scan: false,
      scanResult: false,
      scanResultData: null,
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleVaccineIDChange = this.handleVaccineIDChange.bind(this);
    this.handleContainerTypeChange = this.handleContainerTypeChange.bind(this);
    this.handleContainerNameChange = this.handleContainerNameChange.bind(this);
  }
  handleContainerTypeChange = event => {
    this.setState({ containerType: event.target.value });
  }

  handleContainerNameChange = event => {
    this.setState({ containerName: event.target.value });
  }

  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleSubmit = event => {

    axios.post(process.env.REACT_APP_API_CONTAINER_URL, {
      Operation: "POST",
      Cont_ID: this.state.Cont_ID,
      containerType: this.state.containerType,
      containerName: this.state.containerName,
      isContainerSafe: true
    }, {
      headers: {
        'Authorization': jwtToken
      }
    })
        .then(res => {

        console.log(res);
        console.log(res.data);
        alert("Container saved successfully");
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
  if (testScan != null)
  {
  this.setState({
    containerType: testScan.containerType,
    containerName: testScan.containerName
  })
  console.log(this.state.containerType,this.state.containerName)
  this.handleSubmit();
}
else{
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
    const {containerName,containerType} = this.state
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h5>* indicates a required field</h5>
            <label
              className="form-control-label"
              htmlFor="containerType_id"
            >
              Container Type *
            </label>
            <Input
              id="containerType_id"
              type="text"
              name="containerType" 
              //value={this.state.containerType}
              onChange={this.handleContainerTypeChange} 
            />
          </FormGroup>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="containerName_id"
            >
              Container Name *
            </label>
            <Input
              id="containerName_id"
              type="text"
              name="containerName" 
              //value={this.state.containerName}
              onChange={this.handleContainerNameChange} 
            />
          </FormGroup>
          <FormGroup>
          <Row>
            <Col className={"d-flex justify-content-center"}>
            <label className="form-control-label">
              QRCode Scanner
            </label>
            </Col>
          </Row>
          <Row className={"d-flex justify-content-center"}>
            {!this.state.scan && !this.state.scanResult && <Button className={"d-flex justify-content-center"} color="primary" type="button" onClick={this.activeQR}>
          Activate QRScanner
         </Button>}
         {
           this.state.scanResult && <p>Container: {this.state.scanResultData} <Button color="primary"  type="button" onClick={this.scanAgain}>Scan again</Button></p>
           
         }
         <div style = {camStyle} >
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
            <Col className={"d-flex justify-content-center"}>
          <label
              className="form-control-label step"
          >
            Form Completed?
          </label>
          {!(containerName.length===0||containerType.length===0)?
              <i className={"far fa-check-circle"} style={{color: "green"}}/>
              :
              <i className={"far fa-times-circle"} style={{color: "red"}}/>
          }
            </Col>
          </Row>

          <Row>
            <Col className={"d-flex justify-content-center"}>
                    <Button  className="btn-fill" color="primary" type="submit"
                             disabled={(containerName.length===0||containerType.length===0)}>
                    Create Container
                  </Button>
            </Col>
          </Row>
                  
        </Form>
        
      </>
    );
  }
}

export default ContainerForm;