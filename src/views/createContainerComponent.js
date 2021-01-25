/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

import Amplify, { API, container, graphqlOperation } from 'aws-amplify'
import { getSensorReading, listContainers, listSensorReadings, listGpsReadings } from '../graphql/queries';
//import Select from 'react-select'
//import awsExports from "../aws-exports";
//import Search from 'react-search'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react'
import { createContainer } from '../graphql/mutations';
import FormGroup from "reactstrap/lib/FormGroup";





class createContainerComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     containerName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  async componentDidMount(){
   
  }
  
  componentWillUnmount(){
    
  }
//handle change in form
  handleChange(event){
    this.setState({[event.target.name]: event.target.value});
  }
//handle create container button
  handleSubmit(event){
    event.preventDefault();
    this.createContainerFunction();
  }
  
  //create database entry for container
  async createContainerFunction(){
    

      let container = {
        
        name: this.state.containerName
        
             
      }
      
      try {
        await API.graphql(graphqlOperation(createContainer, {input: container}));
        console.log('Created Container!')
        alert('Created Container!')
      }catch(err){
          console.log("Error creating container", err);

      }

  }

  
  
   
  render() {
  
  
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase ls-1 mb-1">
                          CREATE CONTAINER
                      </h6>
                      <h2 className="text-white mb-0">CREATE CONTAINER</h2>
                    </div>
                    <div className="col">
                    
                    <h6 className="text-uppercase ls-1 mb-1">
                       CREATE CONTAINER
                    </h6>
                      
                     
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup>
                    <Input
                            onChange={this.handleChange}
                            name="containerName"
                            placeholder="Container Name"
                            type="text"
                            value={this.state.containerName}
                            
                          />
                    </FormGroup>
            <br></br>
                <Button className="btn-fill" color="primary" type="submit">
                    CREATE CONTAINER
                  </Button>
                          </Form>
                 
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
            
                  
              
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              
            </Col>
            <Col xl="4">
             
            </Col>
          </Row>
          <AmplifySignOut />
        </Container>
      </>
    );
  }
}

export default withAuthenticator(createContainerComponent);
  
