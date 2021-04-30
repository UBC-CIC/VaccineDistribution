import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import {Button, ListGroup, ListGroupItem} from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import ConnectUserModal from "../Modal/ConnectUserModal";
import JoiningRequestEntityModal from "../Modal/JoiningRequestEntityModal";
import RegisterProductModal from "../Modal/RegisterProductModal";
import CreateBatchModal from "../Modal/CreateBatchModal";
import CreateManufacturerOrderModal from "../Modal/CreateManufacturerOrderModal";
import InitiateShipmentManufacturerModal from "../Modal/InitiateShipmentManufacturerModal";
import InitiateShipmentDistributorModal from "../Modal/InitiateShipmentDistributorModal";
import PropTypes from 'prop-types';
import {StepLabel} from "@material-ui/core";
import {API, Auth, graphqlOperation} from "aws-amplify";
import axios from "axios";
import {createLinkUser, updateContainer} from "../../graphql/mutations";
import {listContainers, listLinkUsers} from "../../graphql/queries";
import CreateExportPickupModal from "../Modal/CreateExportPickupModal";
import CreateDistributorPurchaseOrderModal from "../Modal/CreateDistributorPurchaseOrderModal";
import CreateApproveDeliveryModal from "../Modal/CreateApproveDeliveryModal";
import CreateSetPriceAndAmountModal from "../Modal/CreateSetPriceAndAmountModal";
import CreateLocalTransportModal from "../Modal/CreateLocalTransportModal";

const styles = theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    overflow: "scroll",
});
let user;
let jwtToken;


class HomeStepper extends React.Component {
    getSteps() {
        return ['User and Entity registration', 'Product', 'Order', 'Shipping'];
    }

    constructor(props) {
        super(props);
        const steps = this.getSteps()
        this.state = {
            activeStep:0,
            steps: steps,
            showRegisterEntity: false,
            showRequestJoinEntity: false,
            showConnectUser: false,
            showRegisterProduct: false,
            showCreateBatch: false,
            showCreateManufacturerOrder: false,
            showCreateDistributorPurchaseOrder: false,
            showInitiateShipmentManufacturer: false,
            showInitiateShipmentDistributor: false,
            showApproveDelivery: false,
            showExportPickup: false,
            showLocalTransport: false,
            showSetPriceAndAmount: false,



            showRegisterIOT:false,
            showLinkIOT:false,

            userEmail: '',
            userPhone: '',
            userSub: '',
            ScEntityId:'',
            entity: [],
            filterEntityData: [],
            filterCarrierEntityData: [],
            cognitoUserId: '',
            qldbPersonId: '',

            allMcgRequest:[],
            currentScEntity:[],
            products:[],
            filterProductData: [],
            purchaseOrderIds:[],
            pickUpRequestIds: [],
            containerIds: [],
            containers: [],
            containerOptions: [],


        };


        this.showRegisterEntityModal = this.showRegisterEntityModal.bind(this);
        this.showRequestJoinModal = this.showRequestJoinModal.bind(this);
        this.showConnectUserModal = this.showConnectUserModal.bind(this);
        this.showRegisterProductModal = this.showRegisterProductModal.bind(this);
        this.showCreateBatchModal = this.showCreateBatchModal.bind(this);
        this.showCreateManufacturerOrderModal = this.showCreateManufacturerOrderModal.bind(this);
        this.showCreateDistributorPurchaseOrderModal = this.showCreateDistributorPurchaseOrderModal.bind(this);

        this.showInitiateShipmentManufacturerModal = this.showInitiateShipmentManufacturerModal.bind(this);
        this.showInitiateShipmentDistributorModal = this.showInitiateShipmentDistributorModal.bind(this);
        this.showApproveDeliveryModal = this.showApproveDeliveryModal.bind(this);
        this.showExportPickupModal = this.showExportPickupModal.bind(this);
        this.showLocalTransportModal = this.showLocalTransportModal.bind(this);
        this.showSetPriceAndAmountModal = this.showSetPriceAndAmountModal.bind(this);




        this.hideRegisterEntityModal = this.hideRegisterEntityModal.bind(this);
        this.hideRequestJoinModal = this.hideRequestJoinModal.bind(this);
        this.hideConnectUserModal = this.hideConnectUserModal.bind(this);
        this.hideRegisterProductModal = this.hideRegisterProductModal.bind(this);
        this.hideCreateBatchModal = this.hideCreateBatchModal.bind(this);
        this.hideCreateManufacturerOrderModal = this.hideCreateManufacturerOrderModal.bind(this);
        this.hideCreateDistributorPurchaseOrderModal = this.hideCreateDistributorPurchaseOrderModal.bind(this);

        this.hideInitiateShipmentManufacturerModal = this.hideInitiateShipmentManufacturerModal.bind(this);
        this.hideInitiateShipmentDistributorModal = this.hideInitiateShipmentDistributorModal.bind(this);
        this.hideLocalTransportModal = this.hideLocalTransportModal.bind(this);
        this.hideSetPriceAndAmountModal = this.hideSetPriceAndAmountModal.bind(this);


        this.showRegisterIOTModal = this.showRegisterIOTModal.bind(this)
        this.hideRegisterIOTModal = this.hideRegisterIOTModal.bind(this)
        this.showLinkIOTModal = this.showLinkIOTModal.bind(this)
        this.hideLinkIOTModal = this.hideLinkIOTModal.bind(this)

    }



