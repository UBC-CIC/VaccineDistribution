import React, {Component} from 'react';
import "./ApprovalTable.css";


const URL = 'https://jsonplaceholder.typicode.com/users'

class InventoryTable extends Component {



     renderHeader = () => {
        let headerElement = ['ProductId','Current Inventory', 'MinimumSelling','Product Price']

        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }


     
     renderBody = () => {
         const filterInventory = this.props.inventoryTable//.filter(entity => entity.ScEntityTypeCode != 1 )
        return filterInventory && filterInventory.map(({ ProductId, CurrentInventory, MinimumSellingAmount, ProductPrice}) => {
            return (
                <tr key={ProductId}>
                    <td>{ProductId}</td>
                    <td>{CurrentInventory}</td>
                                       
                    <td>{MinimumSellingAmount}</td>
                    <td>{ProductPrice}</td>

                    
                </tr>
            )
        })
    }



     render(){
        return (
            <>
                <h1 id='title'>Inventory Table</h1>
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

export default InventoryTable
