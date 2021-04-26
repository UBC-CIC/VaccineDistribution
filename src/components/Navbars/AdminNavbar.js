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
import {Link} from "react-router-dom";
import {Auth} from 'aws-amplify';
// reactstrap components
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown
} from "reactstrap";

let user;

//let user ="usama101";//Auth.currentAuthenticatedUser();
/*
Auth.currentAuthenticatedUser()
    .then(user => alert(user.username))
    .catch(err => console.log(err));
*/
class AdminNavbar extends React.Component {
  //let user = await Auth.currentAuthenticatedUser(); 
  constructor(props) {
    super(props);
    this.state = {
        email:''
  };
}

  async componentWillMount(){
    user = await Auth.currentAuthenticatedUser();
    this.setState({email: user.attributes.email})

  }

  async signOut() {
    try {
      await Auth.signOut();
      window.location.reload()
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  render() {
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
            </Link>
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/blank-profile.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                      {this.state.email}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="user-profile">
                    <i className="fas fa-user text-blue" />
                      View Profile
                  </DropdownItem>

                  <DropdownItem onClick={this.signOut}>
                    <i className="fas fa-sign-out-alt text-red"/>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
           
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AdminNavbar;