    async componentDidMount(){
        console.log("Loading Auth token")
        user = await Auth.currentAuthenticatedUser();
        jwtToken = user.signInUserSession.idToken.jwtToken;
        this.setState({userEmail: user.attributes.email});
        this.setState({userPhone: user.attributes.phone_number});
        this.setState({userSub: user.attributes.sub});
        console.log(user.attributes.email);
        console.log(user)
        console.log('user attributes: ', user.attributes);
        localStorage.setItem('cognitoUserId', this.state.userSub);

        await this.getEntityData();
        await this.getContainers();

        await this.getCognitoUserId()
        await this.getQldbPersonId()
        await this.getYourScEntityId()

        await this.getAllProducts();
        await this.getPurchaseOrder()



    }
    //Display Modal form for user register in QLDB
    showRegisterEntityModal = () => {
        this.setState({ showRegisterEntity: true });
    };
    showRequestJoinModal = () => {
        this.setState({ showRequestJoinEntity: true });
    };
    showConnectUserModal = () => {
        this.setState({ showConnectUser: true });
    };
    showRegisterProductModal = () => {
        this.setState({ showRegisterProduct: true });
    };

    showCreateBatchModal = () => {
        this.setState({ showCreateBatch: true });
    };

    showCreateManufacturerOrderModal = () => {
        this.setState({ showCreateManufacturerOrder: true });
    };
    showCreateDistributorPurchaseOrderModal = () => {
        this.setState({ showCreateDistributorPurchaseOrder: true });
    };

    showInitiateShipmentManufacturerModal = () => {
        this.setState({ showInitiateShipmentManufacturer: true });
    };

    showInitiateShipmentDistributorModal = () => {
        this.setState({ showInitiateShipmentDistributor: true });
    };

    showApproveDeliveryModal = () => {
        this.setState({ showApproveDelivery: true });
    };

    showExportPickupModal = () => {
        this.setState({ showExportPickup: true });
    };

    showLocalTransportModal = () => {
        this.setState({ showLocalTransport: true });
    };

    showSetPriceAndAmountModal = () => {
        this.setState({ showSetPriceAndAmount: true });
    };



    hideRegisterEntityModal = () => {
        this.setState({ showRegisterEntity: false });
    };
    hideRequestJoinModal = () => {
        this.setState({ showRequestJoinEntity: false });
    };

