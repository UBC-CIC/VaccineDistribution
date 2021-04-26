import React, {Component} from 'react'

//import React, {Component, useEffect, useState } from 'react'
import {Auth} from 'aws-amplify'
//import awsExports from "../../aws-exports";
// reactstrap components
// core components
import axios from 'axios';

//Amplify.configure(awsExports)


// let Comp_ID = [];
// let companyType = [];
// let companyName = [];
// let companyIC = [];
// let isCompanyRegistered = [];
// let items = [];
// let temp = [];
let companyData = [];
let session;
let user;
let jwtToken;


class JoinRequest_Entity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companies:[],
            itemsList: []
      };
    }

    async componentDidMount(){
        console.log("Loading tables now")
        
         session = await Auth.currentSession(); 
         jwtToken = session.accessToken.jwtToken;
    
         user = await Auth.currentAuthenticatedUser();
         jwtToken = user.signInUserSession.idToken.jwtToken;
         
        this.getJoinRequestEntity();
        
      }

    async getJoinRequestEntity(){
        try {
          
          console.log("JWT token",jwtToken);
    
        axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_ALL_SCENTITIES"} ,
        {
          headers: {
            'Authorization': jwtToken
          }})
        .then(res => {
            console.log(res);
            console.log(res.data);
            console.log(res.data.body);
            companyData = res.data.body;
          //this.setState({ companies: res.data.body }, ()=> this.createCompanyList());
        })
            }
    catch (err) {
        console.log('error fetching company...', err)
      }
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default JoinRequest_Entity;