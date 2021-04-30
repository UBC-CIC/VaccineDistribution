import React from "react";
import axios from 'axios';

// reactstrap components
import {Button} from "reactstrap";
import {API, Auth, graphqlOperation} from 'aws-amplify'
import {createLinkUser} from '../../graphql/mutations';
import NotificationMessage from "../Notification/NotificationMessage";

let user;
let jwtToken;


class CreateIndexesAndAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Operation: "INSERT_INITIAL_DOCUMENTS",
            qldbAdminPersonId: '',
            cognitoUserId: '',
            notificationOpen: false,
            notificationType: "success",
            message: "",
        };
    }
  async componentDidMount(){
    console.log("Loading Auth token")
    user = await Auth.currentAuthenticatedUser();
     jwtToken = user.signInUserSession.idToken.jwtToken;    
  }

  handleTable = () => {
      axios.post(process.env.REACT_APP_API_URL, {Operation: "INSERT_INITIAL_DOCUMENTS"},
          {
              headers: {
                  'Authorization': jwtToken
              }
          })
      .then(res => {
          const cognitoUser = localStorage.getItem('cognitoUserId');
          this.setState({cognitoUserId: cognitoUser})
          if (res.data.statusCode === 200) {
              this.LinkCognito_AdminQLDBUser(res.data.body.AdminPersonId[0])
              this.showNotification("Indexes and Admin created successfully", "success")
          } else {
              console.log(res.data.body)
              this.showNotification("Error: " + res.data.body, "error")
          }
      })
  }

    showNotification(message, type) {
        this.setState({
            message: message,
            notificationType: type,
            notificationOpen: true,
        })
        setTimeout(function () {
            this.setState({
                notificationOpen: false,
            })
        }.bind(this), 7000);
    }


    LinkCognito_AdminQLDBUser(qldbPersonId) {

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
    }catch(err){
        console.log(err)
        console.log("Error creating Link Admin", err);
  
    }
    
  
  }

  render() {
    return (
      <>
          <div>
              <h2>Create Table Indexes and Admin in QLDB</h2>
              <Button color="danger" onClick={this.handleTable}>Create Indexes and Admin</Button>
              <NotificationMessage notificationOpen={this.state.notificationOpen}
                                   message={this.state.message} type={this.state.notificationType}/>
          </div>
      </>
    );
  }
}

export default CreateIndexesAndAdmin;