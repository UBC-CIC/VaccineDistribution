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
//import awsExports from "../../aws-exports";
// reactstrap components
import {Card, CardHeader, Container, Media, Row, Table} from "reactstrap";
// core components
import {withAuthenticator} from '@aws-amplify/ui-react';
import axios from 'axios';

//Amplify.configure(awsExports)


let Cont_ID = [];
let containerType = [];
let containerName = [];
let isContainerSafe = [];
let items = [];
let temp = [];
let containerData = [];
let user;
let jwtToken;


class ContainerTable extends Component {
     
  constructor(props) {
    super(props);
    this.state = {
        containers:[],
        itemsList: []
  };
}

  
  
  async componentDidMount(){
    console.log("Loading tables now")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;
    this.getContainers();
    
  }

  componentWillUnmount(){
    items = []
  }
    
       
  //get all container data
  async getContainers(){
    try {
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgcontainer`, { Operation: "GET_CONTAINER" },{
      headers: {
        'Authorization': jwtToken
      }} )
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        containerData = res.data.body;
      this.setState({ containers: res.data.body }, ()=> this.createContainerList());
    })
        }
catch (err) {
    console.log('error fetching containers...', err)
  }
/*
    try {
      const containers = await API.graphql(graphqlOperation(listContainers))
      containerData = containers.data.listContainers.items
      console.log('containers:', containers)
      this.setState({
         containers: containers.data.listContainers.items
      }, () => this.createContainerList())
    } catch (err) {
      console.log('error fetching containers...', err)
    }

    */
    
  }

  //create table and fill in container data
  async createContainerList(){
    console.log("in create container list")
    containerData.forEach(element => {
      Cont_ID.push(element.Cont_ID);
      containerType.push(element.containerType);
      containerName.push(element.containerName);
      isContainerSafe.push(element.isContainerSafe);
      //let date = new Date(element.updatedAt).toLocaleTimeString()
      //containerDate.push(date)
    });
    temp = containerData
    var i;
    for(i=0; i < this.state.containers.length; i++){
        items.push(
              <tr key={i}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <Media>
                        <span className="mb-0 text-sm">
                        {containerData[i].Cont_ID}
                        </span>
                      </Media>
                    </Media>
                  </th>
                  <td>{containerData[i].containerType}</td>
                  <td>
                    
                     
                      {containerData[i].containerName}
                   
                  </td>
                  <td>
                      {containerData[i].isContainerSafe?"true":"false"}
                  </td>
                  
              </tr>
        )
      
    }
    this.setState({itemsList:items})

    console.log(containerData)

  }
  

  render() {
    return (
      <>
        
        {/* Page content */}
        <Container className="mt--7">
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Container Data</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Name</th>
                      <th scope="col">Container Safe?</th>
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
          {/* Dark table */}

        </Container>
      </>
    );
  }
}

export default withAuthenticator(ContainerTable) ;
