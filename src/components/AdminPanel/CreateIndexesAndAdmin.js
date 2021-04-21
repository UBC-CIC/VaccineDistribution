import React from "react";
import axios from 'axios';

// reactstrap components
import { FormGroup, Form, Input, Row, Col,Button } from "reactstrap";
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import Amplify, { API, container, graphqlOperation, Auth } from 'aws-amplify'
import { createLinkUser } from './../../graphql/mutations';



let user;
let jwtToken;

class CreateIndexesAndAdmin extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        Operation: "INSERT_INITIAL_DOCUMENTS",
        qldbAdminPersonId: '',
        cognitoUserId: ''
        
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
    axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "INSERT_INITIAL_DOCUMENTS"},
    {
      headers: {
        'Authorization': jwtToken
      }} )
      .then(res => {

        console.log(res);
        console.log(res.data);
        const cognitoUser = localStorage.getItem('cognitoUserId');
    this.setState({cognitoUserId: cognitoUser})
    console.log("CognitoUserID: ", cognitoUser)
        if(res.data.statusCode === 200){
        this.LinkCognito_AdminQLDBUser(res.data.body.AdminPersonId[0])
        alert("Indexes and MCG Admin created suuccessfully", res.data)
    }
    else{
        alert("MCG Admin already exist")
    }
      })
  }


  LinkCognito_AdminQLDBUser (qldbPersonId){

    this.setState({qldbAdminPersonId: qldbPersonId});
    const cognitoUser = localStorage.getItem('cognitoUserId');
    this.setState({cognitoUserId: cognitoUser})
    console.log("CognitoUserID: ", cognitoUser)
  
    let linkUser = {
      cognitoUserId: this.props.cognitoUserId,
      qldbPersonId: qldbPersonId 
    }
    console.log(linkUser)
    
    try {
       API.graphql(graphqlOperation(createLinkUser, {input: linkUser}));
      console.log('Created Admin Link !')
      alert('Created Admin Link !')
    }catch(err){
        console.log("Error creating Link Admin", err);
  
    }
    
  
  }

  render() {
    return (
      <>
            <div>
                <h2>Create Table Indexes and MCG Admin in QLDB</h2>
                <Button color="danger" onClick={this.handleTable}>Create Indexes and MCG Admin</Button>
                
            </div>

        
      </>
    );
  }
}

export default CreateIndexesAndAdmin;