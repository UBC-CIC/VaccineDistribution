import React, { Component } from 'react';
import "./ApprovalTable.css";
import axios from 'axios'
import FusionTablesLayer from 'react-google-maps/lib/components/FusionTablesLayer';


const URL = 'https://jsonplaceholder.typicode.com/users'

class ApprovalEntityTable extends Component {



     renderHeader = () => {
        let headerElement = ['Identification Code', 'Entity Name', 'Email', 'Code Type', 'code', 'operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterEntity = this.props.entity.filter(entity => entity.ScEntityTypeCode != 1 && entity.isApprovedBySuperAdmin == false )
        return filterEntity && filterEntity.map(({ ScEntityIdentificationCode, ScEntityName, ScEntityContact, ScEntityIdentificationCodeType, ScEntityTypeCode, PersonIds}) => {
            return (
                <tr key={ScEntityIdentificationCode}>
                    <td>{ScEntityIdentificationCode}</td>
                    <td>{ScEntityName}</td>
                    <td>{ScEntityContact.Email}</td>
                    <td>{ScEntityIdentificationCodeType}</td>
                    <td>{ScEntityTypeCode}</td>
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approveEntityData.bind(this, ScEntityIdentificationCode, PersonIds[0])}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.approveEntityData.bind(this, ScEntityIdentificationCode,PersonIds[0])}>Deny</button>
                    </td>
                </tr>
            )
        })
    }



     render(){
        return (
            <>
                <h1 id='title'>Approval MCG-Request Entity Table</h1>
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

export default ApprovalEntityTable
