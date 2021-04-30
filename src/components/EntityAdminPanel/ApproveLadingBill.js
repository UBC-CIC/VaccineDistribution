import React, {Component} from 'react';
import "./ApprovalTable.css";
import axios from 'axios';
import ViewLadingBillModal from './ViewLadingBillModal';
import NotificationMessage from "../Notification/NotificationMessage";
import { getContainer } from 'graphql/queries';


class ApproveLadingBill extends Component {

    constructor(props){
        super(props);
        this.state = {
          showLadingBill: false,
          BillOfLadingIds: [],
          container:[],
          notificationOpen: false,
          notificationType: "success",
          message: ""
         
        }
        this.showLadingBillModal = this.showLadingBillModal.bind(this);
        this.hideLadingBillModal = this.hideLadingBillModal.bind(this);
        this.getContainerDetails = this.getContainerDetails.bind(this);


    }
    showLadingBillModal = () => {
        this.setState({ showLadingBill: true });
      };

      hideLadingBillModal = () => {
        this.setState({ showLadingBill: false });
      };

      showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:true,
            })
        }.bind(this),2000);
    }


     renderHeader = () => {
        let headerElement = ['PurchaseOrderIds', 'LadingBill', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    
    getContainerDetails= (containerIds) =>{
        if (containerIds.length>0){
       
        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_CONTAINER",
      
        PersonId: localStorage.getItem("qldbPersonId"),
        ContainerId: containerIds[0]
      
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
                console.log(res.data.body);
                this.setState({BillOfLadingIds: res.data.body.BillOfLadingIds})
            
            }
            else{
              console.log("Not Approved Export")
            }
        })
    }

    }


    viewContainers = (purchaseOrderId) => {
        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_PURCHASE_ORDER",
  
        PersonId: localStorage.getItem("qldbPersonId"),
        PurchaseOrderId: purchaseOrderId
      
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
                console.log(res.data.body);
                this.setState({container: res.data.body.HighestPackagingLevelIds})
                this.getContainerDetails(res.data.body.HighestPackagingLevelIds)
            this.showLadingBillModal()
            }
            else{
             this.showNotification("Sorry! No Container available", "error")

              console.log("No container available")
            }
        })
      
    }


     
     renderBody = () => {
        if (this.props.purchaseOrderIds.length >0){
         const filterEntity = this.props.purchaseOrderIds//.filter(request => request.isAccepted == false)//.filter(entity => entity.ScEntityTypeCode != 1 )
       
            return (
                <tr key={filterEntity[0]}>
                    <td>{filterEntity[0]}</td>
                    <td> <button className='buttonInvoice' onClick={this.viewContainers.bind(this,filterEntity[0])}>Container</button></td>
                    <ViewLadingBillModal show={this.state.showLadingBill} handleClose={this.hideLadingBillModal} container={this.state.container} BillOfLadingIds={this.state.BillOfLadingIds}>
          <p>View LadingBill Modal</p>
        </ ViewLadingBillModal>
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approveLadingBill.bind(this, filterEntity[0])}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.denyLadingBill.bind(this, filterEntity[0])}>Deny</button>
                    </td>
                </tr>
            )
        }
        else{
            return(<tr><td>No Approve Lading Bill </td></tr>)
        }
        
    }



     render(){
        return (
            <>
             <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
                <h1 id='title'>Approval Lading Bill</h1>
                <table id='employee'>
                    <thead>
                        <tr>{this.renderHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </>
        )
    }
}

export default ApproveLadingBill
