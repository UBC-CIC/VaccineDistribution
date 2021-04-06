import React, { Component } from 'react';
import "./ApprovalTable.css";
import axios from 'axios'


const URL = 'https://jsonplaceholder.typicode.com/users'

class ApprovalJoinRequestEntityTable extends Component {



     renderHeader = () => {
        let headerElement = ['Identification Code', 'Entity Name', 'Email', 'Code Type', 'code', 'operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterEntity = this.props.entity.filter(entity => entity.ScEntityTypeCode != 1 )
        return filterEntity && filterEntity.map(({ ScEntityIdentificationCode, ScEntityName, ScEntityContact, ScEntityIdentificationCodeType, ScEntityTypeCode }) => {
            return (
                <tr key={ScEntityIdentificationCode}>
                    <td>{ScEntityIdentificationCode}</td>
                    <td>{ScEntityName}</td>
                    <td>{ScEntityContact.Email}</td>
                    <td>{ScEntityIdentificationCodeType}</td>
                    <td>{ScEntityTypeCode}</td>
                    <td className='opration'>
                        <button className='buttonApproval' onClick={this.props.removeEntityData.bind(this, ScEntityIdentificationCode)}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.removeEntityData.bind(this, ScEntityIdentificationCode)}>Deny</button>
                    </td>
                </tr>
            )
        })
    }



     render(){
        return (
            <>
                <h1 id='title'>Approval Join Request to Entity Table</h1>
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

export default ApprovalJoinRequestEntityTable
