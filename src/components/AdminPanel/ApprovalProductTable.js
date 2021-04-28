import React, {Component} from 'react';
import "./ApprovalTable.css";


class ApprovalProductTable extends Component {

     renderHeader = () => {
        let headerElement = ['Product Code', 'Product Name', 'Product Manufacturer ', 'Product tariff number', 'operation']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

     renderBody = () => {
         const filterProducts = this.props.products.filter(product => product.isApprovedBySuperAdmin === false)
        return filterProducts && filterProducts.map(({ ProductCode, ProductName, ManufacturerId, ProductHSTarriffNumber, ProductId}) => {
            return (
                <tr key={ProductId}>
                    <td>{ProductCode}</td>
                    <td>{ProductName}</td>
                    <td>{ManufacturerId}</td>
                    <td>{ProductHSTarriffNumber}</td>
                   
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approveProductData.bind(this, ProductId)}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.removeProductData.bind(this,ProductId)}>Deny</button>
                    </td>
                </tr>
            )
        })
    }

     render(){
        return (
            <>
                <h1 id='title'>Approval Product Table</h1>
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

export default ApprovalProductTable
