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
import {Card, CardHeader, Col, Container, Media, Row, Table} from "reactstrap";
import {withAuthenticator} from '@aws-amplify/ui-react';
import axios from 'axios';


let user;
let jwtToken;
let approvedTmp = []
let unapprovedTmp = [];


class ProductTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products:[],
            approvedItemsList: [],
            approvedProducts:[],
            unapprovedItemsList:[],
            unapprovedProducts:[],

        };
    }



    async componentDidMount(){
        console.log("Loading tables now")
        user = await Auth.currentAuthenticatedUser();
        jwtToken = user.signInUserSession.idToken.jwtToken;
        // await this.getAllProducts();

    }

    componentWillUnmount(){
        approvedTmp = []
        unapprovedTmp=[]
    }


    //get all container data
    async getAllProducts() {
        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_PRODUCTS"} ,
            {
                headers: {
                    'Authorization': jwtToken
                }})
            .then(res => {
                console.log(res.data);
                console.log(res.data.body);
                this.setState({products: res.data.body});
                const approvedProducts = this.state.products.filter(product => product.isApprovedBySuperAdmin === true).map(product => {
                        return product;
                    }
                )
                const unApprovedProducts = this.state.products.filter(product => product.isApprovedBySuperAdmin === false).map(product => {
                        return product;
                    }
                )

                console.log(unApprovedProducts)
                this.setState({unapprovedProducts: unApprovedProducts})
                this.setState({approvedProducts: approvedProducts})
                // this.setState({ products: res.data.body }, ()=> this.createProductList());
                this.createProductList(this.state.approvedProducts, approvedTmp)
                this.setState({approvedItemsList:approvedTmp})

                this.createProductList(this.state.unapprovedProducts, unapprovedTmp)
                console.log(unapprovedTmp)
                this.setState({unapprovedItemsList:unapprovedTmp})

            })
        // this.setState({approvedItemsList:this.createProductList(this.state.approvedProducts)})
    }
    //create table and fill in container data

    async createProductList(products, tmp){
        for(var i=0; i < products.length; i++){
            tmp.push(
                <tr key={i}>
                    <th scope="row">
                        <Media className="align-items-center">
                            <Media>
                        <span className="mb-0 text-sm">
                        {products[i].id}
                        </span>
                            </Media>
                        </Media>
                    </th>
                    <td>{products[i].IoTNumber}</td>
                    <td>
                        {products[i].IoTType}
                    </td>
                    <td>
                        {products[i].IoTName}
                    </td>
                    <td>
                        {products[i].ContainerId}
                    </td>

                </tr>
            )

        }
        console.log(tmp)


    }


    render() {
        return (
            <>
                {/* Page content */}
                <Container className="mt--7">
                    {/* Table */}
                    <Row>
                        <Col className="mb-5">
                            <Card className="table-container scroll-bar">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">IoTs</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive hover>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">IOT Number</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Container Id</th>

                                    </tr>
                                    </thead>
                                    <tbody>

                                    {this.state.approvedItemsList}

                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </Container>
        </>

        );
    }
}

export default withAuthenticator(ProductTable) ;
