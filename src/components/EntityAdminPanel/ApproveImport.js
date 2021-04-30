import React, {Component} from 'react';
import "./ApprovalTable.css";
import axios from 'axios';
import ViewApproveImportModal from './ViewApproveImportModal';
import NotificationMessage from "../Notification/NotificationMessage";


class ApproveImport extends Component {

    constructor(props){
        super(props);
        this.state = {
          showApproveImport: false,
          container:[],
          notificationOpen: false,
          notificationType: "success",
          message: ""
         
        }
        this.showApproveImportModal = this.showApproveImportModal.bind(this);
        this.hideApproveImportModal = this.hideApproveImportModal.bind(this);

    }
    showApproveImportModal = () => {
        this.setState({ showApproveImport: true });
      };

      hideApproveImportModal = () => {
        this.setState({ showApproveImport: false });
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
        let headerElement = ['PurchaseOrderIds', 'Container', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
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
            this.showApproveImportModal()
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
                    <ViewApproveImportModal show={this.state.showContainer} handleClose={this.hideContainerModal} container={this.state.container}>
          <p>View Invoice Modal</p>
        </ ViewApproveImportModal>
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approveImport.bind(this, filterEntity[0])}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.denyImport.bind(this, filterEntity[0])}>Deny</button>
                    </td>
                </tr>
            )
        }
        else{
            return(<tr><td>No Approve Import </td></tr>)
        }
        
    }



     render(){
        return (
            <>
             <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
                <h1 id='title'>Approval Import Table</h1>
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

export default ApproveImport
