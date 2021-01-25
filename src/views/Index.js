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
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

import Amplify, { API, container, graphqlOperation } from 'aws-amplify'
import { getSensorReading, listContainers, listSensorReadings, listGpsReadings } from '../graphql/queries';
import Select from 'react-select'
//import awsExports from "../aws-exports";
import Search from 'react-search'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { withAuthenticator } from '@aws-amplify/ui-react'
import Jvectormap from "components/Dashboard/JVectorMap";
import Timeline from "components/Dashboard/Timeline";
import Piechart from "components/Dashboard/Piechart";
import VectorMapTest from "components/Dashboard/VectorMapTest";

let sensorTemp = []
let sensorHumidity = []

let sensorTemp2 = []
let sensorHumidity2 = []

let API_KEY = 'AIzaSyCE1m9O-rVYp0ttT-keHHHlQA1MRsfJL8k'; //API KEY FROM GOOGLE. REPLACE

var Options = [
  {label:'TEMPERATURE', value: 0},
  {label:'HUMIDITY', value: 1},
  {label: 'LOCATION', value:2}
  
]
/*
data 1 and data 2 are the sensors
they are filled in following functions
*/
var data1 = {
 
  datasets: [
    {
      label: 'Temperature',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      
      
    }
    ,
    {
      label: 'Temperature2',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(191,133,74,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(191,133,74,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(191,133,74,1)',
      pointHoverBorderColor: 'rgba(191,133,74,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      
      
    }
  ]
};

var data2 = {
  
  datasets: [
    {
      label: 'Humidity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      
      
    },
    {
      label: 'Humidity2',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(191,133,74,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(191,133,74,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(191,133,74,1)',
      pointHoverBorderColor: 'rgba(191,133,74,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
     
      
    }
  ]
};

let containerOptions = []

//the default location of the google maps api

const location = {
  address: '1600 Amphitheatre Parkway, Mountain View, california.',
  lat: 37.42216,
  lng: -122.08427,
}
//the google maps component configuration
const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
  
    defaultZoom={10}
    center={{ lat: location.lat, lng: location.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: location.lat, lng: location.lng }} />}
  </GoogleMap>
))

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      containers: [],
      sensorReadings: [],
      dataType: -1,
      dataOption: {},
      dataArray: [],
      data1: '',
      data2: '',
      containerId: '5430d7b2-8987-48ad-aa40-497e4c3f2531',
      containerName: '',
      currentReadings: [],
      dataName: '',
      gpsReadings: [],
      containerLocation: []
    };
    this.chartReference = React.createRef();
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    this.handleSensorDropdown = this.handleSensorDropdown.bind(this);
    this.handleContainerDropdown = this.handleContainerDropdown.bind(this);
  }
  //code to change the type of data that's shown
  toggleNavs = (e, index) => {
    console.log(index)
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
      dataType: index
       
        
    });
   
    
    console.log(this.state.dataArray)
  };
  
  //functions to run after components mount
  async componentWillMount(){
    this.getContainers();
    console.log(this.chartReference)
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  
  componentWillUnmount(){
    containerOptions = []
  }
  //get all containers from database
  async getContainers(){
    try {
      const containers = await API.graphql(graphqlOperation(listContainers))
      console.log('containers:', containers)
      this.setState({
         containers: containers.data.listContainers.items
      })
    } catch (err) {
      console.log('error fetching containers...', err)
    }
    this.state.containers.forEach(element => {
      containerOptions.push({value: element.id, label: element.name})
    });
   

    
  }
  //get sensor readings for selected containers on dropdown
  async getSensorForContainer(){
    console.log(this.state.containerId)
    try {
      const currentReadings = await API.graphql(graphqlOperation(listSensorReadings, {filter:{containerSensorReadingsId:{eq:this.state.containerId}}}))
      
      console.log('current readings: ', currentReadings)
      this.setState({
         currentReadings: currentReadings.data.listSensorReadings.items
      })
    } catch (err) {
      console.log('error fetching current containers...', err)
    }

    let fakeArray = []
    let labelArray = []
    
    this.state.currentReadings.forEach(element => {
      
      if(element.sensorID === '1'){
        sensorTemp.push(element.temperature)
        sensorHumidity.push(element.humidity)
        
      }
      else if(element.sensorID === '2'){
        sensorTemp2.push(element.temperature)
        sensorHumidity2.push(element.humidity)
      }
      
     
    });
    let index = 0
    for(index = 0; index < 10; index++){
      labelArray.push(index)
    }
    
    //console.log(sensorTemp)
    
    data1.datasets[0].data = sensorTemp;
    data1.datasets[1].data = sensorTemp2;
   data1.labels = labelArray;
    
    
    data2.datasets[0].data = sensorHumidity;
    data2.datasets[1].data = sensorHumidity2;
   data2.labels = labelArray;
    
    
    fakeArray.push(data1)
    fakeArray.push(data2)
    
    this.setState({dataArray: fakeArray})
    this.setState({data1: data1})
    this.setState({data2: data2})
   
    
  }

  //handles code for data type dropdown 
  handleSensorDropdown(event){
    this.setState({dataType : event.value})
    this.setState({dataName: event.label})
  }

  //handles code for container dropdown
  handleContainerDropdown(event){
    this.setState({containerName: event.name})
    this.setState({containerId: event.value}, () => this.getSensorForContainer())
    this.setState({containerId: event.value}, () => this.getGPSForContainer())
      
  }

  //get gps coordinates for selected container
  async getGPSForContainer(){
        console.log(this.state.containerId)
        try {
          const currentGPSReadings = await API.graphql(graphqlOperation(listGpsReadings, {filter:{containerGpsReadingId:{eq:this.state.containerId}}}))
          //const currentReadings = await API.graphql(graphqlOperation(listSensorReadings,{filter :{ containerSensorReadingsId: {eq: this.state.containerId}}}))
          console.log('current GPS readings: ', currentGPSReadings)
          this.setState({
            
            currentLocation: currentGPSReadings.data.listGPSReadings.items
          })
        } catch (err) {
          console.log('error fetching current containers...', err)
        }

      location.lat = parseFloat(this.state.currentLocation[0].lat);
      location.lng = parseFloat(this.state.currentLocation[0].lng);
    
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
                          <Select onChange={this.handleContainerDropdown} options={containerOptions}/>
                      </h6>
                      
                      {/* <h2 className="text-white mb-0">Sensor Data</h2> */}
                    </div>
                    <div className="col">
                    <h6 className="text-uppercase ls-1 mb-1">
                      
                        <Select onChange={this.handleSensorDropdown}  options={Options}/>
                        
                    </h6>
                      
                     
                    </div>
                  </Row>
                </CardHeader>
                
                <CardBody>
                  {/* Chart */}
                 
                  <div className="chart">
                    
                    {
                    this.state.dataType === 0 && (
                     <Line ref="chart" data={data1} />
                    )
                    }
                    {
                      this.state.dataType === 1 && (
                        <Line ref="chart" data={data2} />
                       )

                    }
                    {
                     
                      this.state.dataType === 2 && (
                        
                        <MyMapComponent
                        
                              isMarkerShown
                              googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + API_KEY + "&v=3.exp&libraries=geometry,drawing,places"}
                              loadingElement={<div style={{ height: `100%` }} />}
                              containerElement={<div style={{ height: `100%` }} />}
                              mapElement={<div style={{ height: `100%` }} />}
                         />
                      )
                    }
                  </div>
                 
                 
                 
                
                  <h2 className="text-white mb-0">{this.state.dataName}</h2>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4" >
            
            
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Vaccine map</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                
                <Jvectormap />
                 
                </CardBody>
               
              </Card>
                  
                 
              
              
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-default">
            <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Temperature chart</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
             <div className="chart">

                    
               <Line ref="chart"
                 data={chartExample3.data}
                 id="chart-sales"
                 className="chart-canvas"
                 options={chartExample3.options}
                 
               />
             </div>
           </CardBody>
               
              </Card>
              
            </Col>
            <Col xl="4">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Container Piechart</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                
                  <Piechart/>
                 
                </CardBody>
               
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Vaccine Container Timeline</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                
                  <Timeline/>
                 
                </CardBody>
               
              </Card>
              
            </Col>
            <Col xl="4">
            <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Container Piechart</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                
                  <Piechart/>
                 
                </CardBody>
               
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withAuthenticator(Index,{
  includeGreetings: true,
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  }



});
