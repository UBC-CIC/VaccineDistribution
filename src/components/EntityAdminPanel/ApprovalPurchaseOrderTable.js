import React, {Component} from 'react';
import "./ApprovalTable.css";
import axios from 'axios';
import ViewInvoiceModal from './ViewInvoiceModal';
import NotificationMessage from "../Notification/NotificationMessage";


class ApprovalPurchaseOrderTable extends Component {

    constructor(props){
        super(props);
        this.state = {
          showInvoice: false,
          invoice:[],
          notificationOpen: false,
          notificationType: "success",
          message: ""
         
        }
        this.showInvoiceModal = this.showInvoiceModal.bind(this);
        this.hideInvoiceModal = this.hideInvoiceModal.bind(this);

    }
    showInvoiceModal = () => {
        this.setState({ showInvoice: true });
      };

      hideInvoiceModal = () => {
        this.setState({ showInvoice: false });
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
        let headerElement = ['PurchaseOrderIds', 'Invoice', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    viewInvoice = (purchaseOrderId) => {
        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_INVOICE",
  
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
            if(res.data.statusCode == 200){
                console.log(res.data.body);
                this.setState({invoice: res.data.body})
            this.showInvoiceModal()
            }
            else{
             this.showNotification("Sorry! No Invoice available", "error")

              console.log("No Invoice available")
            }
        })
      
    }


     
     renderBody = () => {
        if (this.props.purchaseOrderIds.length >0){
         const filterEntity = this.props.purchaseOrderIds//.filter(request => request.isAccepted == false)//.filter(entity => entity.ScEntityTypeCode != 1 )
       
            return (
                <tr key={filterEntity[0]}>
                    <td>{filterEntity[0]}</td>
                    <td> <button className='buttonInvoice' onClick={this.viewInvoice.bind(this,filterEntity[0])}>Invoice</button></td>
                    <ViewInvoiceModal show={this.state.showInvoice} handleClose={this.hideInvoiceModal} invoice={this.state.invoice}>
          <p>View Invoice Modal</p>
        </ ViewInvoiceModal>
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approvePurchaseOrder.bind(this, filterEntity[0])}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.denyPurchaseOrder.bind(this, filterEntity[0])}>Deny</button>
                    </td>
                </tr>
            )
        }
        else{
            return(<tr><td>No Purchase Order</td></tr>)
        }
        
    }



     render(){
        return (
            <>
             <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
                <h1 id='title'>Approval Purchase Order Table</h1>
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

export default ApprovalPurchaseOrderTable
