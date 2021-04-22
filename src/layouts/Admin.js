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
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import {
  createRoutes,
  routes,
  viewRoutes,
  adminRoutes, authRoutes,superAdminRoutes
} from "routes.js";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

import Amplify, {API, Auth, graphqlOperation} from 'aws-amplify';
import config from '../aws-exports';
import {listLinkUsers} from "../graphql/queries";
import axios from "axios";
Amplify.configure(config);

class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSuperAdmin:false,
      isAdmin:false,
      qldbPersonId:"",
      cognitoUserId:""
    }
  }
  componentDidMount() {
    this.getQldbPersonId()
  }

  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  async getQldbPersonId() {
    console.log(this.state.qldbPersonId)
    try {
      console.log("Loading Auth token")
      let user = await Auth.currentAuthenticatedUser();
     let  jwtToken = user.signInUserSession.idToken.jwtToken;
      this.setState({cognitoUserId: user.attributes.sub})

      const currentReadings = await API.graphql(graphqlOperation(listLinkUsers, {filter:{cognitoUserId: {eq: this.state.cognitoUserId}}}))

      console.log('current readings: ', currentReadings)
      this.setState({
        qldbPersonId: currentReadings.data.listLinkUsers.items[0].qldbPersonId
      })
      axios.post(`https://adpvovcpw8.execute-api.us-west-2.amazonaws.com/testMCG/mcgsupplychain`, { Operation: "GET_PERSON",
            PersonId: this.state.qldbPersonId
          } ,
          {
            headers: {
              //'Authorization': jwtToken
            }})
          .then(res => {
            this.setState({
              isSuperAdmin: res.data.body[0].isSuperAdmin,
              isAdmin: res.data.body[0].isAdmin
            })
          })

    } catch (err) {
      console.log('error fetching LinkUser...', err)
    }
  }

  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
          }}
          isSuperAdmin={this.state.isSuperAdmin}
          isAdmin={this.state.isAdmin}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>
            {this.getRoutes(routes)}
            {this.getRoutes(createRoutes)}
            {this.getRoutes(viewRoutes)}
            {this.getRoutes(authRoutes)}
            <div>
              {(() => {
                if (this.state.isSuperAdmin) {
                  return (
                      this.getRoutes(superAdminRoutes)
                  )
                }else if(this.state.isAdmin){
                  return (
                      this.getRoutes(adminRoutes)
                  )
                } else {
                  return (
                      <div/>
                  )
                }
              })()}
            </div>




            <Redirect from="*" to="/admin/index" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
          
        </div>
      </>
    );
  }
}

export default Admin;
