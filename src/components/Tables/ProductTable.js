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
import {Card, CardHeader, Col, Container, Media, Row, Table} from "reactstrap";
// core components
import {withAuthenticator} from '@aws-amplify/ui-react';
import axios from 'axios';

//Amplify.configure(awsExports)


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
        await this.getAllProducts();

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
                        {products[i].ProductCode}
                        </span>
                            </Media>
                        </Media>
                    </th>
                    <td>{products[i].ProductName}</td>
                    <td>
                        {products[i].ProductPrice}
                    </td>
                    <td>
                        {products[i].MinimumSellingAmount}
                    </td>
                    <td>
                        {products[i].ProductsPerContainer}
                    </td>
                    <td>
                        {products[i].ProductStorage.LowThreshTemp+  " to " +
                            products[i].ProductStorage.HighThreshTemp + " °C"}
                    </td>
                    <td>

                        {products[i].ProductStorage.HighThreshHumidity+ "%"}
                    </td>
                    <td>
                        {products[i].ProductHSTarriffNumber}
                    </td>

                    <td>
                        {products[i].ManufacturerId}
                    </td>
                    <td>
                        {products[i].BatchTableId}
                    </td>

                </tr>
            )

        }
        console.log(tmp)


    }


    render() {
        return (
            <>
                <Container className="mt--7">
                    <Row>
                        <Col className="mb-5">
                            <Card className="table-container scroll-bar">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">Approved Products</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive hover>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Units/Container</th>
                                        <th scope="col">Expiry</th>
                                        <th scope="col">Storage Temperature range</th>
                                        <th scope="col">Storage Max humidity</th>
                                        <th scope="col">HS Tariff Number</th>
                                        <th scope="col">Manufacturer Id</th>
                                        <th scope="col">BatchTable Id</th>

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
                <Container className="mt--12">
                    <Row>
                        <Col className="mb-5">
                            <Card className="table-container scroll-bar">
                                <CardHeader className="border-0">
                                    <h3 className="mb-0">Unapproved Products</h3>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive hover>
                                    <thead className="thead-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Units/Container</th>
                                    <th scope="col">Expiry</th>
                                    <th scope="col">Storage Temperature range</th>
                                    <th scope="col">Storage Max humidity</th>
                                    <th scope="col">HS Tariff Number</th>
                                    <th scope="col">Manufacturer Id</th>
                                    <th scope="col">BatchTable Id</th>

                                </tr>
                                </thead>
                                <tbody>

                                {this.state.unapprovedItemsList}

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
