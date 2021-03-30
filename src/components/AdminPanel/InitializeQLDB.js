import React from "react";
import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"; 



let user;
let jwtToken;

class InitializeQLDB extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        Operation: "CREATE_LEDGER_AND_TABLES"
        
    };
    
    
  }



  //handleIsCompanyRegisteredChange = event => {
  //  this.setState({ isCompanyRegistered: event.target.value });
  //}
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleTable = () => {
       
    /*
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    */
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "CREATE_LEDGER_AND_TABLES"},
    {
      headers: {
        'Authorization': jwtToken
      }} )
      .then(res => {

        console.log(res);
        console.log(res.data);
        alert("Ledger and Tables created suuccessfully", res.data)
      })
  }

  render() {
    return (
      <>
            <div>
                <h2>Create Ledger and Tables in QLDB</h2>
                <Button color="danger" onClick={this.handleTable}>Create Ledger and Tables</Button>
                
            </div>

        
      </>
    );
  }
}

export default InitializeQLDB;