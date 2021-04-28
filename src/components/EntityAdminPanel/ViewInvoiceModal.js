import React from "react";
import "./modal.css";

// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";
import NotificationMessage from "../Notification/NotificationMessage";


class ViewInvoiceModal extends React.Component {
  
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


  


  

 

  
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    const{InvoiceNumber,OrderQuantity, OrderValue} = this.props.invoice;

      return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">View Invoice Modal</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        
          <Container>
            <Row>
              <Col>
             {this.props.invoice.map((result)=> (
             <>
             <label   
              className="form-control-label"
              htmlFor="InvoiceNumber_id">Invoice Number:  </label>
            <label 
              id="InvoiceNumber_id"
              name="InvoiceNumber">{result.InvoiceNumber}</label>
              <br></br>
              <label   
              className="form-control-label"
              htmlFor="OrderQuantity_id">Order Quantity:  </label>
            <label 
              id="OrderQuantity_id"
              name="OrderQuantity">{result.OrderQuantity}</label>
              <br></br>
              <label   
              className="form-control-label"
              htmlFor="OrderValue_id">Order Value:  </label>
            <label 
              id="OrderValue_id"
              name="OrderValue">{result.OrderValue}</label>
              <br></br>
              <label   
              className="form-control-label"
              htmlFor="isInvoicePayed_id">is Invoice Paid:  </label>
            <label 
              id="isInvoicePayed_id"
              name="isInvoicePayed">{result.isInvoicePayed?"True": "False"}</label>
              <br></br>
              <label   
              className="form-control-label"
              htmlFor="TimeOfInvoiceGeneration_id">Time Of Invoice Generation:  </label>
            <label 
              id="TimeOfInvoiceGeneration_id"
              name="TimeOfInvoiceGeneration">
                  {
              (new Date(result.TimeOfInvoiceGeneration*1000)).toLocaleString()
              }
              </label>
              
              </>))}
         
              </Col>
            </Row>
          </Container>
            <div className={"modal-footer"}>
                <Row>
                    <Col className={"align-items-center"}>
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

export default ViewInvoiceModal;