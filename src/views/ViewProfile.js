/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import {Auth} from 'aws-amplify';
import NotificationMessage from "../components/Notification/NotificationMessage";


class ViewProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      userName: "",
      emailVerified: false,
      oldPassword: "",
      newPassword: "",
      newEmailAddress: " ",
      newPasswordTwo: "",
      notificationOpen: false,
      notificationType: "success",
      message: "",
      verificationCode:""

    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this)
    this.handlePasswordSubmit=this.handlePasswordSubmit.bind(this)
    this.handleVerificationCodeSubmit=this.handleVerificationCodeSubmit.bind(this)
  }
  componentDidMount() {

    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(
        user => {
          console.log(user)
          this.setState({
            userEmail: user.attributes.email,
            userName: user.username,
            emailVerified : user.attributes.email_verified
          })
          console.log(user.attributes)
        })
        .catch(err => console.log(err));

  }
  handleOnChange = event => {
    console.log(event.target.value)
    this.setState({ [event.target.name] : event.target.value });
  }

  showNotification(message, type){
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
  handleSubmit = event => {
    console.log("hello")
    event.preventDefault()
  }


  async handleEmailSubmit(){
    const {newEmailAddress} = this.state
    let user = await Auth.currentAuthenticatedUser();

    let result = await Auth.updateUserAttributes(user, {
      'email': newEmailAddress,
    });
    if(result==="SUCCESS"){
      this.showNotification(result,"success");
    }else{
      this.showNotification(result,"error")
    }


  }
  handlePasswordSubmit(){
    const {oldPassword,newPassword,newPasswordTwo} = this.state
    if(newPassword===newPasswordTwo){
      Auth.currentAuthenticatedUser()
          .then(user => {
            return Auth.changePassword(user, oldPassword, newPassword);
          })
          .then(data => {
            this.showNotification("Password updated","success")
            console.log(data)
            this.setState({
              oldPassword:"",
              newPassword:"",
              newPasswordTwo:""
            })
          })
          .catch(err => {
            this.showNotification(err.message,"error")
            this.setState({
              oldPassword:"",
              newPassword:"",
              newPasswordTwo:""
            })
            console.log(err)
          });
    }else{
      this.showNotification("Passwords do not match","error")
    }


  }

  handleVerificationCodeSubmit(){
    const {verificationCode} = this.state
    Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.verifyUserAttributeSubmit(user, 'email',verificationCode);
        })
        .then(data => {
          this.showNotification("Email verified","success")
          console.log(data)
        })
        .catch(err => {
          this.showNotification(err.message,"error")
          console.log(err)
        });

  }



  render() {
    const {userEmail,newEmailAddress,userName,emailVerified,oldPassword, newPassword, newPasswordTwo} = this.state

    const passwordFormIncomplete = oldPassword.length===0||newPassword.length<8||
        newPasswordTwo.length<8 || newPasswordTwo !== newPassword


    return (
      <>
        <Header title={"User Profile"}/>
        <NotificationMessage notificationOpen={this.state.notificationOpen}
                             message={this.state.message} type={this.state.notificationType}/>


        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col>
                        <h6 className="heading-small text-muted mb-4">
                          View user email
                        </h6>

                      </Col>

                    </Row>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={userEmail}
                              disabled
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    <hr className="my-4" />
                    </div>
                  </Form>



                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Change password
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                              Old password
                            </label>
                            <Input
                                className="form-control-alternative"
                                placeholder="Old password"
                                type="password"
                                name="oldPassword"
                                value={this.state.oldPassword}
                                onChange={this.handleOnChange}

                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                            >
                              New Password
                            </label>
                            <Input
                                className="form-control-alternative"
                                type="password"
                                placeholder="New password"
                                name="newPassword"
                                value={this.state.newPassword}
                                onChange={this.handleOnChange}

                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                            >
                              New Password Again
                            </label>
                            <Input
                                className="form-control-alternative"
                                type="password"
                                placeholder="New Password Again"
                                name="newPasswordTwo"
                                value={this.state.newPasswordTwo}
                                onChange={this.handleOnChange}

                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Button className={'float-right'} color={"primary"} disabled={passwordFormIncomplete}
                                  onClick={this.handlePasswordSubmit}>
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ViewProfile;
