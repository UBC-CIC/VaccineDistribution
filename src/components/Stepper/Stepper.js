import React, {Component} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import {Button, Container, ListGroup, ListGroupItem} from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import {Col, Row} from "react-bootstrap";
import ConnectUserModal from "../Modal/ConnectUserModal";
import JoiningRequestEntityModal from "../Modal/JoiningRequestEntityModal";
import RequestJoinEntityModal from "../Modal/RequestJoinEntityModal";
import RegisterProductModal from "../Modal/RegisterProductModal";
import CreateBatchModal from "../Modal/CreateBatchModal";
import CreateManufacturerOrderModal from "../Modal/CreateManufacturerOrderModal";
import InitiateShipmentManufacturerModal from "../Modal/InitiateShipmentManufacturerModal";
import InitiateShipmentDistributorModal from "../Modal/InitiateShipmentDistributorModal";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {StepLabel} from "@material-ui/core";

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

function getSteps() {
    return ['User and Entity registration', 'Product', 'Order', 'Shipping'];
}

function getStepContent(step) {
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
                                            // onClick={this.showConnectUserModal}
                                    >
                                        Register User and Entity </Button>
                                    {/*<ConnectUserModal*/}
                                    {/*    // show={this.state.showConnectUser} handleClose={this.hideConnectUserModal} userEmail={this.state.userEmail} userPhone={this.state.userPhone} LinkCognito_QLDBUser = {this.LinkCognito_QLDBUser} >*/}
                                    {/*    >*/}
                                    {/*    <p>Register User and Entity Modal</p>*/}
                                    {/*</ConnectUserModal>*/}
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-success">

                                <div className="checklist-info">

                                    <h5 className="checklist-title mb-0">Step 2. Joining Request to Entity</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showRegisterEntityModal}
                                    > Joining Request  </Button>

                                    {/*<JoiningRequestEntityModal*/}
                                    {/*    // show={this.state.showRegisterEntity} handleClose={this.hideRegisterEntityModal} entity={this.state.entity}*/}
                                    {/*>*/}

                                    {/*</JoiningRequestEntityModal>*/}
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-warning">
                                <div className="checklist-info">

                                    <h5 className="checklist-title mb-0">Step 3. Request to join the entity</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showRequestJoinModal}
                                    >
                                        Request join </Button>
                                    {/*<RequestJoinEntityModal*/}
                                    {/*    // show={this.state.showRequestJoinEntity} handleClose={this.hideRequestJoinModal}*/}
                                    {/*/>*/}
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

                                    <h5 className="checklist-title mb-0">Step 4. Register a Product</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showRegisterProductModal}
                                    > Register Product </Button>

                                    {/*<RegisterProductModal*/}
                                    {/*    // show={this.state.showRegisterProduct} handleClose={this.hideRegisterProductModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId} >*/}
                                    {/*>*/}
                                    {/*    <p>Register Product Modal</p>*/}
                                    {/*</ RegisterProductModal>*/}

                                </div>
                            </div>
                        </ListGroupItem>




                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">Step 5. Create a Product Batch</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showCreateBatchModal}
                                    > Create Batch </Button>
                                    {/*<CreateBatchModal*/}
                                    {/*    // show={this.state.showCreateBatch} handleClose={this.hideCreateBatchModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId}*/}
                                    {/*>*/}
                                    {/*    <p>Create Batch Modal</p>*/}
                                    {/*</ CreateBatchModal>*/}
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
                                    <h5 className="checklist-title mb-0">Step 6. Create Manufacturer Order Modal</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showCreateManufacturerOrderModal}
                                    > Create Manufacturer Order </Button>
                                    {/*<CreateManufacturerOrderModal*/}
                                    {/*    // show={this.state.showCreateManufacturerOrder} handleClose={this.hideCreateManufacturerOrderModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId}*/}
                                    {/*>*/}
                                    {/*    <p>Create Manufacturer Order Modal</p>*/}
                                    {/*</ CreateManufacturerOrderModal>*/}
                                </div>
                            </div>
                        </ListGroupItem>




                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">Step 7. Initiate Shipment for Manufacturer</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showInitiateShipmentManufacturerModal}
                                    > Initiate Shipment Manufacturer </Button>
                                    {/*<InitiateShipmentManufacturerModal*/}
                                    {/*    // show={this.state.showInitiateShipmentManufacturer} handleClose={this.hideInitiateShipmentManufacturerModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId}*/}
                                    {/*>*/}
                                    {/*    <p>Initiate Shipment Manufacturer Modal</p>*/}
                                    {/*</ InitiateShipmentManufacturerModal>*/}
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">Step 8. Initiate Shipment for Distributor</h5>
                                    <Button className="float-right"
                                            color="primary"
                                            // onClick={this.showInitiateShipmentDistributorModal}
                                    > Initiate Shipment Distributor </Button>
                                    {/*<InitiateShipmentDistributorModal*/}
                                    {/*    // show={this.state.showInitiateShipmentDistributor} handleClose={this.hideInitiateShipmentDistributorModal} qldbPersonId={this.state.qldbPersonId} manufacturerId={this.state.manufacturerId}*/}
                                    {/*>*/}
                                    {/*    <p>Initiate Shipment Distributor Modal</p>*/}
                                    {/*</ InitiateShipmentDistributorModal>*/}
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
                            <div className="checklist-item checklist-item-info">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">
                                        Step 9. Request the vaccine container
                                    </h5>
                                    <Button className="float-right"
                                            color="primary"
                                        // onClick={this.showRequestVaccineContainerModal}
                                    > Request Container </Button>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-danger">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">Step 10. Accept the request</h5>
                                    <Button className="float-right"
                                            color="primary"
                                        // onClick={this.showAcceptRequestModal}
                                    > Accept Request </Button>
                                </div>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="checklist-entry flex-column align-items-start py-4 px-4">
                            <div className="checklist-item checklist-item-success">
                                <div className="checklist-info">
                                    <h5 className="checklist-title mb-0">Step 11. Receive the Vaccine order</h5>
                                    <Button className="float-right"
                                            color="primary"
                                        // onClick={this.showReceiveVaccineOrderModal}
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

// export default function HomeStepper() {
//     const classes = useStyles();
//     const [activeStep, setActiveStep] = React.useState(0);
//     const steps = getSteps();
//
//
//     const handleStep = (step) => () => {
//         setActiveStep(step);
//     };
//
//     return (
//         <div className={classes.root}>
//             <Stepper nonLinear activeStep={activeStep}>
//                 {steps.map((label, index) => (
//                     <Step key={label}>
//                         <StepButton onClick={handleStep(index)} >
//                             {label}
//                         </StepButton>
//                     </Step>
//                 ))}
//             </Stepper>
//             <div>
//                     <Typography className={classes.instructions}>
//                         {getStepContent(activeStep)}
//                     </Typography>
//                     <div>
//                 </div>
//             </div>
//         </div>
//     );
// }
class HomeStepper extends React.Component {
    constructor(props) {
        super(props);
        const steps = getSteps()

        this.state= {
            activeStep:0,
            steps: steps
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
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel  >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                    <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                    </Typography>
                    <div>
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
        </div>

        );
    }
}
HomeStepper.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeStepper);