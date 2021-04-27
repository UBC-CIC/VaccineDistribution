import React, {Component} from 'react'
import {listContainers, listLinkUsers} from '../graphql/queries';
// reactstrap components
import {Button, Container, ListGroup, ListGroupItem} from "reactstrap";
// core components
import {API, Auth, graphqlOperation} from 'aws-amplify'
import ConnectUserModal from "components/Modal/ConnectUserModal";
import JoiningRequestEntityModal from "components/Modal/JoiningRequestEntityModal";
import RegisterProductModal from "components/Modal/RegisterProductModal";
import CreateBatchModal from "components/Modal/CreateBatchModal";
import CreateManufacturerOrderModal from "components/Modal/CreateManufacturerOrderModal";
import InitiateShipmentManufacturerModal from "components/Modal/InitiateShipmentManufacturerModal";
import InitiateShipmentDistributorModal from "components/Modal/InitiateShipmentDistributorModal";
import axios from 'axios';
import {createLinkUser} from '../graphql/mutations';
import Header from "../components/Headers/Header";


let user;
let jwtToken;

class ViewSupplyChainFlow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showRegisterEntity: false,
            showRequestJoinEntity: false,
            showConnectUser: false,
            showRegisterProduct: false,
            showCreateBatch: false,
            showCreateManufacturerOrder: false,
          showInitiateShipmentManufacturer: false,
          showInitiateShipmentDistributor: false,
            showRegisterIOT:false,
            showLinkIOT:false,

            userEmail: '',
            userPhone: '',
            userSub: '',
            ScEntityId: '',
            entity: [],
            filterEntityData: [],
            cognitoUserId: '',
            qldbPersonId: '',
            containers: [],
            containerOptions: [],
            currentScEntity: {},
            products: [],
            filterProductData: [],

        };
        
        
        this.showRegisterEntityModal = this.showRegisterEntityModal.bind(this);
        this.showRequestJoinModal = this.showRequestJoinModal.bind(this);
        this.showConnectUserModal = this.showConnectUserModal.bind(this);
        this.showRegisterProductModal = this.showRegisterProductModal.bind(this);
        this.showCreateBatchModal = this.showCreateBatchModal.bind(this);
        this.showCreateManufacturerOrderModal = this.showCreateManufacturerOrderModal.bind(this);
        this.showInitiateShipmentManufacturerModal = this.showInitiateShipmentManufacturerModal.bind(this);
        this.showInitiateShipmentDistributorModal = this.showInitiateShipmentDistributorModal.bind(this);


        this.hideRegisterEntityModal = this.hideRegisterEntityModal.bind(this);
        this.hideRequestJoinModal = this.hideRequestJoinModal.bind(this);
        this.hideConnectUserModal = this.hideConnectUserModal.bind(this);
        this.hideRegisterProductModal = this.hideRegisterProductModal.bind(this);
        this.hideCreateBatchModal = this.hideCreateBatchModal.bind(this);
        this.hideCreateManufacturerOrderModal = this.hideCreateManufacturerOrderModal.bind(this);
        this.hideInitiateShipmentManufacturerModal = this.hideInitiateShipmentManufacturerModal.bind(this);
        this.hideInitiateShipmentDistributorModal = this.hideInitiateShipmentDistributorModal.bind(this);

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

         this.getEntityData();
         this.getContainers();

         this.getCognitoUserId()
         this.getQldbPersonId()
         this.getYourScEntityId()

         this.getAllProducts();



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

  showInitiateShipmentManufacturerModal = () => {
    this.setState({ showInitiateShipmentManufacturer: true });
  };

  showInitiateShipmentDistributorModal = () => {
    this.setState({ showInitiateShipmentDistributor: true });
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

  hideInitiateShipmentManufacturerModal = () => {
    this.setState({ showInitiateShipmentManufacturer: false });
  };
  hideInitiateShipmentDistributorModal = () => {
    this.setState({ showInitiateShipmentDistributor: false });
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
        const entityData = this.state.entity.filter(entity => entity.isApprovedBySuperAdmin === true).map(entity => {
                var info = {
                    "text": entity.ScEntityName,
                    "id": entity.ScEntityIdentificationCode
                }
                return info;
            }
        )
         console.log("EntityData", entityData)
         this.setState({filterEntityData: entityData})
    })
  }

  //Get all the Entities from "GET_ALL_ENTITIES" operation
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
     localStorage.setItem('cognitoUserId', this. state.cognitoUserId);
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
        localStorage.setItem('qldbPersonId', this. state.qldbPersonId);
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
            localStorage.setItem('ScEntityId', this.state.currentScEntity[0].id);
        }
    })
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


  render() {
    return (
      <>
          <Header title={"Supply Chain Flow"}/>
        {/* Page content */}
        <Container className="mt--7" fluid>
        <ListGroup data-toggle="checklist" flush>
        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 1. Register User and Entity</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showConnectUserModal}> Register User and Entity </Button>


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
                       onClick={this.showRegisterEntityModal}> Joining Request  </Button>

                <JoiningRequestEntityModal show={this.state.showRegisterEntity} handleClose={this.hideRegisterEntityModal} entity={this.state.entity} filterEntityData={this.state.filterEntityData} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser}>
          
               </JoiningRequestEntityModal>
              </div>
            </div>
          </ListGroupItem>


          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 3. Register a Product</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showRegisterProductModal}> Register Product </Button>


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
                       onClick={this.showCreateBatchModal}> Create Batch </Button>


          <CreateBatchModal show={this.state.showCreateBatch} handleClose={this.hideCreateBatchModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products}>
          <p>Create Batch Modal</p>
        </ CreateBatchModal>

              </div>
            </div>
          </ListGroupItem>




          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 5. Create Manufacturer Order</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showCreateManufacturerOrderModal}> Create Manufacturer Order </Button>


          <CreateManufacturerOrderModal show={this.state.showCreateManufacturerOrder} handleClose={this.hideCreateManufacturerOrderModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products}>
          <p>Create Manufacturer Order Modal</p>
        </ CreateManufacturerOrderModal>
              </div>
            </div>

          </ListGroupItem>


          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 6. Initiate Shipment for Manufacturer</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showInitiateShipmentManufacturerModal}> Initiate Shipment Manufacturer </Button>


          <InitiateShipmentManufacturerModal show={this.state.showInitiateShipmentManufacturer} handleClose={this.hideInitiateShipmentManufacturerModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Initiate Shipment Manufacturer Modal</p>
        </ InitiateShipmentManufacturerModal>
              </div>
            </div>
          </ListGroupItem>
            {/*<ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">*/}
            {/*    <div className="checklist-item checklist-item-success">*/}

            {/*        <div className="checklist-info">*/}

            {/*            <h5 className="checklist-title mb-0">Register IOT device</h5>*/}
            {/*            <Button className="float-right"*/}
            {/*                    color="primary"*/}
            {/*                    onClick={this.showRegisterIOTModal}> Register IOT device </Button>*/}


            {/*            <CreateIOTModal show={this.state.showRegisterIOT} handleClose={this.hideRegisterIOTModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} filterProductData={this.state.filterProductData} products={this.state.products}>*/}
            {/*                <p>Register IOT device</p>*/}
            {/*            </ CreateIOTModal>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</ListGroupItem>*/}


            {/*<ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">*/}
            {/*    <div className="checklist-item checklist-item-success">*/}

            {/*        <div className="checklist-info">*/}

            {/*            <h5 className="checklist-title mb-0">Link IOT Device to Container</h5>*/}
            {/*            <Button className="float-right"*/}
            {/*                    color="primary"*/}
            {/*                    onClick={this.showLinkIOTModal}> Link IOT Device</Button>*/}


            {/*            <LinkIOTModal show={this.state.showLinkIOT}*/}
            {/*                          handleClose={this.hideLinkIOTModal}*/}
            {/*                          qldbPersonId={this.state.qldbPersonId}*/}
            {/*                          containers={this.state.containerOptions} >*/}
            {/*                <p>Register IOT device</p>*/}
            {/*            </ LinkIOTModal>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</ListGroupItem>*/}



            <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
                
              <div className="checklist-info">
             
                <h5 className="checklist-title mb-0">Step 7. Initiate Shipment for Distributor</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showInitiateShipmentDistributorModal}> Initiate Shipment Distributor </Button>


          <InitiateShipmentDistributorModal show={this.state.showInitiateShipmentDistributor} handleClose={this.hideInitiateShipmentDistributorModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >
          <p>Initiate Shipment Distributor Modal</p>
        </ InitiateShipmentDistributorModal>
              </div>
            </div>
          </ListGroupItem>



          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-info">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">
                Step 8. Request the vaccine container
                </h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showRequestVaccineContainerModal}> Request Container </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-danger">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">Step 9. Accept the request</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showAcceptRequestModal}> Accept Request </Button>
              </div>
            </div>
          </ListGroupItem>
          <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
            <div className="checklist-item checklist-item-success">
              <div className="checklist-info">
                <h5 className="checklist-title mb-0">Step 10. Receive the Vaccine order</h5>
                <Button className="float-right"
                        color="primary"
                       onClick={this.showReceiveVaccineOrderModal}> Receive Vaccine Order </Button>
              </div>
            </div>
          </ListGroupItem>
        </ListGroup>

        </Container>
      </>
    );
  }
}

export default (ViewSupplyChainFlow);