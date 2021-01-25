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
import axios from 'axios';

//Amplify.configure(awsExports)


let Cont_ID = [];
let containerType = [];
let containerName = [];
let isContainerSafe = [];
let items = [];
let temp = [];
let containerData = [];


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
    this.getContainers();
    
  }

  componentWillUnmount(){
    items = []
  }
    
       
  //get all container data
  async getContainers(){
    try {
    axios.post(`https://2fyx6aac6a.execute-api.ca-central-1.amazonaws.com/testMCG2/mcgcontainer`, { Operation: "GET_CONTAINER" } )
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
                  
                 
                  <td className="text-right">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                        onClick={e => e.preventDefault()}
                      >
                        <i className="fas fa-ellipsis-v" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Something else here
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
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
        <Container className="mt--7" fluid>
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
                      <th scope="col">Cont_ID</th>
                      <th scope="col">Container Type</th>
                      <th scope="col">Container Name</th>
                      <th scope="col">isContainerSafe</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                   
                     {this.state.itemsList}
                   
                  
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
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
