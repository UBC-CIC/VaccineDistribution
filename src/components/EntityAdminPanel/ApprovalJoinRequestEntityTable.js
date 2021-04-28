import React, { Component } from 'react';
import "./ApprovalTable.css";
import axios from 'axios'


const URL = 'https://jsonplaceholder.typicode.com/users'

class ApprovalJoinRequestEntityTable extends Component {



     renderHeader = () => {
        let headerElement = ['JoiningRequestNumber', 'SenderEmployeeId','JoiningRequestId', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterEntity = this.props.allJoiningRequest.filter(request => request.isAccepted == false)//.filter(entity => entity.ScEntityTypeCode != 1 )
        return filterEntity && filterEntity.map(({ JoiningRequestNumber, SenderEmployeeId, SenderPersonId, ScEntityId, isAccepted, JoiningRequestId }) => {
            return (
                <tr key={SenderEmployeeId}>
                    <td>{JoiningRequestNumber}</td>
                    <td>{SenderEmployeeId}</td>
                                       
                    <td>{JoiningRequestId}</td>
                    <td className='operation'>
                        <button className='buttonApproval' onClick={this.props.approveEntityData.bind(this, JoiningRequestId, SenderPersonId)}>Approve</button>
                        <button className='buttonDeny' onClick={this.props.denyEntityData.bind(this, JoiningRequestId, SenderPersonId)}>Deny</button>
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
