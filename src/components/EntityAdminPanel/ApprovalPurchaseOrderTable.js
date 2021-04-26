import React, {Component} from 'react';
import "./ApprovalTable.css";


class ApprovalPurchaseOrderTable extends Component {



     renderHeader = () => {
        let headerElement = ['PurchaseOrderIds', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterEntity = this.props.purchaseOrderIds//.filter(request => request.isAccepted == false)//.filter(entity => entity.ScEntityTypeCode != 1 )
        
            return (
                <tr key={filterEntity[0]}>
                    <td>{filterEntity[0]}</td>
                    
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approvePurchaseOrder.bind(this, filterEntity[0])}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.denyPurchaseOrder.bind(this, filterEntity[0])}>Deny</button>
                    </td>
                </tr>
            )
        
    }



     render(){
        return (
            <>
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
