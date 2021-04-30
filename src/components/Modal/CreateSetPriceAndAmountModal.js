import React from "react";
import "../../assets/css/modal.css";
// react plugin used to create DropdownMenu for selecting items
import axios from 'axios';

// reactstrap components
import {Button, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import {Auth} from "aws-amplify";
import NotificationMessage from "../Notification/NotificationMessage";

let user;
let jwtToken;

class CreateSetPriceAndAmountModal extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      Operation: "SET_PRICE_AND_SELLING_AMOUNT",
      ProductId: '',
      MinimumSellingAmount: '',
      ProductPrice: '',
      PersonId: '',
      
      //entity: [{text:"Moderna", id:1}],
        filterEntityData:[],
      entity : [],
        notificationOpen: false,
        notificationType: "success",
        message: ""

    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  


   }





  handleOnChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  handleOnChangeSelect = event => {
    this.setState({ [event.target.name] : event.target.value });

    const selectedProduct = this.props.products.filter(product => product.ProductId === event.target.value)

    this.setState({ ProductPrice : selectedProduct[0].ProductPrice });
    this.setState({ MinimumSellingAmount : selectedProduct[0].MinimumSellingAmount });
    
  }





  

  //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;


  }

    showNotification(message, type){
        this.setState({
            message:message,
            notificationType:type,
            notificationOpen:true,
        })
        setTimeout(function(){
            this.setState({
                notificationOpen:false,
            })
        }.bind(this),7000);
    }





  handleSubmit = event => {
    event.preventDefault();
    axios.post(process.env.REACT_APP_API_URL, {
        Operation: "SET_PRICE_AND_SELLING_AMOUNT",
        ProductId: this.state.ProductId,
        MinimumSellingAmount: parseInt(this.state.MinimumSellingAmount),
        ProductPrice: parseInt(this.state.ProductPrice),
        PersonId: this.props.qldbPersonId
    })

      .then(res => {

        console.log(res);
        console.log(res.data);
        if(res.data.statusCode === 200){
        alert("Successfully Set the Price and Amount")
       
        
        this.showNotification("Successfully Set the Price and Amount", "success")
        }
        else{
            this.showNotification("Error: "+res.data.body, "error")
        }

      })

  }
    
  render(){
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    const {MinimumSellingAmount,ProductPrice} = this.state;
      const formNotCompleted = MinimumSellingAmount.length===0||ProductPrice.length===0
      console.log(this.props)
    return (
      <div className={showHideClassName}>
          <NotificationMessage notificationOpen={this.state.notificationOpen}
                               message={this.state.message} type={this.state.notificationType}/>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" >
              <div className="modal-content">
                  <div className="modal-header">
                      <h2 className="modal-title" id="exampleModalLabel">Joining Request to Entity</h2>
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
              htmlFor="ProductSelect_id"
            >
              Select the Product
            </label>
            <Input
              id="ProductSelect_id"
              type="select"
              name="ProductId"
              onChange={this.handleOnChangeSelect}
            >
                 <option value="0">-Select-</option>

              {this.props.filterProductData.map((result) => (<option value={result.id}>{result.text}</option>))}


              </Input>
          </FormGroup>

   <FormGroup>
          <label
            className="form-control-label"
            htmlFor="MinimumSellingAmount_id"
          >
            Minimum Selling Amount
          </label>
          <Input
            id="MinimumSellingAmount_id"
            type="text"
            name="MinimumSellingAmount"
            value={this.state.MinimumSellingAmount}
            onChange={this.handleOnChange}              
          />
        </FormGroup>
        <FormGroup>
          <label
            className="form-control-label"
            htmlFor="ProductPrice_id"
          >
           Product Price
          </label>
          <Input
            id="ProductPrice_id"
            type="text"
            name="ProductPrice"
            value={this.state.ProductPrice}
            onChange={this.handleOnChange}                
          />
        </FormGroup>
        
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
             <Col>

             <Button className="btn-fill" color="primary" type="submit" disabled={formNotCompleted}>
                    Set Price and Amount
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

export default CreateSetPriceAndAmountModal;