    hideConnectUserModal = () => {
        this.setState({ showConnectUser: false });
    };
    hideRegisterProductModal = () => {
        this.setState({ showRegisterProduct: false });
    };

    hideCreateBatchModal = () => {
        this.setState({ showCreateBatch: false });
    };

    hideCreateManufacturerOrderModal = () => {
        this.setState({ showCreateManufacturerOrder: false });
    };

    hideCreateDistributorPurchaseOrderModal = () => {
        this.setState({ showCreateDistributorPurchaseOrder: false });
    };

    hideInitiateShipmentManufacturerModal = () => {
        this.setState({ showInitiateShipmentManufacturer: false });
    };
    hideInitiateShipmentDistributorModal = () => {
        this.setState({ showInitiateShipmentDistributor: false });
    };
    hideApproveDeliveryModal = () => {
        this.setState({ showApproveDelivery: false });
    };

    hideExportPickupModal = () => {
        this.setState({ showExportPickup: false });
    };

    hideLocalTransportModal = () => {
        this.setState({ showLocalTransport: false });
    };

    hideSetPriceAndAmountModal = () => {
        this.setState({ showSetPriceAndAmount: false });
    };

    showRegisterIOTModal = () => {
        this.setState({ showRegisterIOT: true });
    };

    hideRegisterIOTModal = () => {
        this.setState({ showRegisterIOT: false });
    };

    showLinkIOTModal = () => {
        this.setState({ showLinkIOT: true });
    };

