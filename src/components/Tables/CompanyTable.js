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
import React, {Component, useEffect, useState } from 'react'
import Amplify, { API, container, graphqlOperation } from 'aws-amplify'
import { listContainers } from '../../graphql/queries';
//import awsExports from "../../aws-exports";




// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 
import axios from 'axios';

//Amplify.configure(awsExports)


let Comp_ID = [];
let companyType = [];
let companyName = [];
let companyIC = [];
let isCompanyRegistered = [];
let items = [];
let temp = [];
let companyData = [];
let session;
let user;
let jwtToken;


class CompanyTable extends Component {
     
  constructor(props) {
    super(props);
    this.state = {
        companies:[],
        itemsList: []
  };
}

  
  
  async componentDidMount(){
    console.log("Loading tables now")
    
     session = await Auth.currentSession(); 
     jwtToken = session.accessToken.jwtToken;

     user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;
     
    this.getCompanies();
    
  }

  componentWillUnmount(){
    items = []
  }
/*
  useEffect(() => {
    Auth.currentAuthenticatedUser(user => {
      user.getSession((err, session) => {
        if(err) {
          throw new Error(err);
        }

        const sessionToken = session.getIdToken().jwtToken;

        fetchItems(sessionToken)
          .then(setItems)
          .catch(err => console.log(err));
      });
    });
  }, []);
    */
       
  //get all container data
  async getCompanies(){
    try {
      
      console.log("JWT token",jwtToken);

    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgcompany`, { Operation: "GET_COMPANY" } ,{
      headers: {
        'Authorization': jwtToken
      }})
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        companyData = res.data.body;
      this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
    })
        }
catch (err) {
    console.log('error fetching company...', err)
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
  async createCompanyList(){
    console.log("in create company list")
    companyData.forEach(element => {
        Comp_ID.push(element.Comp_ID);
        companyType.push(element.companyType);
        companyName.push(element.companyName);
        companyIC.push(element.companyIC);
        isCompanyRegistered.push(element.isCompanyRegistered);
        //let date = new Date(element.updatedAt).toLocaleTimeString()
      //containerDate.push(date)
    });
    temp = companyData
    var i;
    for(i=0; i < this.state.companies.length; i++){
        items.push(
              <tr key={i}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <Media>
                        <span className="mb-0 text-sm">
                        {companyData[i].Comp_ID}
                        </span>
                      </Media>
                    </Media>
                  </th>
                  <td>{companyData[i].companyType}</td>
                  <td>
                      {companyData[i].companyName}
                   
                  </td>
                  <td>
                      {companyData[i].companyIC}
                  </td>
                  <td>
                      {companyData[i].isCompanyRegistered?"true":"false"}
                  </td>
              </tr>
        )
      
    }
    this.setState({itemsList:items})

    console.log(companyData)

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
                  <h3 className="mb-0">Company Data</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Name</th>
                      <th scope="col">IC</th>
                      <th scope="col">Registered?</th>
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

export default withAuthenticator(CompanyTable) ;
