import React from "react";
import "./modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";
import NotificationMessage from "../Notification/NotificationMessage";


class ViewLadingBillModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      
        notificationOpen: false,
        notificationType: "success",
        message: ""

    };
    
  }
    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:true,
            })
        }.bind(this),5000);
    }


    handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  ApproveBillOfLading(){

    for (var i = 0; i< this.props.BillOfLadings.length; i++)
    {
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "APPROVE_LADING_BILL",
  
    PersonId: localStorage.getItem("qldbPersonId"),
    LadingBillId: this.props.BillOfLadings[i]
  
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
        
        }
        else{
          console.log("Not Approved Lading Bill")
        }
    })
}

this.showNotification("Success! Lading Bill", "success")
  }


  


  

 

  
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

   // const{InvoiceNumber,OrderQuantity, OrderValue} = this.props.invoice;

      return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">View BillOfLadingIds Modal</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        
          <Container>
            <Row>
              <Col>
             {this.props.BillOfLadingIds.map((result)=> (
             <>
             <label   
              className="form-control-label"
              htmlFor="BillOfLading_id">BillOfLadingIds:  </label>
            <label 
              id="BillOfLading_id"
              name="BillOfLadingIds">{result}</label>
              <br></br>
              
              </>))}
         
              </Col>
            </Row>
          </Container>
            <div className={"modal-footer"}>
                <Row>
                    <Col className={"align-items-center"}>
                    <Button
                      className="float-left"
                      color="default"
                      
                      onClick={this.ApproveBillOfLading}
                      size="xl"
                    >
                      Approve BillOfLading
                    </Button>
                    <Button
                      className="float-right"
                      color="default"
                      
                      onClick={this.props.handleClose}
                      size="xl"
                    >
                      Close
                    </Button>
                    </Col>
                </Row>
            </div>
        
          
        </div>
          </div>
      </div>
    );
  }
}

export default ViewLadingBillModal;