    hideLinkIOTModal = () => {
        this.setState({ showLinkIOT: false });
    };

//Get all the Entities from "GET_ALL_ENTITIES" operation
    async getEntityData() {

        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_SCENTITIES"} ,
            {
                headers: {
                    //'Authorization': jwtToken
                }})
            .then(res => {
                console.log(res.data);
                console.log(res.data.body);
                this.setState({entity:res.data.body});
                /*
                        const entityData = this.state.entity.map( function(entity) {
                          if( entity.isApprovedBySuperAdmin === true ){
                              var info = { "text": entity.ScEntityName,
                                           "id": entity.ScEntityIdentificationCode
                                          }
                              return info;
                                        }

                         })
                         */
                const entityData = this.state.entity.filter( entity => entity.isApprovedBySuperAdmin === true).map(entity =>
                    {
                        var info = { "text": entity.ScEntityName,
                            "id": entity.ScEntityIdentificationCode
                        }
                        return info;
                    }

                )
                console.log("EntityData", entityData)
                this.setState({filterEntityData: entityData})

                // Filter Carrier Entity Data
                const carrierEntityData = this.state.entity.filter( entity => entity.isApprovedBySuperAdmin === true && entity.ScEntityTypeCode === '3').map(entity =>
                    {
                        var infoCarrier = { "text": entity.ScEntityName,
                            "id": entity.id
                        }
                        return infoCarrier;
                    }

                )
                console.log("CarrierEntityData", carrierEntityData)
                this.setState({filterCarrierEntityData: carrierEntityData})
                //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
            })
    }

    //Get all the products from "GET_ALL_PRODUCTS" operation
    async getAllProducts() {

        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_PRODUCTS"} ,
            {
                headers: {
                    //'Authorization': jwtToken
                }})
            .then(res => {
                console.log(res.data);
                console.log(res.data.body);
                this.setState({products:res.data.body});
                const productsData = this.state.products.filter( product => product.isApprovedBySuperAdmin === true).map(product =>
                    {
                        var info = { "text": product.ProductName,
                            "id": product.ProductId
                        }
                        return info;
                    }

                )
                console.log("Products Data", productsData)
                this.setState({filterProductData: productsData})
            })
    }

    async getCognitoUserId() {
        console.log("Loading Auth token")
        user = await Auth.currentAuthenticatedUser();
        jwtToken = user.signInUserSession.idToken.jwtToken;
        this.setState({cognitoUserId: user.attributes.sub})

        console.log(this.state.cognitoUserId)
        localStorage.setItem('cognitoUserId', this.state.cognitoUserId);
    }

    async getQldbPersonId() {
        console.log(this.state.qldbPersonId)
        try {
            console.log("Loading Auth token")
            user = await Auth.currentAuthenticatedUser();
            jwtToken = user.signInUserSession.idToken.jwtToken;
            this.setState({cognitoUserId: user.attributes.sub})

            const currentReadings = await API.graphql(graphqlOperation(listLinkUsers, {filter:{cognitoUserId: {eq: this.state.cognitoUserId}}}))

            console.log('current readings: ', currentReadings)
            this.setState({
                qldbPersonId: currentReadings.data.listLinkUsers.items[0].qldbPersonId
            })
            localStorage.setItem('qldbPersonId', this.state.qldbPersonId);
        } catch (err) {
            console.log('error fetching LinkUser...', err)
        }
    }


    async getYourScEntityId() {

        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_YOUR_SCENTITY",

                PersonId: localStorage.getItem("qldbPersonId")

            } ,
            {
                headers: {
                    //'Authorization': jwtToken
                }})
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log(res.data.body);
                this.setState({currentScEntity:res.data.body});
                //console.log("EntityId", this.state.currentScEntity[0].id)
                if(this.state.currentScEntity[0]){
                    this.setState({ScEntityId:this.state.currentScEntity[0].id});
                    this.setState({pickUpRequestIds: this.state.currentScEntity[0].PickUpRequests})
                    localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);
                }
            })
    }


    async getPurchaseOrder() {

        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_PURCHASE_ORDER_IDS",

                PersonId: localStorage.getItem("qldbPersonId"),
                FetchType: "Recieved"

            } ,
            {
                headers: {
                    //'Authorization': jwtToken
                }})
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log(res.data.body);
                if(res.data.statusCode === 200){
                    this.setState({purchaseOrderIds: res.data.body.PurchaseOrderIds});
                }
                else{
                    console.log("No Purchase Orders")
                }
            })


        //this.setState({entity: response.data})
    }



    LinkCognito_QLDBUser = (qldbPersonId) => {

        this.setState({qldbPersonId: qldbPersonId});

        let linkUser = {
            cognitoUserId: this.state.userSub,
            qldbPersonId: qldbPersonId
        }
        console.log(linkUser)

        try {
            API.graphql(graphqlOperation(createLinkUser, {input: linkUser}));
            console.log('Created Link User!')
        }
        catch(err){
            console.log(err)
        }
    }
    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type,
            notificationOpen:true,
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:false,
            })
        }.bind(this),7000);
    }

    async getContainers() {
        let containerFiltered = []
        try {
            let containerList = await API.graphql(graphqlOperation(listContainers))
            console.log('containers:', containerList)
            this.setState({
                containers: containerList.data.listContainers.items
            })
        } catch (err) {
            console.log('error fetching containers...', err)
        }
        this.state.containers.forEach(element => {
            containerFiltered.push({id: element.id, name: element.name})
        });
        this.setState({
            containerOptions: containerFiltered
        })
        console.log(containerFiltered)
    }

    LinkQLDBContainerToDynamo = (ContainerIds) => {

        this.setState({containerIds: ContainerIds});

        let linkContainer = {
            id:123,
            qldbContainerId: this.state.containerIds[0],
        }
        console.log(linkContainer)

        try {
            API.graphql(graphqlOperation(updateContainer, {input: linkContainer}));
            console.log('Updated Link Container!')
            alert('Updated Link Container!')
        }
        catch(err){
            console.log("Error updating Link Container", err);
        }

        this.hideInitiateShipmentManufacturerModal();

    }

     getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <div>
                        <ListGroup data-toggle="checklist" flush>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 1. Register User and Entity</h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showConnectUserModal}
                                        >
                                            Register User and Entity </Button>
                                        <ConnectUserModal show={this.state.showConnectUser} handleClose={this.hideConnectUserModal} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser} >
                                            <p>Register User and Entity Modal</p>
                                        </ConnectUserModal>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 2. Joining Request to Entity</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showRegisterEntityModal}
                                        > Joining Request </Button>

                                        <JoiningRequestEntityModal show={this.state.showRegisterEntity} handleClose={this.hideRegisterEntityModal} entity={this.state.entity} filterEntityData={this.state.filterEntityData} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser}>

                                        </JoiningRequestEntityModal>
                                    </div>
                                </div>
                            </ListGroupItem>
                        </ListGroup>

                    </div>
                );
            case 1:
                return (
                    <div>
                        <ListGroup data-toggle="checklist" flush>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 3. Register a Product</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showRegisterProductModal}
                                        > Register Product </Button>

                                        <RegisterProductModal show={this.state.showRegisterProduct} handleClose={this.hideRegisterProductModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.ScEntityId} >
                                            <p>Register Product Modal</p>
                                        </ RegisterProductModal>

                                    </div>
                                </div>
                            </ListGroupItem>


                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 4. Create a Product Batch</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showCreateBatchModal}
                                        > Create Batch </Button>
                                        <CreateBatchModal show={this.state.showCreateBatch} handleClose={this.hideCreateBatchModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products}>
                                            <p>Create Batch Modal</p>
                                        </ CreateBatchModal>
                                    </div>
                                </div>
                            </ListGroupItem>

                        </ListGroup>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <ListGroup data-toggle="checklist" flush>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 5. Create Manufacturer Order
                                            </h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showCreateManufacturerOrderModal}
                                        > Create Manufacturer Order </Button>
                                        <CreateManufacturerOrderModal show={this.state.showCreateManufacturerOrder} handleClose={this.hideCreateManufacturerOrderModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId}
                                                                      filterProductData={this.state.filterProductData} products={this.state.products}>
                                            <p>Create Manufacturer Order</p>
                                        </ CreateManufacturerOrderModal>
                                    </div>
                                </div>
                            </ListGroupItem>


                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 6. Initiate Shipment for
                                            Manufacturer</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showInitiateShipmentManufacturerModal}
                                        > Initiate Shipment Manufacturer </Button>
                                        <InitiateShipmentManufacturerModal show={this.state.showInitiateShipmentManufacturer} handleClose={this.hideInitiateShipmentManufacturerModal} entity={this.state.entity} filterCarrierEntityData={this.state.filterCarrierEntityData} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} purchaseOrderIds={this.state.purchaseOrderIds}  LinkQLDBContainerToDynamo = {this.LinkQLDBContainerToDynamo}>
                                            <p>Initiate Shipment Manufacturer</p>
                                        </ InitiateShipmentManufacturerModal>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 7. Export Pickup </h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showExportPickupModal}> Export Pickup </Button>


                                        <CreateExportPickupModal show={this.state.showExportPickup} handleClose={this.hideExportPickupModal} entity={this.state.entity} filterCarrierEntityData={this.state.filterCarrierEntityData} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} purchaseOrderIds={this.state.purchaseOrderIds} >
                                            <p>Export Pickup</p>
                                        </ CreateExportPickupModal>
                                    </div>
                                </div>
                            </ListGroupItem>

                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 8. Initiate Shipment for
                                            Distributor</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showInitiateShipmentDistributorModal}
                                        > Initiate Shipment Distributor </Button>
                                        <InitiateShipmentDistributorModal show={this.state.showInitiateShipmentDistributor} handleClose={this.hideInitiateShipmentDistributorModal} entity={this.state.entity} filterCarrierEntityData={this.state.filterCarrierEntityData} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} purchaseOrderIds={this.state.purchaseOrderIds} >
                                            <p>Initiate Shipment Distributor Modal</p>
                                        </ InitiateShipmentDistributorModal>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 9. Create Distributor Purchase Order</h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showCreateDistributorPurchaseOrderModal}>  Create Distributor Purchase Order </Button>


                                        <CreateDistributorPurchaseOrderModal show={this.state.showCreateDistributorPurchaseOrder} handleClose={this.hideCreateDistributorPurchaseOrderModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products}>
                                            <p>Create Distributor Purchase Order Modal</p>
                                        </ CreateDistributorPurchaseOrderModal>
                                    </div>
                                </div>
                            </ListGroupItem>



                        </ListGroup>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <ListGroup data-toggle="checklist" flush>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 10. Approve Product Delivery</h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showApproveDeliveryModal}>  Approve Delivery </Button>


                                        <CreateApproveDeliveryModal show={this.state.showApproveDelivery} handleClose={this.hideApproveDeliveryModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} purchaseOrderIds={this.state.purchaseOrderIds} >
                                            <p>Approve Product Delivery Modal</p>
                                        </ CreateApproveDeliveryModal>
                                    </div>
                                </div>
                            </ListGroupItem>

                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 11. Set Price and Selling Amount (By Distributer)</h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showSetPriceAndAmountModal}>  Set Price-Amount </Button>


                                        <CreateSetPriceAndAmountModal show={this.state.showSetPriceAndAmount} handleClose={this.hideSetPriceAndAmountModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products} >
                                            <p>Set Price and Selling Amount (By Distributer)</p>
                                        </ CreateSetPriceAndAmountModal>
                                    </div>
                                </div>
                            </ListGroupItem>




                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">

                                    <div className="checklist-info">

                                        <h5 className="checklist-title mb-0">Step 12. Create Local Transport</h5>
                                        <Button className="float-right"
                                                color="primary"
                                                onClick={this.showLocalTransportModal}> Create Local Transport</Button>


                                        <CreateLocalTransportModal show={this.state.showLocalTransport} handleClose={this.hideLocalTransportModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} pickUpRequestIds={this.state.pickUpRequestIds} entity={this.state.entity} >
                                            <p>Create Local Transport Modal</p>
                                        </ CreateLocalTransportModal>
                                    </div>
                                </div>
                            </ListGroupItem>

                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-info">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">
                                            Step 13. Request the vaccine container
                                        </h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showRequestVaccineContainerModal}
                                        > Request Container </Button>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-danger">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 14. Accept the request</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showAcceptRequestModal}
                                        > Accept Request </Button>
                                    </div>
                                </div>
                            </ListGroupItem>
                            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                                <div className="checklist-item checklist-item-success">
                                    <div className="checklist-info">
                                        <h5 className="checklist-title mb-0">Step 15. Receive the Vaccine order</h5>
                                        <Button className="float-right"
                                                color="primary"
                                            onClick={this.showReceiveVaccineOrderModal}
                                        > Receive Vaccine Order </Button>
                                    </div>
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    }


    // Update the active state according to the next button press
    handleNext = (event) => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1
        });
    };

    // Similar for back and reset buttons
    handleBack= (event) =>{
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep - 1,
        });
    };

    handleStep(index){
        this.setActiveStep(index)
    }
        setActiveStep(index){
        // this.setState({
        //     activeStep: index,
        // });
        console.log(index)

    }



    render() {
        const { classes } = this.props;
        const { activeStep, steps } = this.state;
        const reachMaxSteps = activeStep === 3



        // Notice that the content below isn't in the Stepper, it's in its own pane underneath
        return (
            <div className={classes.root}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel  >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                    <Typography className={classes.instructions}component={'span'} variant={'body2'}>
                        {this.getStepContent(activeStep)}
                    </Typography>
            </div>
                <div className={"card-footer"}>
                    <Button disabled={activeStep === 0} onClick={this.handleBack} >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                        disabled={reachMaxSteps}
                    >
                        Next
                    </Button>

                </div>

            </div>

        );
    }
}
HomeStepper.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeStepper);