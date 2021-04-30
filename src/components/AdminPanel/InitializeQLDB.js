import React from "react";
import axios from 'axios';

// reactstrap components
import {Button} from "reactstrap";
import {Auth} from "aws-amplify";


let user;
let jwtToken;

class InitializeQLDB extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        Operation: "CREATE_LEDGER_AND_TABLES"
    };
  }

  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleTable = () => {
    axios.post(process.env.REACT_APP_API_URL, {Operation: "CREATE_LEDGER_AND_TABLES"},
        {
            headers: {
                'Authorization': jwtToken
            }
        })
      .then(res => {
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