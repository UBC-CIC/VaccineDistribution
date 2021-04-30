import React from "react";
import "./modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Row} from "reactstrap";
import NotificationMessage from "../Notification/NotificationMessage";


class ViewContainerModal extends React.Component {
  
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

  ApproveExport(){

    for (var i = 0; i< this.props.container.length; i++)
    {
    axios.post(process.env.REACT_APP_API_URL, {
            Operation: "APPROVE_EXPORT",

            PersonId: localStorage.getItem("qldbPersonId"),
            ContainerId: this.props.container[i]

        },
        {
            headers: {
                //'Authorization': jwtToken
            }
        })
    .then(res => {
        console.log(res);
        console.log(res.data);
        console.log(res.data.body);
        if(res.data.statusCode == 200){
            console.log(res.data.body);
        
        }
        else{
          console.log("Not Approved Export")
        }
    })
}

this.showNotification("Success! Approved Export", "success")
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
                      <h2 className="modal-title" id="exampleModalLabel">View Container Modal</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        
          <Container>
            <Row>
              <Col>
             {this.props.container.map((result)=> (
             <>
             <label   
              className="form-control-label"
              htmlFor="Containers_id">Container Ids:  </label>
            <label 
              id="Containers_id"
              name="ContainerIds">{result}</label>
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
                      
                      onClick={this.ApproveExport}
                      size="xl"
                    >
                      Approve Export
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

export default ViewContainerModal;