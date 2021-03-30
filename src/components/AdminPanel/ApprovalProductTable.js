import React, { Component } from 'react';
import "./ApprovalTable.css";
import axios from 'axios'


const URL = 'https://jsonplaceholder.typicode.com/users'

class ApprovalProductTable extends Component {



     renderHeader = () => {
        let headerElement = ['Product Code', 'Product Name', 'Product Manufacturer ', 'Product tariff number', 'operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
        return this.props.employees && this.props.employees.map(({ id, name, email, phone }) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td className='opration'>
                        <button className='buttonApproval' onClick={this.props.removeData.bind(this, id)}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.removeData.bind(this, id)}>Deny</button>
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
