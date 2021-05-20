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
import React, {Component} from 'react'
import {Auth} from 'aws-amplify'
import {Card, CardHeader, Container, Media, Row, Table} from "reactstrap";
import {withAuthenticator} from '@aws-amplify/ui-react';
import axios from 'axios';


let Vac_ID = [];
let vaccineType = [];
let vaccineName = [];
let isVaccineSafe = [];
let items = [];
let temp = [];
let vaccineData = [];
let user;
let jwtToken;


class VaccineTable extends Component {
     
  constructor(props) {
    super(props);
    this.state = {
        vaccines:[],
        itemsList: []
  };
}

  
  
  async componentDidMount(){
    console.log("Loading tables now")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;
    this.getVaccines();
    
  }

  componentWillUnmount(){
    items = []
  }
    
       
  //get all container data
  async getVaccines(){
    try {
    axios.post(process.env.REACT_APP_API_VACCINE_URL, {Operation: "GET_VACCINE"}, {
      headers: {
        'Authorization': jwtToken
      }
    })
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        vaccineData = res.data.body;
      this.setState({ vaccines: res.data.body }, ()=> this.createVaccineList());
    })
        }
catch (err) {
    console.log('error fetching vaccine...', err)
  }
  }

  //create table and fill in container data
  async createVaccineList(){
    console.log("in create vaccine list")
    vaccineData.forEach(element => {
      Vac_ID.push(element.Vac_ID);
      vaccineType.push(element.vaccineType);
      vaccineName.push(element.vaccineName);
      
      isVaccineSafe.push(element.isVaccineSafe);
    });
    temp = vaccineData
    var i;
    for(i=0; i < this.state.vaccines.length; i++){
        items.push(
              <tr key={i}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <Media>
                        <span className="mb-0 text-sm">
                        {vaccineData[i].Vac_ID}
                        </span>
                      </Media>
                    </Media>
                  </th>
                  <td>{vaccineData[i].vaccineType}</td>
                  <td>
                      {vaccineData[i].vaccineName}
                  </td>
                  <td>
                      {vaccineData[i].isVaccineSafe?"true":"false"}
                  </td>
            </tr>
        )
      
    }
    this.setState({itemsList:items})

    console.log(vaccineData)

  }
  

  render() {
    return (
      <>
        <Container className="mt--7">
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Vaccine Data</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive hover>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Name</th>
                      <th scope="col">Vaccine Safe?</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                     {this.state.itemsList}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default withAuthenticator(VaccineTable) ;
