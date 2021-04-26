import React, {Component} from 'react';
import "./ApprovalTable.css";


class ApprovalEntityTable extends Component {



     renderHeader = () => {
        let headerElement = ['Identification Code', 'Entity Name', 'Email', 'Code Type', 'code', 'operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterEntity = this.props.entity.filter(entity => entity.ScEntityTypeCode !== 1 && entity.isApprovedBySuperAdmin === false)
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
            <div className='align-items-center'>
                <h1 id='title'>Approval MCG-Request Entity Table</h1>
                <table id='employee'>
                    <thead className={"bg-gradient-primary"}>
                        <tr>{this.renderHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ApprovalEntityTable
