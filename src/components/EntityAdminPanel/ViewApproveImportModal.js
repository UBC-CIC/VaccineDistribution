import React from "react";
import "./modal.css";

import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";

import NotificationMessage from "../Notification/NotificationMessage";


class ViewApproveImportModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        PersonId:'',
        ContainerId: '',
        WarehouseId: '',      
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

  ApproveImport(){

   
    axios.post(process.env.REACT_APP_API_URL, { Operation: "APPROVE_IMPORT",
  
    PersonId: localStorage.getItem("qldbPersonId"),
    ContainerId: this.state.ContainerId,
    WarehouseId: this.state.WarehouseId
  
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
          console.log("Not Approved Export")
        }
    })


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
                      <h2 className="modal-title" id="exampleModalLabel">View Approve Import Modal</h2>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
        
         
            

            <Form onSubmit={this.handleSubmit}>
          <Container>
            <Row>
              <Col>
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="ContainerId_id"
            >
              ContainerId
            </label>
            <Input
              id="ContainerId_id"
              type="select"
              name="ContainerId"
              
              onChange={this.handleOnChange}              
            >
                {/*
               <option value="0">-Select-</option>
              {this.state.PickUpRequestId.map((result) => (<option value={result}>{result}</option>))}
                */}
                

              <option value="0">-Select-</option>
                {this.props.container ? this.props.container.map((result) => (<option value={result}>{result}</option>)) : null}
            


              </Input>
          </FormGroup>

          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="Warehouse_id"
            >
              Warehouse Id
            </label>
            <Input
              id="Warehouse_id"
              type="text"
              name="WarehouseId"
              
              onChange={this.handleOnChange}              
            >
              </Input>
          </FormGroup>

          </Col>
        </Row>

          </Container>
            <div className={"modal-footer"}>
                <Row>
                    <Col className={"align-items-center"}>
                    <Button
                      className="float-left"
                      color="default"
                      
                      type="submit"
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
            </Form>
        
          
        </div>
          </div>
      </div>
    );
  }
}

export default ViewApproveImportModal;