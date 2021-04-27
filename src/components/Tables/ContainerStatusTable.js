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
import {API, graphqlOperation} from 'aws-amplify'
import {listContainers} from '../../graphql/queries';
import {Card, CardHeader, Container, Media, Row, Table,} from "reactstrap";
import {withAuthenticator} from '@aws-amplify/ui-react';

let containerID = [];
let containerTemp = [];
let containerHumidity = [];
let containerDate = [];
let items = [];
let temp = []
let containerData = []

class ContainerStatusTable extends Component {

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
            const containers = await API.graphql(graphqlOperation(listContainers))
            containerData = containers.data.listContainers.items
            console.log('containers:', containers)
            this.setState({
                containers: containers.data.listContainers.items
            }, () => this.createContainerList())
        } catch (err) {
            console.log('error fetching containers...', err)
        }
    }

    //create table and fill in container data
    async createContainerList(){
        console.log("in create container list")
        containerData.forEach(element => {
            containerID.push(element.name);
            containerTemp.push(element.currentTemperature);
            containerHumidity.push(element.currentHumidity);
            let date = new Date(element.updatedAt).toLocaleTimeString()
            containerDate.push(date)
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
                        {containerData[i].name}
                        </span>
                            </Media>
                        </Media>
                    </th>
                    <td>{containerData[i].currentTemperature}  °C</td>
                    <td>
                        {containerData[i].currentHumidity} %
                    </td>
                    <td>
                        {containerData[i].currentLat + " , " + containerData[i].currentLng}
                    </td>
                    <td>
                        {containerDate[i]}
                    </td>
                </tr>
            )
        }
        this.setState({itemsList:items})

        console.log(containerData)

    }


    render() {
        return (
            <Container className="mt--7">
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Sensor Data</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Container</th>
                                    <th scope="col">Temperature </th>
                                    <th scope="col">Humidity</th>
                                    <th scope="col">Location [Lat,Lng] </th>
                                    <th scope="col">Update Time</th>
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

        );
    }
}

export default withAuthenticator(ContainerStatusTable) ;
